"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import InitialScreen from "./InitialScreen";
import CameraScanner from "./CameraScanner";

interface FoodScannerProps {
  initialOpenCamera?: boolean;
}

export default function FoodScanner({ initialOpenCamera = false }: FoodScannerProps) {
  const router = useRouter();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [useCamera, setUseCamera] = useState(initialOpenCamera);

  const handleScan = () => {
    if (!barcodeInput.trim()) {
      return;
    }
    router.push(`/search?barcode=${encodeURIComponent(barcodeInput)}`);
  };

  const handleBarcodeScan = (scannedCode: string) => {
    setUseCamera(false);
    router.push(`/search?barcode=${encodeURIComponent(scannedCode)}`);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950">
      {/* Camera View */}
      {useCamera && (
        <CameraScanner
          onBarcodeScan={handleBarcodeScan}
          onCancel={() => {
            setUseCamera(false);
            router.push("/");
          }}
        />
      )}

      {/* Initial Input Screen with Header */}
      {!useCamera && (
        <div className="w-full min-h-screen bg-zinc-950 flex flex-col">
          <div className="flex justify-center pt-2 flex-shrink-0">
            <img
              src="/will-it-kill-me-logo.png"
              alt="Scanr"
              className="h-32 sm:h-48 w-auto max-w-xs sm:max-w-md"
            />
          </div>
          <InitialScreen
            barcode={barcodeInput}
            onBarcodeChange={setBarcodeInput}
            onScan={handleScan}
            onCameraClick={() => setUseCamera(true)}
            loading={false}
          />
        </div>
      )}
    </div>
  );
}
