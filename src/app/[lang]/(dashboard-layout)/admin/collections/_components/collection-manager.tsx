"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { MoreHorizontal, Plus, Search } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { CollectionCreateSchema, type CollectionCreateInput } from "@/schemas/collection-schema"
import type { CollectionType, LocaleType, ProductType } from "@/types"
import { api } from "@/lib/api-client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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
  products: Pick<ProductType, "id" | "name" | "price" | "thumbnailUrl">[]
  lang: LocaleType
}

export function CollectionManager({
  collections,
  products,
  lang,
}: CollectionManagerProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const form = useForm<CollectionCreateInput>({
    resolver: zodResolver(CollectionCreateSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      thumbnailUrl: "",
      status: "draft",
      sortOrder: 0,
      isFeatured: false,
    },
  })

  const filteredCollections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return collections.filter(
      (collection) =>
        !normalizedQuery ||
        collection.name.toLowerCase().includes(normalizedQuery) ||
        collection.slug.toLowerCase().includes(normalizedQuery) ||
        (collection.description?.toLowerCase().includes(normalizedQuery) ?? false)
    )
  }, [collections, query])

  const openCreate = () => {
    setEditingId(null)
    form.reset({
      name: "",
      slug: "",
      description: "",
      thumbnailUrl: "",
      status: "draft",
      sortOrder: collections.length,
      isFeatured: false,
    })
    setIsSheetOpen(true)
  }

  const openEdit = (collection: CollectionType) => {
    setEditingId(collection.id)
    form.reset({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || "",
      thumbnailUrl: collection.thumbnailUrl || "",
      status: collection.status,
      sortOrder: collection.sortOrder,
      isFeatured: collection.isFeatured,
    })
    setIsSheetOpen(true)
  }

  const onSubmit = async (values: CollectionCreateInput) => {
    setLoading(true)
    try {
      if (editingId) {
        await api.patch(`/api/collections/${editingId}`, values)
        toast.success("Collection updated")
      } else {
        await api.post("/api/collections", values)
        toast.success("Collection created")
      }
      setIsSheetOpen(false)
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

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

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
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
                return (
                  <TableRow key={collection.id}>
                    <TableCell>
                      <div className="relative h-16 w-24 overflow-hidden rounded-md bg-muted">
                        <Image
                          src={collection.thumbnailUrl || ""}
                          alt={collection.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{collection.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
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
                    <TableCell>{collection._count?.products || 0} items</TableCell>
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
                              target="_blank"
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

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editingId ? "Edit Collection" : "Create Collection"}</SheetTitle>
            <SheetDescription>
              Manage storefront collection copy, cover imagery, and publishing
              state.
            </SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Nocturne" {...field} />
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
                      <Input placeholder="nocturne" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="thumbnailUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cover image URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://images.unsplash.com/..." 
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
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={5}
                        placeholder="Describe the collection point of view."
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
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <SheetFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsSheetOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save collection"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </div>
  )
}
