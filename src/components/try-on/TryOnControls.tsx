import {
  Maximize,
  Move,
  RotateCcw,
  RotateCcw as RotateIcon,
} from "lucide-react"

import type { Dispatch, SetStateAction } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"

export type TryOnAdjustments = {
  scale: number
  offsetX: number
  offsetY: number
  rotation: number
}

interface TryOnControlsProps {
  adjustments: TryOnAdjustments
  setAdjustments: Dispatch<SetStateAction<TryOnAdjustments>>
  onReset: () => void
}

export function TryOnControls({
  adjustments,
  setAdjustments,
  onReset,
}: TryOnControlsProps) {
  const handleChange = (key: keyof TryOnAdjustments, value: number[]) => {
    const [nextValue] = value
    if (nextValue === undefined) return

    setAdjustments((prev) => ({
      ...prev,
      [key]: nextValue,
    }))
  }

  return (
    <Card className="bg-neutral-900 border-neutral-800 text-white">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-neutral-400">
          Manual Adjustments
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-8 px-2 text-neutral-400 hover:text-white"
        >
          <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-neutral-500 flex items-center">
              <Maximize className="w-3 h-3 mr-1.5" />
              Scale
            </Label>
            <span className="text-[10px] tabular-nums text-neutral-400">
              {adjustments.scale.toFixed(2)}x
            </span>
          </div>
          <Slider
            value={[adjustments.scale]}
            min={0.5}
            max={2.0}
            step={0.01}
            onValueChange={(v) => handleChange("scale", v)}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-neutral-500 flex items-center">
              <Move className="w-3 h-3 mr-1.5" />
              Vertical Offset
            </Label>
            <span className="text-[10px] tabular-nums text-neutral-400">
              {adjustments.offsetY.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[adjustments.offsetY]}
            min={-0.5}
            max={0.5}
            step={0.01}
            onValueChange={(v) => handleChange("offsetY", v)}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-neutral-500 flex items-center">
              <Move className="w-3 h-3 mr-1.5" />
              Horizontal Offset
            </Label>
            <span className="text-[10px] tabular-nums text-neutral-400">
              {adjustments.offsetX.toFixed(2)}
            </span>
          </div>
          <Slider
            value={[adjustments.offsetX]}
            min={-0.5}
            max={0.5}
            step={0.01}
            onValueChange={(v) => handleChange("offsetX", v)}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-neutral-500 flex items-center">
              <RotateIcon className="w-3 h-3 mr-1.5" />
              Rotation
            </Label>
            <span className="text-[10px] tabular-nums text-neutral-400">
              {adjustments.rotation}°
            </span>
          </div>
          <Slider
            value={[adjustments.rotation]}
            min={-45}
            max={45}
            step={1}
            onValueChange={(v) => handleChange("rotation", v)}
            className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
          />
        </div>
      </CardContent>
    </Card>
  )
}
