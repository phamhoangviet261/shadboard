"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import type { ProductStockAdjustmentInput } from "@/schemas/product-schema"

import { ProductStockAdjustmentSchema } from "@/schemas/product-schema"

import { api } from "@/lib/api-client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ProductStockAdjustmentDialogProps {
  productId: string
  productName: string
  currentStock: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductStockAdjustmentDialog({
  productId,
  productName,
  currentStock,
  open,
  onOpenChange,
}: ProductStockAdjustmentDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ProductStockAdjustmentInput>({
    resolver: zodResolver(ProductStockAdjustmentSchema),
    defaultValues: {
      type: "increase",
      quantity: 0,
      reason: "",
      note: "",
    },
  })

  const type = form.watch("type")
  const quantity = form.watch("quantity")

  // Calculate projected stock for visual feedback
  let projectedStock = currentStock
  if (!isNaN(quantity)) {
    if (type === "increase") projectedStock += quantity
    else if (type === "decrease") projectedStock -= quantity
    else if (type === "set") projectedStock = quantity
  }

  const onSubmit = async (data: ProductStockAdjustmentInput) => {
    if (type === "decrease" && currentStock - data.quantity < 0) {
      form.setError("quantity", {
        type: "manual",
        message: "Decrease amount cannot exceed current stock.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await api.post(`/api/products/${productId}/stock-adjustments`, data)
      toast.success("Stock updated successfully.")
      onOpenChange(false)
      form.reset()
      router.refresh()
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update stock."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Update inventory for <strong>{productName}</strong>. Current stock
            is <strong>{currentStock}</strong>.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adjustment Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="increase">Increase (+)</SelectItem>
                        <SelectItem value="decrease">Decrease (-)</SelectItem>
                        <SelectItem value="set">Set Exact (=)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? 0
                              : parseInt(e.target.value, 10)
                          )
                        }
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="rounded-md bg-muted p-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Projected Stock:</span>
                <span
                  className={`font-bold ${
                    projectedStock < 0 ? "text-destructive" : ""
                  }`}
                >
                  {projectedStock}
                </span>
              </div>
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason (Required)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Restock, Damaged, Count correction"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional details..."
                      className="resize-none"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || projectedStock < 0}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Confirm Adjustment"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
