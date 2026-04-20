import Image from "next/image"
import { Compass, Sparkles, Workflow } from "lucide-react"

import type { Experience, Project, Technology } from "../_data/portfolio"

import { publicProfileContent } from "../_data/profile-content"

import { Card } from "@/components/ui/card"
import { PortfolioReveal } from "./portfolio-reveal"
import { PortfolioSectionHeading } from "./portfolio-section-heading"

interface ProfileAboutProps {
  technologies: Technology[]
  experiences: Experience[]
  projects: Project[]
}

const philosophyIcons = [Compass, Workflow, Sparkles]

export function ProfileAbout({
  technologies,
  experiences,
  projects,
}: ProfileAboutProps) {
  const currentCompany = experiences.at(-1)?.company_name ?? "product teams"
  const focusPreview = Array.from(
    new Set([
      ...publicProfileContent.focusAreas,
      ...technologies.map((technology) => technology.name),
    ])
  ).slice(0, 6)
  const journeySummary = `${experiences.length} career chapters and ${projects.length} real-world projects currently shape the portfolio story on this page.`

  return (
    <section id="about" className="scroll-mt-12 space-y-8">
      <PortfolioReveal>
        <PortfolioSectionHeading
          eyebrow="About / Tech Philosophy"
          title="Frontend craft shaped by reusable systems, performance, and polished execution."
          description="A concise read on how Viet Pham approaches product UI: visually strong, technically grounded, and built to stay maintainable as the surface area grows."
          align="center"
        />
      </PortfolioReveal>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <PortfolioReveal delay={60}>
          <Card className="relative overflow-hidden rounded-[2rem] border-border/60 bg-background/75 p-7 shadow-[0_35px_120px_-80px_rgba(15,23,42,0.65)] backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_100%_0%,rgba(236,72,153,0.12),transparent_28%)]" />
            <Image
              src="/images/illustrations/scenes/scene-01.svg"
              alt=""
              fill
              sizes="(max-width: 1280px) 100vw, 720px"
              className="pointer-events-none object-contain object-bottom-right opacity-30"
            />

            <div className="relative space-y-6">
              <span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                Personal Intro
              </span>

              <div className="space-y-4">
                <h3 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
                  {publicProfileContent.aboutIntro}
                </h3>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                  {publicProfileContent.aboutParagraphs[0]}
                </p>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground">
                  {publicProfileContent.aboutParagraphs[1]}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Current Focus
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {publicProfileContent.currentFocus}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Current Context
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    Recent delivery spans {currentCompany}, with the work
                    centered on responsive product UI, reusable components, and
                    frontend architecture that stays workable under real product
                    pressure.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {focusPreview.map((focusArea) => (
                  <span
                    key={focusArea}
                    className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm font-medium text-muted-foreground"
                  >
                    {focusArea}
                  </span>
                ))}
              </div>

              <p className="max-w-2xl text-sm leading-7 text-muted-foreground">
                {journeySummary}
              </p>
            </div>
          </Card>
        </PortfolioReveal>

        <div className="grid gap-4">
          {publicProfileContent.philosophyPillars.map((pillar, index) => {
            const Icon = philosophyIcons[index % philosophyIcons.length]

            return (
              <PortfolioReveal key={pillar.title} delay={120 + index * 70}>
                <Card className="rounded-[1.75rem] border-border/60 bg-background/75 p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex size-12 items-center justify-center rounded-[1rem] bg-gradient-to-br from-sky-500 to-cyan-500 text-white shadow-lg shadow-sky-500/20">
                        <Icon className="size-5" />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                        {pillar.eyebrow}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold tracking-tight">
                        {pillar.title}
                      </h3>
                      <p className="text-sm leading-7 text-muted-foreground">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </PortfolioReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
