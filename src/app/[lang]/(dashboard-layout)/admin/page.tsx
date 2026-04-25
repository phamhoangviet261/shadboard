import type { Metadata } from "next"

import { AnalyticsSummaryCards } from "./_components/analytics-summary-cards"
import { CollectionInsights } from "./_components/collection-insights"
import { LowStockAlerts } from "./_components/low-stock-alerts"
import { TopStockProducts } from "./_components/top-stock-products"

export const metadata: Metadata = {
  title: "Admin Dashboard | Lensora",
}

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your store&apos;s performance, inventory, and health.
        </p>
      </div>

      <AnalyticsSummaryCards />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 lg:col-span-4 space-y-6">
          <TopStockProducts />
          <CollectionInsights />
        </div>
        <div className="col-span-1 lg:col-span-3">
          <LowStockAlerts />
        </div>
      </div>
    </div>
  )
}
