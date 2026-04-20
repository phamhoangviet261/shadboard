import type { Experience, Project, Technology } from "./portfolio"

import { getTechnologyCategory } from "../_components/portfolio-icon"
import { publicProfileContent } from "./profile-content"

export interface AchievementStat {
  eyebrow: string
  label: string
  value: number
  suffix?: string
  description: string
  accent: "cyan" | "fuchsia" | "emerald" | "amber" | "violet"
}

export interface SideExperiment {
  title: string
  description: string
  tags: string[]
  status: string
  icon?: string
  variant: "feature" | "tall" | "default"
}

export interface FeaturedProjectHighlight {
  project: Project
  kicker: string
  accent: string
  artwork: string
}

function normalize(value?: string) {
  return value?.toLowerCase().replace(/\s+/g, "").replace(/[._-]/g, "")
}

export function getTechnologyAliases(technology: Technology) {
  const normalized = normalize(technology.icon ?? technology.name)

  switch (normalized) {
    case "html":
    case "html5":
      return ["html", "html5"]
    case "css":
    case "css3":
      return ["css", "css3"]
    case "react":
    case "reactjs":
      return ["react", "reactjs"]
    case "tailwind":
    case "tailwindcss":
      return ["tailwind", "tailwindcss"]
    case "redux":
    case "reduxtoolkit":
      return ["redux", "reduxtoolkit"]
    case "nextjs":
      return ["nextjs"]
    case "javascript":
      return ["javascript", "js"]
    case "typescript":
      return ["typescript", "ts"]
    case "scss":
    case "sass":
      return ["scss", "sass"]
    default:
      return normalized ? [normalized] : []
  }
}

export function projectUsesTechnology(
  project: Project,
  technology: Technology
) {
  const aliases = getTechnologyAliases(technology)

  return (
    project.tags?.some((tag) => aliases.includes(normalize(tag.name) ?? "")) ??
    false
  )
}

export function countProjectsUsingTechnology(
  technology: Technology,
  projects: Project[]
) {
  return projects.filter((project) =>
    projectUsesTechnology(project, technology)
  ).length
}

export function getTechnologyDescription(
  technology: Technology,
  projects: Project[]
) {
  const category = getTechnologyCategory(technology.icon)
  const projectUsageCount = countProjectsUsingTechnology(technology, projects)
  const normalized = normalize(technology.icon ?? technology.name)

  switch (normalized) {
    case "nextjs":
      return `The routing and product shell backbone for ${projectUsageCount || 1} featured build${projectUsageCount === 1 ? "" : "s"}, chosen for fast navigation, scalable structure, and strong developer ergonomics.`
    case "react":
    case "reactjs":
      return "The interaction layer used to keep interfaces responsive, component-driven, and easy to evolve as product scope grows."
    case "tailwind":
    case "tailwindcss":
      return "The visual systems engine for shipping refined spacing, states, and consistency without slowing down iteration speed."
    case "typescript":
      return "The guardrail that keeps complex UI logic readable and safer as the component surface expands."
    case "threejs":
      return "A playground for motion-rich storytelling and immersive interface moments when a product needs personality beyond flat layouts."
    case "figma":
      return "Used to close the loop between layout decisions, component thinking, and handoff-quality interface polish."
    default:
      return `${technology.name} currently sits in the ${category.toLowerCase()} layer of the stack, supporting the shipped work shown throughout this portfolio.`
  }
}

function getLargestImpactPercentage(experiences: Experience[]) {
  let largestImpact = 0

  experiences.forEach((experience) => {
    experience.points?.forEach((point) => {
      const matches = point.match(/(\d+)\s*%/g)

      matches?.forEach((match) => {
        const numericValue = Number.parseInt(match.replace("%", "").trim(), 10)

        if (Number.isFinite(numericValue)) {
          largestImpact = Math.max(largestImpact, numericValue)
        }
      })
    })
  })

  return largestImpact
}

export function getAchievementStats(
  technologies: Technology[],
  experiences: Experience[],
  projects: Project[]
): AchievementStat[] {
  const largestImpactPercentage = getLargestImpactPercentage(experiences)
  const impactValue =
    largestImpactPercentage ||
    Math.max(publicProfileContent.yearsExperience * 10, 40)

  return [
    {
      eyebrow: "Experience",
      label: "Years building frontend products",
      value: publicProfileContent.yearsExperience,
      suffix: "+",
      description:
        "Grounded in the profile bio and aligned with the work shown throughout the portfolio.",
      accent: "cyan",
    },
    {
      eyebrow: "Stack",
      label: "Technologies in active rotation",
      value: technologies.length,
      description:
        "Pulled from the real technology dataset already powering the portfolio sections.",
      accent: "emerald",
    },
    {
      eyebrow: "Journey",
      label: "Career chapters documented",
      value: experiences.length,
      description:
        "Each timeline entry reflects a real experience record already present in the codebase.",
      accent: "fuchsia",
    },
    {
      eyebrow: "Portfolio",
      label: "Projects showcased",
      value: projects.length,
      description:
        "The current body of work surfaced directly from the existing project data.",
      accent: "amber",
    },
    {
      eyebrow: "Impact",
      label: "Largest delivery callout",
      value: impactValue,
      suffix: "%",
      description:
        "Derived from the strongest percentage-based outcome mentioned in the experience highlights.",
      accent: "violet",
    },
  ]
}

export function getFeaturedProjectHighlights(
  projects: Project[]
): FeaturedProjectHighlight[] {
  const highlightMeta = [
    {
      kicker: "Flagship Platform",
      accent: "from-cyan-500 via-sky-600 to-blue-700",
      artwork: "/images/illustrations/scenes/scene-03.svg",
    },
    {
      kicker: "Deep Data Layer",
      accent: "from-fuchsia-500 via-pink-600 to-rose-700",
      artwork: "/images/illustrations/scenes/scene-02.svg",
    },
  ]

  return projects.slice(0, 2).map((project, index) => ({
    project,
    ...highlightMeta[index % highlightMeta.length],
  }))
}

export function getSideExperiments(
  technologies: Technology[],
  projects: Project[]
): SideExperiment[] {
  const leadProject = projects[0]?.name ?? "Primary Platform"
  const dataProject = projects[1]?.name ?? leadProject
  const careerProject = projects[2]?.name ?? leadProject
  const hasThreeJs = technologies.some(
    (technology) => normalize(technology.icon) === "threejs"
  )
  const motionTechnology =
    technologies.find((technology) => normalize(technology.icon) === "threejs")
      ?.name ?? "Motion studies"
  const designTechnology =
    technologies.find((technology) => normalize(technology.icon) === "figma")
      ?.name ?? "Design systems"

  return [
    {
      title: "Spatial Discovery Playground",
      description: `A concept lane inspired by ${leadProject} and ${dataProject}, focused on richer search, filters, and guided decision flows.`,
      tags: [leadProject, dataProject, "Search UX"],
      status: "Prototype lane",
      icon: "nextjs",
      variant: "feature",
    },
    {
      title: hasThreeJs
        ? "3D Interface Storytelling"
        : "Interactive Motion Studies",
      description: `A visual sandbox exploring how ${motionTechnology} can add drama and personality to product storytelling without stealing focus from usability.`,
      tags: [motionTechnology, "Micro-interactions", "Visual depth"],
      status: "Experimental",
      icon: hasThreeJs ? "threejs" : "reactjs",
      variant: "tall",
    },
    {
      title: "Design-to-Code Sprint Notes",
      description: `A compact lab for turning ${careerProject}-style content flows into tighter interface systems using ${designTechnology} and fast frontend iteration.`,
      tags: [careerProject, designTechnology, "UI systems"],
      status: "Weekend build",
      icon: "figma",
      variant: "default",
    },
  ]
}
