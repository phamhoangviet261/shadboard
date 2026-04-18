"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ModelLoadingOverlay from "@/components/model-loading"

export default function MePage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsLoading(false)
    }, 5000)

    return () => window.clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <ModelLoadingOverlay
          loading={isLoading}
          modelSrc="/models/chibi_battle_bat_xayah.glb"
        />
      </div>
    )
  }

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{
        backgroundImage: "url(/images/bg.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Card className="w-full max-w-xl rounded-2xl shadow-xl">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-gray-200">
            <img
              src="https://i.pravatar.cc/150"
              alt="avatar"
              className="h-full w-full object-cover"
            />
          </div>

          <h1 className="text-2xl font-bold">Viet Pham</h1>

          <p className="max-w-md text-sm text-muted-foreground">
            Frontend Developer. Building modern web apps with Next.js,
            TailwindCSS & shadcn/ui.
          </p>

          <div className="mt-2 flex flex-wrap justify-center gap-2">
            {["Next.js", "TypeScript", "Tailwind", "Redux"].map((tech) => (
              <span
                key={tech}
                className="rounded-full bg-muted px-3 py-1 text-xs"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-4 flex gap-3">
            <Button asChild>
              <Link href="https://github.com/phamhoangviet261" target="_blank">
                GitHub
              </Link>
            </Button>

            <Button variant="outline" asChild>
              <Link href="/projects">My Projects</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
