"use client"

import { useCallback, useRef, useState } from "react"

export type CameraError =
  | "PERMISSION_DENIED"
  | "NOT_FOUND"
  | "INSECURE_CONTEXT"
  | "UNKNOWN"

export interface UseCameraReturn {
  stream: MediaStream | null
  error: CameraError | null
  isLoading: boolean
  devices: MediaDeviceInfo[]
  activeDeviceId: string | null
  startCamera: (deviceId?: string) => Promise<void>
  stopCamera: () => void
  switchCamera: (deviceId: string) => Promise<void>
}

export function useCamera(): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<CameraError | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null)

  const streamRef = useRef<MediaStream | null>(null)

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      setStream(null)
      setActiveDeviceId(null)
    }
  }, [])

  const getDevices = useCallback(async () => {
    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = allDevices.filter(
        (device) => device.kind === "videoinput"
      )
      setDevices(videoDevices)
    } catch (err) {
      console.error("Error enumerating devices:", err)
    }
  }, [])

  const startCamera = useCallback(
    async (deviceId?: string) => {
      if (typeof window === "undefined" || !navigator.mediaDevices) {
        setError("INSECURE_CONTEXT")
        return
      }

      setIsLoading(true)
      setError(null)
      stopCamera()

      try {
        const constraints: MediaStreamConstraints = {
          video: deviceId
            ? { deviceId: { exact: deviceId } }
            : { facingMode: "user" },
          audio: false,
        }

        const newStream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = newStream
        setStream(newStream)

        // Update active device ID
        const videoTrack = newStream.getVideoTracks()[0]
        if (videoTrack) {
          const settings = videoTrack.getSettings()
          if (settings.deviceId) {
            setActiveDeviceId(settings.deviceId)
          }
        }

        await getDevices()
      } catch (err: unknown) {
        console.error("Error starting camera:", err)
        const errorName =
          typeof err === "object" && err !== null && "name" in err
            ? String(err.name)
            : ""

        if (
          errorName === "NotAllowedError" ||
          errorName === "PermissionDeniedError"
        ) {
          setError("PERMISSION_DENIED")
        } else if (
          errorName === "NotFoundError" ||
          errorName === "DevicesNotFoundError"
        ) {
          setError("NOT_FOUND")
        } else {
          setError("UNKNOWN")
        }
      } finally {
        setIsLoading(false)
      }
    },
    [stopCamera, getDevices]
  )

  const switchCamera = useCallback(
    async (deviceId: string) => {
      await startCamera(deviceId)
    },
    [startCamera]
  )

  return {
    stream,
    error,
    isLoading,
    devices,
    activeDeviceId,
    startCamera,
    stopCamera,
    switchCamera,
  }
}
