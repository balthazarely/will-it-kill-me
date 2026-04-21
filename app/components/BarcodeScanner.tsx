'use client';

import { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { scanBarcode } from '@/lib/api';

export default function BarcodeScanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scannedData, setScannedData] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>('');
  const [sending, setSending] = useState(false);
  const [manualInput, setManualInput] = useState(false);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!isScanning) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Camera error:', err);
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(`Unable to access camera: ${errorMsg}`);
        setIsScanning(false);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isScanning]);

  const scanFrame = () => {
    if (!videoRef.current || !canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );
    const code = jsQR(imageData.data, imageData.width, imageData.height);

    if (code) {
      setScannedData(code.data);
      setIsScanning(false);
    }

    animationFrameRef.current = requestAnimationFrame(scanFrame);
  };

  useEffect(() => {
    if (isScanning && videoRef.current?.readyState === 4) {
      animationFrameRef.current = requestAnimationFrame(scanFrame);
    }
  }, [isScanning]);

  const handleSendToLambda = async () => {
    if (!scannedData) return;

    setSending(true);
    try {
      await scanBarcode(scannedData);
      setScannedData('');
      setError('');
    } catch (err) {
      setError('Failed to send barcode. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 items-center w-full max-w-md">
      {error && (
        <div className="w-full p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {!isScanning && !scannedData && !manualInput && (
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => {
              setIsScanning(true);
              setError('');
            }}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Open Camera & Scan Barcode
          </button>
          <button
            onClick={() => {
              setManualInput(true);
              setError('');
            }}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Enter Barcode Manually
          </button>
        </div>
      )}

      {manualInput && !scannedData && (
        <div className="w-full">
          <input
            type="text"
            placeholder="Enter barcode..."
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter' && (e.target as HTMLInputElement).value) {
                setScannedData((e.target as HTMLInputElement).value);
                setManualInput(false);
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 mb-3"
          />
          <button
            onClick={() => setManualInput(false)}
            className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      {isScanning && (
        <div className="w-full">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg bg-black"
          />
          <canvas ref={canvasRef} className="hidden" />
          <button
            onClick={() => setIsScanning(false)}
            className="w-full mt-4 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      {scannedData && (
        <div className="w-full">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-2">Scanned Data:</p>
            <p className="font-mono text-green-700 break-all">{scannedData}</p>
          </div>
          <button
            onClick={handleSendToLambda}
            disabled={sending}
            className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400"
          >
            {sending ? 'Sending...' : 'Send to Lambda'}
          </button>
          <button
            onClick={() => setScannedData('')}
            className="w-full mt-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            Scan Again
          </button>
        </div>
      )}
    </div>
  );
}
