import type { NormalizedLandmark } from "@mediapipe/tasks-vision"

/**
 * Face Shape Detection Utilities
 *
 * Uses geometric heuristics to estimate face shape from 3D landmarks.
 * MediaPipe indices for Face Mesh:
 * - 10: Forehead top
 * - 152: Chin bottom
 * - 234: Left cheekbone
 * - 454: Right cheekbone
 * - 127: Left temple
 * - 356: Right temple
 * - 172: Left jaw
 * - 397: Right jaw
 */

export type FaceShape =
  | "oval"
  | "round"
  | "square"
  | "heart"
  | "oblong"
  | "diamond"
  | "unknown"

export interface FaceMeasurements {
  height: number
  cheekWidth: number
  foreheadWidth: number
  jawWidth: number
  ratio: number // height / cheekWidth
}

export interface FaceShapeResult {
  shape: FaceShape
  confidence: "high" | "medium" | "low"
  explanation: string
}

export type FaceLandmark = NormalizedLandmark

const getDistance = (p1: FaceLandmark, p2: FaceLandmark) => {
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) +
      Math.pow(p1.y - p2.y, 2) +
      Math.pow(p1.z - p2.z, 2)
  )
}

export const calculateFaceMeasurements = (
  landmarks: FaceLandmark[]
): FaceMeasurements | null => {
  if (!landmarks || landmarks.length < 468) return null

  const height = getDistance(landmarks[10], landmarks[152])
  const cheekWidth = getDistance(landmarks[234], landmarks[454])
  const foreheadWidth = getDistance(landmarks[127], landmarks[356])
  const jawWidth = getDistance(landmarks[172], landmarks[397])

  return {
    height,
    cheekWidth,
    foreheadWidth,
    jawWidth,
    ratio: height / cheekWidth,
  }
}

export const detectFaceShape = (
  measurements: FaceMeasurements
): FaceShapeResult => {
  const { ratio, foreheadWidth, cheekWidth, jawWidth } = measurements

  // Ratios for classification
  const foreheadToCheek = foreheadWidth / cheekWidth
  const jawToCheek = jawWidth / cheekWidth

  // Oblong: Face is significantly longer than it is wide
  if (ratio > 1.45) {
    return {
      shape: "oblong",
      confidence: "high",
      explanation:
        "Your face is notably longer than it is wide, with a balanced forehead and jawline.",
    }
  }

  // Heart: Forehead and cheekbones are wider than the jawline
  if (foreheadToCheek > 0.85 && jawToCheek < 0.8) {
    return {
      shape: "heart",
      confidence: "medium",
      explanation:
        "Your forehead and cheekbones are the widest part of your face, tapering down to a narrower chin.",
    }
  }

  // Square: Broad forehead and strong jawline, width and height are similar
  if (ratio < 1.25 && jawToCheek > 0.85 && foreheadToCheek > 0.85) {
    return {
      shape: "square",
      confidence: "medium",
      explanation:
        "Your forehead, cheekbones, and jawline have similar widths, creating a strong, angular silhouette.",
    }
  }

  // Round: Similar width and height, but with softer features than square
  if (ratio < 1.25 && jawToCheek < 0.85) {
    return {
      shape: "round",
      confidence: "medium",
      explanation:
        "Your face has soft, curved features with a similar width and height.",
    }
  }

  // Diamond: Cheekbones are widest, with narrower forehead and jawline
  if (
    cheekWidth > foreheadWidth &&
    cheekWidth > jawWidth &&
    foreheadToCheek < 0.85 &&
    jawToCheek < 0.85
  ) {
    return {
      shape: "diamond",
      confidence: "medium",
      explanation:
        "Your cheekbones are the widest point, with a narrower forehead and chin.",
    }
  }

  // Oval: Balanced features, height slightly more than width (the 'ideal' baseline)
  if (ratio >= 1.25 && ratio <= 1.45) {
    return {
      shape: "oval",
      confidence: "high",
      explanation:
        "Your face is balanced and slightly longer than it is wide, with softly curved features.",
    }
  }

  return {
    shape: "unknown",
    confidence: "low",
    explanation:
      "We couldn't clearly identify your face shape. Try adjusting your position or lighting.",
  }
}
