import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import type { CollectionType } from "@/types"

import { productsData } from "@/data/lensora/products"

import { cn } from "@/lib/utils"

interface CollectionCardProps {
  collection: CollectionType
  lang: string
  className?: string
}

export function CollectionCard({
  collection,
  lang,
  className,
}: CollectionCardProps) {
  const productCount = productsData.filter(
    (p) => p.collectionId === collection.id && p.status === "published"
  ).length

  return (
    <Link
      href={`/${lang}/shop/collections/${collection.slug}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-muted block",
        className
      )}
      aria-label={`Browse ${collection.name}`}
    >
      {/* Background Image */}
      <div className="aspect-[3/4] relative">
        <Image
          src={collection.thumbnailUrl || ""}
          alt={collection.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <p className="text-xs font-medium text-white/60 uppercase tracking-widest mb-1">
          {productCount} {productCount === 1 ? "piece" : "pieces"}
        </p>
        <h3 className="text-xl font-semibold leading-tight mb-1">
          {collection.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-white/80 transition-all duration-300 group-hover:gap-2">
          <span>Shop now</span>
          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
