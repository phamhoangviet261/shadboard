import Link from "next/link"
import { Glasses } from "lucide-react"

import { cn } from "@/lib/utils"
import type { DictionaryType } from "@/lib/get-dictionary"

import { ModeDropdown } from "@/components/mode-dropdown"

interface StorefrontHeaderProps {
  lang: string
  dictionary: DictionaryType
  className?: string
}

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/shop/collections" },
]

export function StorefrontHeader({
  lang,
  dictionary,
  className,
}: StorefrontHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md",
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href={`/${lang}/shop`}
          className="flex items-center gap-2 font-semibold tracking-tight text-lg shrink-0"
          aria-label="Lensora home"
        >
          <Glasses className="size-5 text-primary" />
          <span>Lensora</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={`/${lang}${link.href}`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/${lang}/admin/products`}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Admin
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ModeDropdown dictionary={dictionary} />
        </div>
      </div>
    </header>
  )
}
