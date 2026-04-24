"use client"

import { ArrowDownAZ, ArrowUpAZ, Sparkles, TrendingUp } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type SortOption = "featured" | "newest" | "price-asc" | "price-desc"

const sortOptions: {
  value: SortOption
  label: string
  icon: React.ReactNode
}[] = [
  {
    value: "featured",
    label: "Featured",
    icon: <Sparkles className="size-3.5" />,
  },
  {
    value: "newest",
    label: "Newest",
    icon: <TrendingUp className="size-3.5" />,
  },
  {
    value: "price-asc",
    label: "Price: Low to High",
    icon: <ArrowDownAZ className="size-3.5" />,
  },
  {
    value: "price-desc",
    label: "Price: High to Low",
    icon: <ArrowUpAZ className="size-3.5" />,
  },
]

interface ProductSortProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

export function ProductSort({ value, onChange }: ProductSortProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-[180px] h-9 text-sm" id="sort-select">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent align="end">
        {sortOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            <div className="flex items-center gap-2">
              {opt.icon}
              {opt.label}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
