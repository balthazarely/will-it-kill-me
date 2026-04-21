"use client";

import { Scanner } from "@yudiel/react-qr-scanner";

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
      console.log("Barcode scanned:", detectedCode);
      if (detectedCode) {
        onBarcodeScan(detectedCode);
      }
    }
  };

  return (
    <div className="flex flex-col  bg-zinc-950 text-white items-center justify-center gap-6 px-8">
      {/* Camera View */}
      <div className="w-full max-w-md">
        <div
          className="w-full rounded-2xl bg-black overflow-hidden mb-4"
          style={{ aspectRatio: "1" }}
        >
          <Scanner onScan={handleScan} />
        </div>
        <p className="text-sm text-white/60 text-center mb-6">
          Point camera at barcode
        </p>
        <button
          onClick={onCancel}
          className="w-full px-4 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/10"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
