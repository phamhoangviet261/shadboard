"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import type { FilterState } from "@/components/lensora/product-filters"
import type { SortOption } from "@/components/lensora/product-sort"
import type { ProductType } from "@/types"

import { Input } from "@/components/ui/input"
import { ProductCard } from "@/components/lensora/product-card"
import {
  ProductFilters,
  defaultFilters,
} from "@/components/lensora/product-filters"
import { ProductSort } from "@/components/lensora/product-sort"

interface CollectionProductGridProps {
  products: ProductType[]
  lang: string
}

export function CollectionProductGrid({
  products,
  lang,
}: CollectionProductGridProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [sort, setSort] = useState<SortOption>("featured")
  const [search, setSearch] = useState("")

  const filtered = useMemo(() => {
    let result = products.filter((p) => p.status === "published")

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (filters.frameShapes.length)
      result = result.filter((p) => filters.frameShapes.includes(p.frameShape))
    if (filters.frameMaterials.length)
      result = result.filter((p) =>
        filters.frameMaterials.includes(p.frameMaterial)
      )
    if (filters.lensTypes.length)
      result = result.filter((p) => filters.lensTypes.includes(p.lensType))
    if (filters.genders.length)
      result = result.filter((p) => filters.genders.includes(p.gender))
    if (filters.faceFits.length)
      result = result.filter((p) => filters.faceFits.includes(p.faceFit))

    result = result.filter(
      (p) =>
        p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    )

    return result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price
        case "price-desc":
          return b.price - a.price
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        case "featured":
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
      }
    })
  }, [products, filters, sort, search])

  return (
    <div className="flex gap-8">
      <ProductFilters filters={filters} onChange={setFilters} />

      <div className="flex-1 min-w-0 space-y-5">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="product-search"
              placeholder="Search products…"
              className="pl-9 h-9 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-muted-foreground">
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </span>
            <ProductSort value={sort} onChange={setSort} />
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} lang={lang} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
