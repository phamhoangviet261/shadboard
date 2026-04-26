"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { useDropzone } from "react-dropzone"
import {
  AlertCircle,
  GripVertical,
  ImageIcon,
  Loader2,
  Plus,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react"

import type { DropResult } from "@hello-pangea/dnd"

import { uploadToCloudinary } from "@/lib/cloudinary-client"
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
import { Progress } from "@/components/ui/progress"
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
  publicId?: string
  status?: "pending" | "uploading" | "success" | "error"
  progress?: number
  error?: string
}

interface ProductImageManagerProps {
  images?: { url: string; alt?: string; publicId?: string }[]
  thumbnailUrl?: string
  onChange: (
    images: { url: string; alt: string; publicId?: string }[],
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
      id: img.publicId || `existing-${index}-${img.url}`,
      url: img.url,
      alt: img.alt || "",
      publicId: img.publicId,
      isLocal: isLocalPreview(img.url),
      status: "success",
    }))
    setItems(initialItems)
  }, [images])

  const notifyChange = useCallback(
    (newItems: ProductMediaItem[], newThumbnail?: string) => {
      const imagesToEmit = newItems
        .filter((item) => item.status === "success" || !item.isLocal)
        .map((item) => ({
          url: item.url,
          alt: item.alt,
          publicId: item.publicId,
        }))
      onChange(imagesToEmit, newThumbnail || thumbnailUrl)
    },
    [onChange, thumbnailUrl]
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const newItems: ProductMediaItem[] = []

      // 1. Initial validation and local preview setup
      acceptedFiles.forEach((file) => {
        const validation = validateImageFile(file)
        if (!validation.valid) {
          console.error(validation.error)
          return
        }

        if (items.length + newItems.length >= maxImages) return

        newItems.push({
          id: crypto.randomUUID(),
          url: URL.createObjectURL(file), // Temporary local preview
          alt: file.name,
          isLocal: true,
          file,
          status: "pending",
          progress: 0,
        })
      })

      if (newItems.length === 0) return

      const updatedItems = [...items, ...newItems]
      setItems(updatedItems)

      // 2. Trigger uploads for each new item
      newItems.forEach(async (item) => {
        if (!item.file) return

        setItems((current) =>
          current.map((i) =>
            i.id === item.id ? { ...i, status: "uploading" as const } : i
          )
        )

        try {
          const result = await uploadToCloudinary(item.file, (progress) => {
            setItems((current) =>
              current.map((i) => (i.id === item.id ? { ...i, progress } : i))
            )
          })

          setItems((current) => {
            const final = current.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    url: result.secure_url,
                    publicId: result.public_id,
                    status: "success" as const,
                    isLocal: false,
                    progress: 100,
                  }
                : i
            )
            // Notify change after EACH successful upload to keep form in sync
            notifyChange(final)
            return final
          })
        } catch (error) {
          console.error("Upload failed:", error)
          setItems((current) =>
            current.map((i) =>
              i.id === item.id
                ? {
                    ...i,
                    status: "error" as const,
                    error:
                      error instanceof Error ? error.message : "Upload failed",
                  }
                : i
            )
          )
        }
      })
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
    } catch (_error) {
      return
    }

    const newItem: ProductMediaItem = {
      id: crypto.randomUUID(),
      url: urlInput,
      alt: "Remote image",
      isLocal: false,
      status: "success",
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
      const firstSuccess = updatedItems.find(
        (item) => item.status === "success"
      )
      newThumbnail = firstSuccess?.url || ""
    }

    notifyChange(updatedItems, newThumbnail)
  }

  const handleSetThumbnail = (url: string) => {
    const targetItem = items.find((item) => item.url === url)
    if (!targetItem || targetItem.status !== "success") return

    onChange(
      items
        .filter((item) => item.status === "success")
        .map((item) => ({
          url: item.url,
          alt: item.alt,
          publicId: item.publicId,
        })),
      url
    )
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const reorderedItems = Array.from(items)
    const [removed] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, removed)

    setItems(reorderedItems)
    notifyChange(reorderedItems)
  }

  const pendingUploads = items.filter(
    (item) => item.status === "uploading" || item.status === "pending"
  ).length
  const hasErrors = items.some((item) => item.status === "error")

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
        <div className="flex items-center gap-3">
          {pendingUploads > 0 && (
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              Uploading {pendingUploads}...
            </div>
          )}
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

      {hasErrors && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-destructive-foreground">
          <AlertCircle className="mt-0.5 size-5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm font-semibold">Upload Errors Detected</p>
            <p className="text-xs leading-relaxed opacity-90">
              Some images failed to upload. Please remove them and try again.
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
                          className={cn(
                            "object-cover transition-transform group-hover:scale-105",
                            (item.status === "uploading" ||
                              item.status === "pending") &&
                              "opacity-50 blur-[1px]"
                          )}
                        />

                        {/* Status Overlays */}
                        {item.status === "uploading" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20 p-3">
                            <Progress
                              value={item.progress}
                              className="h-1.5 w-full"
                            />
                            <span className="mt-1.5 text-[10px] font-bold text-white drop-shadow-sm">
                              {item.progress}%
                            </span>
                          </div>
                        )}

                        {item.status === "error" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-destructive/10 p-2 text-center">
                            <AlertCircle className="size-5 text-destructive" />
                            <span className="mt-1 text-[9px] font-semibold leading-tight text-destructive-foreground drop-shadow-sm">
                              Upload Failed
                            </span>
                          </div>
                        )}

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

                            {item.status === "success" && (
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
                          {item.isLocal &&
                            item.status !== "success" &&
                            item.status !== "uploading" && (
                              <Badge
                                variant="secondary"
                                className="h-5 border-yellow-500/50 bg-yellow-500/10 px-1.5 text-[10px] font-bold uppercase text-yellow-700 dark:text-yellow-400"
                              >
                                Demo Preview
                              </Badge>
                            )}
                          {item.status === "success" && !item.isLocal && (
                            <Badge className="h-5 border-emerald-500/50 bg-emerald-500/10 px-1.5 text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-400">
                              Live
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
