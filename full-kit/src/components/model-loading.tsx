"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  modelSrc: string
  loading: boolean
  text?: string
  errorText?: string
}

export default function ModelLoadingOverlay({
  modelSrc,
  loading,
  text = "Loading...",
  errorText = "Không tải được model",
}: Props) {
  const modelRef = useRef<HTMLDivElement>(null)

  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(loading)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [modelError, setModelError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    import("@google/model-viewer").then(() => {
      setMounted(true)
    })
  }, [])

  useEffect(() => {
    if (!mounted) return

    const el = modelRef.current
    if (!el) return

    const handleLoad = () => {
      setModelLoaded(true)
      setModelError(null)
    }

    const handleError = () => {
      setModelLoaded(false)
      setModelError("Load fail")
    }

    el.addEventListener("load", handleLoad)
    el.addEventListener("error", handleError)

    return () => {
      el.removeEventListener("load", handleLoad)
      el.removeEventListener("error", handleError)
    }
  }, [mounted, retryKey])

  useEffect(() => {
    if (loading) {
      setVisible(true)
      return
    }

    const timer = setTimeout(() => {
      setVisible(false)
    }, 400)

    return () => clearTimeout(timer)
  }, [loading])

  const handleRetry = () => {
    setModelError(null)
    setModelLoaded(false)
    setRetryKey((prev) => prev + 1)
  }

  if (!mounted || !visible) return null

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-400 ${
        loading ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="relative h-[220px] w-[220px] pointer-events-none translate-x-[-10px]">
        {/* {!modelLoaded && !modelError && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-black/60">
            Đang tải model...
          </div>
        )} */}

        {/* @ts-expect-error custom element */}
        <model-viewer
          key={retryKey}
          ref={modelRef}
          src={modelSrc}
          autoplay
          auto-rotate
          camera-controls={false}
          disable-pan
          disable-zoom
          interaction-prompt="none"
          environment-image="neutral"
          style={{
            width: "100%",
            height: "100%",
            opacity: modelLoaded && !modelError ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>

      {!modelError ? (
        <p className="mt-4 animate-pulse text-sm text-black/80">{text}</p>
      ) : (
        <div className="mt-4 flex flex-col items-center gap-2">
          <p className="text-sm text-red-600">{errorText}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="rounded-md border border-black/15 px-3 py-1.5 text-sm text-black transition hover:bg-black/5"
          >
            Thử lại
          </button>
        </div>
      )}
    </div>
  )
}
