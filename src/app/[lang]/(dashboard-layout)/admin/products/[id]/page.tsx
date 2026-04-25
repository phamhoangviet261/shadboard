import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"

import type { LocaleType } from "@/types"
import type { Metadata } from "next"

import { db } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { ProductDetailsActions } from "../_components/product-details-actions"

export const metadata: Metadata = {
  title: "Product Details — Lensora Admin",
}

export default async function AdminProductDetailPage(props: {
  params: Promise<{ lang: LocaleType; id: string }>
}) {
  const { lang, id } = await props.params

  const product = await db.product.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      collection: true,
    },
  })

  if (!product) {
    notFound()
  }

  const serializedProduct = JSON.parse(JSON.stringify(product, (key, value) => 
    typeof value === 'object' && value?.constructor?.name === 'Decimal' 
      ? Number(value) 
      : value
  ))

  const statusVariant: any = {
    published: "default",
    draft: "secondary",
    archived: "outline",
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/${lang}/admin/products`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{serializedProduct.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={statusVariant[serializedProduct.status]}>
                {serializedProduct.status}
              </Badge>
              <span className="text-sm text-muted-foreground">SKU: {serializedProduct.sku || "N/A"}</span>
            </div>
          </div>
        </div>
        <ProductDetailsActions 
          productId={id} 
          productName={serializedProduct.name} 
          lang={lang} 
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {serializedProduct.images && serializedProduct.images.length > 0 ? (
                  serializedProduct.images.map((image: any, index: number) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                      <Image
                        src={image.url}
                        alt={image.alt || serializedProduct.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 flex h-40 items-center justify-center rounded-lg border border-dashed text-muted-foreground">
                    No images uploaded
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                {serializedProduct.description || "No description provided."}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Eyewear Specifications</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-4 text-sm sm:grid-cols-3">
              <div>
                <p className="font-medium">Frame Shape</p>
                <p className="text-muted-foreground capitalize">{serializedProduct.frameShape || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Material</p>
                <p className="text-muted-foreground capitalize">{serializedProduct.frameMaterial || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Lens Type</p>
                <p className="text-muted-foreground capitalize">{serializedProduct.lensType || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Face Fit</p>
                <p className="text-muted-foreground capitalize">{serializedProduct.faceFit || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Gender</p>
                <p className="text-muted-foreground capitalize">{serializedProduct.gender || "N/A"}</p>
              </div>
              <div>
                <p className="font-medium">Sizes</p>
                <p className="text-muted-foreground">{serializedProduct.size?.join(", ") || "N/A"}</p>
              </div>
            </CardContent>
            <Separator />
            <CardContent className="grid grid-cols-2 gap-y-4 pt-6 text-sm sm:grid-cols-5">
              <div>
                <p className="font-medium">Lens</p>
                <p className="text-muted-foreground">{serializedProduct.specs?.lensWidth}mm</p>
              </div>
              <div>
                <p className="font-medium">Bridge</p>
                <p className="text-muted-foreground">{serializedProduct.specs?.bridgeWidth}mm</p>
              </div>
              <div>
                <p className="font-medium">Temple</p>
                <p className="text-muted-foreground">{serializedProduct.specs?.templeLength}mm</p>
              </div>
              <div>
                <p className="font-medium">Total</p>
                <p className="text-muted-foreground">{serializedProduct.specs?.totalWidth}mm</p>
              </div>
              <div>
                <p className="font-medium">Weight</p>
                <p className="text-muted-foreground">{serializedProduct.specs?.weight}g</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Inventory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price</span>
                <span className="font-bold text-lg">${serializedProduct.price}</span>
              </div>
              {serializedProduct.compareAtPrice && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Compare at</span>
                  <span className="line-through">${serializedProduct.compareAtPrice}</span>
                </div>
              )}
              {serializedProduct.costPrice && (
                <div className="flex justify-between border-t pt-2">
                  <span className="text-muted-foreground">Cost per item</span>
                  <span>${serializedProduct.costPrice}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock</span>
                <span className={serializedProduct.stockQuantity < serializedProduct.lowStockThreshold ? "text-destructive font-bold" : ""}>
                  {serializedProduct.stockQuantity} units
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Threshold</span>
                <span>{serializedProduct.lowStockThreshold} units</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="font-medium">Collection</p>
                <p className="text-muted-foreground">{serializedProduct.collection?.name || "Unassigned"}</p>
              </div>
              <div>
                <p className="font-medium">Brand</p>
                <p className="text-muted-foreground">{serializedProduct.brand || "Lensora"}</p>
              </div>
              <div>
                <p className="font-medium">Tags</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {serializedProduct.tags.map((tag: string) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Created</span>
                <span>{new Date(serializedProduct.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Last updated</span>
                <span>{new Date(serializedProduct.updatedAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
