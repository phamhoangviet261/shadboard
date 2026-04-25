import { NextResponse } from "next/server"

import { authenticateUser, getAuthErrorResponse } from "@/lib/auth"
import { db } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await authenticateUser("role:manage")
    const { id } = await params

    const user = await db.user.findUnique({
      where: { id },
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
    })

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    const authError = getAuthErrorResponse(error)
    if (authError) {
      return NextResponse.json(
        { message: authError.message },
        { status: authError.status }
      )
    }

    console.error("Error fetching user:", error)
    return NextResponse.json(
      { message: "Unable to fetch user." },
      { status: 500 }
    )
  }
}
