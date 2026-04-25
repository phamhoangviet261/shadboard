import { NextResponse } from "next/server"
import { db } from "@/lib/prisma"
import { CollectionCreateSchema, CollectionQuerySchema } from "@/schemas/collection-schema"
import { Prisma } from "@/generated/client"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const params = Object.fromEntries(searchParams.entries())
    
    const parsed = CollectionQuerySchema.safeParse(params)
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 })
    }

    const { status, q, includeProductCount, sortBy, sortOrder } = parsed.data

    const where: Prisma.CollectionWhereInput = {
      deletedAt: null,
    }

    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ]
    }

    if (status) {
      where.status = status
    }

    const collections = await db.collection.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: includeProductCount ? {
        _count: {
          select: { 
            products: { 
              where: { deletedAt: null } 
            } 
          }
        }
      } : undefined
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error("Error fetching collections:", error)
    return NextResponse.json(
      { message: "Unable to fetch collections." },
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
    
    const parsed = CollectionCreateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 })
    }

    const collection = await db.collection.create({
      data: parsed.data as any,
    })

    return NextResponse.json(collection, { status: 201 })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Slug already in use." },
        { status: 409 }
      )
    }
    console.error("Error creating collection:", error)
    return NextResponse.json(
      { message: "Unable to create collection." },
      { status: 500 }
    )
  }
}
