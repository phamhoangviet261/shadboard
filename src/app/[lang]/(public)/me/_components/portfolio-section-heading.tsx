import { cn } from "@/lib/utils"

interface PortfolioSectionHeadingProps {
  eyebrow: string
  title: string
  description: string
  align?: "left" | "center"
  className?: string
}

export function PortfolioSectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: PortfolioSectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <span className="inline-flex items-center rounded-full border border-border/60 bg-background/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.28em] text-muted-foreground backdrop-blur">
        {eyebrow}
      </span>
      <div className="space-y-3">
        <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-muted-foreground sm:text-lg">
          {description}
        </p>
      </div>
    </div>
  )
}
