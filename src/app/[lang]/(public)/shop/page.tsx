import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"

import type { LocaleType } from "@/types"

import { collectionsData } from "@/data/lensora/collections"
import { productsData } from "@/data/lensora/products"

import { Button } from "@/components/ui/button"
import { CollectionCard } from "@/components/lensora/collection-card"
import { ProductCard } from "@/components/lensora/product-card"

export const metadata: Metadata = {
  title: "Lensora — Premium Eyewear",
  description:
    "Discover handcrafted eyewear that blends precision engineering with refined aesthetics. Shop glasses, sunglasses, and optical frames.",
}

export default async function ShopPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await props.params

  const featuredProducts = productsData
    .filter((p) => p.isFeatured && p.status === "published")
    .slice(0, 4)

  const featuredCollections = collectionsData
    .filter((c) => c.isFeatured && c.status === "published")
    .slice(0, 3)

  const heroCollection = collectionsData.find(
    (c) => c.slug === "classics" && c.status === "published"
  )

  return (
    <div className="space-y-20 pb-20">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1800&q=85"
            alt="Lensora — Premium Eyewear"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>

        <div className="relative z-10 container pb-16 md:pb-24">
          <div className="max-w-xl">
            <p className="text-white/60 text-sm uppercase tracking-[0.2em] font-medium mb-4">
              New Collection · 2024
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
              See the world
              <br />
              differently.
            </h1>
            <p className="text-white/70 text-lg mb-8 max-w-sm leading-relaxed">
              Precision-crafted eyewear for those who appreciate the art of
              detail.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-white/90"
                asChild
              >
                <Link href={`/${lang}/shop/collections`}>
                  Shop Collections
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/40 text-white hover:bg-white/10"
                asChild
              >
                <Link href={`/${lang}/shop/products/aether-titanium`}>
                  View Bestsellers
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
              Handpicked
            </p>
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Pieces
            </h2>
          </div>
          <Link
            href={`/${lang}/shop/collections`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} lang={lang} />
          ))}
        </div>
      </section>

      {/* Shop by Collection */}
      <section className="container">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1">
            Curated Edits
          </p>
          <h2 className="text-3xl font-bold tracking-tight">
            Shop by Collection
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredCollections.map((collection) => (
            <CollectionCard
              key={collection.id}
              collection={collection}
              lang={lang}
            />
          ))}
        </div>
      </section>

      {/* Brand strip */}
      <section className="bg-muted/50 border-y border-border py-16">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {[
            {
              label: "Handcrafted",
              desc: "Every frame is finished by hand to our exacting standards.",
            },
            {
              label: "Prescription Ready",
              desc: "All optical frames accept single-vision and progressive lenses.",
            },
            {
              label: "Free Returns",
              desc: "30-day home trial — return or exchange, no questions asked.",
            },
          ].map(({ label, desc }) => (
            <div key={label}>
              <h3 className="font-semibold text-base mb-2">{label}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
