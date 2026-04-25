"use client"

import { useCallback, useEffect, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { Search } from "lucide-react"
import { useDebounce } from "react-use"

import { UserRole } from "@/generated/client"
import type { PaginationInfo } from "@/types"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
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

import { UserDetailsDrawer } from "./user-details-drawer"
import { UserRoleDialog } from "./user-role-dialog"
import { UserStatusDialog } from "./user-status-dialog"
import { UserTableActions } from "./user-table-actions"

interface UserInfo {
  id: string
  name: string
  email: string
  role: string
  status: string
  avatar: string | null
  createdAt: string
  updatedAt: string
  lastLoginAt: string | null
}

interface UserManagementTableProps {
  users: UserInfo[]
  lang: string
  pagination: PaginationInfo
}

const roleVariant: Record<
  UserRole,
  "default" | "secondary" | "outline" | "destructive"
> = {
  ADMIN: "destructive",
  MANAGER: "default",
  EDITOR: "secondary",
  VIEWER: "outline",
}

const statusVariant: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  ACTIVE: "default",
  DISABLED: "destructive",
}

export function UserManagementTable({
  users,
  pagination,
}: UserManagementTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "")
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm)

  const [userToUpdateRole, setUserToUpdateRole] = useState<{
    id: string
    name: string
    currentRole: UserRole
  } | null>(null)

  const [userToUpdateStatus, setUserToUpdateStatus] = useState<{
    id: string
    name: string
    currentStatus: string
  } | null>(null)

  const [userToView, setUserToView] = useState<UserInfo | null>(null)

  useDebounce(
    () => {
      setDebouncedSearch(searchTerm)
    },
    500,
    [searchTerm]
  )

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, String(value))
        }
      })

      return newSearchParams.toString()
    },
    [searchParams]
  )

  const onFilterChange = (key: string, value: string | number | null) => {
    const queryString = createQueryString({ [key]: value, page: 1 })
    router.push(`${pathname}?${queryString}`)
  }

  useEffect(() => {
    const queryString = createQueryString({ q: debouncedSearch, page: 1 })
    if (debouncedSearch !== (searchParams.get("q") || "")) {
      router.push(`${pathname}?${queryString}`)
    }
  }, [debouncedSearch, pathname, router, createQueryString, searchParams])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-xl border bg-card p-3 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="pl-9"
            placeholder="Search name or email"
          />
        </div>
        <Select
          value={searchParams.get("role") || "all"}
          onValueChange={(value) =>
            onFilterChange("role", value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
            <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
            <SelectItem value={UserRole.EDITOR}>Editor</SelectItem>
            <SelectItem value={UserRole.VIEWER}>Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={searchParams.get("status") || "all"}
          onValueChange={(value) =>
            onFilterChange("status", value === "all" ? null : value)
          }
        >
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="DISABLED">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar>
                      <AvatarImage src={user.avatar ?? undefined} />
                      <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleVariant[user.role as UserRole]}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[user.status] || "outline"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {user.lastLoginAt
                      ? format(new Date(user.lastLoginAt), "MMM d, yyyy HH:mm")
                      : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <UserTableActions
                      user={user}
                      onView={() => setUserToView(user)}
                      onUpdateRole={() =>
                        setUserToUpdateRole({
                          id: user.id,
                          name: user.name,
                          currentRole: user.role as UserRole,
                        })
                      }
                      onUpdateStatus={() =>
                        setUserToUpdateStatus({
                          id: user.id,
                          name: user.name,
                          currentStatus: user.status,
                        })
                      }
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-32 text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  pagination.page > 1
                    ? `?${createQueryString({ page: pagination.page - 1 })}`
                    : "#"
                }
                className={
                  pagination.page <= 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href={`?${createQueryString({ page: p })}`}
                    isActive={p === pagination.page}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href={
                  pagination.page < pagination.totalPages
                    ? `?${createQueryString({ page: pagination.page + 1 })}`
                    : "#"
                }
                className={
                  pagination.page >= pagination.totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {userToUpdateRole && (
        <UserRoleDialog
          user={userToUpdateRole}
          open={!!userToUpdateRole}
          onOpenChange={(open) => !open && setUserToUpdateRole(null)}
          onSuccess={() => router.refresh()}
        />
      )}

      {userToUpdateStatus && (
        <UserStatusDialog
          user={userToUpdateStatus}
          open={!!userToUpdateStatus}
          onOpenChange={(open) => !open && setUserToUpdateStatus(null)}
          onSuccess={() => router.refresh()}
        />
      )}

      {userToView && (
        <UserDetailsDrawer
          user={userToView}
          open={!!userToView}
          onOpenChange={(open) => !open && setUserToView(null)}
        />
      )}
    </div>
  )
}
