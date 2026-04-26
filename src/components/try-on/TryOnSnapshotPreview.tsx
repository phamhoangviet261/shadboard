import React from "react"
import Image from "next/image"
import { Camera, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface TryOnSnapshotPreviewProps {
  isOpen: boolean
  onClose: () => void
  snapshotUrl: string | null
}

export const TryOnSnapshotPreview: React.FC<TryOnSnapshotPreviewProps> = ({
  isOpen,
  onClose,
  snapshotUrl,
}) => {
  const download = () => {
    if (!snapshotUrl) return
    const link = document.createElement("a")
    link.href = snapshotUrl
    link.download = `lensora-try-on-${Date.now()}.png`
    link.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-neutral-950 border-neutral-800 text-white p-0 overflow-hidden sm:rounded-3xl">
        <DialogHeader className="p-6 border-b border-neutral-800 bg-neutral-900/50">
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-neutral-400" />
            Snapshot Preview
          </DialogTitle>
        </DialogHeader>

        <div className="p-0 bg-neutral-950 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-neutral-900 to-neutral-950">
          {snapshotUrl ? (
            <div className="relative aspect-video w-full max-h-[60vh]">
              <Image
                src={snapshotUrl}
                alt="Try-on Snapshot"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <div className="aspect-video w-full flex items-center justify-center text-neutral-500">
              No content to display
            </div>
          )}
        </div>

        <DialogFooter className="p-6 border-t border-neutral-800 flex items-center justify-between bg-neutral-900/50">
          <p className="text-[11px] text-neutral-500 max-w-[240px]">
            This snapshot is only saved locally. Lensora does not upload or
            store your images on our servers.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-neutral-800 hover:bg-neutral-800 text-white rounded-full"
            >
              Discard
            </Button>
            <Button
              onClick={download}
              className="bg-white text-black hover:bg-neutral-200 rounded-full px-6"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
