import React, { useEffect, useRef } from "react"

import type { EyewearTransform } from "@/hooks/useVirtualTryOn"

interface EyewearOverlayCanvasProps {
  transform: EyewearTransform | null
  productImage: string | null
  videoRef: React.RefObject<HTMLVideoElement | null>
  adjustments: {
    scale: number
    offsetX: number
    offsetY: number
    rotation: number
  }
  mirrored?: boolean
}

export const EyewearOverlayCanvas: React.FC<EyewearOverlayCanvasProps> = ({
  transform,
  productImage,
  videoRef,
  adjustments,
  mirrored = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    if (productImage) {
      const img = new Image()
      img.src = productImage
      img.onload = () => {
        imageRef.current = img
      }
    } else {
      imageRef.current = null
    }
  }, [productImage])

  useEffect(() => {
    const canvas = canvasRef.current
    const video = videoRef.current
    if (!canvas || !video) return

    let animationFrameId: number

    const render = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Ensure canvas matches video size
      if (
        canvas.width !== video.videoWidth ||
        canvas.height !== video.videoHeight
      ) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (transform && imageRef.current) {
        const { x, y, scale, rotation } = transform
        const img = imageRef.current

        ctx.save()

        if (mirrored) {
          ctx.translate(canvas.width, 0)
          ctx.scale(-1, 1)
        }

        // Apply detected position
        const drawX = x * canvas.width
        const drawY = y * canvas.height

        // Apply adjustments
        const finalScale = scale * adjustments.scale
        const finalX = drawX + adjustments.offsetX * canvas.width
        const finalY = drawY + adjustments.offsetY * canvas.height
        const finalRotation = rotation + (adjustments.rotation * Math.PI) / 180

        ctx.translate(finalX, finalY)
        ctx.rotate(finalRotation)

        // Aspect ratio of image
        const imgAspect = img.width / img.height
        const drawWidth = canvas.width * finalScale
        const drawHeight = drawWidth / imgAspect

        ctx.drawImage(
          img,
          -drawWidth / 2,
          -drawHeight / 2,
          drawWidth,
          drawHeight
        )

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [transform, videoRef, adjustments, mirrored])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none w-full h-full object-cover ${
        mirrored ? "scale-x-[-1]" : ""
      }`}
    />
  )
}
