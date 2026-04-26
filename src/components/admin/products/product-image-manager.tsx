"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { useDropzone } from "react-dropzone"
import {
  AlertCircle,
  GripVertical,
  ImageIcon,
  Plus,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react"

import type { DropResult } from "@hello-pangea/dnd"

import {
  isLocalPreview,
  revokeImagePreviewUrl,
  validateImageFile,
} from "@/lib/image-utils"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface ProductMediaItem {
  id: string
  url: string
  alt: string
  isLocal: boolean
  file?: File
}

interface ProductImageManagerProps {
  images?: { url: string; alt?: string }[]
  thumbnailUrl?: string
  onChange: (
    images: { url: string; alt: string }[],
    thumbnailUrl?: string
  ) => void
  maxImages?: number
}

export function ProductImageManager({
  images = [],
  thumbnailUrl,
  onChange,
  maxImages = 8,
}: ProductImageManagerProps) {
  const [items, setItems] = useState<ProductMediaItem[]>([])
  const [urlInput, setUrlInput] = useState("")
  const [isAddingUrl, setIsAddingUrl] = useState(false)

  // Initialize items from props
  useEffect(() => {
    const initialItems: ProductMediaItem[] = images.map((img, index) => ({
      id: `existing-${index}-${img.url}`,
      url: img.url,
      alt: img.alt || "",
      isLocal: isLocalPreview(img.url),
    }))
    setItems(initialItems)
  }, [images])

  const notifyChange = useCallback(
    (newItems: ProductMediaItem[], newThumbnail?: string) => {
      const imagesToEmit: { url: string; alt: string }[] = newItems.map(
        (item) => ({
          url: item.url,
          alt: item.alt,
        })
      )
      onChange(imagesToEmit, newThumbnail || thumbnailUrl)
    },
    [onChange, thumbnailUrl]
  )

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newItems: ProductMediaItem[] = []

      acceptedFiles.forEach((file) => {
        const validation = validateImageFile(file)
        if (!validation.valid) {
          console.error(validation.error)
          return
        }

        if (items.length + newItems.length >= maxImages) return

        newItems.push({
          id: crypto.randomUUID(),
          url: URL.createObjectURL(file),
          alt: file.name,
          isLocal: true,
          file,
        })
      })

      const updatedItems = [...items, ...newItems]
      setItems(updatedItems)
      notifyChange(updatedItems)
    },
    [items, maxImages, notifyChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/gif": [],
      "image/avif": [],
    },
    maxFiles: maxImages - items.length,
    disabled: items.length >= maxImages,
  })

  const handleAddUrl = () => {
    if (!urlInput) return

    try {
      new URL(urlInput)
    } catch {
      return
    }

    const newItem: ProductMediaItem = {
      id: crypto.randomUUID(),
      url: urlInput,
      alt: "Remote image",
      isLocal: false,
    }

    const updatedItems = [...items, newItem]
    setItems(updatedItems)
    setUrlInput("")
    setIsAddingUrl(false)
    notifyChange(updatedItems)
  }

  const handleRemove = (id: string) => {
    const itemToRemove = items.find((item) => item.id === id)
    if (itemToRemove?.isLocal) {
      revokeImagePreviewUrl(itemToRemove.url)
    }

    const updatedItems = items.filter((item) => item.id !== id)
    setItems(updatedItems)

    let newThumbnail = thumbnailUrl
    if (itemToRemove?.url === thumbnailUrl) {
      const firstRemote = updatedItems.find((item) => !item.isLocal)
      newThumbnail = firstRemote?.url || ""
    }

    notifyChange(updatedItems, newThumbnail)
  }

  const handleSetThumbnail = (url: string) => {
    if (isLocalPreview(url)) return

    const plainImages = items.map((item) => ({ url: item.url, alt: item.alt }))
    onChange(plainImages, url)
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const reorderedItems = Array.from(items)
    const [removed] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, removed)

    setItems(reorderedItems)
    notifyChange(reorderedItems)
  }

  const hasLocalPreviews = items.some((item) => item.isLocal)

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative flex min-h-40 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 p-6 transition-all hover:border-primary/50 hover:bg-muted/10",
          isDragActive && "border-primary bg-muted/20",
          items.length >= maxImages && "cursor-not-allowed opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="rounded-full bg-background p-3 shadow-sm ring-1 ring-border">
            <UploadCloud className="size-6 text-muted-foreground" />
          </div>
          <p className="mt-2 text-sm font-medium">
            Drag & drop images or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, WebP, GIF, AVIF (Max 5MB each, up to {maxImages} total)
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Product Gallery</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsAddingUrl(!isAddingUrl)}
          className="h-8 gap-1.5"
        >
          {isAddingUrl ? (
            <>
              <X className="size-3.5" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="size-3.5" />
              Add by URL
            </>
          )}
        </Button>
      </div>

      {isAddingUrl && (
        <div className="flex animate-in fade-in slide-in-from-top-2 items-end gap-2 rounded-lg border bg-muted/30 p-3">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="image-url" className="sr-only">
              Image URL
            </Label>
            <Input
              id="image-url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="h-9"
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddUrl())
              }
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleAddUrl}
            className="h-9"
          >
            Add
          </Button>
        </div>
      )}

      {hasLocalPreviews && (
        <div className="flex items-start gap-3 rounded-xl border border-warning/20 bg-warning/5 p-4 text-warning-foreground">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Local Previews Detected</p>
            <p className="text-xs leading-relaxed opacity-90">
              Images marked as{" "}
              <Badge
                variant="outline"
                className="h-4 px-1 text-[10px] font-bold uppercase tracking-wider border-warning/30 bg-warning/10 text-warning-foreground"
              >
                Demo Preview
              </Badge>{" "}
              cannot be saved to the database yet. Please upload them to a
              storage service or provide a remote URL to persist them.
            </p>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="product-images" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-wrap gap-4"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={cn(
                        "group relative aspect-square w-full max-w-[140px] rounded-xl border bg-background p-1.5 shadow-sm transition-all sm:max-w-[160px]",
                        snapshot.isDragging &&
                          "z-50 ring-2 ring-primary shadow-lg",
                        item.url === thumbnailUrl && "ring-2 ring-primary"
                      )}
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={item.url}
                          alt={item.alt}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />

                        <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  className="size-8 rounded-full"
                                  onClick={() => handleRemove(item.id)}
                                >
                                  <Trash2 className="size-4 text-destructive" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Remove image</TooltipContent>
                            </Tooltip>

                            {!item.isLocal && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant={
                                      item.url === thumbnailUrl
                                        ? "default"
                                        : "secondary"
                                    }
                                    size="icon"
                                    className="size-8 rounded-full"
                                    onClick={() => handleSetThumbnail(item.url)}
                                  >
                                    <Star
                                      className={cn(
                                        "size-4",
                                        item.url === thumbnailUrl &&
                                          "fill-current"
                                      )}
                                    />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {item.url === thumbnailUrl
                                    ? "Primary image"
                                    : "Set as primary"}
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </TooltipProvider>
                        </div>

                        <div className="absolute left-2 top-2 flex flex-col gap-1">
                          {item.url === thumbnailUrl && (
                            <Badge className="h-5 px-1.5 text-[10px] font-bold uppercase shadow-sm">
                              Primary
                            </Badge>
                          )}
                          {item.isLocal && (
                            <Badge
                              variant="secondary"
                              className="h-5 border-yellow-500/50 bg-yellow-500/10 px-1.5 text-[10px] font-bold uppercase text-yellow-700 dark:text-yellow-400"
                            >
                              Demo Preview
                            </Badge>
                          )}
                        </div>

                        <div
                          {...provided.dragHandleProps}
                          className="absolute bottom-2 right-2 rounded-md bg-white/80 p-1 text-zinc-500 backdrop-blur-sm transition-colors hover:text-zinc-900 dark:bg-zinc-900/80"
                        >
                          <GripVertical className="size-4" />
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {items.length === 0 && (
                <div className="flex aspect-square w-full max-w-[160px] flex-col items-center justify-center rounded-xl border border-dashed text-muted-foreground opacity-40">
                  <ImageIcon className="size-8" />
                  <span className="mt-2 text-xs font-medium">
                    Empty Gallery
                  </span>
                </div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )
}
