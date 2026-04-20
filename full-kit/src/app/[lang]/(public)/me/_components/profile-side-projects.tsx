import { FlaskConical, Rocket, Sparkles } from "lucide-react"

import type { Project, Technology } from "../_data/portfolio"

import { getSideExperiments } from "../_data/portfolio-derivatives"

import { Card } from "@/components/ui/card"
import { getPortfolioIcon } from "./portfolio-icon"
import { PortfolioReveal } from "./portfolio-reveal"
import { PortfolioSectionHeading } from "./portfolio-section-heading"

interface ProfileSideProjectsProps {
  technologies: Technology[]
  projects: Project[]
}

const experimentAccents = [
  "from-cyan-500/20 via-sky-500/10 to-background",
  "from-fuchsia-500/20 via-pink-500/10 to-background",
  "from-emerald-500/20 via-teal-500/10 to-background",
]

const experimentIcons = [Rocket, FlaskConical, Sparkles]

export function ProfileSideProjects({
  technologies,
  projects,
}: ProfileSideProjectsProps) {
  const experiments = getSideExperiments(technologies, projects)

  return (
    <section id="experiments" className="scroll-mt-12 space-y-8">
      <PortfolioReveal>
        <PortfolioSectionHeading
          eyebrow="Side Projects / Experiments"
          title="A more playful layer: concept directions derived from the current stack and shipped work."
          description="There is no separate side-project dataset in this repo, so these cards intentionally remix themes from the existing technologies and project history instead of inventing disconnected filler."
          align="center"
        />
      </PortfolioReveal>

      <div className="grid gap-5 lg:grid-cols-12">
        {experiments.map((experiment, index) => {
          const AccentIcon = experimentIcons[index % experimentIcons.length]
          const TechnologyIcon = getPortfolioIcon(experiment.icon)
          const spanClass =
            experiment.variant === "feature"
              ? "lg:col-span-6"
              : experiment.variant === "tall"
                ? "lg:col-span-3"
                : "lg:col-span-3"
          const tiltClass =
            index === 0
              ? "lg:-rotate-[1deg]"
              : index === 1
                ? "lg:rotate-[1.25deg]"
                : "lg:-rotate-[0.75deg]"

          return (
            <PortfolioReveal
              key={experiment.title}
              delay={100 + index * 80}
              className={spanClass}
            >
              <Card
                className={`group relative h-full overflow-hidden rounded-[2rem] border-border/60 bg-gradient-to-br p-6 backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 ${tiltClass} ${experimentAccents[index % experimentAccents.length]}`}
              >
                <div className="pointer-events-none absolute end-4 top-4 size-28 rounded-full bg-white/20 blur-3xl transition-transform duration-500 group-hover:scale-110" />

                <div className="relative flex h-full flex-col gap-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-[1rem] bg-background/90 shadow-lg">
                        <TechnologyIcon className="size-5" />
                      </div>
                      <div className="flex size-10 items-center justify-center rounded-full border border-border/60 bg-background/70">
                        <AccentIcon className="size-4 text-muted-foreground" />
                      </div>
                    </div>

                    <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                      {experiment.status}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tight">
                      {experiment.title}
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {experiment.description}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {experiment.tags.map((tag) => (
                      <span
                        key={`${experiment.title}-${tag}`}
                        className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1.5 text-xs font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
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
