"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ModelLoadingOverlay from "@/components/model-loading"

export default function MePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl shadow-xl rounded-2xl">
        <CardContent className="flex flex-col items-center text-center gap-4 p-8">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
            <img
              src="https://i.pravatar.cc/150"
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name */}
          <h1 className="text-2xl font-bold">Viet Pham</h1>

          {/* Bio */}
          <p className="text-muted-foreground text-sm max-w-md">
            Frontend Developer. Building modern web apps with Next.js,
            TailwindCSS & shadcn/ui.
          </p>

          {/* Tech stack */}
          <div className="flex gap-2 flex-wrap justify-center mt-2">
            {["Next.js", "TypeScript", "Tailwind", "Redux"].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs rounded-full bg-muted"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <Button asChild>
              <a href="https://github.com/phamhoangviet261" target="_blank">
                GitHub
              </a>
            </Button>

            <Button variant="outline" asChild>
              <a href="/projects">Projects</a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <ModelLoadingOverlay
        loading={true}
        modelSrc="/models/chibi_battle_bat_xayah.glb"
        text="Đang vào trang..."
      />
    </div>
  )
}
