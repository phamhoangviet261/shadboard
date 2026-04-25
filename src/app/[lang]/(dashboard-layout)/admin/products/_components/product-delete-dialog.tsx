"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { api } from "@/lib/api-client"

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

interface ProductDeleteDialogProps {
  productId: string
  productName: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function ProductDeleteDialog({
  productId,
  productName,
  open,
  onOpenChange,
  onSuccess,
}: ProductDeleteDialogProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    setLoading(true)
    try {
      await api.delete(`/api/products/${productId}`)
      toast.success("Product deleted successfully")
      onOpenChange(false)
      if (onSuccess) {
        onSuccess()
      } else {
        router.refresh()
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete product"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will archive <strong>{productName}</strong>. You can still
            restore it later from the database if needed, but it will be hidden
            from the admin and storefront.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onDelete()
            }}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Deleting..." : "Delete Product"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
