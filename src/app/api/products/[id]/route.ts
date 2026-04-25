import { NextResponse } from "next/server"
import { db } from "@/lib/prisma"
import { ProductUpdateSchema } from "@/schemas/product-schema"
import { Prisma } from "@/generated/client"

export const runtime = "nodejs"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await db.product.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        deletedAt: null,
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
            slug: true,
            thumbnailUrl: true,
          },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { message: "Unable to fetch product." },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    
    const parsed = ProductUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 })
    }

    // Check if product exists and not deleted
    const product = await db.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 })
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: parsed.data as any,
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Slug or SKU already in use." },
        { status: 409 }
      )
    }
    console.error("Error updating product:", error)
    return NextResponse.json(
      { message: "Unable to update product." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const product = await db.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 })
    }

    await db.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ message: "Product deleted successfully." })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { message: "Unable to delete product." },
      { status: 500 }
    )
  }
}
