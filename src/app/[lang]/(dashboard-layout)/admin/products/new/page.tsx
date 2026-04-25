import type { CollectionType, LocaleType } from "@/types"
import type { Metadata } from "next"

import { db } from "@/lib/prisma"

import { ProductForm } from "../_components/product-form"

export const metadata: Metadata = {
  title: "New Product — Lensora Admin",
}

export default async function AdminNewProductPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await props.params

  const collections = await db.collection.findMany({
    where: { deletedAt: null },
    select: { id: true, name: true },
  })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Add Product</h2>
      </div>

      <ProductForm
        lang={lang}
        collections={collections as Pick<CollectionType, "id" | "name">[]}
      />
    </div>
  )
}
