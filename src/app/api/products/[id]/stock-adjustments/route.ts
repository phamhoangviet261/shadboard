import { NextResponse } from "next/server"

import { ProductStockAdjustmentSchema } from "@/schemas/product-schema"

import { logInventoryActivity } from "@/lib/activity-log"
import { authenticateUser, getAuthErrorResponse } from "@/lib/auth"
import { db } from "@/lib/prisma"

export const runtime = "nodejs"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateUser("inventory:adjust")
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
      actor: { id: user.id, email: user.email ?? "", role: user.role },
      before: { stockQuantity: product.stockQuantity },
      after: { stockQuantity: updatedProduct.stockQuantity },
      metadata: { adjustment: quantity, type },
    })

    return NextResponse.json(updatedProduct, { status: 201 })
  } catch (error) {
    const authError = getAuthErrorResponse(error)
    if (authError) {
      return NextResponse.json(
        { message: authError.message },
        { status: authError.status }
      )
    }
    console.error("Error adjusting stock:", error)
    return NextResponse.json(
      { message: "Unable to adjust stock." },
      { status: 500 }
    )
  }
}
