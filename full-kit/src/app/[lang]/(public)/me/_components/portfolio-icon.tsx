import {
  Boxes,
  Braces,
  Cable,
  Code2,
  Cuboid,
  Database,
  Sparkles,
  SwatchBook,
} from "lucide-react"
import {
  SiCss3,
  SiDocker,
  SiFigma,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiReact,
  SiRedux,
  SiSass,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si"

import type { IconType as AppIconType } from "@/types"

function normalize(value?: string) {
  return value?.toLowerCase().replace(/\s+/g, "").replace(/[._-]/g, "")
}

const portfolioIconMap: Record<string, AppIconType> = {
  css: SiCss3,
  css3: SiCss3,
  docker: SiDocker,
  figma: SiFigma,
  git: SiGit,
  html: SiHtml5,
  html5: SiHtml5,
  javascript: SiJavascript,
  mongodb: SiMongodb,
  nextjs: SiNextdotjs,
  nodejs: SiNodedotjs,
  react: SiReact,
  reactjs: SiReact,
  redux: SiRedux,
  reduxtoolkit: SiRedux,
  scss: SiSass,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  threejs: SiThreedotjs,
  typescript: SiTypescript,
  vuejs: SiVuedotjs,
}

const projectTagIconMap: Record<string, AppIconType> = {
  css: SiCss3,
  nextjs: SiNextdotjs,
  react: SiReact,
  restapi: Cable,
  scss: SiSass,
  supabase: Database,
  tailwind: SiTailwindcss,
  vuejs: SiVuedotjs,
}

export function getPortfolioIcon(key?: string) {
  return portfolioIconMap[normalize(key) ?? ""] ?? Code2
}

export function getProjectTagIcon(name?: string) {
  return projectTagIconMap[normalize(name) ?? ""] ?? Sparkles
}

export function getTechnologyCategory(key?: string) {
  const normalizedKey = normalize(key)

  if (
    ["html", "html5", "css", "css3", "tailwind", "tailwindcss"].includes(
      normalizedKey ?? ""
    )
  ) {
    return "Interface craft"
  }

  if (
    [
      "javascript",
      "typescript",
      "react",
      "reactjs",
      "redux",
      "reduxtoolkit",
      "nextjs",
      "vuejs",
    ].includes(normalizedKey ?? "")
  ) {
    return "Frontend systems"
  }

  if (["nodejs", "mongodb", "restapi"].includes(normalizedKey ?? "")) {
    return "Platform logic"
  }

  if (["figma", "docker", "git", "scss"].includes(normalizedKey ?? "")) {
    return "Workflow tooling"
  }

  if (normalizedKey === "threejs") {
    return "Interactive visuals"
  }

  return "Product engineering"
}

export function getTechnologyAccent(index: number) {
  const accentSets = [
    {
      container:
        "from-cyan-500/20 via-sky-500/[0.08] to-background dark:to-background",
      icon: "from-cyan-500 to-sky-500 text-white",
      glow: "bg-cyan-500/30",
    },
    {
      container:
        "from-fuchsia-500/[0.18] via-pink-500/[0.08] to-background dark:to-background",
      icon: "from-fuchsia-500 to-pink-500 text-white",
      glow: "bg-fuchsia-500/30",
    },
    {
      container:
        "from-emerald-500/[0.18] via-teal-500/[0.08] to-background dark:to-background",
      icon: "from-emerald-500 to-teal-500 text-white",
      glow: "bg-emerald-500/30",
    },
    {
      container:
        "from-amber-500/[0.18] via-orange-500/[0.08] to-background dark:to-background",
      icon: "from-amber-500 to-orange-500 text-white",
      glow: "bg-amber-500/30",
    },
  ]

  return accentSets[index % accentSets.length]
}

export function getProjectAccent(index: number) {
  const accents = [
    "from-cyan-500 via-sky-600 to-blue-700",
    "from-fuchsia-500 via-pink-600 to-rose-700",
    "from-emerald-500 via-teal-600 to-cyan-700",
  ]

  return accents[index % accents.length]
}

export function getProjectBadgeTone(color?: string) {
  switch (color) {
    case "blue-text-gradient":
      return "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-200"
    case "green-text-gradient":
      return "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-200"
    case "pink-text-gradient":
      return "border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-200"
    default:
      return "border-border/60 bg-background/70 text-muted-foreground"
  }
}

export function getDisplayHost(url?: string) {
  try {
    const parsedUrl = new URL(url ?? "")

    return parsedUrl.hostname.replace(/^www\./, "")
  } catch {
    return undefined
  }
}

export function isUsefulExternalLink(
  url?: string,
  options?: { disallowGithubRoot?: boolean }
) {
  try {
    const parsedUrl = new URL(url ?? "")
    const isHttp =
      parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:"

    if (!isHttp) {
      return false
    }

    if (
      options?.disallowGithubRoot &&
      parsedUrl.hostname === "github.com" &&
      (parsedUrl.pathname === "/" || parsedUrl.pathname === "")
    ) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export const portfolioFeatureIcons = [Boxes, Braces, Cuboid, SwatchBook]
