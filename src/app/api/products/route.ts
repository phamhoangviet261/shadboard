import { NextResponse } from "next/server"
import { Prisma } from "@/generated/client"

import {
  ProductCreateSchema,
  ProductQuerySchema,
} from "@/schemas/product-schema"

import { db } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const params = Object.fromEntries(searchParams.entries())

    const parsed = ProductQuerySchema.safeParse(params)
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 })
    }

    const {
      page,
      limit,
      q,
      status,
      collectionId,
      minPrice,
      maxPrice,
      tags,
      sortBy,
      sortOrder,
    } = parsed.data

    const skip = (page - 1) * limit

    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { sku: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (collectionId) {
      where.collectionId = collectionId
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Prisma.DecimalFilter = {}
      if (minPrice !== undefined) priceFilter.gte = minPrice
      if (maxPrice !== undefined) priceFilter.lte = maxPrice
      where.price = priceFilter
    }

    if (tags) {
      const tagList = tags.split(",").map((t) => t.trim())
      where.tags = {
        hasSome: tagList,
      }
    }

    const [total, products] = await Promise.all([
      db.product.count({ where }),
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
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
      }),
    ])

    return NextResponse.json({
      data: JSON.parse(
        JSON.stringify(products, (key, value) =>
          typeof value === "object" && value?.constructor?.name === "Decimal"
            ? Number(value)
            : value
        )
      ),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { message: "Unable to fetch products." },
      { status: 500 }
    )
  }
}

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

    const parsed = ProductCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 })
    }

    const product = await db.product.create({
      data: parsed.data as Prisma.ProductUncheckedCreateInput,
    })

    return NextResponse.json(product, { status: 201 })
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
    console.error("Error creating product:", error)
    return NextResponse.json(
      { message: "Unable to create product." },
      { status: 500 }
    )
  }
}
