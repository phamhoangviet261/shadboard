import { useEffect, useRef, useState } from "react"

import type {
  FaceLandmark,
  FaceShape,
  FaceShapeResult,
} from "../lib/try-on/face-shape-utils"

import {
  calculateFaceMeasurements,
  detectFaceShape,
} from "../lib/try-on/face-shape-utils"

interface UseFaceShapeProps {
  landmarks: FaceLandmark[] | null
  isEnabled: boolean
}

export const useFaceShape = ({ landmarks, isEnabled }: UseFaceShapeProps) => {
  const [result, setResult] = useState<FaceShapeResult | null>(null)
  const [manualShape, setManualShape] = useState<FaceShape | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // Detection stability state
  const detectionHistory = useRef<FaceShape[]>([])
  const MAX_HISTORY = 15 // Window size for stabilization
  const STABILITY_THRESHOLD = 10 // Need 10 identical results in history to be "stable"

  const lastProcessTime = useRef(0)
  const PROCESS_INTERVAL = 500 // Analyze every 500ms

  useEffect(() => {
    if (!isEnabled || !landmarks || manualShape) {
      if (!manualShape) setIsAnalyzing(false)
      return
    }

    const now = Date.now()
    if (now - lastProcessTime.current < PROCESS_INTERVAL) return
    lastProcessTime.current = now

    setIsAnalyzing(true)

    const measurements = calculateFaceMeasurements(landmarks)
    if (!measurements) return

    const { shape } = detectFaceShape(measurements)

    // Add to history
    detectionHistory.current.push(shape)
    if (detectionHistory.current.length > MAX_HISTORY) {
      detectionHistory.current.shift()
    }

    // Stabilize results (Majority vote)
    const counts = detectionHistory.current.reduce(
      (acc, s) => {
        acc[s] = (acc[s] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const [mostFrequentShape, count] = Object.entries(counts).sort(
      (a, b) => b[1] - a[1]
    )[0] as [FaceShape, number]

    if (count >= STABILITY_THRESHOLD) {
      // We have a stable result
      const stableResult = detectFaceShape(measurements) // Get full result for the stable shape
      setResult({ ...stableResult, shape: mostFrequentShape })
    }
  }, [landmarks, isEnabled, manualShape])

  // Computed state
  const currentShape = manualShape || result?.shape || "unknown"
  const isStable =
    manualShape !== null ||
    detectionHistory.current.length >= STABILITY_THRESHOLD

  const overrideShape = (shape: FaceShape | null) => {
    setManualShape(shape)
    if (shape === null) {
      setResult(null)
      detectionHistory.current = []
    }
  }

  return {
    shape: currentShape,
    result: manualShape ? null : result, // Hide analysis results if manual
    isAnalyzing: isAnalyzing && !manualShape && !isStable,
    isStable,
    isManual: !!manualShape,
    overrideShape,
  }
}
