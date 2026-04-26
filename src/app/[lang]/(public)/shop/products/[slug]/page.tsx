import Link from "next/link"
import { notFound } from "next/navigation"

import type { LocaleType, ProductType } from "@/types"
import type { Metadata } from "next"

import { db } from "@/lib/prisma"
import {
  serializeProduct,
  serializeProducts,
} from "@/lib/product-serialization"

import { Badge } from "@/components/ui/badge"
import { ProductDetailsForm } from "./_components/product-details-form"
import { ProductGallery } from "./_components/product-gallery"
import { FrameSpecs } from "@/components/lensora/frame-specs"
import { ProductCard } from "@/components/lensora/product-card"

interface Props {
  params: Promise<{ lang: LocaleType; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await db.product.findUnique({ where: { slug } })
  if (!product || product.deletedAt) return {}
  return {
    title: product.seoTitle || `${product.name} — Lensora`,
    description: product.seoDescription || product.description || "",
  }
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { status: "published", deletedAt: null },
    select: { slug: true },
  })
  return products.map((p) => ({ slug: p.slug }))
}

export default async function ProductDetailPage({ params }: Props) {
  const { lang, slug } = await params
  const product = await db.product.findUnique({
    where: { slug },
  })

  if (!product || product.status !== "published" || product.deletedAt) {
    notFound()
  }

  let relatedProducts: unknown[] = []
  if (product.collectionId) {
    relatedProducts = await db.product.findMany({
      where: {
        collectionId: product.collectionId,
        id: { not: product.id },
        status: "published",
        deletedAt: null,
      },
      take: 4,
    })
  }

  const serializedProduct = serializeProduct<ProductType>(product)
  const serializedRelatedProducts =
    serializeProducts<ProductType>(relatedProducts)

  const hasDiscount =
    serializedProduct.compareAtPrice &&
    serializedProduct.compareAtPrice > serializedProduct.price
  const discountPercent = hasDiscount
    ? Math.round(
        ((serializedProduct.compareAtPrice! - serializedProduct.price) /
          serializedProduct.compareAtPrice!) *
          100
      )
    : 0

  return (
    <div className="container py-8 md:py-12 space-y-24">
      {/* Product Detail Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24">
          <ProductGallery images={serializedProduct.images || []} />
        </div>

        {/* Info */}
        <div className="space-y-8 max-w-lg">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {serializedProduct.isFeatured && (
                <Badge variant="secondary" className="text-xs">
                  Featured
                </Badge>
              )}
              {hasDiscount && (
                <Badge variant="destructive" className="text-xs">
                  Save {discountPercent}%
                </Badge>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
              {serializedProduct.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">
                ${serializedProduct.price}
              </span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  ${serializedProduct.compareAtPrice}
                </span>
              )}
            </div>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">
            {serializedProduct.description || ""}
          </p>

          <ProductDetailsForm product={serializedProduct} />

          {/* Accordions */}
          <div className="pt-4 border-t border-border">
            {serializedProduct.specs && (
              <FrameSpecs
                specs={serializedProduct.specs}
                frameMaterial={serializedProduct.frameMaterial || ""}
                frameShape={serializedProduct.frameShape || ""}
                lensType={serializedProduct.lensType || ""}
                faceFit={serializedProduct.faceFit || ""}
                gender={serializedProduct.gender || ""}
              />
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {serializedRelatedProducts.length > 0 && (
        <section>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">
              You might also like
            </h2>
            <Link
              href={`/${lang}/shop/collections`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Shop Collection
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serializedRelatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
