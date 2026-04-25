"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import type { LocaleType, ProductType } from "@/types"

import { api } from "@/lib/api-client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface ProductDuplicateDialogProps {
  productId: string
  productName: string
  lang: LocaleType
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDuplicateDialog({
  productId,
  productName,
  lang,
  open,
  onOpenChange,
}: ProductDuplicateDialogProps) {
  const router = useRouter()
  const [isDuplicating, setIsDuplicating] = useState(false)

  const onDuplicate = async () => {
    setIsDuplicating(true)
    try {
      const newProduct = await api.post<ProductType>(
        `/api/products/${productId}/duplicate`
      )
      toast.success("Product duplicated successfully")
      onOpenChange(false)

      // Redirect to edit page of the new product
      router.push(`/${lang}/admin/products/${newProduct.id}/edit`)
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to duplicate product"
      )
    } finally {
      setIsDuplicating(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Duplicate product?</AlertDialogTitle>
          <AlertDialogDescription>
            This will create a new draft product with copied data from{" "}
            <span className="font-semibold text-foreground">{productName}</span>
            . The slug and SKU will be automatically regenerated to ensure
            uniqueness.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDuplicating}>Cancel</AlertDialogCancel>
          <Button
            onClick={onDuplicate}
            disabled={isDuplicating}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isDuplicating ? "Duplicating..." : "Duplicate Product"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
