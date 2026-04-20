import type { Metadata } from "next"

import { experiences, projects, technologies } from "./_data/portfolio"
import { getAchievementStats } from "./_data/portfolio-derivatives"

import { ProfileAbout } from "./_components/profile-about"
import { ProfileCta } from "./_components/profile-cta"
import { ProfileExperiences } from "./_components/profile-experiences"
import { ProfileFeaturedProjects } from "./_components/profile-featured-projects"
import { ProfileHero } from "./_components/profile-hero"
import { ProfileModeToggle } from "./_components/profile-mode-toggle"
import { ProfileProjects } from "./_components/profile-projects"
import { ProfileSideProjects } from "./_components/profile-side-projects"
import { ProfileStats } from "./_components/profile-stats"
import { ProfileTechnologies } from "./_components/profile-technologies"

export const metadata: Metadata = {
  title: "Pham Hoang Viet",
  description:
    "Frontend Developer with 5+ years of experience building modern, responsive, and scalable applications using React, Next.js, TypeScript, and TailwindCSS. The focus stays on smooth UX, reusable UI systems, and solid engineering behind every visual detail.",
  openGraph: {
    title: "Pham Hoang Viet",
    description:
      "Frontend Developer with 5+ years of experience building modern, responsive, and scalable applications using React, Next.js, TypeScript, and TailwindCSS. The focus stays on smooth UX, reusable UI systems, and solid engineering behind every visual detail.",
    images: ["https://vietpham.io.vn/images/avatars/icon.ico"],
  },
  twitter: {
    title: "Pham Hoang Viet",
    description:
      "Frontend Developer with 5+ years of experience building modern, responsive, and scalable applications using React, Next.js, TypeScript, and TailwindCSS. The focus stays on smooth UX, reusable UI systems, and solid engineering behind every visual detail.",
    images: ["https://vietpham.io.vn/images/avatars/icon.ico"],
  },
}

export default function MePage() {
  const achievementStats = getAchievementStats(
    technologies,
    experiences,
    projects
  )

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_top_right,rgba(236,72,153,0.08),transparent_28%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.08),transparent_30%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "url('/images/bg.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />

      <div className="relative container flex flex-col gap-24 py-8 sm:gap-28 sm:py-12 lg:gap-32 lg:py-16">
        <div className="flex flex-col gap-6">
          <div className="flex justify-end">
            <ProfileModeToggle />
          </div>
          <ProfileHero
            technologies={technologies}
            experiences={experiences}
            projects={projects}
          />
        </div>
        <ProfileAbout
          technologies={technologies}
          experiences={experiences}
          projects={projects}
        />
        <ProfileStats stats={achievementStats} />
        <ProfileTechnologies technologies={technologies} projects={projects} />
        <ProfileExperiences experiences={experiences} />
        <ProfileFeaturedProjects projects={projects} />
        <ProfileSideProjects technologies={technologies} projects={projects} />
        <ProfileProjects projects={projects} />
        <ProfileCta technologies={technologies} />
      </div>
    </div>
  )
}
