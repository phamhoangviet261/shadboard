"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { GripVertical, ImagePlus, Plus, Sparkles, Trash2 } from "lucide-react"

import type {
  ColorVariant,
  FileType,
  LocaleType,
  ProductSize,
  ProductType,
} from "@/types"

import { collectionsData } from "@/data/lensora/collections"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FileDropzone } from "@/components/ui/file-dropzone"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

const PRODUCT_SIZES: ProductSize[] = ["XS", "S", "M", "L", "XL"]

const DEFAULT_COLORS: ColorVariant[] = [
  { name: "Midnight Black", hex: "#111111" },
  { name: "Honey Tortoise", hex: "#8B5E3C" },
]

interface ProductFormProps {
  lang: LocaleType
  initialData?: ProductType
}

export function ProductForm({ lang, initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false)
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>(
    initialData?.size ?? ["M"]
  )
  const [colors, setColors] = useState<ColorVariant[]>(
    initialData?.colors.length ? initialData.colors : DEFAULT_COLORS
  )
  const [files, setFiles] = useState<FileType[]>(
    initialData?.images.map((image, index) => ({
      id: `${initialData.id}-image-${index}`,
      name: image.alt,
      size: 0,
      type: "image/jpeg",
      url: image.url,
    })) ?? []
  )

  const toggleSize = (size: ProductSize) => {
    setSelectedSizes((current) =>
      current.includes(size)
        ? current.filter((item) => item !== size)
        : [...current, size]
    )
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    router.push(`/${lang}/admin/products`)
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  defaultValue={initialData?.name}
                  placeholder="e.g. Solaris Round"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  defaultValue={initialData?.slug}
                  placeholder="solaris-round"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={initialData?.description}
                  placeholder="Detailed product description..."
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileDropzone
                multiple
                maxFiles={8}
                accept={{ "image/*": [] }}
                value={files}
                onFilesChange={setFiles}
                className="min-h-72"
              />
              {files.length > 1 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Image order</p>
                  <div className="rounded-lg border bg-muted/20">
                    {files.map((file, index) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 border-b px-3 py-2 last:border-b-0"
                      >
                        <GripVertical className="size-4 text-muted-foreground" />
                        <span className="flex size-6 items-center justify-center rounded bg-background text-xs font-medium">
                          {index + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm">
                          {file.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  defaultValue={initialData?.price}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compareAtPrice">Compare at Price ($)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  defaultValue={initialData?.compareAtPrice}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" defaultValue={initialData?.sku} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Inventory Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  defaultValue={initialData?.stock}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Colors & Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {colors.map((color, index) => (
                  <div
                    key={`${color.name}-${index}`}
                    className="grid gap-3 sm:grid-cols-[1fr_8rem_auto]"
                  >
                    <Input
                      value={color.name}
                      aria-label="Color name"
                      onChange={(event) =>
                        setColors((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, name: event.target.value }
                              : item
                          )
                        )
                      }
                    />
                    <Input
                      type="color"
                      value={color.hex}
                      aria-label="Color value"
                      onChange={(event) =>
                        setColors((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, hex: event.target.value }
                              : item
                          )
                        )
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setColors((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index)
                        )
                      }
                      aria-label="Remove color"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setColors((current) => [
                    ...current,
                    { name: "New color", hex: "#d6d3d1" },
                  ])
                }
              >
                <Plus className="mr-2 size-4" />
                Add color
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO Fields</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seoTitle">SEO Title</Label>
                <Input
                  id="seoTitle"
                  defaultValue={initialData?.seoTitle}
                  placeholder="Solaris Round Sunglasses - Lensora"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seoDescription">SEO Description</Label>
                <Textarea
                  id="seoDescription"
                  defaultValue={initialData?.seoDescription}
                  placeholder="Premium handcrafted eyewear with UV protection and refined fit."
                  rows={3}
                />
              </div>
              <Button type="button" variant="secondary" size="sm">
                <Sparkles className="mr-2 size-4" />
                Draft with AI Writer
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Status & Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select defaultValue={initialData?.status || "draft"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Collection</Label>
                <Select defaultValue={initialData?.collectionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collectionsData.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div>
                  <Label htmlFor="featured">Featured product</Label>
                  <p className="text-xs text-muted-foreground">
                    Show in storefront highlights.
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Frame Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Frame Shape</Label>
                <Select defaultValue={initialData?.frameShape}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round">Round</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="cat-eye">Cat Eye</SelectItem>
                    <SelectItem value="aviator">Aviator</SelectItem>
                    <SelectItem value="oval">Oval</SelectItem>
                    <SelectItem value="geometric">Geometric</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Material</Label>
                <Select defaultValue={initialData?.frameMaterial}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acetate">Acetate</SelectItem>
                    <SelectItem value="titanium">Titanium</SelectItem>
                    <SelectItem value="stainless-steel">
                      Stainless Steel
                    </SelectItem>
                    <SelectItem value="tr90">TR90</SelectItem>
                    <SelectItem value="wood">Wood</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lens Type</Label>
                <Select defaultValue={initialData?.lensType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lens type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-vision">Single Vision</SelectItem>
                    <SelectItem value="progressive">Progressive</SelectItem>
                    <SelectItem value="bifocal">Bifocal</SelectItem>
                    <SelectItem value="blue-light">Blue Light</SelectItem>
                    <SelectItem value="sunglasses">Sunglasses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Face Fit</Label>
                  <Select defaultValue={initialData?.faceFit}>
                    <SelectTrigger>
                      <SelectValue placeholder="Fit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="narrow">Narrow</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="wide">Wide</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select defaultValue={initialData?.gender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <Label>Sizes</Label>
                <div className="grid grid-cols-5 gap-2">
                  {PRODUCT_SIZES.map((size) => (
                    <Label
                      key={size}
                      className="flex h-10 cursor-pointer items-center justify-center rounded-md border text-sm font-medium has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary has-[[data-state=checked]]:text-primary-foreground"
                    >
                      <Checkbox
                        checked={selectedSizes.includes(size)}
                        onCheckedChange={() => toggleSize(size)}
                        className="sr-only"
                      />
                      {size}
                    </Label>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Measurements</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lensWidth">Lens</Label>
                <Input
                  id="lensWidth"
                  type="number"
                  defaultValue={initialData?.specs.lensWidth}
                  placeholder="52"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bridgeWidth">Bridge</Label>
                <Input
                  id="bridgeWidth"
                  type="number"
                  defaultValue={initialData?.specs.bridgeWidth}
                  placeholder="18"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="templeLength">Temple</Label>
                <Input
                  id="templeLength"
                  type="number"
                  defaultValue={initialData?.specs.templeLength}
                  placeholder="145"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalWidth">Total</Label>
                <Input
                  id="totalWidth"
                  type="number"
                  defaultValue={initialData?.specs.totalWidth}
                  placeholder="140"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  defaultValue={initialData?.specs.weight}
                  placeholder="22"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-dashed">
            <CardContent className="flex gap-3 p-4">
              <ImagePlus className="mt-0.5 size-5 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Preview route</p>
                <p className="text-xs text-muted-foreground">
                  Saved products can be reviewed from the storefront action in
                  the products table.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${lang}/admin/products`)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading
            ? "Saving..."
            : initialData
              ? "Save Changes"
              : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
