import { NextResponse } from "next/server"
import { db } from "@/lib/prisma"
import { CollectionUpdateSchema } from "@/schemas/collection-schema"
import { Prisma } from "@/generated/client"

export const runtime = "nodejs"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const collection = await db.collection.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
        deletedAt: null,
      },
      include: {
        _count: {
          select: { 
            products: { 
              where: { deletedAt: null } 
            } 
          }
        }
      }
    })

    if (!collection) {
      return NextResponse.json({ message: "Collection not found." }, { status: 404 })
    }

    return NextResponse.json(collection)
  } catch (error) {
    console.error("Error fetching collection:", error)
    return NextResponse.json(
      { message: "Unable to fetch collection." },
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
    
    const parsed = CollectionUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(parsed.error, { status: 400 })
    }

    const collection = await db.collection.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!collection) {
      return NextResponse.json({ message: "Collection not found." }, { status: 404 })
    }

    const updatedCollection = await db.collection.update({
      where: { id },
      data: parsed.data as any,
    })

    return NextResponse.json(updatedCollection)
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
    console.error("Error updating collection:", error)
    return NextResponse.json(
      { message: "Unable to update collection." },
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

    const collection = await db.collection.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    })

    if (!collection) {
      return NextResponse.json({ message: "Collection not found." }, { status: 404 })
    }

    await db.collection.update({
      where: { id },
      data: { deletedAt: new Date() },
    })

    return NextResponse.json({ message: "Collection deleted successfully." })
  } catch (error) {
    console.error("Error deleting collection:", error)
    return NextResponse.json(
      { message: "Unable to delete collection." },
      { status: 500 }
    )
  }
}
