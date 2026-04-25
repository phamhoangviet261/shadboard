"use client"

import { useSession } from "next-auth/react"
import type { UserRole } from "@/generated/client"
import { Permission, can as hasPermission, canAny as hasAnyPermission } from "@/lib/permissions"

/**
 * Hook to check permissions on the client side
 */
export function usePermission() {
  const { data: session, status } = useSession()
  const userRole = session?.user?.role as UserRole | undefined
  const isLoading = status === "loading"

  const checkPermission = (permission: Permission) => {
    return userRole ? hasPermission(userRole, permission) : false
  }

  const checkAnyPermission = (permissions: Permission[]) => {
    return userRole ? hasAnyPermission(userRole, permissions) : false
  }

  return {
    can: checkPermission,
    canAny: checkAnyPermission,
    role: userRole,
    isLoading,
    isAuthenticated: !!session?.user,
    isAdmin: userRole === "ADMIN",
  }
}

export type { Permission }
