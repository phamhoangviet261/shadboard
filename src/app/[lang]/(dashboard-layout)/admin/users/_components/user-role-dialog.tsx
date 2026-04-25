"use client"

import { useState } from "react"
import { toast } from "sonner"
import { UserRole } from "@/generated/client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface UserRoleDialogProps {
  user: {
    id: string
    name: string
    currentRole: UserRole
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UserRoleDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UserRoleDialogProps) {
  const [role, setRole] = useState<UserRole>(user.currentRole)
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdate = async () => {
    if (role === user.currentRole) {
      onOpenChange(false)
      return
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/users/${user.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update role")
      }

      toast.success(`Updated ${user.name}'s role to ${role}`)
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update role")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change User Role</AlertDialogTitle>
          <AlertDialogDescription>
            Select a new role for <strong>{user.name}</strong>. This will change their permissions immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
              <SelectTrigger id="role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                <SelectItem value={UserRole.MANAGER}>Manager</SelectItem>
                <SelectItem value={UserRole.EDITOR}>Editor</SelectItem>
                <SelectItem value={UserRole.VIEWER}>Viewer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => {
            e.preventDefault()
            handleUpdate()
          }} disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Role"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
