"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { User, Shield, Mail, Calendar, Clock, Activity } from "lucide-react"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface UserDetailsDrawerProps {
  user: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailsDrawer({
  user,
  open,
  onOpenChange,
}: UserDetailsDrawerProps) {
  const [logs, setLogs] = useState<any[]>([])
  const [isLoadingLogs, setIsLoadingLogs] = useState(false)

  useEffect(() => {
    if (open && user?.id) {
      const fetchLogs = async () => {
        try {
          setIsLoadingLogs(true)
          const response = await fetch(`/api/activity-logs?actorId=${user.id}&limit=10`)
          const data = await response.json()
          if (response.ok) {
            setLogs(data.data || [])
          }
        } catch (error) {
          console.error("Failed to fetch logs:", error)
        } finally {
          setIsLoadingLogs(false)
        }
      }
      fetchLogs()
    }
  }, [open, user?.id])

  if (!user) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader className="text-left">
          <SheetTitle>User Details</SheetTitle>
          <SheetDescription>
            Full profile and recent activity for {user.name}.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          <div className="flex flex-col gap-6 py-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">{user.name?.[0]}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{user.role}</Badge>
                <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                  {user.status}
                </Badge>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <h4 className="text-sm font-medium">Account Information</h4>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">User ID:</span>
                  <span className="font-mono text-xs">{user.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Current Role:</span>
                  <span>{user.role}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined:</span>
                  <span>{format(new Date(user.createdAt), "PPP")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Last Login:</span>
                  <span>{user.lastLoginAt ? format(new Date(user.lastLoginAt), "PPP HH:mm") : "Never"}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Recent Activity</h4>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
              
              {isLoadingLogs ? (
                <div className="py-4 text-center text-sm text-muted-foreground">Loading activity...</div>
              ) : logs.length > 0 ? (
                <div className="relative space-y-4 before:absolute before:left-2 before:top-2 before:h-[calc(100%-16px)] before:w-[2px] before:bg-muted">
                  {logs.map((log) => (
                    <div key={log.id} className="relative pl-6">
                      <div className="absolute left-0 top-1.5 h-4 w-4 rounded-full border-2 border-background bg-primary shadow-sm" />
                      <div className="grid gap-1">
                        <div className="text-sm font-medium leading-none">
                          {log.action.replace(/_/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {log.entityName || log.entityType}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {format(new Date(log.createdAt), "MMM d, HH:mm")}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No recent activity found.
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
