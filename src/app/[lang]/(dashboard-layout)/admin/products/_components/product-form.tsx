/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2, Plus, Sparkles, Trash2 } from "lucide-react"

import type { ProductCreateInput } from "@/schemas/product-schema"
import type { CollectionType, LocaleType, ProductType } from "@/types"

import { ProductCreateSchema } from "@/schemas/product-schema"

import { api } from "@/lib/api-client"
import { isLocalPreview } from "@/lib/image-utils"
import { generateSampleProductData } from "@/lib/sample-data"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import { ProductImageManager } from "@/components/admin/products/product-image-manager"

const PRODUCT_SIZES = ["XS", "S", "M", "L", "XL"] as const

function toOptionalNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return undefined
  }

  return Number(value)
}

interface ProductFormProps {
  lang: LocaleType
  initialData?: ProductType
  collections: Pick<CollectionType, "id" | "name">[]
}

export function ProductForm({
  lang,
  initialData,
  collections,
}: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

  const form = useForm<ProductCreateInput>({
    resolver: zodResolver(ProductCreateSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          description: initialData.description || "",
          shortDescription: initialData.shortDescription || "",
          sku: initialData.sku || "",
          price: Number(initialData.price),
          compareAtPrice: toOptionalNumber(initialData.compareAtPrice),
          costPrice: toOptionalNumber(initialData.costPrice),
          currency: initialData.currency,
          status: initialData.status,
          stockQuantity: initialData.stockQuantity,
          lowStockThreshold: initialData.lowStockThreshold,
          thumbnailUrl: initialData.thumbnailUrl || undefined,
          brand: initialData.brand || "Lensora",
          tags: initialData.tags || [],
          collectionId: initialData.collectionId || null,
          isFeatured: initialData.isFeatured,
          colors: initialData.colors || [],
          images: initialData.images || [],
          frameShape: initialData.frameShape || "",
          frameMaterial: initialData.frameMaterial || "",
          lensType: initialData.lensType || "",
          faceFit: initialData.faceFit || "",
          gender: initialData.gender || "",
          size: initialData.size || ["M"],
          specs: initialData.specs || {
            lensWidth: 50,
            bridgeWidth: 20,
            templeLength: 145,
            totalWidth: 140,
            weight: 22,
          },
          seoTitle: initialData.seoTitle || "",
          seoDescription: initialData.seoDescription || "",
        }
      : {
          name: "",
          slug: "",
          description: "",
          price: 0,
          currency: "USD",
          status: "draft",
          stockQuantity: 0,
          lowStockThreshold: 10,
          brand: "Lensora",
          tags: [],
          isFeatured: false,
          colors: [
            { name: "Midnight Black", hex: "#111111" },
            { name: "Honey Tortoise", hex: "#8B5E3C" },
          ],
          size: ["M"],
          specs: {
            lensWidth: 50,
            bridgeWidth: 20,
            templeLength: 145,
            totalWidth: 140,
            weight: 22,
          },
          images: [],
        },
  })

  const onSubmit = async (values: ProductCreateInput) => {
    // Check for local previews that haven't been uploaded
    const hasLocalPreviews = values.images?.some(
      (img: { url: string; publicId?: string }) =>
        isLocalPreview(img.url) && !img.publicId
    )
    if (hasLocalPreviews) {
      toast.error(
        "Please wait for all images to finish uploading before saving."
      )
      return
    }

    setLoading(true)
    try {
      if (initialData) {
        await api.patch(`/api/products/${initialData.id}`, values)
        toast.success("Product updated successfully")
      } else {
        await api.post("/api/products", values)
        toast.success("Product created successfully")
      }

      router.push(`/${lang}/admin/products`)
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save product"
      )
    } finally {
      setLoading(false)
    }
  }

  const onGenerateSample = async () => {
    setGenerating(true)
    try {
      const sample = generateSampleProductData()

      // Generate unique slug
      const baseSlug =
        sample.name
          ?.toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "") || "sample-product"
      let uniqueSlug = baseSlug
      let isAvailable = false
      let counter = 0

      while (!isAvailable) {
        const checkSlug = counter === 0 ? baseSlug : `${baseSlug}-${counter}`
        const response = await api.get<{ available: boolean }>(
          "/api/products/check-slug",
          {
            params: { slug: checkSlug },
          }
        )

        if (response.available) {
          uniqueSlug = checkSlug
          isAvailable = true
        } else {
          counter++
          // Safety break
          if (counter > 50) {
            uniqueSlug = `${baseSlug}-${Math.random()
              .toString(36)
              .substring(2, 6)}`
            isAvailable = true
          }
        }
      }

      Object.entries(sample).forEach(([key, value]) => {
        if (key !== "images" && value !== undefined) {
          form.setValue(key as any, value)
        }
      })

      form.setValue("slug", uniqueSlug)

      if (sample.images?.length) {
        form.setValue(
          "images",
          sample.images.map((image: any) => ({
            url: image.url,
            alt: image.alt || "Sample product image",
          }))
        )
        if (sample.thumbnailUrl) {
          form.setValue("thumbnailUrl", sample.thumbnailUrl)
        }
      }

      // Randomly pick a collection if available
      if (collections.length > 0 && !form.getValues("collectionId")) {
        const randomCollection =
          collections[Math.floor(Math.random() * collections.length)]
        form.setValue("collectionId", randomCollection.id)
      }

      toast.success("Sample data generated")
    } catch (error) {
      console.error("Error generating sample data:", error)
      toast.error("Failed to generate sample data")
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>General Information</CardTitle>
                {!initialData && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onGenerateSample}
                    disabled={generating}
                  >
                    {generating ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 size-4" />
                    )}
                    Generate Sample Data
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Solaris Round" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="solaris-round" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Detailed product description..."
                          rows={5}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Images & Media</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ProductImageManager
                          images={field.value}
                          thumbnailUrl={form.watch("thumbnailUrl")}
                          onChange={(newImages, newThumbnail) => {
                            field.onChange(newImages)
                            if (newThumbnail !== undefined) {
                              form.setValue(
                                "thumbnailUrl",
                                newThumbnail || undefined
                              )
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="compareAtPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compare at Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseFloat(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SKU</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="LNS-001"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Inventory Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Colors & Variants</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {form.watch("colors")?.map((color: any, index: number) => (
                    <div
                      key={index}
                      className="grid gap-3 sm:grid-cols-[1fr_8rem_auto]"
                    >
                      <Input
                        value={color.name}
                        aria-label="Color name"
                        onChange={(event) => {
                          const newColors = [
                            ...(form.getValues("colors") || []),
                          ]
                          newColors[index].name = event.target.value
                          form.setValue("colors", newColors)
                        }}
                      />
                      <Input
                        type="color"
                        value={color.hex}
                        aria-label="Color value"
                        onChange={(event) => {
                          const newColors = [
                            ...(form.getValues("colors") || []),
                          ]
                          newColors[index].hex = event.target.value
                          form.setValue("colors", newColors)
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          const newColors = form
                            .getValues("colors")
                            ?.filter((_: any, i: number) => i !== index)
                          form.setValue("colors", newColors)
                        }}
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
                  onClick={() => {
                    const currentColors = form.getValues("colors") || []
                    form.setValue("colors", [
                      ...currentColors,
                      { name: "New color", hex: "#d6d3d1" },
                    ])
                  }}
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
                <FormField
                  control={form.control}
                  name="seoTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Solaris Round Sunglasses - Lensora"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seoDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SEO Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Premium handcrafted eyewear..."
                          rows={3}
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="collectionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collection</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select collection" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {collections.map((collection) => (
                            <SelectItem
                              key={collection.id}
                              value={collection.id}
                            >
                              {collection.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Separator />
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Featured product</FormLabel>
                        <FormDescription>
                          Show in storefront highlights.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Frame Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="frameShape"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frame Shape</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select shape" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="frameMaterial"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Material</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                        </FormControl>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lensType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lens Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value || ""}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select lens type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="single-vision">
                            Single Vision
                          </SelectItem>
                          <SelectItem value="progressive">
                            Progressive
                          </SelectItem>
                          <SelectItem value="bifocal">Bifocal</SelectItem>
                          <SelectItem value="blue-light">Blue Light</SelectItem>
                          <SelectItem value="sunglasses">Sunglasses</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="faceFit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Face Fit</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Fit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="narrow">Narrow</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="wide">Wide</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="men">Men</SelectItem>
                            <SelectItem value="women">Women</SelectItem>
                            <SelectItem value="unisex">Unisex</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sizes</FormLabel>
                      <div className="grid grid-cols-5 gap-2">
                        {PRODUCT_SIZES.map((size) => (
                          <Label
                            key={size}
                            className={`flex h-10 cursor-pointer items-center justify-center rounded-md border text-sm font-medium ${field.value?.includes(size) ? "border-primary bg-primary text-primary-foreground" : ""}`}
                          >
                            <Checkbox
                              checked={field.value?.includes(size)}
                              onCheckedChange={() => {
                                const currentValues = field.value || []
                                const newValue = currentValues.includes(size)
                                  ? currentValues.filter((s: any) => s !== size)
                                  : [...currentValues, size]
                                field.onChange(newValue)
                              }}
                              className="sr-only"
                            />
                            {size}
                          </Label>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Measurements</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="specs.lensWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lens (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specs.bridgeWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bridge (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specs.templeLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temple (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specs.totalWidth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total (mm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specs.weight"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Weight (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? parseInt(e.target.value)
                                : undefined
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="sticky bottom-0 z-20 -mx-6 bg-background/80 px-6 py-4 backdrop-blur-md border-t">
          <div className="flex items-center justify-end gap-3 max-w-[1400px] mx-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {initialData ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
