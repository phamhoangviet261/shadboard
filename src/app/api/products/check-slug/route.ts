import { NextResponse } from "next/server"

import { db } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ message: "Slug is required" }, { status: 400 })
    }

    const product = await db.product.findFirst({
      where: {
        slug: slug,
        deletedAt: null,
      },
      select: {
        id: true,
      },
    })

    return NextResponse.json({
      available: !product,
      slug,
    })
  } catch (error) {
    console.error("Error checking slug availability:", error)
    return NextResponse.json(
      { message: "Unable to check slug availability." },
      { status: 500 }
    )
  }
}
