"use client";

import { useRef, useState } from "react";
import ScannerLoader from "./ScannerLoader";

interface NutritionLabelCameraProps {
  onCancel: () => void;
  onImageCapture: (imageData: string) => void;
}

export default function NutritionLabelCamera({
  onCancel,
  onImageCapture,
}: NutritionLabelCameraProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      onImageCapture(imageData);
    };
    reader.readAsDataURL(file);
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col min-h-screen w-full bg-zinc-950 text-white items-center justify-center gap-3 px-6 py-6">
        <ScannerLoader emoji="🏷️" />
        <div className="text-center mt-1">
          <p className="text-[15px] font-semibold tracking-tight">
            Analyzing nutrition label...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-zinc-950 text-white items-center justify-center gap-6 px-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageCapture}
        className="hidden"
      />

      <div className="text-center flex flex-col gap-6">
        <p className="text-lg font-semibold">
          Capture Nutrition Label
        </p>
        <p className="text-white/70 text-sm">
          Take a photo of the nutrition label to analyze it
        </p>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-8 py-6 text-white font-semibold rounded-2xl cursor-pointer text-lg shadow-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all"
        >
          📸 Take Photo
        </button>

        <button
          onClick={onCancel}
          className="mt-4 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/10 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
