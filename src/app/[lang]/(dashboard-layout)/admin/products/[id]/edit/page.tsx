import { notFound } from "next/navigation"

import type { CollectionType, LocaleType, ProductType } from "@/types"
import type { Metadata } from "next"

import { authenticateUser } from "@/lib/auth"
import { db } from "@/lib/prisma"
import { serializeProduct } from "@/lib/product-serialization"

import { ProductForm } from "../../_components/product-form"
import { UnauthorizedState } from "@/components/auth/unauthorized-state"

export const metadata: Metadata = {
  title: "Edit Product — Lensora Admin",
}

export default async function AdminEditProductPage(props: {
  params: Promise<{ lang: LocaleType; id: string }>
}) {
  const { lang, id } = await props.params

  try {
    await authenticateUser("product:update")
  } catch {
    return <UnauthorizedState />
  }

  const [product, collections] = await Promise.all([
    db.product.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    }),
    db.collection.findMany({
      where: { deletedAt: null },
      select: { id: true, name: true },
    }),
  ])

  if (!product) {
    notFound()
  }

  const serializedProduct = serializeProduct<ProductType>(product)

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>

      <ProductForm
        initialData={serializedProduct}
        lang={lang}
        collections={collections as Pick<CollectionType, "id" | "name">[]}
      />
    </div>
  )
}
