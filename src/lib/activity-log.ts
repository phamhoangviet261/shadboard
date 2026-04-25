import { headers } from "next/headers"

import type { Prisma } from "@/generated/client"

import { db } from "@/lib/prisma"

export type ActivityEntityType =
  | "product"
  | "collection"
  | "inventory"
  | "bulk_action"

export interface ActivityLogInput {
  action: string
  entityType: ActivityEntityType
  entityId?: string
  entityName?: string
  actorId?: string
  actorEmail?: string
  metadata?: Record<string, unknown>
  before?: unknown
  after?: unknown
}

/**
 * Core helper to create an activity log entry
 */
export async function createActivityLog(input: ActivityLogInput) {
  try {
    const headersList = await headers()
    const ipAddress =
      headersList.get("x-forwarded-for") || headersList.get("x-real-ip")
    const userAgent = headersList.get("user-agent")

    return await db.activityLog.create({
      data: {
        ...input,
        metadata: (input.metadata as Prisma.InputJsonValue) || undefined,
        before: (input.before as Prisma.InputJsonValue) || undefined,
        after: (input.after as Prisma.InputJsonValue) || undefined,
        ipAddress,
        userAgent,
      },
    })
  } catch (error) {
    // We don't want activity logging to crash the main process
    console.error("Failed to create activity log:", error)
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
  actor?: { id: string; email: string }
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
  actor?: { id: string; email: string }
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
  actor?: { id: string; email: string }
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
  actor?: { id: string; email: string }
  metadata?: Record<string, unknown>
}) {
  return createActivityLog({
    action,
    entityType: "bulk_action",
    entityName: `${count} products affected`,
    actorId: actor?.id,
    actorEmail: actor?.email,
    metadata: {
      ...metadata,
      affectedIds: ids,
      affectedCount: count,
    },
  })
}
