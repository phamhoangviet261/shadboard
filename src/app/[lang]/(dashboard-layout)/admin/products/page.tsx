import Link from "next/link"
import { Plus } from "lucide-react"

import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { db } from "@/lib/prisma"
import { ProductQuerySchema } from "@/schemas/product-schema"

import { Button } from "@/components/ui/button"
import { ProductManagementTable } from "./_components/product-management-table"

export const metadata: Metadata = {
  title: "Products — Lensora Admin",
}

export default async function AdminProductsPage(props: {
  params: Promise<{ lang: LocaleType }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { lang } = await props.params
  const searchParams = await props.searchParams

  // Parse query params
  const query = ProductQuerySchema.parse({
    page: searchParams.page,
    limit: searchParams.limit,
    q: searchParams.q,
    status: searchParams.status,
    collectionId: searchParams.collectionId,
    sortBy: searchParams.sortBy,
    sortOrder: searchParams.sortOrder,
  })

  const skip = (query.page - 1) * query.limit

  // Build where clause (matches API logic)
  const where: any = {
    deletedAt: null,
  }

  if (query.q) {
    where.OR = [
      { name: { contains: query.q as string, mode: "insensitive" } },
      { slug: { contains: query.q as string, mode: "insensitive" } },
      { sku: { contains: query.q as string, mode: "insensitive" } },
    ]
  }

  if (query.status) {
    where.status = query.status
  }

  if (query.collectionId) {
    where.collectionId = query.collectionId
  }

  // Fetch data
  const [total, products, collections] = await Promise.all([
    db.product.count({ where }),
    db.product.findMany({
      where,
      skip,
      take: query.limit,
      orderBy: {
        [query.sortBy]: query.sortOrder,
      },
      include: {
        collection: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    db.collection.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
    }),
  ])

  const serializedProducts = JSON.parse(JSON.stringify(products, (key, value) => 
    typeof value === 'object' && value?.constructor?.name === 'Decimal' 
      ? Number(value) 
      : value
  ))

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href={`/${lang}/admin/products/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <ProductManagementTable
        products={serializedProducts}
        collections={collections as any}
        lang={lang}
        pagination={{
          total,
          page: query.page,
          limit: query.limit,
          totalPages: Math.ceil(total / query.limit),
        }}
      />
    </div>
  )
}
