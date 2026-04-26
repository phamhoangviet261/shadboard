import React from "react"
import Image from "next/image"

import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface TryOnProduct {
  id: string
  name: string
  price: number
  imageUrl: string
  slug: string
}

interface TryOnProductPickerProps {
  products: TryOnProduct[]
  selectedId: string | null
  onSelect: (product: TryOnProduct) => void
}

export const TryOnProductPicker: React.FC<TryOnProductPickerProps> = ({
  products,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-medium uppercase tracking-wider text-neutral-400 px-1">
        Select Eyewear
      </h3>
      <ScrollArea className="h-[400px] pr-4">
        <div className="grid grid-cols-2 gap-3 pb-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className={`overflow-hidden cursor-pointer transition-all duration-200 border-neutral-800 bg-neutral-900 hover:border-neutral-700 ${
                selectedId === product.id
                  ? "ring-2 ring-white ring-offset-2 ring-offset-black border-white"
                  : ""
              }`}
              onClick={() => onSelect(product)}
            >
              <CardContent className="p-0">
                <div className="aspect-square relative bg-neutral-800/50 p-4">
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-3">
                  <p className="text-[11px] font-medium text-white truncate mb-1">
                    {product.name}
                  </p>
                  <p className="text-[10px] text-neutral-500">
                    ${product.price.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
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
