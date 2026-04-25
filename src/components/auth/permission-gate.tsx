"use client"

import React from "react"

import type { Permission } from "@/lib/permissions"

import { usePermission } from "@/hooks/use-permission"

interface PermissionGateProps {
  permission?: Permission | Permission[]
  any?: Permission[]
  fallback?: React.ReactNode
  children: React.ReactNode
}

/**
 * Component to conditionally render content based on user permissions
 */
export function PermissionGate({
  permission,
  any,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { canAny, isLoading } = usePermission()

  if (isLoading) return null

  if (permission) {
    const permissions = Array.isArray(permission) ? permission : [permission]
    if (!canAny(permissions)) {
      return <>{fallback}</>
    }
  }

  if (any && !canAny(any)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
