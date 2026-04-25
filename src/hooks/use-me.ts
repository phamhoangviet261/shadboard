"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

import { api } from "@/lib/api-client"

export interface UserMe {
  id: string
  name: string
  username: string | null
  email: string | null
  avatar: string | null
  status: string
  role: string
  createdAt: string
  updatedAt: string
  preferences?: {
    theme: string
    mode: string
    radius: string
    layout: string
    direction: string
  }
}

/**
 * Hook to get the current logged-in user data from the /api/me endpoint.
 * This hook provides more detailed information than the standard useSession hook.
 */
export function useMe() {
  const { status: sessionStatus } = useSession()
  const [user, setUser] = useState<UserMe | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // If not authenticated, stop loading
    if (sessionStatus === "unauthenticated") {
      setIsLoading(false)
      setUser(null)
      return
    }

    // If authenticated, fetch data
    if (sessionStatus === "authenticated") {
      const fetchUserData = async () => {
        setIsLoading(true)
        try {
          const data = await api.get<UserMe>("/api/me")
          setUser(data)
          setError(null)
        } catch (err) {
          console.error("Failed to fetch current user data:", err)
          setError(
            err instanceof Error ? err : new Error("Failed to fetch user data")
          )
        } finally {
          setIsLoading(false)
        }
      }

      fetchUserData()
    }
  }, [sessionStatus])

  return {
    user,
    isLoading: isLoading || sessionStatus === "loading",
    error,
    isAuthenticated: sessionStatus === "authenticated",
    refresh: async () => {
      if (sessionStatus === "authenticated") {
        try {
          const data = await api.get<UserMe>("/api/me")
          setUser(data)
        } catch (err) {
          console.error("Failed to refresh user data:", err)
        }
      }
    },
  }
}
