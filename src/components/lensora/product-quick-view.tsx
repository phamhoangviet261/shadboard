"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"

import type { ProductType } from "@/types"

import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ColorSwatch } from "./color-swatch"

interface ProductQuickViewProps {
  product: ProductType
  lang: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductQuickView({
  product,
  lang,
  open,
  onOpenChange,
}: ProductQuickViewProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || { name: "", hex: "" }
  )

  const images = product.images || []
  const colors = product.colors || []

  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.compareAtPrice! - product.price) / product.compareAtPrice!) *
          100
      )
    : 0

  const goNext = () => setCurrentImageIndex((i) => (i + 1) % images.length)
  const goPrev = () =>
    setCurrentImageIndex((i) => (i - 1 + images.length) % images.length)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 overflow-y-auto"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{product.name}</SheetTitle>
        </SheetHeader>

        {/* Image gallery */}
        <div className="relative aspect-square bg-muted">
          {images.length > 0 ? (
            <Image
              src={images[currentImageIndex].url}
              alt={images[currentImageIndex].alt}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No images
            </div>
          )}
          {images.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 size-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="size-4" />
              </button>
            </>
          )}
          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={cn(
                    "size-1.5 rounded-full transition-all",
                    i === currentImageIndex ? "bg-white w-3" : "bg-white/50"
                  )}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Header */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold leading-tight">
                {product.name}
              </h2>
              {product.isFeatured && (
                <Badge variant="secondary" className="shrink-0 text-xs">
                  Featured
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-2xl font-bold">${product.price}</span>
              {hasDiscount && (
                <>
                  <span className="text-base text-muted-foreground line-through">
                    ${product.compareAtPrice}
                  </span>
                  <Badge variant="destructive" className="text-xs">
                    -{discountPercent}%
                  </Badge>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {product.description}
          </p>

          {/* Color */}
          {colors.length > 0 && (
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2">
                Color —{" "}
                <span className="text-foreground">{selectedColor.name}</span>
              </p>
              <ColorSwatch
                colors={colors}
                selected={selectedColor}
                onSelect={setSelectedColor}
              />
            </div>
          )}

          {/* Specs summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Shape", value: product.frameShape },
              { label: "Material", value: product.frameMaterial },
              { label: "Fit", value: product.faceFit },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg border border-border p-3 text-center"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="text-sm font-medium capitalize mt-0.5">{value}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-1">
            <Button size="lg" className="w-full">
              Add to Bag
            </Button>
            <Button variant="outline" size="lg" className="w-full" asChild>
              <Link href={`/${lang}/shop/products/${product.slug}`}>
                View Full Details
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
