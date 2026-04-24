import Link from "next/link"
import { Plus } from "lucide-react"

import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { collectionsData } from "@/data/lensora/collections"
import { productsData } from "@/data/lensora/products"

import { Button } from "@/components/ui/button"
import { ProductManagementTable } from "./_components/product-management-table"

export const metadata: Metadata = {
  title: "Products — Lensora Admin",
}

export default async function AdminProductsPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await props.params

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
        products={productsData}
        collections={collectionsData}
        lang={lang}
      />
    </div>
  )
}
