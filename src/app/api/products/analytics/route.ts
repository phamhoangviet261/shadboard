import { NextResponse } from "next/server"
import { db } from "@/lib/prisma"
import { Prisma } from "@/generated/client"

export const runtime = "nodejs"

export async function GET() {
  try {
    const products = await db.product.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        status: true,
        stockQuantity: true,
        price: true,
        name: true,
        slug: true,
        sku: true,
        lowStockThreshold: true,
        collectionId: true,
      },
    })

    const collections = await db.collection.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        name: true,
      },
    })

    let totalProducts = 0
    let activeProducts = 0
    let draftProducts = 0
    let archivedProducts = 0
    let totalStockUnits = 0
    let totalInventoryValue = 0
    let outOfStockProducts = 0
    let lowStockCount = 0

    const lowStockProductsList = []
    const collectionSummaryMap: Record<string, any> = {}

    for (const collection of collections) {
      collectionSummaryMap[collection.id] = {
        id: collection.id,
        name: collection.name,
        productCount: 0,
        activeProductCount: 0,
        stockUnits: 0,
        inventoryValue: 0,
      }
    }

    for (const p of products) {
      totalProducts++

      if (p.status === "published") {
        activeProducts++
      } else if (p.status === "draft") {
        draftProducts++
      } else if (p.status === "archived") {
        archivedProducts++
      }

      if (p.stockQuantity !== null) {
        if (p.stockQuantity > 0) {
          totalStockUnits += p.stockQuantity
          totalInventoryValue += p.stockQuantity * Number(p.price || 0)
        }
        if (p.stockQuantity <= 0) {
          outOfStockProducts++
        } else if (
          p.lowStockThreshold !== null &&
          p.stockQuantity <= p.lowStockThreshold
        ) {
          lowStockCount++
          lowStockProductsList.push({
            id: p.id,
            name: p.name,
            slug: p.slug,
            sku: p.sku,
            stockQuantity: p.stockQuantity,
            lowStockThreshold: p.lowStockThreshold,
          })
        }
      }

      if (p.collectionId && collectionSummaryMap[p.collectionId]) {
        const c = collectionSummaryMap[p.collectionId]
        c.productCount++
        if (p.status === "published") {
          c.activeProductCount++
        }
        if (p.stockQuantity && p.stockQuantity > 0) {
          c.stockUnits += p.stockQuantity
          c.inventoryValue += p.stockQuantity * Number(p.price || 0)
        }
      }
    }

    const topStockProductsList = [...products]
      .filter((p) => p.stockQuantity && p.stockQuantity > 0)
      .sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        stockQuantity: p.stockQuantity,
        price: Number(p.price || 0),
      }))

    return NextResponse.json({
      summary: {
        totalProducts,
        activeProducts,
        draftProducts,
        archivedProducts,
        lowStockProducts: lowStockCount,
        outOfStockProducts,
        totalStockUnits,
        totalInventoryValue,
      },
      collections: Object.values(collectionSummaryMap),
      topStockProducts: topStockProductsList,
      lowStockProducts: lowStockProductsList,
    })
  } catch (error) {
    console.error("Error fetching product analytics:", error)
    return NextResponse.json(
      { message: "Unable to fetch product analytics." },
      { status: 500 }
    )
  }
}
