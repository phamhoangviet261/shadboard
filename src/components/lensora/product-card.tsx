"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Eye, ShoppingBag } from "lucide-react"

import type { ProductType } from "@/types"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ProductQuickView } from "./product-quick-view"

interface ProductCardProps {
  product: ProductType
  lang: string
}

export function ProductCard({ product, lang }: ProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [hovered, setHovered] = useState(false)

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0

  const mainImage = product.images[0]
  const hoverImage = product.images[1] ?? product.images[0]

  return (
    <>
      <article
        className="group relative flex flex-col"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Image Container */}
        <Link
          href={`/${lang}/shop/products/${product.slug}`}
          className="relative overflow-hidden rounded-xl bg-muted aspect-[4/3] block"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={hovered ? hoverImage.url : mainImage.url}
            alt={hovered ? hoverImage.alt : mainImage.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover transition-all duration-500",
              hovered ? "scale-105" : "scale-100"
            )}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isFeatured && (
              <Badge className="text-xs font-medium">Featured</Badge>
            )}
            {hasDiscount && (
              <Badge variant="destructive" className="text-xs font-medium">
                -{discountPercent}%
              </Badge>
            )}
          </div>

          {/* Quick actions overlay */}
          <div
            className={cn(
              "absolute inset-0 flex items-end justify-center gap-2 p-4 transition-all duration-300",
              hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            )}
          >
            <div className="flex gap-2 w-full">
              <Button
                size="sm"
                variant="secondary"
                className="flex-1 backdrop-blur-sm bg-background/80 hover:bg-background"
                onClick={(e) => {
                  e.preventDefault()
                  setQuickViewOpen(true)
                }}
              >
                <Eye className="size-3.5 mr-1.5" />
                Quick View
              </Button>
              <Button
                size="sm"
                className="flex-1"
                onClick={(e) => e.preventDefault()}
              >
                <ShoppingBag className="size-3.5 mr-1.5" />
                Add to Bag
              </Button>
            </div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="mt-3 space-y-1">
          <div className="flex items-start justify-between gap-2">
            <Link
              href={`/${lang}/shop/products/${product.slug}`}
              className="font-medium text-sm leading-snug hover:underline underline-offset-2 line-clamp-1"
            >
              {product.name}
            </Link>
            <div className="flex items-center gap-1.5 shrink-0">
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  ${product.compareAtPrice}
                </span>
              )}
              <span className="text-sm font-semibold">${product.price}</span>
            </div>
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-1">
            {product.colors.slice(0, 4).map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="size-3 rounded-full border border-border/60 shadow-sm"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground ml-0.5">
                +{product.colors.length - 4}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground capitalize">
            {product.frameShape} · {product.frameMaterial}
          </p>
        </div>
      </article>

      <ProductQuickView
        product={product}
        lang={lang}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  )
}
