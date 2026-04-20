import Image from "next/image"
import {
  ArrowDownRight,
  Building2,
  Sparkles,
  Workflow,
  Wrench,
} from "lucide-react"

import type { Experience, Project, Technology } from "../_data/portfolio"

import {
  isPlaceholderContactValue,
  publicProfileContent,
} from "../_data/profile-content"
import { socialLinksData } from "@/data/social-links"
import { userData } from "@/data/user"

import { getInitials } from "@/lib/utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getPortfolioIcon, portfolioFeatureIcons } from "./portfolio-icon"
import { PortfolioReveal } from "./portfolio-reveal"

interface ProfileHeroProps {
  technologies: Technology[]
  experiences: Experience[]
  projects: Project[]
}

export function ProfileHero({
  technologies,
  experiences,
  projects,
}: ProfileHeroProps) {
  const currentExperience = experiences.at(-1)
  const socialLinks = socialLinksData.filter(({ href }) =>
    /^https?:\/\//.test(href)
  )
  const featuredTechnologies = technologies.slice(0, 6)
  const focusCards = [
    {
      label: "Years Experience",
      value: `${publicProfileContent.yearsExperience}+`,
    },
    {
      label: "Experience Chapters",
      value: String(experiences.length),
    },
    {
      label: "Featured Builds",
      value: String(projects.length),
    },
  ]

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-background/[0.65] px-6 py-8 shadow-[0_40px_120px_-60px_rgba(14,165,233,0.45)] backdrop-blur-xl sm:px-8 sm:py-10 lg:px-10 lg:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_85%_15%,rgba(236,72,153,0.18),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.14),transparent_35%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: "url('/images/bg.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_30rem]">
        <div className="space-y-8">
          <PortfolioReveal delay={50}>
            <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              Premium frontend profile
            </div>
          </PortfolioReveal>

          <div className="space-y-5">
            <PortfolioReveal delay={120}>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                {publicProfileContent.heroHeadline}
              </h1>
            </PortfolioReveal>

            <PortfolioReveal delay={200}>
              <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                {publicProfileContent.heroSummary}
              </p>
            </PortfolioReveal>
          </div>

          <PortfolioReveal delay={260}>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <a href="#featured-projects">
                  Explore Featured Work
                  <ArrowDownRight className="ms-2 size-4" />
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-border/60 bg-background/70 px-6 backdrop-blur"
              >
                <a href="#about">Read Tech Philosophy</a>
              </Button>
            </div>
          </PortfolioReveal>

          <PortfolioReveal delay={320}>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 backdrop-blur">
                <Sparkles className="size-4 text-sky-500" />
                <span>{publicProfileContent.heroHighlights[0]}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 backdrop-blur">
                <Workflow className="size-4 text-fuchsia-500" />
                <span>{publicProfileContent.heroHighlights[1]}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 backdrop-blur">
                <Wrench className="size-4 text-emerald-500" />
                <span>{publicProfileContent.heroHighlights[3]}</span>
              </div>
            </div>
          </PortfolioReveal>

          <div className="grid gap-3 sm:grid-cols-3">
            {focusCards.map((card, index) => (
              <PortfolioReveal key={card.label} delay={380 + index * 60}>
                <Card className="rounded-[1.5rem] border-border/60 bg-background/70 p-5 backdrop-blur-xl">
                  <p className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="mt-3 text-3xl font-black tracking-tight">
                    {card.value}
                  </p>
                </Card>
              </PortfolioReveal>
            ))}
          </div>

          {socialLinks.length > 0 ? (
            <PortfolioReveal delay={560}>
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground transition-transform duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:text-sky-500"
                    aria-label={label}
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </PortfolioReveal>
          ) : null}
        </div>

        <PortfolioReveal delay={180}>
          <Card className="relative overflow-hidden rounded-[2rem] border-white/10 bg-slate-950 text-white shadow-[0_40px_120px_-60px_rgba(14,165,233,0.75)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.36),transparent_34%),radial-gradient(circle_at_100%_0%,rgba(236,72,153,0.22),transparent_32%),radial-gradient(circle_at_60%_100%,rgba(16,185,129,0.16),transparent_28%)]" />
            <Image
              src="/images/illustrations/scenes/scene-04.svg"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="pointer-events-none object-contain object-bottom-right opacity-35"
            />

            <div className="relative flex h-full flex-col gap-6 p-6 sm:p-7">
              <div className="flex items-center justify-between gap-3">
                <Badge
                  variant="outline"
                  className="border-white/[0.15] bg-white/10 text-white"
                >
                  Profile Pulse
                </Badge>
                <span className="rounded-full bg-emerald-400/[0.15] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
                  Active
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Avatar className="size-20">
                  <AvatarImage
                    src={userData.avatar}
                    alt={userData.name}
                    className="rounded-[1.5rem] border border-white/10 bg-white/10 object-cover"
                  />
                  <AvatarFallback className="rounded-[1.5rem] border border-white/10 bg-white/10 text-lg font-semibold">
                    {getInitials(userData.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight">
                    {publicProfileContent.name}
                  </h2>
                  <p className="text-sm text-white/70">
                    {publicProfileContent.tagline}
                  </p>
                  <div className="inline-flex items-center gap-2 text-sm text-white/60">
                    <Building2 className="size-4" />
                    <span>
                      {currentExperience?.company_name || "Current company"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/[0.45]">
                    Current Chapter
                  </p>
                  <p className="mt-3 text-lg font-semibold">
                    {currentExperience?.title || "Frontend specialist"}
                  </p>
                  <p className="mt-1 text-sm text-white/[0.65]">
                    {currentExperience?.date || "Ongoing"}
                  </p>
                </div>

                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/[0.45]">
                    Current Focus
                  </p>
                  <div className="mt-3 space-y-1">
                    <p className="text-lg font-semibold">
                      {publicProfileContent.role}
                    </p>
                    <p className="text-sm text-white/[0.65]">
                      {publicProfileContent.currentFocus}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/[0.45]">
                  Core Toolkit
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {featuredTechnologies.map((technology, index) => {
                    const Icon = getPortfolioIcon(technology.icon)
                    const FeatureIcon =
                      portfolioFeatureIcons[
                        index % portfolioFeatureIcons.length
                      ]

                    return (
                      <div
                        key={technology.name}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.08] px-3 py-2 text-sm text-white/[0.85]"
                      >
                        <div className="flex size-8 items-center justify-center rounded-full bg-white/10">
                          <Icon className="size-4" />
                        </div>
                        <span>{technology.name || "Technology"}</span>
                        <FeatureIcon className="size-3.5 text-white/[0.45]" />
                      </div>
                    )
                  })}
                </div>
              </div>

              {!isPlaceholderContactValue(userData.email) ? (
                <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/[0.45]">
                    Contact
                  </p>
                  <p className="mt-3 text-sm text-white/[0.8]">
                    {userData.email}
                  </p>
                </div>
              ) : null}
            </div>
          </Card>
        </PortfolioReveal>
      </div>
    </section>
  )
}
