'use client';

import React, { useState } from 'react';
import { useVirtualTryOn } from '@/hooks/useVirtualTryOn';
import { EyewearOverlayCanvas } from './EyewearOverlayCanvas';
import { Button } from '@/components/ui/button';
import { Camera, CameraOff, RefreshCw, Loader2, User, UserX, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface VirtualTryOnCameraProps {
  productImage: string | null;
  adjustments: {
    scale: number;
    offsetX: number;
    offsetY: number;
    rotation: number;
  };
  onCapture?: (dataUrl: string) => void;
}

export const VirtualTryOnCamera: React.FC<VirtualTryOnCameraProps> = ({
  productImage,
  adjustments,
  onCapture,
}) => {
  const vt = useVirtualTryOn();
  const { camera, faceLandmarker, transform, isDetecting, videoRef } = vt;
  const [mirrored, setMirrored] = useState(true);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const captureSnapshot = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video
    if (mirrored) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw overlay (simplified, we could alternatively grab the actual overlay canvas)
    // For MVP, we'll just redraw the overlay logic or capture both if properly aligned.
    // Actually, it's better to capture exactly what's on screen.
    
    const overlayCanvas = containerRef.current?.querySelector('canvas');
    if (overlayCanvas) {
      // If we used a single canvas for everything it would be easier, 
      // but here we have video + canvas.
      // Let's reset transform to draw overlay on top of the captured video frame
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(overlayCanvas, 0, 0, canvas.width, canvas.height);
    }

    const dataUrl = canvas.toDataURL('image/png');
    onCapture?.(dataUrl);
  };

  return (
    <div className="flex flex-col gap-4">
      <div 
        ref={containerRef}
        className="relative aspect-video bg-neutral-950 rounded-2xl overflow-hidden border border-neutral-800 shadow-2xl group"
      >
        {/* Video Element */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover ${mirrored ? 'scale-x-[-1]' : ''}`}
          autoPlay
          playsInline
          muted
        />

        {/* Overlay Canvas */}
        {camera.stream && (
          <EyewearOverlayCanvas
            transform={transform}
            productImage={productImage}
            videoRef={videoRef}
            adjustments={adjustments}
            mirrored={mirrored}
          />
        )}

        {/* Status Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
          {camera.stream ? (
            <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
              Camera Active
            </Badge>
          ) : (
            <Badge variant="secondary" className="bg-neutral-500/10 text-neutral-400 border-neutral-500/20 backdrop-blur-md">
              Camera Off
            </Badge>
          )}

          {camera.stream && (
            isDetecting ? (
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 backdrop-blur-md">
                <User className="w-3 h-3 mr-1.5" />
                Face Detected
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-orange-500/20 backdrop-blur-md">
                <UserX className="w-3 h-3 mr-1.5" />
                No Face Detected
              </Badge>
            )
          )}
        </div>

        {/* Privacy Note */}
        <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <Badge variant="secondary" className="bg-black/40 text-[10px] uppercase tracking-wider text-neutral-400 border-neutral-800 backdrop-blur-md">
             <ShieldCheck className="w-3 h-3 mr-1.5" />
             Local Processing Only
           </Badge>
        </div>

        {/* Loading / Error States */}
        {!camera.stream && !camera.isLoading && !camera.error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10 text-center p-6">
            <Camera className="w-12 h-12 text-neutral-700 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Ready to try on?</h3>
            <p className="text-neutral-400 max-w-xs mb-6">
              Enable your camera to see how these glasses look on you. All processing is done locally in your browser.
            </p>
            <Button 
              onClick={() => camera.startCamera()}
              className="bg-white text-black hover:bg-neutral-200 rounded-full px-8"
            >
              Start Camera
            </Button>
          </div>
        )}

        {camera.isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10">
            <Loader2 className="w-10 h-10 text-white animate-spin mb-4" />
            <p className="text-white font-medium">Accessing Camera...</p>
          </div>
        )}

        {camera.error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900/80 backdrop-blur-sm z-10 p-6 text-center">
            <div className="bg-red-500/20 p-4 rounded-full mb-4">
              <CameraOff className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              {camera.error === 'PERMISSION_DENIED' ? 'Camera Access Denied' : 'Camera Error'}
            </h3>
            <p className="text-neutral-400 max-w-xs mb-6">
              {camera.error === 'PERMISSION_DENIED' 
                ? 'Please allow camera access in your browser settings to use the Virtual Try-On feature.' 
                : 'Something went wrong while accessing your camera. Please check your device settings.'}
            </p>
            <Button 
              variant="outline"
              onClick={() => camera.startCamera()}
              className="border-neutral-700 text-white hover:bg-neutral-800 rounded-full px-8"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      {camera.stream && (
        <div className="flex items-center justify-between gap-4 p-4 bg-neutral-900/50 rounded-2xl border border-neutral-800">
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => camera.stopCamera()}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            >
              <CameraOff className="w-4 h-4 mr-2" />
              Stop
            </Button>
            {camera.devices.length > 1 && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  const currentIndex = camera.devices.findIndex(d => d.deviceId === camera.activeDeviceId);
                  const nextIndex = (currentIndex + 1) % camera.devices.length;
                  camera.switchCamera(camera.devices[nextIndex].deviceId);
                }}
                className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Switch
              </Button>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setMirrored(!mirrored)}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            >
              Mirror
            </Button>
          </div>

          <Button
            onClick={captureSnapshot}
            className="bg-white text-black hover:bg-neutral-200 rounded-full"
          >
            Take Snapshot
          </Button>
        </div>
      )}

      {faceLandmarker.error && (
        <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-400">
          <AlertDescription>
            AI Model Error: {faceLandmarker.error}. Tracking might not work.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
