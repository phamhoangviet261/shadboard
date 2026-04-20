import Image from "next/image"
import { ArrowUpRight, Sparkles, Workflow } from "lucide-react"

import type { Technology } from "../_data/portfolio"

import {
  isPlaceholderContactValue,
  publicProfileContent,
} from "../_data/profile-content"
import { userData } from "@/data/user"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PortfolioReveal } from "./portfolio-reveal"

interface ProfileCtaProps {
  technologies: Technology[]
}

export function ProfileCta({ technologies }: ProfileCtaProps) {
  const topTechnologies = technologies.slice(0, 4)
  const hasPublicEmail = !isPlaceholderContactValue(userData.email)
  const primaryAction = hasPublicEmail
    ? {
        href: `mailto:${userData.email}`,
        label: "Start a Project",
      }
    : {
        href: "#featured-projects",
        label: "Explore Featured Work",
      }
  const secondaryAction = hasPublicEmail
    ? {
        href: "#experiences",
        label: "Review Career Journey",
      }
    : {
        href: "#about",
        label: "Read Tech Philosophy",
      }

  return (
    <section id="contact" className="scroll-mt-12">
      <PortfolioReveal>
        <Card className="relative overflow-hidden rounded-[2.5rem] border-border/60 bg-slate-950 px-7 py-8 text-white shadow-[0_45px_140px_-80px_rgba(14,165,233,0.75)] sm:px-8 sm:py-10 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.34),transparent_32%),radial-gradient(circle_at_100%_0%,rgba(236,72,153,0.2),transparent_28%),radial-gradient(circle_at_40%_100%,rgba(16,185,129,0.14),transparent_34%)]" />
          <Image
            src="/images/illustrations/scenes/scene-04.svg"
            alt=""
            fill
            sizes="(max-width: 1280px) 100vw, 1000px"
            className="pointer-events-none object-contain object-bottom-right opacity-30"
          />

          <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end">
            <div className="space-y-6">
              <span className="inline-flex items-center rounded-full border border-white/[0.15] bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
                Call To Action
              </span>

              <div className="space-y-4">
                <h2 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  {publicProfileContent.name} builds interfaces where visual
                  quality and frontend engineering reinforce each other.
                </h2>
                <p className="max-w-2xl text-base leading-8 text-white/75">
                  {publicProfileContent.tagline}{" "}
                  {publicProfileContent.availabilityLabel}.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full px-6">
                  <a href={primaryAction.href}>
                    {primaryAction.label}
                    <ArrowUpRight className="ms-2 size-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full border-white/20 bg-white/10 px-6 text-white hover:bg-white/15 hover:text-white"
                >
                  <a href={secondaryAction.href}>{secondaryAction.label}</a>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {topTechnologies.map((technology) => (
                  <span
                    key={technology.name}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.08] px-3 py-1.5 text-sm text-white/80"
                  >
                    {technology.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/[0.45]">
                  Availability
                </p>
                <div className="mt-3 inline-flex items-start gap-3 text-white/90">
                  <Sparkles className="mt-0.5 size-4 shrink-0" />
                  <span className="text-sm leading-6">
                    {publicProfileContent.availabilityLabel}
                  </span>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.08] p-5 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/[0.45]">
                  Current Focus
                </p>
                <div className="mt-3 inline-flex items-start gap-3 text-white/90">
                  <Workflow className="mt-0.5 size-4 shrink-0" />
                  <span className="text-sm leading-6">
                    {publicProfileContent.currentFocus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </PortfolioReveal>
    </section>
  )
}
