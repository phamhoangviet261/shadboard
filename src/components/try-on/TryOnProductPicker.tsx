"use client"

import React, { useMemo } from "react"
import Image from "next/image"
import { Sparkles, Star } from "lucide-react"

import type { Recommendation } from "@/lib/try-on/recommendation-utils"

import { scoreProductMatch } from "@/lib/try-on/recommendation-utils"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface TryOnProduct {
  id: string
  name: string
  price: number
  imageUrl: string
  slug: string
  tags?: string[]
  description?: string
}

interface TryOnProductPickerProps {
  products: TryOnProduct[]
  selectedId: string | null
  onSelect: (product: TryOnProduct) => void
  recommendation?: Recommendation | null
}

export const TryOnProductPicker: React.FC<TryOnProductPickerProps> = ({
  products,
  selectedId,
  onSelect,
  recommendation,
}) => {
  // Sort products to show recommended ones first
  const sortedProducts = useMemo(() => {
    if (!recommendation) return products

    return [...products].sort((a, b) => {
      const scoreA = scoreProductMatch(a, recommendation)
      const scoreB = scoreProductMatch(b, recommendation)
      return scoreB - scoreA // Desceding order of match
    })
  }, [products, recommendation])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-400">
          Select Eyewear
        </h3>
        {recommendation && (
          <div className="flex items-center gap-1.5 text-[10px] text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/20">
            <Sparkles className="w-3 h-3" />
            <span>AI Filters Active</span>
          </div>
        )}
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {sortedProducts.map((product) => {
            const matchScore = recommendation
              ? scoreProductMatch(product, recommendation)
              : 1
            const isRecommended = matchScore === 2

            return (
              <Card
                key={product.id}
                className={`group relative overflow-hidden cursor-pointer transition-all duration-300 border-neutral-800 bg-neutral-900 hover:border-neutral-600 ${
                  selectedId === product.id
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black border-white"
                    : ""
                }`}
                onClick={() => onSelect(product)}
              >
                {/* Recommendation Ribbon */}
                {isRecommended && (
                  <div className="absolute top-0 right-0 z-10">
                    <div className="bg-primary text-black text-[8px] font-black uppercase px-2 py-0.5 shadow-lg flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Best Match
                    </div>
                  </div>
                )}

                <CardContent className="p-0">
                  <div className="aspect-square relative bg-neutral-800/30 p-4 transition-transform group-hover:scale-105 duration-500">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <p className="text-[11px] font-medium text-white truncate">
                        {product.name}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-neutral-500">
                        ${product.price.toLocaleString()}
                      </p>
                      {recommendation && (
                        <span
                          className={`text-[8px] font-bold uppercase tracking-tighter ${
                            matchScore === 2
                              ? "text-emerald-400"
                              : matchScore === 1
                                ? "text-blue-400"
                                : "text-neutral-500"
                          }`}
                        >
                          {matchScore === 2
                            ? "Highly Recommended"
                            : matchScore === 1
                              ? "Good Match"
                              : "Try Anyways"}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </ScrollArea>
      {products.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 border border-dashed border-neutral-800 rounded-2xl text-center">
          <p className="text-xs text-neutral-500">
            No alternate products available
          </p>
        </div>
      )}
    </div>
  )
}
