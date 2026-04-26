"use client"

import React from "react"
import {
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Settings2,
  Sparkles,
} from "lucide-react"

import type { FaceShape, FaceShapeResult } from "@/lib/try-on/face-shape-utils"

import { RECOMMENDATION_RULES } from "@/lib/try-on/recommendation-utils"

import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FaceShapePanelProps {
  shape: FaceShape
  result: FaceShapeResult | null
  isAnalyzing: boolean
  isStable: boolean
  isManual: boolean
  onOverride: (shape: FaceShape | null) => void
}

export const FaceShapePanel: React.FC<FaceShapePanelProps> = ({
  shape,
  result,
  isAnalyzing,
  isStable,
  isManual,
  onOverride,
}) => {
  const recommendation =
    RECOMMENDATION_RULES[shape] || RECOMMENDATION_RULES.unknown

  const getConfidenceColor = (conf?: string) => {
    switch (conf) {
      case "high":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
      case "medium":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20"
      case "low":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20"
      default:
        return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20"
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-200">
              Style Assistant
            </h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-neutral-500 hover:text-neutral-300 transition-colors">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-neutral-900 border-neutral-800 text-neutral-300">
                <p className="text-xs">
                  We analyze your face geometry to recommend frames that
                  complement your features. All processing happens in your
                  browser.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="p-5 space-y-6">
          {/* Analysis Result */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-500 uppercase tracking-widest font-medium">
                Detected Shape
              </span>
              {!isManual && isStable && result && (
                <Badge
                  variant="outline"
                  className={`text-[10px] uppercase font-bold px-2 py-0.5 ${getConfidenceColor(
                    result.confidence
                  )}`}
                >
                  {result.confidence} Confidence
                </Badge>
              )}
              {isManual && (
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold px-2 py-0.5 bg-neutral-800 text-neutral-400 border-neutral-700"
                >
                  Manual Entry
                </Badge>
              )}
            </div>

            {isAnalyzing ? (
              <div className="flex items-center gap-3 p-4 bg-neutral-950/50 rounded-xl border border-dashed border-neutral-800">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-neutral-400 italic">
                  Analyzing facial geometry...
                </span>
              </div>
            ) : (
              <div className="group relative">
                <div className="flex items-center justify-between p-4 bg-neutral-950 rounded-xl border border-neutral-800 transition-all hover:border-neutral-700">
                  <span className="text-xl font-bold text-white capitalize">
                    {shape === "unknown" ? "Detecting..." : shape}
                  </span>
                  {!isManual && !isStable && (
                    <span className="text-[10px] text-neutral-600 uppercase tracking-tighter">
                      Stabilizing...
                    </span>
                  )}
                </div>
              </div>
            )}

            {shape !== "unknown" && isStable && (
              <p className="text-xs text-neutral-400 leading-relaxed px-1">
                {isManual
                  ? RECOMMENDATION_RULES[shape].reasons
                  : result?.explanation || RECOMMENDATION_RULES[shape].reasons}
              </p>
            )}
          </div>

          <div className="h-px bg-neutral-800" />

          {/* Recommendations */}
          <div className="space-y-4">
            <div>
              <span className="text-xs text-neutral-500 uppercase tracking-widest font-medium mb-3 block">
                Recommended Styles
              </span>
              <div className="flex flex-wrap gap-2">
                {recommendation.styles.map((style) => (
                  <Badge
                    key={style}
                    className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors capitalize px-3 py-1"
                  >
                    {style}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-neutral-950/80 rounded-xl p-4 border border-neutral-800 space-y-2">
              <div className="flex items-start gap-2">
                <div className="mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed italic">
                  {recommendation.reasons}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Override */}
          <div className="pt-2">
            <Select
              value={isManual ? shape : "auto"}
              onValueChange={(val) =>
                onOverride(val === "auto" ? null : (val as FaceShape))
              }
            >
              <SelectTrigger className="bg-transparent border-none text-[11px] text-neutral-500 hover:text-neutral-300 h-auto p-1 shadow-none focus:ring-0">
                <Settings2 className="w-3 h-3 mr-1.5" />
                <SelectValue placeholder="Adjust face shape" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-neutral-800 text-neutral-200">
                <SelectItem value="auto" className="text-xs">
                  Automatic Detection
                </SelectItem>
                <SelectItem value="oval" className="text-xs">
                  Oval
                </SelectItem>
                <SelectItem value="round" className="text-xs">
                  Round
                </SelectItem>
                <SelectItem value="square" className="text-xs">
                  Square
                </SelectItem>
                <SelectItem value="heart" className="text-xs">
                  Heart
                </SelectItem>
                <SelectItem value="oblong" className="text-xs">
                  Oblong
                </SelectItem>
                <SelectItem value="diamond" className="text-xs">
                  Diamond
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Privacy Guard */}
      <div className="flex items-start gap-3 px-2">
        <AlertCircle className="w-3.5 h-3.5 text-neutral-600 mt-0.5" />
        <p className="text-[10px] text-neutral-500 leading-normal">
          Detection is approximate and for guidance only. Measurements are
          temporary and never leave your device.
        </p>
      </div>
    </div>
  )
}
