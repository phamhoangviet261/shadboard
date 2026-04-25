import { NextResponse } from "next/server"

import type { Prisma } from "@/generated/client"

import { db } from "@/lib/prisma"

export const runtime = "nodejs"

function getPaginationResponse({
  data = [],
  page,
  limit,
  total = 0,
}: {
  data?: unknown[]
  page: number
  limit: number
  total?: number
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  }
}

function getPrismaErrorCode(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof error.code === "string"
  ) {
    return error.code
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "errorCode" in error &&
    typeof error.errorCode === "string"
  ) {
    return error.errorCode
  }

  if (error instanceof Error) {
    const match = error.message.match(/\bP\d{4}\b/u)

    return match?.[0] ?? null
  }

  return null
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const pageParam = Number.parseInt(searchParams.get("page") || "1", 10)
  const limitParam = Number.parseInt(searchParams.get("limit") || "20", 10)
  const page = Number.isFinite(pageParam) ? Math.max(1, pageParam) : 1
  const limit = Number.isFinite(limitParam)
    ? Math.min(100, Math.max(1, limitParam))
    : 20

  try {
    if (!db.activityLog) {
      return NextResponse.json(getPaginationResponse({ page, limit }))
    }

    const skip = (page - 1) * limit

    // Filters
    const action = searchParams.get("action")
    const entityType = searchParams.get("entityType")
    const entityId = searchParams.get("entityId")
    const actorId = searchParams.get("actorId")
    const q = searchParams.get("q")
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const sortOrderParam = searchParams.get("sortOrder")
    const sortOrder = sortOrderParam === "asc" ? "asc" : "desc"

    const where: Prisma.ActivityLogWhereInput = {}

    if (action) where.action = action
    if (entityType) where.entityType = entityType
    if (entityId) where.entityId = entityId
    if (actorId) where.actorId = actorId

    if (q) {
      where.OR = [
        { action: { contains: q, mode: "insensitive" } },
        { entityName: { contains: q, mode: "insensitive" } },
        { actorEmail: { contains: q, mode: "insensitive" } },
      ]
    }

    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) where.createdAt.lte = new Date(to)
    }

    const [total, logs] = await Promise.all([
      db.activityLog.count({ where }),
      db.activityLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: sortOrder,
        },
      }),
    ])

    return NextResponse.json(
      getPaginationResponse({ data: logs, page, limit, total })
    )
  } catch (error) {
    console.error("Error fetching activity logs:", error)

    const errorCode = getPrismaErrorCode(error)

    if (
      errorCode === "P1001" ||
      errorCode === "P2021" ||
      errorCode === "P2022"
    ) {
      return NextResponse.json(getPaginationResponse({ page, limit }))
    }

    return NextResponse.json(
      { message: "Unable to fetch activity logs." },
      { status: 500 }
    )
  }
}
