"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebounce } from "react-use"
import { MoreHorizontal, Search } from "lucide-react"

import type {
  CollectionType,
  LocaleType,
  PaginationInfo,
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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
import { ProductDeleteDialog } from "./product-delete-dialog"
import { ProductDuplicateDialog } from "./product-duplicate-dialog"

interface ProductManagementTableProps {
  products: ProductType[]
  collections: Pick<CollectionType, "id" | "name">[]
  lang: LocaleType
  pagination: PaginationInfo
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
  pagination,
}: ProductManagementTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)
  const [productToDelete, setProductToDelete] = useState<{
    id: string
    name: string
  } | null>(null)
  const [productToDuplicate, setProductToDuplicate] = useState<{
    id: string
    name: string
  } | null>(null)

  useDebounce(
    () => {
      setDebouncedSearch(searchTerm)
    },
    500,
    [searchTerm]
  )

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      })

      return newSearchParams.toString()
    },
    [searchParams]
  )

  const onFilterChange = (key: string, value: string | number | null) => {
    const queryString = createQueryString({ [key]: value, page: 1 })
    router.push(`${pathname}?${queryString}`)
  }

  useEffect(() => {
    const queryString = createQueryString({ q: debouncedSearch, page: 1 })
    if (debouncedSearch !== (searchParams.get("q") || "")) {
      router.push(`${pathname}?${queryString}`)
    }
  }, [debouncedSearch, pathname, router, createQueryString, searchParams])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-9"
            placeholder="Search name, SKU, or collection"
          />
        </div>
        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(value) =>
            onFilterChange("status", value === "all" ? null : value)
          }
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
        <Select
          value={searchParams.get("collectionId") || "all"}
          onValueChange={(value) =>
            onFilterChange("collectionId", value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Collection" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All collections</SelectItem>
            {collections.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
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
            {products.length > 0 ? (
              products.map((product) => {
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={
                            product.thumbnailUrl ||
                            product.images?.[0]?.url ||
                            ""
                          }
                          alt={product.images?.[0]?.alt || product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {product.sku || "No SKU"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[product.status]}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {product.collection?.name || "Unassigned"}
                    </TableCell>
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
                        className={
                          product.stockQuantity < product.lowStockThreshold
                            ? "text-destructive"
                            : ""
                        }
                      >
                        {product.stockQuantity} in stock
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
                              href={`/${lang}/admin/products/${product.id}`}
                            >
                              View details
                            </Link>
                          </DropdownMenuItem>
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
                              target="_blank"
                            >
                              View on storefront
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              setProductToDuplicate({
                                id: product.id,
                                name: product.name,
                              })
                            }
                          >
                            Duplicate product
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() =>
                              setProductToDelete({
                                id: product.id,
                                name: product.name,
                              })
                            }
                          >
                            Delete product
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

      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  pagination.page > 1
                    ? `?${createQueryString({ page: pagination.page - 1 })}`
                    : "#"
                }
                aria-disabled={pagination.page <= 1}
                className={
                  pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={`?${createQueryString({ page: p })}`}
                    isActive={p === pagination.page}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href={
                  pagination.page < pagination.totalPages
                    ? `?${createQueryString({ page: pagination.page + 1 })}`
                    : "#"
                }
                aria-disabled={pagination.page >= pagination.totalPages}
                className={
                  pagination.page >= pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {productToDelete && (
        <ProductDeleteDialog
          productId={productToDelete.id}
          productName={productToDelete.name}
          open={!!productToDelete}
          onOpenChange={(open) => !open && setProductToDelete(null)}
        />
      )}

      {productToDuplicate && (
        <ProductDuplicateDialog
          productId={productToDuplicate.id}
          productName={productToDuplicate.name}
          lang={lang}
          open={!!productToDuplicate}
          onOpenChange={(open) => !open && setProductToDuplicate(null)}
        />
      )}
    </div>
  )
}
