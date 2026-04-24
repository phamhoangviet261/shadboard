import Image from "next/image"
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Mail,
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
  const contactLinks = socialLinksData.filter(({ href }) => !href.endsWith("#"))
  const featuredTechnologies = technologies.slice(0, 6)
  const navLinks = [
    { href: "#about", label: "About" },
    { href: "#technologies", label: "Stack" },
    { href: "#featured-projects", label: "Work" },
    { href: "#contact", label: "Contact" },
  ]
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
    <section className="relative overflow-hidden rounded-[2.25rem] border border-white/30 bg-background/[0.68] px-5 py-5 shadow-[0_40px_140px_-70px_rgba(14,165,233,0.55)] backdrop-blur-2xl dark:border-white/10 sm:px-7 sm:py-7 lg:px-8 lg:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.24),transparent_32%),radial-gradient(circle_at_84%_12%,rgba(244,114,182,0.22),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.16),transparent_34%)]" />
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent dark:via-white/20" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-multiply dark:mix-blend-screen"
        style={{
          backgroundImage: "url('/images/bg.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="relative mb-8 flex flex-wrap items-center justify-between gap-3 rounded-full border border-border/60 bg-background/55 p-2 backdrop-blur-xl">
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-bold text-background shadow-lg"
        >
          <span className="size-2 rounded-full bg-emerald-400" />
          {publicProfileContent.name}
        </a>
        <nav
          aria-label="Portfolio sections"
          className="flex flex-1 flex-wrap justify-end gap-1"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_31rem]">
        <div className="space-y-8">
          <PortfolioReveal delay={50}>
            <div className="inline-flex items-center gap-3 rounded-full border border-border/60 bg-background/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground backdrop-blur">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
              </span>
              Frontend Developer
            </div>
          </PortfolioReveal>

          <div className="space-y-5">
            <PortfolioReveal delay={120}>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                <span>{publicProfileContent.heroHeadline}</span>
                <span className="block bg-gradient-to-r from-cyan-500 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
                  Frontend with product-grade polish.
                </span>
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
              {!isPlaceholderContactValue(userData.email) ? (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-sky-500/25 bg-sky-500/10 px-6 text-sky-700 backdrop-blur hover:bg-sky-500/15 dark:text-sky-200"
                >
                  <a href={`mailto:${userData.email}`}>
                    Start a Conversation
                    <Mail className="ms-2 size-4" />
                  </a>
                </Button>
              ) : null}
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

          {contactLinks.length > 0 ? (
            <PortfolioReveal delay={560}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm font-semibold text-muted-foreground">
                  Connect
                </span>
                {contactLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-1 hover:border-sky-500/40 hover:text-sky-500"
                    aria-label={label}
                  >
                    <Icon className="size-4" />
                    <span>{label}</span>
                  </a>
                ))}
              </div>
            </PortfolioReveal>
          ) : null}
        </div>

        <PortfolioReveal delay={180}>
          <Card className="relative overflow-hidden rounded-[2rem] border-white/10 bg-slate-950 text-white shadow-[0_40px_120px_-60px_rgba(14,165,233,0.75)] transition-transform duration-500 hover:-rotate-1 hover:scale-[1.01]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.36),transparent_34%),radial-gradient(circle_at_100%_0%,rgba(236,72,153,0.22),transparent_32%),radial-gradient(circle_at_60%_100%,rgba(16,185,129,0.16),transparent_28%)]" />
            <div className="pointer-events-none absolute -right-20 top-20 size-52 rounded-full border border-white/10" />
            <div className="pointer-events-none absolute -right-8 top-32 size-32 rounded-full border border-white/10" />
            <Image
              src="/images/avatars/viet-avt-1.jfif"
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 480px"
              className="pointer-events-none object-contain object-right-bottom opacity-35"
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
                  <a
                    href={`mailto:${userData.email}`}
                    className="mt-3 inline-flex items-center gap-2 text-sm text-white/[0.8] transition-colors hover:text-white"
                  >
                    {userData.email}
                    <ArrowUpRight className="size-3.5" />
                  </a>
                </div>
              ) : null}
            </div>
          </Card>
        </PortfolioReveal>
      </div>
    </section>
  )
}
