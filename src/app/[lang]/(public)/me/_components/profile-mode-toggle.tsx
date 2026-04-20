"use client"

import { useCallback } from "react"
import { MoonStar, Sun } from "lucide-react"

import { cn } from "@/lib/utils"

import { useIsDarkMode } from "@/hooks/use-mode"
import { useSettings } from "@/hooks/use-settings"
import { Switch } from "@/components/ui/switch"

export function ProfileModeToggle() {
  const { settings, updateSettings } = useSettings()
  const isDarkMode = useIsDarkMode()

  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      updateSettings({ ...settings, mode: checked ? "dark" : "light" })
    },
    [settings, updateSettings]
  )

  return (
    <div className="inline-flex items-center gap-3 self-end rounded-full border border-border/60 bg-background/80 px-4 py-2 text-sm font-medium text-foreground shadow-[0_20px_60px_-40px_rgba(15,23,42,0.65)] backdrop-blur-xl">
      <Sun
        className={cn(
          "size-4 transition-colors",
          isDarkMode ? "text-muted-foreground" : "text-amber-500"
        )}
      />
      <Switch
        checked={isDarkMode}
        onCheckedChange={handleCheckedChange}
        aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      />
      <MoonStar
        className={cn(
          "size-4 transition-colors",
          isDarkMode ? "text-sky-400" : "text-muted-foreground"
        )}
      />
      <span className="min-w-20 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        {isDarkMode ? "Dark mode" : "Light mode"}
      </span>
    </div>
  )
}
