import { NextResponse } from "next/server"
import { UserRole } from "@/generated/client"

import { UserUpdateRoleSchema } from "@/schemas/user-schema"

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
    const parsed = UserUpdateRoleSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 })
    }

    const { role: newRole } = parsed.data

    // Fetch target user
    const user = await db.user.findUnique({
      where: { id },
    })

    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 })
    }

    // Rule: Prevent non-admin users from assigning the admin role
    if (newRole === UserRole.ADMIN && actor.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { message: "Only administrators can assign the admin role." },
        { status: 403 }
      )
    }

    // Rule: Prevent removing the last admin role from the system
    if (user.role === UserRole.ADMIN && newRole !== UserRole.ADMIN) {
      const adminCount = await db.user.count({
        where: { role: UserRole.ADMIN, status: "ACTIVE" },
      })

      if (adminCount <= 1) {
        return NextResponse.json(
          { message: "Cannot remove the last active administrator." },
          { status: 400 }
        )
      }
    }

    const updatedUser = await db.user.update({
      where: { id },
      data: { role: newRole },
    })

    await logUserActivity({
      action: "user_role_updated",
      user: { id: updatedUser.id, name: updatedUser.name },
      actor: { id: actor.id, email: actor.email ?? "", role: actor.role },
      before: { role: user.role },
      after: { role: updatedUser.role },
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

    console.error("Error updating user role:", error)
    return NextResponse.json(
      { message: "Unable to update user role." },
      { status: 500 }
    )
  }
}
