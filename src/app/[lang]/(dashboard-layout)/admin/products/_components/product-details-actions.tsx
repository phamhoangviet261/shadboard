"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Copy, Edit, Trash2 } from "lucide-react"

import type { LocaleType } from "@/types"

import { Button } from "@/components/ui/button"
import { ProductDeleteDialog } from "./product-delete-dialog"
import { ProductDuplicateDialog } from "./product-duplicate-dialog"

interface ProductDetailsActionsProps {
  productId: string
  productName: string
  lang: LocaleType
}

export function ProductDetailsActions({
  productId,
  productName,
  lang,
}: ProductDetailsActionsProps) {
  const router = useRouter()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" asChild>
          <Link href={`/${lang}/admin/products/${productId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
        <Button
          variant="outline"
          onClick={() => setIsDuplicateDialogOpen(true)}
        >
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </Button>
        <Button
          variant="destructive"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <ProductDeleteDialog
        productId={productId}
        productName={productName}
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onSuccess={() => router.push(`/${lang}/admin/products`)}
      />

      <ProductDuplicateDialog
        productId={productId}
        productName={productName}
        lang={lang}
        open={isDuplicateDialogOpen}
        onOpenChange={setIsDuplicateDialogOpen}
      />
    </>
  )
}
