export interface PublicProfileContent {
  name: string
  role: string
  tagline: string
  yearsExperience: number
  heroHeadline: string
  heroSummary: string
  aboutIntro: string
  aboutParagraphs: string[]
  currentFocus: string
  focusAreas: string[]
  heroHighlights: string[]
  philosophyPillars: Array<{
    eyebrow: string
    title: string
    description: string
  }>
  availabilityLabel: string
}

export const publicProfileContent: PublicProfileContent = {
  name: "Viet Pham",
  role: "Frontend Developer",
  tagline:
    "Frontend Developer focused on building modern, performant, and visually engaging web experiences.",
  yearsExperience: 4,
  heroHeadline:
    "Viet Pham builds modern, performant, and visually engaging web experiences.",
  heroSummary:
    "Frontend Developer with 5+ years of experience building modern, responsive, and scalable applications using React, Next.js, TypeScript, and TailwindCSS. The focus stays on smooth UX, reusable UI systems, and solid engineering behind every visual detail.",
  aboutIntro:
    "I am a Frontend Developer with around 5+ years of experience building modern, responsive, and scalable web applications.",
  aboutParagraphs: [
    "I specialize in React and Next.js, with strong experience in TypeScript, TailwindCSS, and building clean, reusable UI systems. I enjoy crafting smooth user experiences, optimizing performance, and turning complex ideas into intuitive interfaces.",
    "Over the years, I have worked on multiple real-world projects, including deploying and managing applications on VPS, handling CI/CD, and integrating modern frontend architectures. I am passionate about creating visually appealing products with solid engineering behind them, and I continuously explore new technologies to improve both user experience and developer experience.",
  ],
  currentFocus:
    "Currently, I focus on building high-quality web applications and experimenting with creative portfolio designs.",
  focusAreas: [
    "React",
    "Next.js",
    "TypeScript",
    "TailwindCSS",
    "Reusable UI Systems",
    "Performance Optimization",
    "VPS Deployment",
    "CI/CD Workflows",
  ],
  heroHighlights: [
    "5+ years shipping modern frontend work",
    "React + Next.js application architecture",
    "TypeScript + TailwindCSS UI systems",
    "VPS deployment and CI/CD workflows",
  ],
  philosophyPillars: [
    {
      eyebrow: "01 Reusable UI Systems",
      title: "Clean foundations matter more than one-off visuals.",
      description:
        "I prefer interface systems that stay readable, scalable, and reusable as product scope grows instead of relying on fragile screen-by-screen styling.",
    },
    {
      eyebrow: "02 Performance And UX",
      title: "A fast experience feels clearer, sharper, and more trustworthy.",
      description:
        "Performance work is part of the design process for me. Smooth interactions, lightweight rendering, and clear flows directly improve how a product feels.",
    },
    {
      eyebrow: "03 Engineering Behind The Visuals",
      title: "Polished products need delivery discipline behind the scenes.",
      description:
        "I enjoy pairing frontend craft with practical engineering, from component architecture to VPS deployment, CI/CD, and the details that keep products stable after launch.",
    },
  ],
  availabilityLabel: "Open to building high-quality product experiences",
}

export function isPlaceholderContactValue(value?: string) {
  if (!value) return true

  const normalizedValue = value.trim().toLowerCase()

  return (
    normalizedValue.length === 0 ||
    normalizedValue.includes("example.com") ||
    normalizedValue === "+15558675309"
  )
}
