"use client"

import Link from "next/link"
import { ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

interface UnauthorizedStateProps {
  title?: string
  description?: string
  backHref?: string
}

export function UnauthorizedState({
  title = "Access Denied",
  description = "You do not have the required permissions to view this page. If you believe this is an error, please contact your administrator.",
  backHref = "/admin",
}: UnauthorizedStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full max-w-md mx-auto text-center px-4">
      <div className="bg-destructive/10 p-4 rounded-full mb-6">
        <ShieldAlert className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>
      <Button asChild>
        <Link href={backHref}>Return to Dashboard</Link>
      </Button>
    </div>
  )
}
