"use client"

import { useCallback, useEffect, useState } from "react"
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  History,
  Layers,
  Package,
  RefreshCw,
  Search,
} from "lucide-react"

import { usePermission } from "@/hooks/use-permission"
import { UnauthorizedState } from "@/components/auth/unauthorized-state"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface LogEntry {
  id: string
  action: string
  entityType: string
  entityId: string
  entityName: string
  actorEmail: string
  createdAt: string
  metadata: Record<string, unknown> | null
}

interface ActivityLogsResponse {
  data?: LogEntry[]
  pagination?: {
    totalPages?: number
  }
  message?: string
}

export default function ActivityLogPage() {
  const { can, isLoading: isPermissionLoading } = usePermission()
  const canView = can("activityLog:view")

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [entityType, setEntityType] = useState<string>("all")

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let url = `/api/activity-logs?page=${page}&limit=15`
      if (search) url += `&q=${encodeURIComponent(search)}`
      if (entityType !== "all") url += `&entityType=${entityType}`

      const res = await fetch(url)
      const data = (await res.json()) as ActivityLogsResponse

      if (!res.ok) {
        throw new Error(data.message || "Unable to fetch activity logs.")
      }

      setLogs(Array.isArray(data.data) ? data.data : [])
      setTotalPages(Math.max(1, data.pagination?.totalPages ?? 1))
    } catch (error) {
      console.error("Failed to fetch logs:", error)
      setLogs([])
      setTotalPages(1)
      setError(
        error instanceof Error
          ? error.message
          : "Unable to fetch activity logs."
      )
    } finally {
      setLoading(false)
    }
  }, [page, search, entityType])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const getActionBadge = (action: string) => {
    if (action.includes("created"))
      return (
        <Badge
          variant="default"
          className="bg-emerald-500 hover:bg-emerald-600"
        >
          Created
        </Badge>
      )
    if (action.includes("deleted"))
      return <Badge variant="destructive">Deleted</Badge>
    if (action.includes("updated"))
      return <Badge variant="secondary">Updated</Badge>
    if (action.includes("duplicated"))
      return (
        <Badge variant="outline" className="border-blue-400 text-blue-500">
          Duplicated
        </Badge>
      )
    if (action.includes("stock"))
      return (
        <Badge variant="outline" className="border-orange-400 text-orange-500">
          Inventory
        </Badge>
      )
    if (action.includes("bulk"))
      return (
        <Badge variant="outline" className="border-purple-400 text-purple-500">
          Bulk
        </Badge>
      )
    return <Badge variant="outline">{action}</Badge>
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "product":
        return <Package className="h-4 w-4 text-orange-500" />
      case "collection":
        return <Layers className="h-4 w-4 text-blue-500" />
      case "bulk_action":
        return <History className="h-4 w-4 text-purple-500" />
      default:
        return <History className="h-4 w-4 text-muted-foreground" />
    }
  }

  if (!isPermissionLoading && !canView) {
    return <UnauthorizedState />
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 w-full max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Trail</h1>
        <p className="text-muted-foreground mt-2">
          Track and review all administrative actions across your store.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search action, name or actor..."
            className="pl-9"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Select
            value={entityType}
            onValueChange={(val) => {
              setEntityType(val)
              setPage(1)
            }}
          >
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Entity Type" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Entities</SelectItem>
              <SelectItem value="product">Products</SelectItem>
              <SelectItem value="collection">Collections</SelectItem>
              <SelectItem value="inventory">Inventory</SelectItem>
              <SelectItem value="bulk_action">Bulk Actions</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={fetchLogs}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <Card className="shadow-premium overflow-hidden border-none bg-background/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px]">Date</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Entity</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-6 w-full animate-pulse bg-muted rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-destructive"
                  >
                    {error}
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-32 text-center text-muted-foreground"
                  >
                    No activity logs found.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow
                    key={log.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getEntityIcon(log.entityType)}
                        <span className="font-medium text-sm">
                          {log.entityName || "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {log.actorEmail || "System"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between px-2">
        <p className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  )
}
