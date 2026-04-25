import { NextResponse } from "next/server"

import { ProductStockAdjustmentSchema } from "@/schemas/product-schema"

import { db } from "@/lib/prisma"
import { logInventoryActivity } from "@/lib/activity-log"

export const runtime = "nodejs"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON request body." },
        { status: 400 }
      )
    }

    const parsed = ProductStockAdjustmentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 })
    }

    const { type, quantity } = parsed.data

    const product = await db.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 }
      )
    }

    let newStock = product.stockQuantity

    if (type === "increase") {
      newStock += quantity
    } else if (type === "decrease") {
      newStock -= quantity
      if (newStock < 0) {
        return NextResponse.json(
          { message: "Stock quantity cannot be negative." },
          { status: 400 }
        )
      }
    } else if (type === "set") {
      newStock = quantity
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: {
        stockQuantity: newStock,
      },
    })

    await logInventoryActivity({
      action: `stock_${type === "set" ? "set" : type === "increase" ? "increased" : "decreased"}`,
      product: { id: updatedProduct.id, name: updatedProduct.name },
      before: { stockQuantity: product.stockQuantity },
      after: { stockQuantity: updatedProduct.stockQuantity },
      metadata: { adjustment: quantity, type },
    })

    // If there was an InventoryAdjustment table, we would also create a record here using db.$transaction.
    // For now, updating the product is sufficient based on the schema.

    return NextResponse.json(updatedProduct, { status: 201 })
  } catch (error) {
    console.error("Error adjusting stock:", error)
    return NextResponse.json(
      { message: "Unable to adjust stock." },
      { status: 500 }
    )
  }
}
