import { useEffect, useState } from "react";

export interface ProgressUpdate {
  status: string;
  message: string;
}

export function useScanProgress(barcode: string | null) {
  const [progress, setProgress] = useState<ProgressUpdate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!barcode) return;

    const eventSource = new EventSource(`/api/scan/${barcode}/progress`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setProgress(data);
      } catch (err) {
        console.error("Failed to parse progress event:", err);
      }
    };

    eventSource.onerror = () => {
      setError("Connection error");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [barcode]);

  return {
    progress,
    error,
  };
}
