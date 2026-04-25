import { getServerSession } from "next-auth"
import type { Session } from "next-auth"
import type { UserRole } from "@/generated/client"

import { authOptions } from "@/configs/next-auth"
import { can } from "@/lib/permissions"
import type { Permission } from "@/lib/permissions"

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
