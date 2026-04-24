"use client"

import type { ProductSize } from "@/types"

import { cn } from "@/lib/utils"

interface SizeSelectorProps {
  sizes: ProductSize[]
  selected?: ProductSize
  onSelect: (size: ProductSize) => void
}

export function SizeSelector({ sizes, selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((size) => {
        const isSelected = size === selected
        return (
          <button
            key={size}
            onClick={() => onSelect(size)}
            className={cn(
              "h-10 px-4 rounded-md border text-sm font-medium transition-all duration-200",
              isSelected
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:border-foreground/50 hover:bg-muted"
            )}
            aria-label={`Select size ${size}`}
            aria-pressed={isSelected}
          >
            {size}
          </button>
        )
      })}
    </div>
  )
}
