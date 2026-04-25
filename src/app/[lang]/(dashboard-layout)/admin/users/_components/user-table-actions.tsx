"use client"

import {
  Eye,
  MoreHorizontal,
  ShieldAlert,
  UserCheck,
  UserCog,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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

interface UserTableActionsProps {
  user: UserInfo
  onView: () => void
  onUpdateRole: () => void
  onUpdateStatus: () => void
}

export function UserTableActions({
  user,
  onView,
  onUpdateRole,
  onUpdateStatus,
}: UserTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={onView}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onUpdateRole}>
          <UserCog className="mr-2 h-4 w-4" />
          Change Role
        </DropdownMenuItem>
        <DropdownMenuItem
          className={
            user.status === "ACTIVE"
              ? "text-destructive focus:text-destructive"
              : "text-green-600 focus:text-green-600"
          }
          onClick={onUpdateStatus}
        >
          {user.status === "ACTIVE" ? (
            <>
              <ShieldAlert className="mr-2 h-4 w-4" />
              Disable Account
            </>
          ) : (
            <>
              <UserCheck className="mr-2 h-4 w-4" />
              Enable Account
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
