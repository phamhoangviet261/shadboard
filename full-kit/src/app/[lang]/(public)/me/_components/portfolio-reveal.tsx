"use client"

import { useEffect, useRef, useState } from "react"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface PortfolioRevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function PortfolioReveal({
  children,
  className,
  delay = 0,
}: PortfolioRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) return

    const isInitiallyVisible =
      node.getBoundingClientRect().top <= window.innerHeight * 0.9

    if (isInitiallyVisible) {
      setIsVisible(true)
      setIsReady(true)
      return
    }

    setIsReady(true)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(node)
        }
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -8% 0px",
      }
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-out will-change-transform motion-reduce:transition-none motion-reduce:transform-none",
        isReady &&
          !isVisible &&
          "opacity-0 translate-y-8 scale-[0.98] motion-reduce:opacity-100",
        isVisible && "opacity-100 translate-y-0 scale-100",
        className
      )}
    >
      {children}
    </div>
  )
}
