import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Camera, ChevronLeft, Info } from "lucide-react"

import { TryOnControls } from "@/components/try-on/TryOnControls"
import {
  type TryOnProduct,
  TryOnProductPicker,
} from "@/components/try-on/TryOnProductPicker"
import { TryOnSnapshotPreview } from "@/components/try-on/TryOnSnapshotPreview"
import { VirtualTryOnCamera } from "@/components/try-on/VirtualTryOnCamera"
import { Button } from "@/components/ui/button"
import { productsData } from "@/data/lensora/products"

export default function VirtualTryOnPage() {
  const [selectedProduct, setSelectedProduct] = useState<TryOnProduct | null>(null);
  const [adjustments, setAdjustments] = useState({
    scale: 1.0,
    offsetX: 0,
    offsetY: 0,
    rotation: 0,
  });
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);

  // Map productsData to TryOnProduct type
  const products: TryOnProduct[] = productsData.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    imageUrl: p.thumbnailUrl, // For better alignment, transparent PNGs are better, but we use thumbnail for now
    slug: p.slug,
  }));

  useEffect(() => {
    if (products.length > 0 && !selectedProduct) {
      setSelectedProduct(products[0]);
    }
  }, [products, selectedProduct]);

  const handleCapture = (dataUrl: string) => {
    setSnapshotUrl(dataUrl);
    setIsSnapshotOpen(true);
  };

  const resetAdjustments = () => {
    setAdjustments({
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="text-white hover:bg-white/10">
              <Link href="/shop">
                <ChevronLeft className="w-5 h-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Virtual Try-On</h1>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest leading-none">
                Lensora Studio
              </p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
               <Info className="w-3.5 h-3.5" />
               <span>For best results, use a well-lit area and front-facing camera.</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Camera View */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <VirtualTryOnCamera
              productImage={selectedProduct?.imageUrl || null}
              adjustments={adjustments}
              onCapture={handleCapture}
            />
            
            <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
               <div className="bg-neutral-800 p-4 rounded-full">
                  <Camera className="w-6 h-6 text-neutral-400" />
               </div>
               <div className="flex-1 text-center md:text-left">
                  <h4 className="text-sm font-medium mb-1">Privacy Focused</h4>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Our Virtual Try-On technology processes all video frames locally on your device. 
                    No camera data is sent to our servers. Any snapshots you take are saved only to 
                    your browser's transient memory and can be downloaded directly to your device.
                  </p>
               </div>
            </div>
          </div>

          {/* Controls and Picker */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            <TryOnProductPicker
              products={products}
              selectedId={selectedProduct?.id || null}
              onSelect={(p) => setSelectedProduct(p)}
            />

            <TryOnControls
              adjustments={adjustments}
              setAdjustments={setAdjustments}
              onReset={resetAdjustments}
            />
          </div>
        </div>
      </main>

      <TryOnSnapshotPreview
        isOpen={isSnapshotOpen}
        onClose={() => setIsSnapshotOpen(false)}
        snapshotUrl={snapshotUrl}
      />
    </div>
  )
}
