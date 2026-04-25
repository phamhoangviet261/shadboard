import { NextResponse } from "next/server"

import type { Prisma } from "@/generated/client"

import { logProductActivity } from "@/lib/activity-log"
import { db } from "@/lib/prisma"
import { generateUniqueSku, generateUniqueSlug } from "@/lib/product-utils"

export const runtime = "nodejs"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 1. Fetch original product
    const originalProduct = await db.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!originalProduct) {
      return NextResponse.json(
        { message: "Original product not found." },
        { status: 404 }
      )
    }

    // 2. Prepare duplicated data
    const newName = `${originalProduct.name} Copy`

    // Generate unique slug based on new name
    const baseSlug = newName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
    const uniqueSlug = await generateUniqueSlug(baseSlug)

    // Generate unique SKU
    const baseSku = originalProduct.sku
      ? `${originalProduct.sku}-COPY`
      : `SKU-${Date.now()}-COPY`
    const uniqueSku = await generateUniqueSku(baseSku)

    // 3. Create new product (excluding protected fields)
    const {
      id: _,
      createdAt: __,
      updatedAt: ___,
      deletedAt: ____,
      ...copyData
    } = originalProduct

    const duplicatedProduct = await db.product.create({
      data: {
        ...copyData,
        name: newName,
        slug: uniqueSlug,
        sku: uniqueSku,
        status: "draft",
      } as Prisma.ProductUncheckedCreateInput,
    })

    await logProductActivity({
      action: "product_duplicated",
      product: { id: duplicatedProduct.id, name: duplicatedProduct.name },
      metadata: { originalId: id },
      after: duplicatedProduct,
    })

    return NextResponse.json(duplicatedProduct, { status: 201 })
  } catch (error) {
    console.error("Error duplicating product:", error)
    return NextResponse.json(
      { message: "Unable to duplicate product." },
      { status: 500 }
    )
  }
}
