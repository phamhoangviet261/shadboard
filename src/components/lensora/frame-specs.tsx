import type { ProductSpecs } from "@/types"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FrameSpecsProps {
  specs: ProductSpecs
  frameMaterial: string
  frameShape: string
  lensType: string
  faceFit: string
  gender: string
}

export function FrameSpecs({
  specs,
  frameMaterial,
  frameShape,
  lensType,
  faceFit,
  gender,
}: FrameSpecsProps) {
  const measurements = [
    { label: "Lens Width", value: `${specs.lensWidth} mm` },
    { label: "Bridge Width", value: `${specs.bridgeWidth} mm` },
    { label: "Temple Length", value: `${specs.templeLength} mm` },
    { label: "Total Width", value: `${specs.totalWidth} mm` },
    ...(specs.weight ? [{ label: "Weight", value: `${specs.weight} g` }] : []),
  ]

  const details = [
    { label: "Frame Shape", value: frameShape },
    { label: "Frame Material", value: frameMaterial },
    { label: "Lens Type", value: lensType },
    { label: "Face Fit", value: faceFit },
    { label: "Gender", value: gender },
  ]

  return (
    <Accordion type="multiple" defaultValue={["measurements"]} className="w-full">
      <AccordionItem value="measurements">
        <AccordionTrigger className="text-sm font-medium">
          Frame Measurements
        </AccordionTrigger>
        <AccordionContent>
          <div className="grid grid-cols-2 gap-3 pt-1">
            {measurements.map(({ label, value }) => (
              <div
                key={label}
                className="rounded-lg border border-border px-4 py-3"
              >
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {label}
                </p>
                <p className="text-sm font-semibold mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="details">
        <AccordionTrigger className="text-sm font-medium">
          Frame Details
        </AccordionTrigger>
        <AccordionContent>
          <dl className="space-y-2 pt-1">
            {details.map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium capitalize">{value}</dd>
              </div>
            ))}
          </dl>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="fit-guide">
        <AccordionTrigger className="text-sm font-medium">
          Fit Guide
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3 pt-1 text-sm text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">Total Width {specs.totalWidth}mm</strong> — measure your
              current frame or the width of your face just below your temples.
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { fit: "Narrow", range: "120–133mm", active: faceFit === "narrow" },
                { fit: "Medium", range: "134–144mm", active: faceFit === "medium" },
                { fit: "Wide", range: "145mm+", active: faceFit === "wide" },
              ].map(({ fit, range, active }) => (
                <div
                  key={fit}
                  className={`rounded-lg border p-2 transition-colors ${
                    active
                      ? "border-foreground bg-foreground/5 text-foreground"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  <p className="text-xs font-semibold">{fit}</p>
                  <p className="text-[10px] mt-0.5">{range}</p>
                </div>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
