"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { useCamera } from "./useCamera"
import { useFaceLandmarker } from "./useFaceLandmarker"

export interface EyewearTransform {
  x: number
  y: number
  scale: number
  rotation: number
  width: number
}

export interface UseVirtualTryOnReturn {
  camera: ReturnType<typeof useCamera>
  faceLandmarker: ReturnType<typeof useFaceLandmarker>
  transform: EyewearTransform | null
  isDetecting: boolean
  videoRef: React.RefObject<HTMLVideoElement | null>
}

export function useVirtualTryOn(): UseVirtualTryOnReturn {
  const camera = useCamera()
  const faceLandmarker = useFaceLandmarker()

  const [transform, setTransform] = useState<EyewearTransform | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const requestRef = useRef<number | null>(null)
  const lastVideoTimeRef = useRef<number>(-1)

  const detect = useCallback(() => {
    const video = videoRef.current
    const landmarker = faceLandmarker.faceLandmarker

    if (
      video &&
      landmarker &&
      video.readyState >= 2 &&
      video.currentTime !== lastVideoTimeRef.current
    ) {
      lastVideoTimeRef.current = video.currentTime

      const startTimeMs = performance.now()
      const results = landmarker.detectForVideo(video, startTimeMs)

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        setIsDetecting(true)
        const landmarks = results.faceLandmarks[0]

        // Calculate transform based on eye positions
        // Landmarks:
        // 33: Left eye inner corner
        // 133: Left eye outer corner
        // 362: Right eye inner corner
        // 263: Right eye outer corner
        // 168: Nose bridge top (glabella region)
        // 6: Midpoint between eyes

        const leftEyeIndex = 33
        const rightEyeIndex = 263

        const leftEye = landmarks[leftEyeIndex]
        const rightEye = landmarks[rightEyeIndex]

        if (leftEye && rightEye) {
          // Midpoint between eyes
          const midX = (leftEye.x + rightEye.x) / 2
          const midY = (leftEye.y + rightEye.y) / 2

          // Distance between eyes for scale
          const dx = rightEye.x - leftEye.x
          const dy = rightEye.y - leftEye.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Rotation in radians
          const rotation = Math.atan2(dy, dx)

          // These values are normalized [0, 1]
          setTransform({
            x: midX,
            y: midY,
            scale: distance * 5, // Arbitrary multiplier, will need adjustment
            rotation: rotation,
            width: video.videoWidth,
          })
        }
      } else {
        setIsDetecting(false)
        setTransform(null)
      }
    }

    requestRef.current = requestAnimationFrame(detect)
  }, [faceLandmarker.faceLandmarker])

  useEffect(() => {
    if (camera.stream && faceLandmarker.faceLandmarker) {
      requestRef.current = requestAnimationFrame(detect)
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [camera.stream, faceLandmarker.faceLandmarker, detect])

  // Connect video element to stream
  useEffect(() => {
    if (videoRef.current && camera.stream) {
      videoRef.current.srcObject = camera.stream
    }
  }, [camera.stream])

  return {
    camera,
    faceLandmarker,
    transform,
    isDetecting,
    videoRef,
  }
}
