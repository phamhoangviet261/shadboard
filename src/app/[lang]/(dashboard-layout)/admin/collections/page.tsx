import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { db } from "@/lib/prisma"
import { CollectionManager } from "./_components/collection-manager"

export const metadata: Metadata = {
  title: "Collections — Lensora Admin",
}

export default async function AdminCollectionsPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await props.params

  const [collections, products] = await Promise.all([
    db.collection.findMany({
      where: { deletedAt: null },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { products: { where: { deletedAt: null } } }
        }
      }
    }),
    db.product.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true, price: true, thumbnailUrl: true }
    })
  ])

  const serializedCollections = JSON.parse(JSON.stringify(collections))
  const serializedProducts = JSON.parse(JSON.stringify(products, (key, value) => 
    typeof value === 'object' && value?.constructor?.name === 'Decimal' 
      ? Number(value) 
      : value
  ))

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Collections</h2>
          <p className="text-sm text-muted-foreground">
            Curate storefront edits and merchandising groups.
          </p>
        </div>
      </div>

      <CollectionManager
        collections={serializedCollections}
        products={serializedProducts}
        lang={lang}
      />
    </div>
  )
}
