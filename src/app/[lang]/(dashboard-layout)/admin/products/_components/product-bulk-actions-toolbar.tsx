"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Trash2, X } from "lucide-react"

import type { ProductBulkActionInput } from "@/schemas/product-schema"
import type { CollectionType } from "@/types"

import { api } from "@/lib/api-client"
import { usePermission } from "@/hooks/use-permission"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface ProductBulkActionsToolbarProps {
  selectedIds: string[]
  collections: Pick<CollectionType, "id" | "name">[]
  onClearSelection: () => void
  onSuccess: () => void
}

export function ProductBulkActionsToolbar({
  selectedIds,
  collections,
  onClearSelection,
  onSuccess,
}: ProductBulkActionsToolbarProps) {
  const [loading, setLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [tagsInput, setTagsInput] = useState("")
  const { can } = usePermission()

  const canBulkUpdate = can("product:bulkUpdate")
  const canBulkDelete = can("product:bulkDelete")

  const count = selectedIds.length

  if (count === 0) return null

  const handleBulkAction = async (payload: ProductBulkActionInput) => {
    setLoading(true)
    try {
      await api.post("/api/products/bulk", payload)
      toast.success("Bulk action completed successfully")
      onSuccess()
      onClearSelection()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Bulk action failed")
    } finally {
      setLoading(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleUpdateStatus = (status: "draft" | "published" | "archived") => {
    handleBulkAction({ action: "updateStatus", ids: selectedIds, status })
  }

  const handleAssignCollection = (collectionId: string) => {
    handleBulkAction({
      action: "assignCollection",
      ids: selectedIds,
      collectionId: collectionId === "unassigned" ? null : collectionId,
    })
  }

  const handleAddTags = () => {
    if (!tagsInput.trim()) return
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    if (tags.length === 0) return
    handleBulkAction({ action: "addTags", ids: selectedIds, tags })
    setTagsInput("")
  }

  const handleRemoveTags = () => {
    if (!tagsInput.trim()) return
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
    if (tags.length === 0) return
    handleBulkAction({ action: "removeTags", ids: selectedIds, tags })
    setTagsInput("")
  }

  return (
    <>
      <div className="sticky top-4 z-10 mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-3 rounded-lg border bg-background p-2 shadow-lg sm:flex-row sm:p-3">
        <div className="flex items-center gap-2 px-2 text-sm font-medium">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
            {count}
          </span>
          <span>Selected</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-1 text-muted-foreground"
            onClick={onClearSelection}
            disabled={loading}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear selection</span>
          </Button>
        </div>

        <Separator orientation="vertical" className="hidden h-6 sm:block" />

        <div className="flex flex-wrap items-center gap-2">
          <Select onValueChange={handleUpdateStatus} disabled={loading || !canBulkUpdate}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue placeholder="Set Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={handleAssignCollection} disabled={loading || !canBulkUpdate}>
            <SelectTrigger className="h-8 w-[160px]">
              <SelectValue placeholder="Assign Collection" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Clear collection</SelectItem>
              {collections.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="tags (comma separated)"
              className="h-8 w-[160px]"
              disabled={loading || !canBulkUpdate}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddTags()
              }}
            />
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2"
              onClick={handleAddTags}
              disabled={loading || !canBulkUpdate || !tagsInput.trim()}
              title="Add tags"
            >
              Add
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-destructive hover:text-destructive"
              onClick={handleRemoveTags}
              disabled={loading || !canBulkUpdate || !tagsInput.trim()}
              title="Remove tags"
            >
              Remove
            </Button>
          </div>

          <Button
            variant="destructive"
            size="sm"
            className="h-8"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={loading || !canBulkDelete}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Delete
          </Button>
        </div>
      </div>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will delete {count} selected product
              {count === 1 ? "" : "s"}. This action can be undone later if soft
              delete is enabled, but the products will be immediately hidden
              from the storefront.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault()
                handleBulkAction({ action: "delete", ids: selectedIds })
              }}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Delete Products"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
