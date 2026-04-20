import Image from "next/image"
import { ArrowUpRight, Github } from "lucide-react"

import type { Project } from "../_data/portfolio"

import { getFeaturedProjectHighlights } from "../_data/portfolio-derivatives"

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

interface ProfileFeaturedProjectsProps {
  projects: Project[]
}

export function ProfileFeaturedProjects({
  projects,
}: ProfileFeaturedProjectsProps) {
  const highlights = getFeaturedProjectHighlights(projects)
  const archivePreview = projects.slice(2)

  return (
    <section id="featured-projects" className="scroll-mt-12 space-y-8">
      <PortfolioReveal>
        <PortfolioSectionHeading
          eyebrow="Featured Projects"
          title="Large-format project highlights designed to carry the page visually."
          description="These highlights reuse the existing project data, but give the strongest builds extra room for narrative, atmosphere, and stronger call-to-action framing."
          align="center"
        />
      </PortfolioReveal>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {highlights[0] ? (
          <PortfolioReveal delay={80}>
            <FeaturedProjectCard
              project={highlights[0].project}
              kicker={highlights[0].kicker}
              accent={highlights[0].accent}
              artwork={highlights[0].artwork}
              large
            />
          </PortfolioReveal>
        ) : null}

        <div className="grid gap-6">
          {highlights[1] ? (
            <PortfolioReveal delay={160}>
              <FeaturedProjectCard
                project={highlights[1].project}
                kicker={highlights[1].kicker}
                accent={highlights[1].accent}
                artwork={highlights[1].artwork}
              />
            </PortfolioReveal>
          ) : null}

          <PortfolioReveal delay={220}>
            <Card className="rounded-[2rem] border-border/60 bg-background/75 p-7 backdrop-blur-xl">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    Archive Preview
                  </p>
                  <h3 className="text-2xl font-black tracking-tight">
                    More shipped work follows below.
                  </h3>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4">
                    <p className="text-sm text-muted-foreground">
                      Total builds
                    </p>
                    <p className="mt-2 text-3xl font-black">
                      {projects.length}
                    </p>
                  </div>
                  <div className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4 sm:col-span-2">
                    <p className="text-sm text-muted-foreground">
                      Also included
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(archivePreview.length > 0
                        ? archivePreview
                        : projects
                      ).map((project) => (
                        <span
                          key={project.name}
                          className="inline-flex items-center rounded-full border border-border/60 bg-background px-3 py-1 text-sm font-medium"
                        >
                          {project.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <Button asChild className="rounded-full px-5">
                  <a href="#projects">
                    Browse Full Project Archive
                    <ArrowUpRight className="ms-2 size-4" />
                  </a>
                </Button>
              </div>
            </Card>
          </PortfolioReveal>
        </div>
      </div>
    </section>
  )
}

function FeaturedProjectCard({
  project,
  kicker,
  accent,
  artwork,
  large = false,
}: {
  project: Project
  kicker: string
  accent: string
  artwork: string
  large?: boolean
}) {
  const host = getDisplayHost(project.url)
  const liveUrl = isUsefulExternalLink(project.url) ? project.url : undefined
  const sourceUrl = isUsefulExternalLink(project.source_code_link, {
    disallowGithubRoot: true,
  })
    ? project.source_code_link
    : undefined

  return (
    <Card className="group relative h-full overflow-hidden rounded-[2rem] border-border/60 bg-slate-950 text-white shadow-[0_40px_120px_-75px_rgba(14,165,233,0.65)]">
      <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_24%),radial-gradient(circle_at_0%_100%,rgba(15,23,42,0.45),transparent_40%)]" />
      <Image
        src={artwork}
        alt=""
        fill
        sizes="(max-width: 1280px) 100vw, 720px"
        className="pointer-events-none object-contain object-bottom-right opacity-70 transition-transform duration-500 group-hover:scale-105"
      />

      <div
        className={`relative flex h-full flex-col justify-between gap-10 p-7 sm:p-8 ${
          large ? "min-h-[28rem]" : "min-h-[20rem]"
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full border border-white/[0.15] bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/80 backdrop-blur">
            {kicker}
          </span>
          {host ? (
            <span className="inline-flex items-center rounded-full border border-white/[0.15] bg-black/[0.15] px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
              {host}
            </span>
          ) : null}
        </div>

        <div className="max-w-2xl space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/[0.65]">
              {project.image || "project"}
            </p>
            <h3
              className={`font-black tracking-tight ${
                large ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
              }`}
            >
              {project.name || "Untitled project"}
            </h3>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
            {project.description || "Project details will be added soon."}
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
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getProjectBadgeTone(tag.color)}`}
                >
                  <Icon className="size-3.5" />
                  {tag.name}
                </span>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {liveUrl ? (
            <Button asChild className="rounded-full px-5">
              <a href={liveUrl} target="_blank" rel="noopener noreferrer">
                Visit Project
                <ArrowUpRight className="ms-2 size-4" />
              </a>
            </Button>
          ) : null}
          {sourceUrl ? (
            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/20 bg-white/10 px-5 text-white hover:bg-white/15 hover:text-white"
            >
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                Source Code
                <Github className="ms-2 size-4" />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </Card>
  )
}
