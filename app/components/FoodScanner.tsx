"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useScanBarcode } from "@/lib/hooks";
import { useScanHistory } from "@/lib/useScanHistory";
import InitialScreen from "./InitialScreen";
import CameraScanner from "./CameraScanner";
import ScanningScreen from "./ScanningScreen";
import ErrorScreen from "./ErrorScreen";

interface FoodScannerProps {
  initialOpenCamera?: boolean;
}

export default function FoodScanner({ initialOpenCamera = false }: FoodScannerProps) {
  const router = useRouter();
  const [barcodeInput, setBarcodeInput] = useState("");
  const [barcodeToScan, setBarcodeToScan] = useState<string | null>(null);
  const [useCamera, setUseCamera] = useState(initialOpenCamera);
  const [error, setError] = useState("");
  const [lastScannedBarcode, setLastScannedBarcode] = useState<string | null>(
    null,
  );
  const [isNavigating, setIsNavigating] = useState(false);

  const queryClient = useQueryClient();
  const { history, addScan } = useScanHistory();

  const {
    data: product,
    isPending: loading,
    error: queryError,
  } = useScanBarcode(barcodeToScan);

  // Set error state when query returns an error
  useEffect(() => {
    if (queryError && !loading) {
      setError("Product not found. Please check the barcode and try again.");
    }
  }, [queryError, loading]);

  // Navigate to product page when product is loaded
  useEffect(() => {
    if (product && lastScannedBarcode && !isNavigating) {
      setIsNavigating(true);
      addScan(lastScannedBarcode, product.name);
      router.push(`/product/${lastScannedBarcode}`);
    }
  }, [product, lastScannedBarcode, router, addScan, isNavigating]);

  const handleScan = () => {
    if (!barcodeInput.trim()) {
      setError("Please enter a barcode");
      return;
    }
    setError("");
    setLastScannedBarcode(barcodeInput);
    setBarcodeToScan(barcodeInput);
  };

  const handleBarcodeScan = (scannedCode: string) => {
    setError("");
    setUseCamera(false);
    setLastScannedBarcode(scannedCode);
    setBarcodeToScan(scannedCode);
  };

  const handleErrorRetry = () => {
    setBarcodeInput("");
    setError("");
    setLastScannedBarcode(null);
  };

  const handleErrorBack = () => {
    setBarcodeInput("");
    setError("");
    setBarcodeToScan(null);
    setLastScannedBarcode(null);
    queryClient.invalidateQueries({ queryKey: ["barcode"] });
  };

  const handleReset = () => {
    setBarcodeToScan(null);
    setBarcodeInput("");
    setError("");
    setLastScannedBarcode(null);
    queryClient.invalidateQueries({ queryKey: ["barcode"] });
  };

  return (
    <div className="w-full min-h-screen bg-zinc-950">
      {/* Loading/Scanning State */}
      {loading && barcodeToScan && (
        <ScanningScreen
          productName={barcodeToScan}
          onCancel={() => {
            setBarcodeToScan(null);
            setIsNavigating(false);
          }}
        />
      )}

      {/* Camera View */}
      {!loading && useCamera && (
        <CameraScanner
          onBarcodeScan={handleBarcodeScan}
          onCancel={() => {
            setUseCamera(false);
            router.push("/");
          }}
        />
      )}

      {/* Error Screen */}
      {error && lastScannedBarcode && !loading && !product && (
        <ErrorScreen barcode={lastScannedBarcode} onBack={handleErrorBack} />
      )}

      {/* Initial Input Screen with Header */}
      {!loading && !useCamera && !product && !error && !isNavigating && (
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
            loading={loading}
          />
        </div>
      )}
    </div>
  );
}
