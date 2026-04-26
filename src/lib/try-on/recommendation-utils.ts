import type { FaceShape } from "./face-shape-utils"

export type FrameStyle =
  | "round"
  | "oval"
  | "square"
  | "rectangular"
  | "aviator"
  | "cat-eye"
  | "geometric"
  | "browline"
  | "rimless"
  | "oversized"
  | "wayfarer"
  | "light-rim"
  | "bottom-heavy"

export interface Recommendation {
  styles: FrameStyle[]
  reasons: string
  avoid: FrameStyle[]
}

interface ProductFrameProfile {
  name: string
  description?: string | null
  tags?: readonly string[] | null
}

export const RECOMMENDATION_RULES: Record<FaceShape, Recommendation> = {
  oval: {
    styles: ["square", "rectangular", "aviator", "geometric"],
    reasons:
      "Oval faces are balanced and work well with most frame shapes. Angular styles add extra character.",
    avoid: [],
  },
  round: {
    styles: ["rectangular", "square", "geometric", "browline"],
    reasons:
      "Angular frames help add definition and contrast to the soft curves of a round face.",
    avoid: ["round"],
  },
  square: {
    styles: ["round", "oval", "aviator", "rimless"],
    reasons:
      "Soft, rounded frames help balance and soften a strong, angular jawline.",
    avoid: ["square"],
  },
  heart: {
    styles: ["oval", "round", "light-rim", "bottom-heavy"],
    reasons:
      "Lighter or bottom-heavy frames help balance a wider forehead and narrower chin.",
    avoid: ["browline", "geometric"],
  },
  oblong: {
    styles: ["oversized", "square", "wayfarer", "rectangular"],
    reasons:
      "Taller and oversized frames help break up the length of your face for a more balanced look.",
    avoid: ["cat-eye"],
  },
  diamond: {
    styles: ["oval", "rimless", "cat-eye", "browline"],
    reasons:
      "Frames that emphasize the top of the eyes help balance prominent cheekbones.",
    avoid: ["square", "geometric"],
  },
  unknown: {
    styles: ["rectangular", "oval", "wayfarer"],
    reasons: "These versatile classics suit a wide variety of features.",
    avoid: [],
  },
}

/**
 * Infer frame styles from product tags or name
 */
export const inferFrameStyles = (
  product: ProductFrameProfile
): FrameStyle[] => {
  const styles: FrameStyle[] = []
  const content = `${product.name} ${product.description || ""} ${
    product.tags?.join(" ") || ""
  }`.toLowerCase()

  const mapping: Record<string, FrameStyle> = {
    round: "round",
    oval: "oval",
    square: "square",
    rectangular: "rectangular",
    rectangle: "rectangular",
    aviator: "aviator",
    "cat-eye": "cat-eye",
    "cat eye": "cat-eye",
    geometric: "geometric",
    browline: "browline",
    rimless: "rimless",
    oversized: "oversized",
    wayfarer: "wayfarer",
  }

  Object.entries(mapping).forEach(([keyword, style]) => {
    if (content.includes(keyword)) {
      styles.push(style)
    }
  })

  // Default inference based on name pattern if no keywords found
  if (styles.length === 0) {
    if (product.name.toLowerCase().includes("sun")) styles.push("aviator")
    else styles.push("rectangular") // Default assumption
  }

  return Array.from(new Set(styles))
}

/**
 * Score a product's fit for a face shape
 * Returns: 2 (Try it), 1 (Good match), 0 (Neutral)
 */
export const scoreProductMatch = (
  product: ProductFrameProfile,
  recommended: Recommendation
): number => {
  const productStyles = inferFrameStyles(product)

  if (productStyles.some((s) => recommended.styles.includes(s))) {
    return 2 // Recommended
  }

  if (productStyles.some((s) => recommended.avoid.includes(s))) {
    return 0 // Try anyway
  }

  return 1 // Good match
}
