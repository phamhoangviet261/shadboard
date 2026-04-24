"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MoreHorizontal, Search } from "lucide-react"

import type {
  CollectionType,
  LocaleType,
  ProductStatus,
  ProductType,
} from "@/types"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ProductManagementTableProps {
  products: ProductType[]
  collections: CollectionType[]
  lang: LocaleType
}

const statusVariant: Record<
  ProductStatus,
  "default" | "secondary" | "outline"
> = {
  published: "default",
  draft: "secondary",
  archived: "outline",
}

export function ProductManagementTable({
  products,
  collections,
  lang,
}: ProductManagementTableProps) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<ProductStatus | "all">("all")

  const collectionById = useMemo(
    () => new Map(collections.map((collection) => [collection.id, collection])),
    [collections]
  )

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products.filter((product) => {
      const collectionName =
        collectionById.get(product.collectionId)?.name.toLowerCase() ?? ""
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.sku.toLowerCase().includes(normalizedQuery) ||
        collectionName.includes(normalizedQuery)
      const matchesStatus = status === "all" || product.status === status

      return matchesQuery && matchesStatus
    })
  }, [collectionById, products, query, status])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            placeholder="Search name, SKU, or collection"
          />
        </div>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as ProductStatus | "all")}
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
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
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const collection = collectionById.get(product.collectionId)

                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={
                            product.images[0]?.url ||
                            collection?.coverImage ||
                            ""
                          }
                          alt={product.images[0]?.alt || product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {product.sku}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[product.status]}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{collection?.name || "Unassigned"}</TableCell>
                    <TableCell>
                      <div className="font-medium">${product.price}</div>
                      {product.compareAtPrice && (
                        <div className="text-xs text-muted-foreground line-through">
                          ${product.compareAtPrice}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className={product.stock < 15 ? "text-destructive" : ""}
                      >
                        {product.stock} in stock
                      </span>
                    </TableCell>
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
                            <Link
                              href={`/${lang}/admin/products/${product.id}/edit`}
                            >
                              Edit product
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/${lang}/shop/products/${product.slug}`}
                            >
                              View on storefront
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <p className="font-medium">No products found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Adjust the search term or status filter.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
