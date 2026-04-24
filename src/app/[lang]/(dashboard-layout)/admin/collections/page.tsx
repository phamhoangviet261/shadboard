import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { collectionsData } from "@/data/lensora/collections"
import { productsData } from "@/data/lensora/products"

import { CollectionManager } from "./_components/collection-manager"

export const metadata: Metadata = {
  title: "Collections — Lensora Admin",
}

export default async function AdminCollectionsPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await props.params

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
        collections={collectionsData}
        products={productsData}
        lang={lang}
      />
    </div>
  )
}
