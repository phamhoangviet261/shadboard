import { ArrowUpRight, Github, Layers3 } from "lucide-react"

import type { Project } from "../_data/portfolio"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  getDisplayHost,
  getProjectBadgeTone,
  getProjectTagIcon,
  isUsefulExternalLink,
} from "./portfolio-icon"
import { PortfolioReveal } from "./portfolio-reveal"
import { PortfolioSectionHeading } from "./portfolio-section-heading"

interface ProfileProjectsProps {
  projects: Project[]
}

export function ProfileProjects({ projects }: ProfileProjectsProps) {
  return (
    <section id="projects" className="scroll-mt-12 space-y-8">
      <PortfolioReveal>
        <PortfolioSectionHeading
          eyebrow="Projects"
          title="The full project archive, kept cleaner and more scannable after the featured showcase."
          description="This section intentionally shifts from cinematic highlights to a sharper archive view, so every project is easy to compare without repeating the same visual treatment."
          align="center"
        />
      </PortfolioReveal>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => {
          const host = getDisplayHost(project.url)
          const liveUrl = isUsefulExternalLink(project.url)
            ? project.url
            : undefined
          const sourceUrl = isUsefulExternalLink(project.source_code_link, {
            disallowGithubRoot: true,
          })
            ? project.source_code_link
            : undefined

          return (
            <PortfolioReveal key={project.name} delay={index * 90}>
              <Card className="group relative flex h-full flex-col overflow-hidden rounded-[1.9rem] border-border/60 bg-background/80 p-6 shadow-[0_25px_90px_-70px_rgba(15,23,42,0.65)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_35px_90px_-70px_rgba(14,165,233,0.6)]">
                <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-emerald-500" />

                <div className="flex h-full flex-col gap-5 pt-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      <Layers3 className="size-3.5" />
                      Project {String(index + 1).padStart(2, "0")}
                    </div>
                    {host ? (
                      <span className="inline-flex items-center rounded-full border border-border/60 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                        {host}
                      </span>
                    ) : null}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tight">
                      {project.name || "Untitled project"}
                    </h3>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {project.description ||
                        "Project details will be added soon."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(project.tags?.length
                      ? project.tags
                      : [{ name: "coming-soon" }]
                    ).map((tag) => {
                      const Icon = getProjectTagIcon(tag.name)

                      return (
                        <span
                          key={`${project.name}-${tag.name}`}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                            getProjectBadgeTone(tag.name)
                          )}
                        >
                          <Icon className="size-3.5" />
                          {tag.name}
                        </span>
                      )
                    })}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3 pt-2">
                    {liveUrl ? (
                      <Button asChild className="rounded-full px-5">
                        <a
                          href={liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Visit Project
                          <ArrowUpRight className="ms-2 size-4" />
                        </a>
                      </Button>
                    ) : null}

                    {sourceUrl ? (
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-full border-border/60 bg-background/70 px-5"
                      >
                        <a
                          href={sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Source Code
                          <Github className="ms-2 size-4" />
                        </a>
                      </Button>
                    ) : null}
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
