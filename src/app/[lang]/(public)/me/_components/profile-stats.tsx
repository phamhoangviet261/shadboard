"use client"

import { useEffect, useRef, useState } from "react"

import type { AchievementStat } from "../_data/portfolio-derivatives"

import { cn } from "@/lib/utils"

import { Card } from "@/components/ui/card"
import { PortfolioReveal } from "./portfolio-reveal"
import { PortfolioSectionHeading } from "./portfolio-section-heading"

interface ProfileStatsProps {
  stats: AchievementStat[]
}

const accentMap: Record<AchievementStat["accent"], string> = {
  cyan: "from-cyan-500/25 to-sky-500/10",
  emerald: "from-emerald-500/25 to-teal-500/10",
  amber: "from-amber-500/25 to-orange-500/10",
  fuchsia: "from-fuchsia-500/25 to-pink-500/10",
  violet: "from-violet-500/25 to-indigo-500/10",
}

function AnimatedCounter({
  value,
  suffix,
}: {
  value: number
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    const node = ref.current

    if (!node) return

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    if (prefersReducedMotion) {
      setDisplayValue(value)
      return
    }

    let frame = 0
    let hasStarted = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted) return

        hasStarted = true
        const startTime = performance.now()
        const duration = 1200

        const animate = (currentTime: number) => {
          const progress = Math.min((currentTime - startTime) / duration, 1)
          const easedProgress = 1 - Math.pow(1 - progress, 3)
          setDisplayValue(Math.round(value * easedProgress))

          if (progress < 1) {
            frame = window.requestAnimationFrame(animate)
          }
        }

        frame = window.requestAnimationFrame(animate)
        observer.disconnect()
      },
      { threshold: 0.35 }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
      if (frame) {
        window.cancelAnimationFrame(frame)
      }
    }
  }, [value])

  return (
    <span ref={ref}>
      {displayValue.toLocaleString("en")}
      {suffix}
    </span>
  )
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <section id="stats" className="scroll-mt-12 space-y-8">
      <PortfolioReveal>
        <PortfolioSectionHeading
          eyebrow="Stats / Achievements"
          title="A signal board pulled from the real experience, technology, and project data behind this portfolio."
          description="These counters are derived from the existing portfolio content and profile narrative, not invented filler metrics."
          align="center"
        />
      </PortfolioReveal>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat, index) => (
          <PortfolioReveal key={stat.label} delay={index * 80}>
            <Card
              className={cn(
                "relative overflow-hidden rounded-[1.75rem] border-border/60 bg-gradient-to-br p-6 backdrop-blur-xl",
                accentMap[stat.accent]
              )}
            >
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%)]" />

              <div className="relative space-y-5">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                    {stat.eyebrow}
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                </div>

                <p className="text-4xl font-black tracking-tight sm:text-5xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>

                <p className="text-sm leading-7 text-muted-foreground">
                  {stat.description}
                </p>
              </div>
            </Card>
          </PortfolioReveal>
        ))}
      </div>
    </section>
  )
}
