"use client"

import { useEffect, useState } from "react"

import { experiences, projects, technologies } from "./_data/portfolio"

import { ProfileExperiences } from "./_components/profile-experiences"
import { ProfileHero } from "./_components/profile-hero"
import { ProfileProjects } from "./_components/profile-projects"
import { ProfileTechnologies } from "./_components/profile-technologies"
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
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_28%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_30%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "url('/images/bg.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="relative container flex flex-col gap-24 py-8 sm:gap-28 sm:py-12 lg:gap-32 lg:py-16">
        <ProfileHero
          technologies={technologies}
          experiences={experiences}
          projects={projects}
        />
        <ProfileTechnologies technologies={technologies} />
        <ProfileExperiences experiences={experiences} />
        <ProfileProjects projects={projects} />
      </div>
    </div>
  )
}
