import { NextResponse } from "next/server"

import { ProductBulkActionSchema } from "@/schemas/product-schema"

import { logBulkProductActivity } from "@/lib/activity-log"
import { db } from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON request body." },
        { status: 400 }
      )
    }

    const parsed = ProductBulkActionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 })
    }

    const data = parsed.data

    switch (data.action) {
      case "updateStatus":
        await db.product.updateMany({
          where: { id: { in: data.ids } },
          data: { status: data.status },
        })
        await logBulkProductActivity({
          action: "product_bulk_status_updated",
          ids: data.ids,
          count: data.ids.length,
          metadata: { status: data.status },
        })
        break
      case "delete":
        await db.product.updateMany({
          where: { id: { in: data.ids } },
          data: { deletedAt: new Date() },
        })
        await logBulkProductActivity({
          action: "product_bulk_deleted",
          ids: data.ids,
          count: data.ids.length,
        })
        break
      case "assignCollection":
        await db.product.updateMany({
          where: { id: { in: data.ids } },
          data: { collectionId: data.collectionId },
        })
        await logBulkProductActivity({
          action: "product_bulk_collection_assigned",
          ids: data.ids,
          count: data.ids.length,
          metadata: { collectionId: data.collectionId },
        })
        break
      case "addTags":
      case "removeTags":
        // Prisma doesn't support array push/remove directly on postgres scalar arrays via updateMany easily
        // So we use a transaction to update individually
        await db.$transaction(async (tx) => {
          const products = await tx.product.findMany({
            where: { id: { in: data.ids } },
            select: { id: true, tags: true },
          })

          for (const product of products) {
            let currentTags = Array.isArray(product.tags)
              ? (product.tags as string[])
              : []

            if (data.action === "addTags") {
              const newTags = data.tags.filter((t) => !currentTags.includes(t))
              currentTags = [...currentTags, ...newTags]
            } else if (data.action === "removeTags") {
              currentTags = currentTags.filter((t) => !data.tags.includes(t))
            }

            await tx.product.update({
              where: { id: product.id },
              data: { tags: currentTags },
            })
          }
        })
        await logBulkProductActivity({
          action:
            data.action === "addTags"
              ? "product_bulk_tags_added"
              : "product_bulk_tags_removed",
          ids: data.ids,
          count: data.ids.length,
          metadata: { tags: data.tags },
        })
        break
      default:
        return NextResponse.json(
          { message: "Invalid bulk action." },
          { status: 400 }
        )
    }

    return NextResponse.json({ message: "Bulk action completed successfully." })
  } catch (error) {
    console.error("Bulk action error:", error)
    return NextResponse.json(
      { message: "Unable to process bulk action." },
      { status: 500 }
    )
  }
}
