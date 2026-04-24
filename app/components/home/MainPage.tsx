"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import InitialScreen from "./InitialScreen";
import CameraScanner from "./CameraScanner";
import ScannerLoader from "./ScannerLoader";

interface FoodScannerProps {
  initialOpenCamera?: boolean;
}

export default function MainPage({
  initialOpenCamera = false,
}: FoodScannerProps) {
  const router = useRouter();
  const nutritionFileInputRef = useRef<HTMLInputElement>(null);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [useCamera, setUseCamera] = useState(initialOpenCamera);
  const [nutritionLabelMode, setNutritionLabelMode] = useState(false);
  const [isAnalyzingNutrition, setIsAnalyzingNutrition] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleScan = () => {
    if (!barcodeInput.trim()) {
      return;
    }
    startTransition(() => {
      router.push(`/search?barcode=${encodeURIComponent(barcodeInput)}`);
    });
  };

  const handleBarcodeScan = (scannedCode: string) => {
    startTransition(() => {
      router.push(`/search?barcode=${encodeURIComponent(scannedCode)}`);
    });
  };

  const handleNutritionLabelClick = () => {
    nutritionFileInputRef.current?.click();
  };

  const handleNutritionFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      handleNutritionImageCapture(imageData);
    };
    reader.readAsDataURL(file);
  };

  const handleNutritionImageCapture = async (imageData: string) => {
    setIsAnalyzingNutrition(true);
    try {
      const response = await fetch("/api/scan-nutrition-label", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze nutrition label");
      }

      const data = await response.json();
      // Pass the nutrition data to the search page via URL state
      const encodedData = encodeURIComponent(JSON.stringify(data));
      router.push(`/search-nutrition-label?data=${encodedData}`);
    } catch (error) {
      console.error("Nutrition label analysis error:", error);
      setIsAnalyzingNutrition(false);
      router.push(`/search-nutrition-label?error=analysis_failed`);
    }
  };


  return (
    <div className="w-full min-h-screen bg-zinc-950">
      {/* Hidden nutrition label file input */}
      <input
        ref={nutritionFileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleNutritionFileChange}
        className="hidden"
      />

      {/* Nutrition Label Scanning Screen */}
      {isAnalyzingNutrition && (
        <div className="flex flex-col min-h-screen w-full bg-zinc-950 text-white items-center justify-center gap-3 px-6 py-6">
          <ScannerLoader emoji="🏷️" />
          <div className="text-center mt-1">
            <p className="text-[15px] font-semibold tracking-tight">
              Analyzing nutrition label...
            </p>
          </div>
        </div>
      )}

      {/* Barcode Camera View */}
      {useCamera && !nutritionLabelMode && (
        <CameraScanner
          onBarcodeScan={handleBarcodeScan}
          onCancel={() => {
            setUseCamera(false);
            setNutritionLabelMode(false);
            router.push("/");
          }}
        />
      )}

      {/* Initial Input Screen with Header */}
      {!useCamera && (
        <div className="w-full min-h-screen bg-zinc-950 flex flex-col">
          <div className="flex justify-center pt-2 shrink-0">
            <img
              src="/will-it-kill-me-logo.png"
              alt="will-it-kill-me"
              className="h-32 sm:h-48 w-auto max-w-xs sm:max-w-md"
            />
          </div>
          <InitialScreen
            barcode={barcodeInput}
            onBarcodeChange={setBarcodeInput}
            onScan={handleScan}
            onCameraClick={() => setUseCamera(true)}
            onNutritionLabelClick={handleNutritionLabelClick}
          />
        </div>
      )}
    </div>
  );
}
