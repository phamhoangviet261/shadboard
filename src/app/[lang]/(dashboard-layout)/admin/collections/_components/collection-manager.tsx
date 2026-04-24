"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { MoreHorizontal, Plus, Search } from "lucide-react"

import type { CollectionType, LocaleType, ProductType } from "@/types"

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
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

interface CollectionManagerProps {
  collections: CollectionType[]
  products: ProductType[]
  lang: LocaleType
}

export function CollectionManager({
  collections,
  products,
  lang,
}: CollectionManagerProps) {
  const [query, setQuery] = useState("")
  const [activeCollection, setActiveCollection] =
    useState<CollectionType | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const filteredCollections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return collections.filter(
      (collection) =>
        !normalizedQuery ||
        collection.name.toLowerCase().includes(normalizedQuery) ||
        collection.slug.toLowerCase().includes(normalizedQuery) ||
        collection.description.toLowerCase().includes(normalizedQuery)
    )
  }, [collections, query])

  const openCreate = () => {
    setActiveCollection(null)
    setIsCreating(true)
  }

  const openEdit = (collection: CollectionType) => {
    setActiveCollection(collection)
    setIsCreating(false)
  }

  const isSheetOpen = isCreating || Boolean(activeCollection)
  const sheetTitle = isCreating ? "Create collection" : "Edit collection"

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            placeholder="Search collections"
          />
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Add Collection
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Cover</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCollections.length > 0 ? (
              filteredCollections.map((collection) => {
                const productCount = products.filter(
                  (product) => product.collectionId === collection.id
                ).length

                return (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div className="relative h-16 w-24 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={collection.coverImage}
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{collection.name}</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        /{collection.slug}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          collection.status === "published"
                            ? "default"
                            : collection.status === "draft"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {collection.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{productCount} items</TableCell>
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
                          <DropdownMenuItem
                            onClick={() => openEdit(collection)}
                          >
                            Edit collection
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/${lang}/shop/collections/${collection.slug}`}
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
                <TableCell colSpan={5} className="h-32 text-center">
                  <p className="font-medium">No collections found</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try a different search term.
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Sheet
        open={isSheetOpen}
        onOpenChange={(open) => {
          if (!open) {
            setActiveCollection(null)
            setIsCreating(false)
          }
        }}
      >
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{sheetTitle}</SheetTitle>
            <SheetDescription>
              Manage storefront collection copy, cover imagery, and publishing
              state.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Name</Label>
              <Input
                id="collection-name"
                defaultValue={activeCollection?.name}
                placeholder="Nocturne"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-slug">Slug</Label>
              <Input
                id="collection-slug"
                defaultValue={activeCollection?.slug}
                placeholder="nocturne"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-cover">Cover image URL</Label>
              <Input
                id="collection-cover"
                defaultValue={activeCollection?.coverImage}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="collection-description">Description</Label>
              <Textarea
                id="collection-description"
                defaultValue={activeCollection?.description}
                rows={5}
                placeholder="Describe the collection point of view."
              />
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setActiveCollection(null)
                setIsCreating(false)
              }}
            >
              Cancel
            </Button>
            <Button type="button">Save collection</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  )
}
