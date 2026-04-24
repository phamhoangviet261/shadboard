import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"

import type { LocaleType } from "@/types"

import { productsData } from "@/data/lensora/products"

import { Badge } from "@/components/ui/badge"
import { ProductCard } from "@/components/lensora/product-card"

import { ProductGallery } from "./_components/product-gallery"
import { ProductDetailsForm } from "./_components/product-details-form"
import { FrameSpecs } from "@/components/lensora/frame-specs"

interface Props {
  params: Promise<{ lang: LocaleType; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = productsData.find((p) => p.slug === slug)
  if (!product) return {}
  return {
    title: product.seoTitle || `${product.name} — Lensora`,
    description: product.seoDescription || product.description,
  }
}

export async function generateStaticParams() {
  return productsData
    .filter((p) => p.status === "published")
    .map((p) => ({ slug: p.slug }))
}

export default async function ProductDetailPage({ params }: Props) {
  const { lang, slug } = await params
  const product = productsData.find((p) => p.slug === slug)

  if (!product || product.status !== "published") {
    notFound()
  }

  const relatedProducts = productsData
    .filter(
      (p) =>
        p.collectionId === product.collectionId &&
        p.id !== product.id &&
        p.status === "published"
    )
    .slice(0, 4)

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0

  return (
    <div className="container py-8 md:py-12 space-y-24">
      {/* Product Detail Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start">
        {/* Gallery */}
        <div className="lg:sticky lg:top-24">
          <ProductGallery images={product.images} />
        </div>

        {/* Info */}
        <div className="space-y-8 max-w-lg">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {product.isFeatured && (
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
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold">${product.price}</span>
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  ${product.compareAtPrice}
                </span>
              )}
            </div>
          </div>

          <p className="text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <ProductDetailsForm product={product} />

          {/* Accordions */}
          <div className="pt-4 border-t border-border">
            <FrameSpecs
              specs={product.specs}
              frameMaterial={product.frameMaterial}
              frameShape={product.frameShape}
              lensType={product.lensType}
              faceFit={product.faceFit}
              gender={product.gender}
            />
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
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
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
