"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function LowStockAlerts() {
  const [products, setProducts] = useState<
    {
      id: string
      name: string
      slug: string
      sku: string
      stockQuantity: number
      lowStockThreshold: number
    }[]
  >([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products/analytics")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.lowStockProducts || [])
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching analytics low stock:", err)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Low Stock Alerts</CardTitle>
          <CardDescription>Items that need to be reordered</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="space-y-2">
                    <div className="h-4 w-[150px] rounded bg-muted animate-pulse" />
                  </div>
                </div>
                <div className="h-6 w-16 rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-destructive/20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-2 h-full bg-destructive/10" />
      <CardHeader>
        <CardTitle className="text-destructive">Low Stock Alerts</CardTitle>
        <CardDescription>
          Products below their safe stock threshold
        </CardDescription>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-muted-foreground/20">
            <p className="text-sm text-muted-foreground">All inventory levels healthy</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      SKU: {product.sku}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="destructive">
                        {product.stockQuantity} / {product.lowStockThreshold}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
