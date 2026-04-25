"use client"

import { useEffect, useState } from "react"
import { Activity, AlertTriangle, Box, DollarSign, Package } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AnalyticsSummaryCards() {
  const [data, setData] = useState<{
    totalProducts: number
    activeProducts: number
    draftProducts: number
    archivedProducts: number
    lowStockProducts: number
    outOfStockProducts: number
    totalStockUnits: number
    totalInventoryValue: number
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/products/analytics")
      .then((res) => res.json())
      .then((data) => {
        setData(data.summary)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching analytics summary:", err)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-4 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalProducts}</div>
          <p className="mt-1 text-xs text-muted-foreground">
            {data.activeProducts} active, {data.draftProducts} draft
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${data.totalInventoryValue.toLocaleString()}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Across {data.totalStockUnits} units in stock
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Stock Units
          </CardTitle>
          <Box className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalStockUnits}</div>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <Activity className="h-3 w-3" />
            Active inventory
          </p>
        </CardContent>
      </Card>
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-destructive">
            Attention Needed
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-destructive">
              {data.lowStockProducts + data.outOfStockProducts}
            </div>
            {data.outOfStockProducts > 0 && (
              <Badge variant="destructive" className="text-[10px]">
                {data.outOfStockProducts} Out of stock
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-destructive/80">
            {data.lowStockProducts} products low on stock
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
