import { ArrowRight, BriefcaseBusiness, MapPinned, Route } from "lucide-react"

import type { Experience } from "../_data/portfolio"

import { cn } from "@/lib/utils"

import { Card } from "@/components/ui/card"
import { getPortfolioIcon } from "./portfolio-icon"
import { PortfolioReveal } from "./portfolio-reveal"
import { PortfolioSectionHeading } from "./portfolio-section-heading"

interface ProfileExperiencesProps {
  experiences: Experience[]
}

export function ProfileExperiences({ experiences }: ProfileExperiencesProps) {
  const regions = experiences
    .map((experience) => experience.company_name.split("-").at(-1)?.trim())
    .filter(Boolean) as string[]

  return (
    <section id="experiences" className="scroll-mt-12 space-y-8">
      <PortfolioReveal>
        <PortfolioSectionHeading
          eyebrow="Career Journey"
          title="A storytelling timeline through product platforms, performance work, and interface scale."
          description="The original experience entries stay intact, but the presentation leans more editorial: chapter-based, directional, and easier to scan as a progression."
          align="center"
        />
      </PortfolioReveal>

      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <PortfolioReveal delay={70}>
          <Card className="relative overflow-hidden rounded-[2rem] border-border/60 bg-slate-950 p-7 text-white shadow-[0_35px_120px_-80px_rgba(14,165,233,0.7)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.32),transparent_30%),radial-gradient(circle_at_100%_0%,rgba(236,72,153,0.18),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.18),transparent_30%)]" />

            <div className="relative space-y-7">
              <div className="space-y-3">
                <span className="inline-flex items-center rounded-full border border-white/[0.15] bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
                  Journey Summary
                </span>
                <h3 className="text-3xl font-black tracking-tight">
                  From company platforms to higher-traffic product surfaces.
                </h3>
                <p className="text-sm leading-8 text-white/75">
                  The current path moves from implementation and optimization
                  work into larger-scale product execution, with a strong thread
                  around clarity, speed, and search-driven user journeys.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                  <div className="inline-flex items-center gap-2 text-sm text-white/80">
                    <MapPinned className="size-4" />
                    <span>
                      {regions.join(" -> ") || "Regions not specified"}
                    </span>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                  <div className="inline-flex items-center gap-2 text-sm text-white/80">
                    <Route className="size-4" />
                    <span>
                      {experiences.length} chapters in the current dataset
                    </span>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                  <div className="inline-flex items-center gap-2 text-sm text-white/80">
                    <ArrowRight className="size-4" />
                    <span>
                      Strongest recurring themes: speed, scale, and UX polish
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </PortfolioReveal>

        <div className="relative space-y-6 before:absolute before:bottom-4 before:start-5 before:top-4 before:w-px before:bg-gradient-to-b before:from-cyan-500/60 before:via-fuchsia-500/30 before:to-transparent lg:before:start-1/2 lg:before:-translate-x-1/2">
          {experiences.map((experience, index) => {
            const isRightColumn = index % 2 === 1
            const ExperienceIcon = getPortfolioIcon(experience.icon)
            const points =
              experience.points?.filter((point) => point.trim().length > 0) ??
              []
            const chapterLabel = `Chapter ${String(index + 1).padStart(2, "0")}`

            return (
              <PortfolioReveal
                key={`${experience.company_name}-${experience.date}`}
                delay={index * 120}
              >
                <div className="relative lg:grid lg:grid-cols-2 lg:gap-12">
                  <div
                    className={cn(
                      "ms-14 lg:ms-0",
                      isRightColumn
                        ? "lg:col-start-2 lg:ps-12"
                        : "lg:col-start-1 lg:pe-12"
                    )}
                  >
                    <Card className="rounded-[1.75rem] border-border/60 bg-background/80 p-6 shadow-[0_20px_80px_-60px_rgba(15,23,42,0.65)] backdrop-blur-xl sm:p-7">
                      <div className="space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <span className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                            {chapterLabel}
                          </span>
                          <span className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                            {experience.date || "Timeline not provided"}
                          </span>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                            {experience.company_name || "Company"}
                          </p>
                          <h3 className="text-2xl font-black tracking-tight">
                            {experience.title || "Role"}
                          </h3>
                        </div>

                        <ul className="space-y-3 text-sm leading-7 text-muted-foreground">
                          {(points.length > 0
                            ? points
                            : ["Experience details will be added soon."]
                          ).map((point) => (
                            <li key={point} className="flex gap-3">
                              <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-sky-500" />
                              <span>{point.trim()}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  </div>

                  <div
                    className="absolute start-0 top-7 flex size-11 items-center justify-center rounded-2xl border border-background shadow-[0_0_0_10px_hsl(var(--background)/0.9)] lg:start-1/2 lg:-translate-x-1/2"
                    style={{ backgroundColor: experience.iconBg ?? undefined }}
                  >
                    {experience.icon ? (
                      <ExperienceIcon className="size-4 text-slate-950" />
                    ) : (
                      <BriefcaseBusiness className="size-4 text-slate-950" />
                    )}
                  </div>
                </div>
              </PortfolioReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
