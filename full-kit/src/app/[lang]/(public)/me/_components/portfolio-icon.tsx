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

const badgeToneMap: Record<string, string> = {
  react: "border-cyan-500 bg-cyan-500/30 text-cyan-900",
  nextjs: "border-zinc-600 bg-white/80 text-zinc-900",
  tailwind: "border-sky-500 bg-sky-500/30 text-sky-900",
  typescript: "border-blue-600 bg-blue-600/30 text-blue-900",
  node: "border-green-600 bg-green-600/30 text-green-900",
  postgresql: "border-indigo-600 bg-indigo-600/30 text-indigo-900",
  aws: "border-amber-500 bg-amber-500/30 text-amber-900",
  docker: "border-blue-500 bg-blue-500/30 text-blue-900",
  git: "border-rose-500 bg-rose-500/30 text-rose-900",
  figma: "border-pink-500 bg-pink-500/30 text-pink-900",

  vuejs: "border-emerald-600 bg-emerald-600/30 text-emerald-900",
  restapi: "border-orange-500 bg-orange-500/30 text-orange-900",
  scss: "border-fuchsia-500 bg-fuchsia-500/30 text-fuchsia-900",
  supabase: "border-lime-600 bg-lime-600/30 text-lime-900",
  css: "border-blue-700 bg-blue-700/30 text-blue-900",
}

export function getProjectBadgeTone(tag: string) {
  return (
    badgeToneMap[tag] || "border-border bg-background text-muted-foreground"
  )
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
