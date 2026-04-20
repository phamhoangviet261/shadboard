import { Code2 } from "lucide-react"

import type { Technology } from "../_data/portfolio"

import { cn } from "@/lib/utils"

import { Card } from "@/components/ui/card"
import {
  getPortfolioIcon,
  getTechnologyAccent,
  getTechnologyCategory,
} from "./portfolio-icon"
import { PortfolioReveal } from "./portfolio-reveal"
import { PortfolioSectionHeading } from "./portfolio-section-heading"

interface ProfileTechnologiesProps {
  technologies: Technology[]
}

const wideCardIndexes = new Set([1, 8])

export function ProfileTechnologies({
  technologies,
}: ProfileTechnologiesProps) {
  return (
    <section id="technologies" className="scroll-mt-12 space-y-8">
      <PortfolioReveal>
        <PortfolioSectionHeading
          eyebrow="Technologies"
          title="A toolbelt designed for polished interfaces and production delivery."
          description="The stack mixes frontend foundations, application architecture, visual craft, and delivery tooling. Each card below comes directly from the existing portfolio data."
          align="center"
        />
      </PortfolioReveal>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <PortfolioReveal className="md:col-span-2 xl:col-span-2" delay={80}>
          <Card className="relative h-full overflow-hidden rounded-[1.75rem] border-white/10 bg-slate-950 p-6 text-white shadow-[0_30px_120px_-70px_rgba(59,130,246,0.8)] sm:p-7">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.4),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(236,72,153,0.22),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.2),transparent_35%)]" />

            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="space-y-4">
                <span className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  Stack Overview
                </span>
                <div className="max-w-xl space-y-3">
                  <h3 className="text-3xl font-black tracking-tight sm:text-4xl">
                    {technologies.length} technologies shaping the portfolio
                    stack.
                  </h3>
                  <p className="text-base leading-7 text-white/70">
                    The mix spans interface engineering, component systems,
                    application logic, design tooling, and workflow foundations
                    required to ship fast without sacrificing finish.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {technologies.slice(0, 4).map((technology) => {
                  const Icon = getPortfolioIcon(technology.icon)

                  return (
                    <div
                      key={technology.name}
                      className="rounded-[1.5rem] border border-white/10 bg-white/[0.07] p-4 backdrop-blur"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10">
                          <Icon className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {technology.name || "Technology"}
                          </p>
                          <p className="text-sm text-white/[0.55]">
                            {getTechnologyCategory(technology.icon)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </Card>
        </PortfolioReveal>

        {technologies.map((technology, index) => {
          const Icon = getPortfolioIcon(technology.icon)
          const accent = getTechnologyAccent(index)

          return (
            <PortfolioReveal
              key={`${technology.name}-${technology.icon}`}
              delay={120 + index * 40}
              className={cn(wideCardIndexes.has(index) && "xl:col-span-2")}
            >
              <Card
                className={cn(
                  "group relative h-full overflow-hidden rounded-[1.75rem] border-border/60 bg-gradient-to-br p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_80px_-55px_rgba(56,189,248,0.65)]",
                  accent.container
                )}
              >
                <div
                  className={cn(
                    "pointer-events-none absolute end-4 top-4 size-20 rounded-full blur-3xl transition duration-500 group-hover:scale-110",
                    accent.glow
                  )}
                />

                <div className="relative flex h-full flex-col justify-between gap-8">
                  <div className="flex items-start justify-between gap-4">
                    <div
                      className={cn(
                        "flex size-14 items-center justify-center rounded-[1.25rem] bg-gradient-to-br shadow-lg",
                        accent.icon
                      )}
                    >
                      <Icon className="size-6" />
                    </div>

                    <span className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight">
                      {technology.name || "Technology"}
                    </h3>
                    <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground">
                      <Code2 className="size-3.5" />
                      {getTechnologyCategory(technology.icon)}
                    </div>
                  </div>
                </div>
              </Card>
            </PortfolioReveal>
          )
        })}
      </div>
    </section>
  )
}
