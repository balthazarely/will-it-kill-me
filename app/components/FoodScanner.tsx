"use client";

import { useState } from "react";
import { scanBarcode, type Product } from "@/lib/api";
import InitialScreen from "./InitialScreen";
import CameraScanner from "./CameraScanner";
import ResultsPage from "./ResultsPage";

export default function FoodScanner() {
  const [barcode, setBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [useCamera, setUseCamera] = useState(false);
  const [detectedBarcode, setDetectedBarcode] = useState("");
  const [confirmingBarcode, setConfirmingBarcode] = useState(false);

  const handleScan = async () => {
    if (!barcode.trim()) {
      setError("Please enter a barcode");
      return;
    }

    setLoading(true);
    setError("");
    setProduct(null);

    try {
      const data = await scanBarcode(barcode);
      setProduct(data);
      setBarcode("");
    } catch (err) {
      setError("Product not found. Please check the barcode and try again.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCameraUseBarcode = () => {
    setConfirmingBarcode(true);
  };

  const handleCameraCancel = () => {
    setUseCamera(false);
    setConfirmingBarcode(false);
    setDetectedBarcode("");
  };

  const handleConfirmedBarcodeScan = async () => {
    setUseCamera(false);
    setConfirmingBarcode(false);
    setLoading(true);
    setError("");
    setProduct(null);

    try {
      const data = await scanBarcode(detectedBarcode);
      setProduct(data);
      setDetectedBarcode("");
    } catch (err) {
      setError("Product not found. Please check the barcode and try again.");
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRescan = () => {
    setDetectedBarcode("");
    setConfirmingBarcode(false);
  };

  const handleReset = () => {
    setProduct(null);
    setError("");
    setBarcode("");
  };

  return (
    <div className="w-full">
      {/* Camera View */}
      {useCamera && (
        <CameraScanner
          detectedBarcode={detectedBarcode}
          onBarcodeChange={setDetectedBarcode}
          onConfirm={
            confirmingBarcode
              ? handleConfirmedBarcodeScan
              : handleCameraUseBarcode
          }
          onCancel={confirmingBarcode ? handleRescan : handleCameraCancel}
          confirmingBarcode={confirmingBarcode}
          onScannedBarcode={(code) => {
            setUseCamera(false);
          }}
          setLoading={setLoading}
          setError={setError}
          setProduct={setProduct}
        />
      )}

      {/* Initial Input Screen */}
      {!useCamera && !product && (
        <>
          <InitialScreen
            barcode={barcode}
            onBarcodeChange={setBarcode}
            onScan={handleScan}
            onCameraClick={() => setUseCamera(true)}
            loading={loading}
          />

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </>
      )}

      {/* Results Page */}
      {product && <ResultsPage product={product} onReset={handleReset} />}
    </div>
  );
}
