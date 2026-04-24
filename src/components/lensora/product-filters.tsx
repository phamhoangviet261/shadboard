"use client"

import { useState } from "react"
import { SlidersHorizontal, X } from "lucide-react"

import type {
  FaceFit,
  FrameMaterial,
  FrameShape,
  Gender,
  LensType,
} from "@/types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export interface FilterState {
  frameShapes: FrameShape[]
  frameMaterials: FrameMaterial[]
  lensTypes: LensType[]
  genders: Gender[]
  faceFits: FaceFit[]
  priceRange: [number, number]
}

export const defaultFilters: FilterState = {
  frameShapes: [],
  frameMaterials: [],
  lensTypes: [],
  genders: [],
  faceFits: [],
  priceRange: [0, 500],
}

interface ProductFiltersProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

const FRAME_SHAPES: FrameShape[] = [
  "round",
  "square",
  "rectangle",
  "cat-eye",
  "aviator",
  "oval",
  "geometric",
]
const FRAME_MATERIALS: FrameMaterial[] = [
  "acetate",
  "titanium",
  "stainless-steel",
  "tr90",
  "wood",
]
const LENS_TYPES: LensType[] = [
  "single-vision",
  "progressive",
  "blue-light",
  "sunglasses",
]
const GENDERS: Gender[] = ["men", "women", "unisex"]
const FACE_FITS: FaceFit[] = ["narrow", "medium", "wide"]

function toggle<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((v) => v !== item) : [...arr, item]
}

function FilterGroup<T extends string>({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string
  options: T[]
  selected: T[]
  onToggle: (item: T) => void
}) {
  return (
    <div className="space-y-2.5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <div className="space-y-2">
        {options.map((opt) => (
          <div key={opt} className="flex items-center gap-2.5">
            <Checkbox
              id={`filter-${opt}`}
              checked={selected.includes(opt)}
              onCheckedChange={() => onToggle(opt)}
            />
            <Label
              htmlFor={`filter-${opt}`}
              className="text-sm capitalize cursor-pointer font-normal"
            >
              {opt.replace(/-/g, " ")}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}

function FiltersPanel({
  filters,
  onChange,
}: ProductFiltersProps) {
  const activeCount =
    filters.frameShapes.length +
    filters.frameMaterials.length +
    filters.lensTypes.length +
    filters.genders.length +
    filters.faceFits.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0)

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm">
          Filters{" "}
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </p>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => onChange(defaultFilters)}
          >
            <X className="size-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>
      <Separator />

      {/* Price Range */}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Price
        </p>
        <Slider
          min={0}
          max={500}
          step={10}
          value={filters.priceRange}
          onValueChange={(v) =>
            onChange({ ...filters, priceRange: v as [number, number] })
          }
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      <FilterGroup
        title="Frame Shape"
        options={FRAME_SHAPES}
        selected={filters.frameShapes}
        onToggle={(v) =>
          onChange({ ...filters, frameShapes: toggle(filters.frameShapes, v) })
        }
      />
      <Separator />
      <FilterGroup
        title="Material"
        options={FRAME_MATERIALS}
        selected={filters.frameMaterials}
        onToggle={(v) =>
          onChange({
            ...filters,
            frameMaterials: toggle(filters.frameMaterials, v),
          })
        }
      />
      <Separator />
      <FilterGroup
        title="Lens Type"
        options={LENS_TYPES}
        selected={filters.lensTypes}
        onToggle={(v) =>
          onChange({ ...filters, lensTypes: toggle(filters.lensTypes, v) })
        }
      />
      <Separator />
      <FilterGroup
        title="Gender"
        options={GENDERS}
        selected={filters.genders}
        onToggle={(v) =>
          onChange({ ...filters, genders: toggle(filters.genders, v) })
        }
      />
      <Separator />
      <FilterGroup
        title="Face Fit"
        options={FACE_FITS}
        selected={filters.faceFits}
        onToggle={(v) =>
          onChange({ ...filters, faceFits: toggle(filters.faceFits, v) })
        }
      />
    </div>
  )
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <FiltersPanel filters={filters} onChange={onChange} />
      </aside>

      {/* Mobile sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="size-4 mr-2" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <FiltersPanel filters={filters} onChange={onChange} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
