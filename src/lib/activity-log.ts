import { headers } from "next/headers"

import { db } from "@/lib/prisma"

export type ActivityEntityType =
  | "product"
  | "collection"
  | "inventory"
  | "bulk_action"
  | "user"

export interface ActivityLogInput {
  action: string
  entityType: ActivityEntityType
  entityId?: string
  entityName?: string
  actorId?: string
  actorEmail?: string
  actorRole?: string
  metadata?: Record<string, unknown>
  before?: unknown
  after?: unknown
}

/**
 * Core helper to create an activity log entry
 */
export async function createActivityLog(input: ActivityLogInput) {
  console.log("[ActivityLog] Creating log for action:", input.action)
  try {
    let ipAddress: string | null = null
    let userAgent: string | null = null

    try {
      const headersList = await headers()
      ipAddress =
        headersList.get("x-forwarded-for") || headersList.get("x-real-ip")
      userAgent = headersList.get("user-agent")
    } catch (headerError) {
      console.warn("[ActivityLog] Failed to get headers:", headerError)
    }

    const log = await db.activityLog.create({
      data: {
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        entityName: input.entityName,
        actorId: input.actorId,
        actorEmail: input.actorEmail,
        actorRole: input.actorRole,
        metadata: input.metadata
          ? JSON.parse(JSON.stringify(input.metadata))
          : undefined,
        before: input.before
          ? JSON.parse(JSON.stringify(input.before))
          : undefined,
        after: input.after
          ? JSON.parse(JSON.stringify(input.after))
          : undefined,
        ipAddress,
        userAgent,
      },
    })
    console.log("[ActivityLog] Log created successfully:", log.id)
    return log
  } catch (error) {
    // We don't want activity logging to crash the main process
    console.error("[ActivityLog] Failed to create activity log:", error)
    return null
  }
}

/**
 * Helper to log product related activities
 */
export async function logProductActivity({
  action,
  product,
  actor,
  before,
  after,
  metadata,
}: {
  action: string
  product: { id: string; name: string }
  actor?: { id: string; email: string; role?: string }
  before?: unknown
  after?: unknown
  metadata?: Record<string, unknown>
}) {
  return createActivityLog({
    action,
    entityType: "product",
    entityId: product.id,
    entityName: product.name,
    actorId: actor?.id,
    actorEmail: actor?.email,
    actorRole: actor?.role,
    before,
    after,
    metadata,
  })
}

/**
 * Helper to log collection related activities
 */
export async function logCollectionActivity({
  action,
  collection,
  actor,
  before,
  after,
  metadata,
}: {
  action: string
  collection: { id: string; name: string }
  actor?: { id: string; email: string; role?: string }
  before?: unknown
  after?: unknown
  metadata?: Record<string, unknown>
}) {
  return createActivityLog({
    action,
    entityType: "collection",
    entityId: collection.id,
    entityName: collection.name,
    actorId: actor?.id,
    actorEmail: actor?.email,
    actorRole: actor?.role,
    before,
    after,
    metadata,
  })
}

/**
 * Helper to log inventory related activities
 */
export async function logInventoryActivity({
  action,
  product,
  actor,
  before,
  after,
  metadata,
}: {
  action: string
  product: { id: string; name: string }
  actor?: { id: string; email: string; role?: string }
  before?: unknown
  after?: unknown
  metadata?: Record<string, unknown>
}) {
  return createActivityLog({
    action,
    entityType: "inventory",
    entityId: product.id,
    entityName: product.name,
    actorId: actor?.id,
    actorEmail: actor?.email,
    actorRole: actor?.role,
    before,
    after,
    metadata,
  })
}

/**
 * Helper to log bulk activities
 */
export async function logBulkProductActivity({
  action,
  ids,
  count,
  actor,
  metadata,
}: {
  action: string
  ids: string[]
  count: number
  actor?: { id: string; email: string; role?: string }
  metadata?: Record<string, unknown>
}) {
  return createActivityLog({
    action,
    entityType: "bulk_action",
    entityName: `${count} products affected`,
    actorId: actor?.id,
    actorEmail: actor?.email,
    actorRole: actor?.role,
    metadata: {
      ...metadata,
      affectedIds: ids,
      affectedCount: count,
    },
  })
}

/**
 * Helper to log user related activities
 */
export async function logUserActivity({
  action,
  user,
  actor,
  before,
  after,
  metadata,
}: {
  action: string
  user: { id: string; name: string }
  actor?: { id: string; email: string; role?: string }
  before?: unknown
  after?: unknown
  metadata?: Record<string, unknown>
}) {
  return createActivityLog({
    action,
    entityType: "user",
    entityId: user.id,
    entityName: user.name,
    actorId: actor?.id,
    actorEmail: actor?.email,
    actorRole: actor?.role,
    before,
    after,
    metadata,
  })
}
