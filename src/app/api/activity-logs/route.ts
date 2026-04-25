import { NextResponse } from "next/server"

import type { Prisma } from "@/generated/client"

import { db } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)

    // Pagination
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "20"))
    )
    const skip = (page - 1) * limit

    // Filters
    const action = searchParams.get("action")
    const entityType = searchParams.get("entityType")
    const entityId = searchParams.get("entityId")
    const actorId = searchParams.get("actorId")
    const q = searchParams.get("q")
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc"

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

    return NextResponse.json({
      data: logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching activity logs:", error)
    return NextResponse.json(
      { message: "Unable to fetch activity logs." },
      { status: 500 }
    )
  }
}
