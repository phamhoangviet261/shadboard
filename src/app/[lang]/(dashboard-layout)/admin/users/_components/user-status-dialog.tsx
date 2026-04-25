"use client"

import { useState } from "react"
import { toast } from "sonner"

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

interface UserStatusDialogProps {
  user: {
    id: string
    name: string
    currentStatus: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UserStatusDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
}: UserStatusDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEnabling = user.currentStatus === "DISABLED"

  const handleUpdate = async () => {
    const newStatus = isEnabling ? "ACTIVE" : "DISABLED"

    try {
      setIsLoading(true)
      const response = await fetch(`/api/users/${user.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update status")
      }

      toast.success(
        `${isEnabling ? "Enabled" : "Disabled"} ${user.name}'s account`
      )
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status"
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEnabling ? "Enable Account" : "Disable Account"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to {isEnabling ? "enable" : "disable"}{" "}
            <strong>{user.name}</strong>&apos;s account?
            {!isEnabling &&
              " When disabled, they will no longer be able to access protected admin features."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              handleUpdate()
            }}
            disabled={isLoading}
            className={
              !isEnabling
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
          >
            {isLoading
              ? "Processing..."
              : isEnabling
                ? "Enable Account"
                : "Disable Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
