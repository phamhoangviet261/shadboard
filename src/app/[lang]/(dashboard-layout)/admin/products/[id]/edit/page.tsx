import { notFound } from "next/navigation"
import type { Metadata } from "next"

import type { LocaleType } from "@/types"

import { productsData } from "@/data/lensora/products"
import { ProductForm } from "../../_components/product-form"

export const metadata: Metadata = {
  title: "Edit Product — Lensora Admin",
}

export default async function AdminEditProductPage(props: {
  params: Promise<{ lang: LocaleType; id: string }>
}) {
  const { lang, id } = await props.params
  const product = productsData.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
      </div>

      <ProductForm initialData={product} lang={lang} />
    </div>
  )
}
