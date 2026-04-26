# Virtual Try-On

Lensora features a real-time, browser-based Virtual Try-On (VTO) system that allows customers to preview eyewear products using their webcam.

## Overview

The VTO system uses MediaPipe Face Landmarker to detect 478 face landmarks in real time. It computes the position, scale, and rotation of the eyewear overlay based on the detected eye positions and nose bridge.

## Route

- Global Try-On: `/shop/try-on`
- Product-specific: `/shop/products/[slug]/try-on`

## Camera Permissions

- Users must explicitly grant camera permissions to use the feature.
- The feature handles "Permission Denied" and "No Camera Found" states gracefully.
- HTTPS is required for camera access in production.

## Privacy

> [!IMPORTANT]
> **Privacy is our priority.**
> - All video frames are processed **locally** in the browser.
> - Video data is **never** uploaded to our servers.
> - Snapshots are saved only to the user's local memory and are never automatically stored.

## Technical Implementation

- **Face Detection**: `@mediapipe/tasks-vision` (Face Landmarker).
- **Rendering**: HTML5 Canvas overlay on top of `<video>` element.
- **Smoothing**: RequestAnimationFrame loop with manual adjustment controls to fine-tune fit.
- **Frontend Only**: No backend processing or storage involved.

## Recommended Product Images

For best results, eyewear products should have:
- Transparent PNG or WebP format.
- Front-facing perspective.
- High resolution.

## Manual Controls

Since automatic alignment can vary based on lighting and camera angle, we provide manual adjustment tools:
- **Scale**: Resize the eyewear.
- **Vertical/Horizontal Offset**: Shift the eyewear position.
- **Rotation**: Adjust the angle.

## Snapshot Feature

Users can capture a snapshot of themselves wearing the glasses. The snapshot is previewed in a modal and can be downloaded as a PNG file.

## Known Limitations (MVP)

- Works best with one face at a time.
- Requires good lighting for stable face tracking.
- Does not account for face occlusion (e.g., hands over face).
- Desktop performance is generally better than mobile due to WASM processing requirements.
