import { getServerSession } from "next-auth"

import type { UserRole } from "@/generated/client"
import type { Permission } from "@/lib/permissions"
import type { Session } from "next-auth"

import { authOptions } from "@/configs/next-auth"
import { can } from "@/lib/permissions"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function authenticateUser(permission?: Permission | Permission[]) {
  const session = (await getSession()) as Session | null

  if (!session || !session.user?.id) {
    throw new Error("Unauthorized user.")
  }

  const user = session.user

  if (permission && !can(user.role as UserRole, permission)) {
    throw new Error("Forbidden: Insufficient permissions.")
  }

  return user
}

export function getAuthErrorResponse(error: unknown) {
  if (!(error instanceof Error)) return null

  if (
    !error.message.includes("Forbidden") &&
    !error.message.includes("Unauthorized")
  ) {
    return null
  }

  return {
    message: error.message,
    status: error.message.includes("Forbidden") ? 403 : 401,
  }
}
