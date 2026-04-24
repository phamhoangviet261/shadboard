import Link from "next/link"
import Image from "next/image"
import { MoreHorizontal, Plus } from "lucide-react"
import type { Metadata } from "next"

import type { LocaleType } from "@/types"

import { collectionsData } from "@/data/lensora/collections"
import { productsData } from "@/data/lensora/products"

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
  title: "Collections — Lensora Admin",
}

export default async function AdminCollectionsPage(props: {
  params: Promise<{ lang: LocaleType }>
}) {
  const { lang } = await props.params

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Collections</h2>
        <div className="flex items-center space-x-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Collection
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
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
            {collectionsData.map((collection) => {
              const productCount = productsData.filter(
                (p) => p.collectionId === collection.id
              ).length

              return (
                <TableRow key={collection.id}>
                  <TableCell>
                    <div className="relative h-16 w-24 rounded-md overflow-hidden bg-muted">
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
                    <div className="text-sm text-muted-foreground mt-1">
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
                        <DropdownMenuItem>Edit collection</DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/${lang}/shop/collections/${collection.slug}`}>
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
