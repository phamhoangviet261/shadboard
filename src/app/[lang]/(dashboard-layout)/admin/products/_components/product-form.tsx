"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import type { ProductType } from "@/types"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDropzone } from "@/components/ui/file-dropzone"

interface ProductFormProps {
  initialData?: ProductType
}

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Mock save delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLoading(false)
    router.push("/en/admin/products")
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Col - Main Details */}
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
            <CardContent>
              <FileDropzone
                // Quick mock usage of dropzone
                onDrop={() => {}}
                className="w-full h-40"
              />
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
        </div>

        {/* Right Col - Metadata */}
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
                    <SelectItem value="col-001">Summer Edit</SelectItem>
                    <SelectItem value="col-002">Classics</SelectItem>
                    <SelectItem value="col-003">Sport Performance</SelectItem>
                    <SelectItem value="col-004">Architect Series</SelectItem>
                  </SelectContent>
                </Select>
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
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/en/admin/products")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : initialData ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  )
}
