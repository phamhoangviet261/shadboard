import Image from "next/image"
import { notFound } from "next/navigation"

import type { LocaleType, ProductType } from "@/types"
import type { Metadata } from "next"

import { collectionsData } from "@/data/lensora/collections"
import { productsData } from "@/data/lensora/products"

import { db } from "@/lib/prisma"
import { serializeProducts } from "@/lib/product-serialization"

import { CollectionProductGrid } from "./_components/collection-product-grid"

interface Props {
  params: Promise<{ lang: LocaleType; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  if (slug === "all") {
    return {
      title: "All Products — Lensora",
      description: "Browse all available eyewear products.",
    }
  }

  const collection = collectionsData.find((c) => c.slug === slug)
  if (!collection) return {}
  return {
    title: `${collection.name} — Lensora`,
    description: collection.description || "",
  }
}

export async function generateStaticParams() {
  const params = collectionsData
    .filter((c) => c.status === "published")
    .map((c) => ({ slug: c.slug }))

  return [...params, { slug: "all" }]
}

export default async function CollectionDetailPage({ params }: Props) {
  const { lang, slug } = await params

  let collection
  let collectionProducts

  if (slug === "all") {
    // Fetch all published products from database
    const products = await db.product.findMany({
      where: {
        status: "published",
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    collectionProducts = serializeProducts<ProductType>(products)

    collection = {
      id: "all",
      name: "All Products",
      slug: "all",
      description: "Browse all available eyewear products.",
      thumbnailUrl:
        collectionProducts.length > 0 ? collectionProducts[0].thumbnailUrl : "",
      status: "published" as const,
    }
  } else {
    collection = collectionsData.find((c) => c.slug === slug)

    if (!collection || collection.status !== "published") {
      notFound()
    }

    collectionProducts = productsData.filter(
      (p) => p.collectionId === collection!.id
    )
  }

  return (
    <div>
      {/* Collection hero */}
      <section className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src={collection.thumbnailUrl || ""}
          alt={collection.name}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end container pb-10">
          <p className="text-white/60 text-xs uppercase tracking-widest mb-2">
            Collection
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
            {collection.name}
          </h1>
          <p className="text-white/70 text-base max-w-lg leading-relaxed">
            {collection.description || ""}
          </p>
        </div>
      </section>

      {/* Product grid with filters */}
      <div className="container py-10">
        <CollectionProductGrid products={collectionProducts} lang={lang} />
      </div>
    </div>
  )
}
