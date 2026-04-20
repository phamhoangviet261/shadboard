"use client"

import { useState } from "react"
import { Layers3, Sparkles, Zap } from "lucide-react"

import type { Project, Technology } from "../_data/portfolio"

import {
  countProjectsUsingTechnology,
  getTechnologyDescription,
  projectUsesTechnology,
} from "../_data/portfolio-derivatives"

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
  projects: Project[]
}

export function ProfileTechnologies({
  technologies,
  projects,
}: ProfileTechnologiesProps) {
  const categories = [
    "All",
    ...Array.from(
      new Set(
        technologies.map((technology) => getTechnologyCategory(technology.icon))
      )
    ),
  ]
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedTechnologyName, setSelectedTechnologyName] = useState(
    technologies.find((technology) => technology.icon === "nextjs")?.name ??
      technologies[0]?.name ??
      ""
  )

  const filteredTechnologies =
    activeCategory === "All"
      ? technologies
      : technologies.filter(
          (technology) =>
            getTechnologyCategory(technology.icon) === activeCategory
        )

  const selectedTechnology =
    technologies.find(
      (technology) => technology.name === selectedTechnologyName
    ) ??
    filteredTechnologies[0] ??
    technologies[0]

  const selectedTechnologyIndex = technologies.findIndex(
    (technology) => technology.name === selectedTechnology?.name
  )
  const selectedTechnologyAccent = getTechnologyAccent(
    Math.max(selectedTechnologyIndex, 0)
  )
  const SelectedTechnologyIcon = getPortfolioIcon(selectedTechnology?.icon)
  const selectedTechnologyProjectCount = selectedTechnology
    ? countProjectsUsingTechnology(selectedTechnology, projects)
    : 0
  const relatedProjects = selectedTechnology
    ? projects.filter((project) =>
        projectUsesTechnology(project, selectedTechnology)
      )
    : []

  return (
    <section id="technologies" className="scroll-mt-12 space-y-8">
      <PortfolioReveal>
        <PortfolioSectionHeading
          eyebrow="Technologies"
          title="An interactive stack map instead of a flat tech list."
          description="The goal here is not to dump logos. Hover or select a technology to shift the spotlight, surface where it shows up, and keep the section feeling alive."
          align="center"
        />
      </PortfolioReveal>

      <PortfolioReveal delay={70}>
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category)
                const nextTechnology =
                  category === "All"
                    ? technologies[0]
                    : technologies.find(
                        (technology) =>
                          getTechnologyCategory(technology.icon) === category
                      )

                if (nextTechnology) {
                  setSelectedTechnologyName(nextTechnology.name)
                }
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300",
                activeCategory === category
                  ? "border-sky-500/40 bg-sky-500/10 text-sky-700 shadow-[0_10px_35px_-25px_rgba(14,165,233,0.7)] dark:text-sky-200"
                  : "border-border/60 bg-background/70 text-muted-foreground hover:border-sky-500/30 hover:text-foreground"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </PortfolioReveal>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <PortfolioReveal delay={100}>
          <Card className="relative overflow-hidden rounded-[2rem] border-border/60 bg-slate-950 p-7 text-white shadow-[0_35px_120px_-75px_rgba(14,165,233,0.75)]">
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                selectedTechnologyAccent.icon.replace(" text-white", "")
              )}
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_25%),radial-gradient(circle_at_0%_100%,rgba(15,23,42,0.5),transparent_38%)]" />

            <div className="relative flex h-full flex-col gap-8">
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full border border-white/[0.15] bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                  Stack Spotlight
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-black/[0.15] px-3 py-1 text-xs font-medium text-white/80">
                  <Sparkles className="size-3.5" />
                  {getTechnologyCategory(selectedTechnology?.icon)}
                </span>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="flex size-16 items-center justify-center rounded-[1.5rem] bg-white/10 shadow-lg backdrop-blur">
                    <SelectedTechnologyIcon className="size-7" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black tracking-tight sm:text-4xl">
                      {selectedTechnology?.name || "Technology"}
                    </h3>
                    <p className="text-sm text-white/70">
                      Selected from the active stack navigator
                    </p>
                  </div>
                </div>

                <p className="max-w-xl text-sm leading-8 text-white/80 sm:text-base">
                  {selectedTechnology
                    ? getTechnologyDescription(selectedTechnology, projects)
                    : "Select a technology to inspect how it fits into the portfolio."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/[0.45]">
                    Project usage
                  </p>
                  <p className="mt-3 text-3xl font-black">
                    {selectedTechnologyProjectCount}
                  </p>
                  <p className="mt-2 text-sm text-white/[0.7]">
                    Featured projects currently reference this part of the
                    stack.
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/[0.45]">
                    Interaction mode
                  </p>
                  <p className="mt-3 text-3xl font-black">
                    {filteredTechnologies.length}
                  </p>
                  <p className="mt-2 text-sm text-white/[0.7]">
                    Technologies visible in the current category filter.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/[0.55]">
                  <Layers3 className="size-4" />
                  Related projects
                </div>
                <div className="flex flex-wrap gap-2">
                  {(relatedProjects.length > 0
                    ? relatedProjects
                    : projects.slice(0, 2)
                  ).map((project) => (
                    <span
                      key={`${selectedTechnology?.name}-${project.name}`}
                      className="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white/[0.85]"
                    >
                      {project.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </PortfolioReveal>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filteredTechnologies.map((technology, index) => {
            const isSelected = technology.name === selectedTechnology?.name
            const technologyIndex = technologies.findIndex(
              (item) => item.name === technology.name
            )
            const accent = getTechnologyAccent(Math.max(technologyIndex, 0))
            const Icon = getPortfolioIcon(technology.icon)

            return (
              <PortfolioReveal
                key={`${technology.name}-${technology.icon}`}
                delay={120 + index * 35}
              >
                <button
                  type="button"
                  onMouseEnter={() =>
                    setSelectedTechnologyName(technology.name)
                  }
                  onFocus={() => setSelectedTechnologyName(technology.name)}
                  onClick={() => setSelectedTechnologyName(technology.name)}
                  className="h-full text-start"
                >
                  <Card
                    className={cn(
                      "group relative flex h-full flex-col justify-between overflow-hidden rounded-[1.6rem] border p-5 transition-all duration-300 hover:-translate-y-1",
                      isSelected
                        ? "border-sky-500/30 bg-background shadow-[0_25px_70px_-50px_rgba(14,165,233,0.8)]"
                        : "border-border/60 bg-background/75 backdrop-blur-xl"
                    )}
                  >
                    <div
                      className={cn(
                        "pointer-events-none absolute end-4 top-4 size-16 rounded-full blur-2xl transition duration-500",
                        accent.glow
                      )}
                    />

                    <div className="relative flex h-full flex-col justify-between gap-8">
                      <div className="flex items-start justify-between gap-4">
                        <div
                          className={cn(
                            "flex size-[3.25rem] items-center justify-center rounded-[1.1rem] bg-gradient-to-br shadow-lg",
                            accent.icon
                          )}
                        >
                          <Icon className="size-5" />
                        </div>
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-sky-500/20 bg-sky-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-200">
                            <Zap className="size-3" />
                            Active
                          </span>
                        ) : null}
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-lg font-bold tracking-tight">
                          {technology.name}
                        </h3>
                        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                          {getTechnologyCategory(technology.icon)}
                        </p>
                      </div>
                    </div>
                  </Card>
                </button>
              </PortfolioReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
