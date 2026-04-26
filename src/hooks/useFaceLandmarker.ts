"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision"

export interface UseFaceLandmarkerReturn {
  faceLandmarker: FaceLandmarker | null
  isLoading: boolean
  error: string | null
}

export function useFaceLandmarker(): UseFaceLandmarkerReturn {
  const [faceLandmarker, setFaceLandmarker] = useState<FaceLandmarker | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isLoadingRef = useRef(false)

  const initFaceLandmarker = useCallback(async () => {
    if (faceLandmarker || isLoadingRef.current) return

    setIsLoading(true)
    isLoadingRef.current = true
    setError(null)

    try {
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm"
      )

      const landmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          runningMode: "VIDEO",
          numFaces: 1,
        }
      )

      setFaceLandmarker(landmarker)
    } catch (err: any) {
      console.error("Error initializing FaceLandmarker:", err)
      setError(err.message || "Failed to initialize face detection")
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [faceLandmarker])

  useEffect(() => {
    initFaceLandmarker()

    return () => {
      if (faceLandmarker) {
        faceLandmarker.close()
      }
    }
  }, [initFaceLandmarker, faceLandmarker])

  return {
    faceLandmarker,
    isLoading,
    error,
  }
}
