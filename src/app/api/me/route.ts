import { NextResponse } from "next/server"

import { authenticateUser, getAuthErrorResponse } from "@/lib/auth"
import { db } from "@/lib/prisma"

export const runtime = "nodejs"

/**
 * GET /api/me
 * Retrieves the current logged-in user's detailed information.
 */
export async function GET() {
  try {
    // 1. Authenticate the session
    const user = await authenticateUser()

    // 2. Fetch latest user data from DB to ensure we have the most up-to-date role/info
    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        avatar: true,
        status: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        preferences: {
          select: {
            theme: true,
            mode: true,
            radius: true,
            layout: true,
            direction: true,
          },
        },
      },
    })

    if (!userData) {
      return NextResponse.json({ message: "User not found." }, { status: 404 })
    }

    return NextResponse.json(userData)
  } catch (error) {
    const authError = getAuthErrorResponse(error)
    if (authError) {
      return NextResponse.json(
        { message: authError.message },
        { status: authError.status }
      )
    }

    console.error("Error fetching current user info:", error)
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    )
  }
}
