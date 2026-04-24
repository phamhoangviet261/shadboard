import Link from "next/link"
import Image from "next/image"
import { MoreHorizontal, Plus } from "lucide-react"
import type { Metadata } from "next"

import type { LocaleType } from "@/types"

import { productsData } from "@/data/lensora/products"
import { collectionsData } from "@/data/lensora/collections"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const metadata: Metadata = {
  title: "Products — Lensora Admin",
}

export default async function AdminProductsPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await props.params

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href={`/${lang}/admin/products/new`}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Inventory</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {productsData.map((product) => {
              const collection = collectionsData.find(
                (c) => c.id === product.collectionId
              )
              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted">
                      <Image
                        src={product.images[0]?.url || ""}
                        alt={product.images[0]?.alt || ""}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.status === "published"
                          ? "default"
                          : product.status === "draft"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{collection?.name || "—"}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.stock} in stock</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/${lang}/admin/products/${product.id}/edit`}>
                            Edit product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/${lang}/shop/products/${product.slug}`}>
                            View on storefront
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
