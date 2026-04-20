import { BriefcaseBusiness } from "lucide-react"

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
  return (
    <section id="experiences" className="scroll-mt-12 space-y-8">
      <PortfolioReveal>
        <PortfolioSectionHeading
          eyebrow="Experiences"
          title="A compact timeline of product work, delivery, and scale."
          description="The experience section keeps the original role and company data intact, then frames it in a cleaner editorial timeline with responsive cards."
          align="center"
        />
      </PortfolioReveal>

      <div className="relative space-y-6 before:absolute before:bottom-4 before:start-5 before:top-4 before:w-px before:bg-gradient-to-b before:from-cyan-500/60 before:via-fuchsia-500/30 before:to-transparent lg:before:start-1/2 lg:before:-translate-x-1/2">
        {experiences.map((experience, index) => {
          const isRightColumn = index % 2 === 1
          const ExperienceIcon = getPortfolioIcon(experience.icon)
          const points =
            experience.points?.filter((point) => point.trim().length > 0) ?? []

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
                  <Card className="rounded-[1.75rem] border-border/60 bg-background/75 p-6 shadow-[0_20px_80px_-60px_rgba(15,23,42,0.65)] backdrop-blur-xl sm:p-7">
                    <div className="space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                          {experience.date || "Timeline not provided"}
                        </span>
                        {experience.date?.toLowerCase().includes("now") ? (
                          <span className="inline-flex items-center rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">
                            Current
                          </span>
                        ) : null}
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
                  className="absolute start-0 top-7 flex size-10 items-center justify-center rounded-2xl border border-background shadow-[0_0_0_10px_hsl(var(--background)/0.9)] lg:start-1/2 lg:-translate-x-1/2"
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
    </section>
  )
}
