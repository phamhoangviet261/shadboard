import type { Metadata } from "next"
import type { LocaleType } from "@/types"

import { collectionsData } from "@/data/lensora/collections"
import { productsData } from "@/data/lensora/products"

import { CollectionCard } from "@/components/lensora/collection-card"

export const metadata: Metadata = {
  title: "Collections — Lensora",
  description:
    "Browse all Lensora eyewear collections. From timeless classics to sport performance and architectural frames.",
}

export default async function CollectionsPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await props.params

  const published = collectionsData.filter((c) => c.status === "published")

  return (
    <div className="container py-12 space-y-10">
      {/* Header */}
      <div className="max-w-xl">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
          All Collections
        </p>
        <h1 className="text-4xl font-bold tracking-tight mb-3">
          Curated Edits
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Each collection is a distinct point of view — from the quietly refined
          to the boldly architectural. Find the one that speaks to you.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-8 py-4 border-y border-border">
        {[
          { label: "Collections", value: published.length },
          {
            label: "Products",
            value: productsData.filter((p) => p.status === "published").length,
          },
          { label: "Materials", value: 5 },
          { label: "Frame shapes", value: 7 },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {published.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            lang={lang}
          />
        ))}
      </div>
    </div>
  )
}
