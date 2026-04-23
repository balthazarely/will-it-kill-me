"use client";

import { useState, useEffect } from "react";
import ScannerLoader from "./ScannerLoader";
import { useScanProgress } from "@/lib/hooks/useScanProgress";

interface ScanningScreenProps {
  productName: string;
  barcode?: string;
  emoji?: string;
  onCancel?: () => void;
}

export default function ScanningScreen({
  productName,
  barcode,
  emoji = "🍔",
  onCancel,
}: ScanningScreenProps) {
  const [dots, setDots] = useState("");
  const { progress } = useScanProgress(barcode || null);

  useEffect(() => {
    const id = setInterval(
      () => setDots((d) => (d.length >= 3 ? "" : d + ".")),
      400,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-zinc-950 text-white items-center justify-center gap-3 px-6 py-6">
      <ScannerLoader emoji={emoji} />

      {/* Status text */}
      <div className="text-center mt-1">
        <p className="text-[15px] font-semibold tracking-tight">
          {progress?.message || "Starting scan..."}
        </p>
      </div>

      {/* Cancel Button */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/10 cursor-pointer"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
