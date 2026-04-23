"use client";

import { Scanner } from "@yudiel/react-qr-scanner";
import { useCallback } from "react";

interface CameraScannerProps {
  onBarcodeScan: (barcode: string) => void;
  onCancel: () => void;
}

export default function CameraScanner({
  onBarcodeScan,
  onCancel,
}: CameraScannerProps) {
  const handleScan = (result: any) => {
    if (result && result.length > 0) {
      const detectedCode =
        result[0]?.rawValue || result[0]?.getText?.() || result[0];
      if (detectedCode) {
        onBarcodeScan(detectedCode);
      }
    }
  };


  const customTracker = useCallback(
    (detectedCodes: any[], ctx: CanvasRenderingContext2D) => {
      if (detectedCodes.length === 0) return;

      detectedCodes.forEach((code) => {
        const { boundingBox } = code;
        const { x, y, width, height } = boundingBox;

        // Check if barcode is in good scanning position
        const minWidth = 60;
        const maxWidth = 400;
        const isGoodSize = width > minWidth && width < maxWidth;

        // Center area (roughly middle 60% of screen)
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const barcodeCenter = {
          x: x + width / 2,
          y: y + height / 2,
        };

        const distFromCenter = Math.sqrt(
          Math.pow(barcodeCenter.x - centerX, 2) +
            Math.pow(barcodeCenter.y - centerY, 2)
        );

        const maxDistance = Math.min(ctx.canvas.width, ctx.canvas.height) / 4;
        const isCentered = distFromCenter < maxDistance;

        const isGoodPosition = isGoodSize && isCentered;

        // Draw outer ring - green for good, red for not ideal
        ctx.strokeStyle = isGoodPosition ? "#22c55e" : "#ef4444";
        ctx.lineWidth = 4;
        ctx.shadowColor = isGoodPosition ? "rgba(34, 197, 94, 0.8)" : "rgba(239, 68, 68, 0.8)";
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.strokeRect(x - 8, y - 8, width + 16, height + 16);

        // Draw inner corners
        ctx.strokeStyle = isGoodPosition ? "#22c55e" : "#ef4444";
        ctx.lineWidth = 3;
        const cornerLen = 24;

        // Top-left
        ctx.beginPath();
        ctx.moveTo(x - 8, y - 8 + cornerLen);
        ctx.lineTo(x - 8, y - 8);
        ctx.lineTo(x - 8 + cornerLen, y - 8);
        ctx.stroke();

        // Top-right
        ctx.beginPath();
        ctx.moveTo(x + width + 8 - cornerLen, y - 8);
        ctx.lineTo(x + width + 8, y - 8);
        ctx.lineTo(x + width + 8, y - 8 + cornerLen);
        ctx.stroke();

        // Bottom-left
        ctx.beginPath();
        ctx.moveTo(x - 8, y + height + 8 - cornerLen);
        ctx.lineTo(x - 8, y + height + 8);
        ctx.lineTo(x - 8 + cornerLen, y + height + 8);
        ctx.stroke();

        // Bottom-right
        ctx.beginPath();
        ctx.moveTo(x + width + 8 - cornerLen, y + height + 8);
        ctx.lineTo(x + width + 8, y + height + 8);
        ctx.lineTo(x + width + 8, y + height + 8 - cornerLen);
        ctx.stroke();
      });
    },
    []
  );

  return (
    <div className="flex flex-col min-h-screen w-full bg-zinc-950 text-white items-center justify-center gap-6 px-8">
      {/* Camera View - optimized for mobile */}
      <div className="relative w-[85vw] h-[85vw] max-w-md rounded-2xl overflow-hidden bg-black">
        <Scanner
          sound={false}
          onScan={handleScan}
          components={{
            tracker: customTracker,
            finder: false,
            torch: true,
          }}
        />
      </div>

      {/* Instruction Text */}
      <div className="text-center">
        <p className="text-[17px] font-semibold tracking-tight mb-1.5">
          Scan Barcode
        </p>
        <p className="text-[13px] text-white/40 font-medium">
          Point camera at barcode
        </p>
      </div>

      {/* Cancel Button */}
      <button
        onClick={onCancel}
        className="mt-4 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/10 cursor-pointer"
      >
        Cancel
      </button>
    </div>
  );
}
