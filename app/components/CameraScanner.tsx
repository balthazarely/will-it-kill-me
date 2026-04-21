'use client';

import { Scanner } from '@yudiel/react-qr-scanner';
import { scanBarcode } from '@/lib/api';

interface CameraScannerProps {
  detectedBarcode: string;
  onBarcodeChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  confirmingBarcode: boolean;
  onScannedBarcode: (barcode: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  setProduct: (product: any) => void;
}

export default function CameraScanner({
  detectedBarcode,
  onBarcodeChange,
  onConfirm,
  onCancel,
  confirmingBarcode,
  onScannedBarcode,
  setLoading,
  setError,
  setProduct,
}: CameraScannerProps) {
  const handleScan = (result: any) => {
    if (result && result.length > 0) {
      const detectedCode = result[0]?.rawValue || result[0]?.getText?.() || result[0];
      console.log('Barcode detected:', detectedCode);
      if (detectedCode) {
        onBarcodeChange(detectedCode);
      }
    }
  };

  return (
    <>
      {/* Camera View */}
      {!confirmingBarcode && (
        <div className="mb-8">
          <div className="w-full rounded-lg bg-black mb-3 overflow-hidden" style={{ aspectRatio: '1' }}>
            <Scanner onScan={handleScan} />
          </div>
          <p className="text-xs text-gray-400 text-center mb-3">
            Point camera at barcode or enter manually below
          </p>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Or type barcode number..."
            value={detectedBarcode}
            onChange={(e) => onBarcodeChange(e.target.value)}
            className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white mb-3"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (detectedBarcode) {
                  onConfirm();
                }
              }}
              disabled={!detectedBarcode}
              className="flex-1 px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
            >
              Use
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-600 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Barcode Confirmation */}
      {confirmingBarcode && (
        <div className="mb-8 p-4 bg-zinc-900 border border-zinc-700 rounded-lg">
          <p className="text-sm text-gray-400 mb-3">Scanned barcode:</p>
          <input
            type="text"
            value={detectedBarcode}
            onChange={(e) => onBarcodeChange(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-zinc-700 rounded-lg text-white text-center font-mono mb-3 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <div className="flex gap-2">
            <button
              onClick={onConfirm}
              className="flex-1 px-3 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              Use This
            </button>
            <button
              onClick={onCancel}
              className="flex-1 px-3 py-2 bg-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-600 transition-colors text-sm"
            >
              Rescan
            </button>
          </div>
        </div>
      )}
    </>
  );
}
