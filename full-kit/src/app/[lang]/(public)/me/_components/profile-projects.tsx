import Image from "next/image"
import { ArrowUpRight, Github } from "lucide-react"

import type { Project } from "../_data/portfolio"

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  getDisplayHost,
  getProjectAccent,
  getProjectBadgeTone,
  getProjectTagIcon,
  isUsefulExternalLink,
} from "./portfolio-icon"
import { PortfolioReveal } from "./portfolio-reveal"
import { PortfolioSectionHeading } from "./portfolio-section-heading"

interface ProfileProjectsProps {
  projects: Project[]
}

const artworkPaths = [
  "/images/illustrations/scenes/scene-03.svg",
  "/images/illustrations/scenes/scene-02.svg",
  "/images/illustrations/misc/welcome.svg",
]

export function ProfileProjects({ projects }: ProfileProjectsProps) {
  return (
    <section id="projects" className="scroll-mt-12 space-y-8">
      <PortfolioReveal>
        <PortfolioSectionHeading
          eyebrow="Projects"
          title="Selected builds presented as the portfolio’s visual centerpiece."
          description="These cards reuse the existing project dataset and elevate it with stronger presentation, layered artwork, and cleaner calls to action."
          align="center"
        />
      </PortfolioReveal>

      <div className="grid gap-6 xl:grid-cols-12">
        {projects.map((project, index) => {
          const isFeaturedProject = index === 0
          const ProjectTagIcon = getProjectTagIcon(project.tags?.[0]?.name)
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
            <PortfolioReveal
              key={project.name}
              delay={index * 120}
              className={cn(
                isFeaturedProject
                  ? "xl:col-span-7 xl:row-span-2"
                  : "xl:col-span-5"
              )}
            >
              <Card className="group h-full overflow-hidden rounded-[2rem] border-border/60 bg-background/75 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_40px_120px_-75px_rgba(59,130,246,0.7)]">
                <div
                  className={cn(
                    "relative overflow-hidden border-b border-white/10 p-6 text-white",
                    isFeaturedProject
                      ? "min-h-[20rem] sm:min-h-[24rem]"
                      : "min-h-[16rem] sm:min-h-[18rem]"
                  )}
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br",
                      getProjectAccent(index)
                    )}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_28%),radial-gradient(circle_at_20%_80%,rgba(15,23,42,0.4),transparent_38%)]" />
                  <Image
                    src={artworkPaths[index % artworkPaths.length]}
                    alt=""
                    fill
                    sizes="(max-width: 1280px) 100vw, 720px"
                    className="pointer-events-none object-contain object-bottom-right opacity-70 transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="relative flex h-full flex-col justify-between gap-8">
                    <div className="flex items-center justify-between gap-4">
                      <span className="inline-flex items-center rounded-full border border-white/[0.15] bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/[0.85] backdrop-blur">
                        {project.image || "project"}
                      </span>
                      {host ? (
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.15] bg-black/[0.15] px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
                          <ProjectTagIcon className="size-3.5" />
                          {host}
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold uppercase tracking-[0.32em] text-white/[0.65]">
                        {isFeaturedProject
                          ? "Featured Build"
                          : "Portfolio Build"}
                      </p>
                      <h3
                        className={cn(
                          "max-w-xl font-black tracking-tight",
                          isFeaturedProject
                            ? "text-3xl sm:text-4xl"
                            : "text-2xl sm:text-3xl"
                        )}
                      >
                        {project.name || "Untitled project"}
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="flex h-full flex-col gap-5 p-6 sm:p-7">
                  <p className="text-sm leading-7 text-muted-foreground">
                    {project.description ||
                      "Project details will be added soon."}
                  </p>

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
                            getProjectBadgeTone(tag.color)
                          )}
                        >
                          <Icon className="size-3.5" />
                          {tag.name}
                        </span>
                      )
                    })}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3">
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
