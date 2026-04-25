import { NextResponse } from "next/server"
import type { Prisma } from "@/generated/client"

import { UserQuerySchema } from "@/schemas/user-schema"

import { authenticateUser, getAuthErrorResponse } from "@/lib/auth"
import { db } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    // Authenticate and check view permission
    // Note: We'll use 'role:manage' as the permission requirement for user management
    await authenticateUser("role:manage")

    const { searchParams } = new URL(req.url)
    const params = Object.fromEntries(searchParams.entries())

    const query = UserQuerySchema.parse({
      page: params.page,
      limit: params.limit,
      q: params.q,
      role: params.role,
      status: params.status,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    })

    const skip = (query.page - 1) * query.limit

    const where: Prisma.UserWhereInput = {}

    if (query.q) {
      where.OR = [
        { name: { contains: query.q, mode: "insensitive" } },
        { email: { contains: query.q, mode: "insensitive" } },
      ]
    }

    if (query.role) {
      where.role = query.role
    }

    if (query.status) {
      where.status = query.status
    }

    const [total, users] = await Promise.all([
      db.user.count({ where }),
      db.user.findMany({
        where,
        skip,
        take: query.limit,
        orderBy: {
          [query.sortBy]: query.sortOrder,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          avatar: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      }),
    ])

    return NextResponse.json({
      data: users,
      pagination: {
        total,
        page: query.page,
        limit: query.limit,
        totalPages: Math.ceil(total / query.limit),
      },
    })
  } catch (error) {
    const authError = getAuthErrorResponse(error)
    if (authError) {
      return NextResponse.json(
        { message: authError.message },
        { status: authError.status }
      )
    }

    console.error("Error fetching users:", error)
    return NextResponse.json(
      { message: "Unable to fetch users." },
      { status: 500 }
    )
  }
}
