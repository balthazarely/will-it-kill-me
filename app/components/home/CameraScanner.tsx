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
      if (detectedCode) {
        onBarcodeScan(detectedCode);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-zinc-950 text-white items-center justify-center gap-6 px-8">
      {/* Camera View - optimized for mobile */}
      <div className="relative w-[85vw] h-[85vw] max-w-md rounded-2xl overflow-hidden bg-black">
        <Scanner sound={false} onScan={handleScan} />
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
