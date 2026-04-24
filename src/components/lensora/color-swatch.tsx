"use client"

import type { ColorVariant } from "@/types"

import { cn } from "@/lib/utils"

interface ColorSwatchProps {
  colors: ColorVariant[]
  selected: ColorVariant
  onSelect: (color: ColorVariant) => void
  size?: "sm" | "md"
}

export function ColorSwatch({
  colors,
  selected,
  onSelect,
  size = "md",
}: ColorSwatchProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((color) => {
        const isSelected = color.name === selected.name
        return (
          <button
            key={color.name}
            title={color.name}
            aria-label={`Select color: ${color.name}`}
            aria-pressed={isSelected}
            onClick={() => onSelect(color)}
            className={cn(
              "rounded-full border-2 transition-all duration-200",
              size === "md" ? "size-7" : "size-5",
              isSelected
                ? "border-foreground ring-2 ring-foreground/20 ring-offset-1 scale-110"
                : "border-border hover:border-foreground/50 hover:scale-105"
            )}
            style={{ backgroundColor: color.hex }}
          />
        )
      })}
    </div>
  )
}
