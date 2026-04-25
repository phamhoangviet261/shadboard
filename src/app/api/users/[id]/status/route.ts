import { NextResponse } from "next/server"
import { UserRole } from "@/generated/client"

import { UserUpdateStatusSchema } from "@/schemas/user-schema"

import { logUserActivity } from "@/lib/activity-log"
import { authenticateUser, getAuthErrorResponse } from "@/lib/auth"
import { db } from "@/lib/prisma"

export const runtime = "nodejs"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const actor = await authenticateUser("role:manage")
    const { id } = await params

    const body = await req.json()
    const parsed = UserUpdateStatusSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 })
    }

    const { status: newStatus } = parsed.data

    // Fetch target user
    const user = await db.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 })
    }

    // Rule: Prevent disabling the last active admin
    if (
      user.role === UserRole.ADMIN &&
      user.status === "ACTIVE" &&
      newStatus === "DISABLED"
    ) {
      const activeAdminCount = await db.user.count({
        where: { role: UserRole.ADMIN, status: "ACTIVE" },
      })

      if (activeAdminCount <= 1) {
        return NextResponse.json(
          { message: "Cannot disable the last active administrator." },
          { status: 400 }
        )
      }
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: { status: newStatus },
    })

    await logUserActivity({
      action: newStatus === "DISABLED" ? "user_disabled" : "user_enabled",
      user: { id: updatedUser.id, name: updatedUser.name },
      actor: { id: actor.id, email: actor.email ?? "", role: actor.role },
      before: { status: user.status },
      after: { status: updatedUser.status },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    const authError = getAuthErrorResponse(error)
    if (authError) {
      return NextResponse.json(
        { message: authError.message },
        { status: authError.status }
      )
    }

    console.error("Error updating user status:", error)
    return NextResponse.json(
      { message: "Unable to update user status." },
      { status: 500 }
    )
  }
}
