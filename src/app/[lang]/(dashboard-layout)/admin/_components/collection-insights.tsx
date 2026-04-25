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

export function CollectionInsights() {
  const [collections, setCollections] = useState<
    {
      id: string
      name: string
      productCount: number
      activeProductCount: number
      stockUnits: number
      inventoryValue: number
    }[]
  >([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products/analytics")
      .then((res) => res.json())
      .then((data) => {
        setCollections(data.collections || [])
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching analytics collections:", err)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Collection Insights</CardTitle>
          <CardDescription>Performance by product group</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 w-[120px] rounded bg-muted animate-pulse" />
                <div className="h-4 w-[60px] rounded bg-muted animate-pulse" />
                <div className="h-4 w-[80px] rounded bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection Insights</CardTitle>
        <CardDescription>Inventory and performance by category</CardDescription>
      </CardHeader>
      <CardContent>
        {collections.length === 0 ? (
          <div className="flex xl:h-[350px] h-32 items-center justify-center rounded-md border border-dashed">
            <p className="text-sm text-muted-foreground">No collection data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collection</TableHead>
                  <TableHead className="text-center">Products</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {collections
                  .sort((a, b) => b.inventoryValue - a.inventoryValue)
                  .map((collection) => (
                    <TableRow key={collection.id}>
                      <TableCell className="font-medium">
                        {collection.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {collection.activeProductCount}{" "}
                        <span className="text-muted-foreground text-xs">
                          / {collection.productCount} active
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {collection.stockUnits}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${collection.inventoryValue.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
