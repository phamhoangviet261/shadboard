/* eslint-disable @next/next/no-img-element */
"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"

import type { ProductImage } from "@/types"

import { cn } from "@/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ProductGalleryProps {
  images: ProductImage[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  const goNext = () => setCurrentIndex((i) => (i + 1) % images.length)
  const goPrev = () =>
    setCurrentIndex((i) => (i - 1 + images.length) % images.length)

  if (!images.length) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        No images available
      </div>
    )
  }

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:w-20 shrink-0 hide-scrollbar pb-2 lg:pb-0">
          {images.map((image, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative shrink-0 w-20 aspect-[3/4] overflow-hidden rounded-lg border-2 transition-all duration-200 bg-muted",
                currentIndex === idx
                  ? "border-primary ring-1 ring-primary/20 ring-offset-1 scale-100 opacity-100"
                  : "border-transparent opacity-60 hover:opacity-100 scale-95 hover:scale-100"
              )}
              aria-label={`View image ${idx + 1}`}
              aria-current={currentIndex === idx}
            >
              <Image
                src={image.url}
                alt={image.alt || ""}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main Image */}
      <div className="relative flex-1 aspect-[4/5] lg:aspect-[3/4] bg-muted rounded-2xl overflow-hidden group">
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogTrigger asChild>
            <button
              className="relative h-full w-full cursor-zoom-in"
              aria-label="Zoom image"
            >
              <Image
                src={images[currentIndex].url}
                alt={images[currentIndex].alt || ""}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute bottom-4 right-4 z-10 rounded-full bg-background/80 p-2 backdrop-blur-md opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="size-5" />
              </div>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[95vw] max-h-[95vh] border-none bg-transparent p-0 shadow-none outline-none">
            <div className="sr-only">
              <DialogTitle>Product Image Gallery Preview</DialogTitle>
            </div>
            <div className="relative h-[90vh] w-full">
              <img
                src={images[currentIndex].url}
                alt={images[currentIndex].alt || ""}
                className="h-full w-full object-contain"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      goPrev()
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center hover:bg-background transition-all"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      goNext()
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 size-12 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center hover:bg-background transition-all"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {images.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-background hover:scale-110 shadow-sm z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 size-10 rounded-full bg-background/80 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-background hover:scale-110 shadow-sm z-10"
              aria-label="Next image"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}
