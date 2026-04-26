"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Camera, Check, Truck } from "lucide-react"

import type { ProductType } from "@/types"

import { Button } from "@/components/ui/button"
import { ColorSwatch } from "@/components/lensora/color-swatch"
import { SizeSelector } from "@/components/lensora/size-selector"

interface ProductDetailsFormProps {
  product: ProductType
}

export function ProductDetailsForm({ product }: ProductDetailsFormProps) {
  const params = useParams()
  const lang = params.lang as string

  const [selectedColor, setSelectedColor] = useState(
    product.colors?.[0] || { name: "", hex: "" }
  )
  const [selectedSize, setSelectedSize] = useState(product.size?.[0] || "")

  return (
    <div className="space-y-6">
      {/* Color */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Color</p>
          <span className="text-sm text-muted-foreground">
            {selectedColor.name}
          </span>
        </div>
        <ColorSwatch
          colors={product.colors || []}
          selected={selectedColor}
          onSelect={setSelectedColor}
        />
      </div>

      {/* Size */}
      {product.size && product.size.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Size</p>
            <button className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground">
              Size Guide
            </button>
          </div>
          <SizeSelector
            sizes={product.size}
            selected={selectedSize}
            onSelect={setSelectedSize}
          />
        </div>
      )}

      {/* Actions */}
      <div className="pt-2 space-y-3">
        <Button size="lg" className="w-full text-base h-12">
          Add to Bag — ${product.price}
        </Button>

        <Button
          variant="outline"
          size="lg"
          className="w-full text-base h-12 border-neutral-200 hover:bg-neutral-50"
          asChild
        >
          <Link href={`/${lang}/shop/products/${product.slug}/try-on`}>
            <Camera className="size-4 mr-2" />
            Virtual Try-On
          </Link>
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Free shipping and returns on all orders.
        </p>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Check className="size-4 text-primary" />
          <span>In stock, ready to ship</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Truck className="size-4 text-primary" />
          <span>Ships within 24 hours</span>
        </div>
      </div>
    </div>
  )
}
