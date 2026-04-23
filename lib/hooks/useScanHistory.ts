import { useState, useEffect, useCallback } from "react";

export interface ScanItem {
  barcode: string;
  name: string;
  timestamp: number;
}

const STORAGE_KEY = "scanHistory";
const MAX_SCANS = 5;

export function useScanHistory() {
  const [history, setHistory] = useState<ScanItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        setHistory([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const addScan = useCallback((barcode: string, name: string) => {
    setHistory((prev) => {
      const newHistory = [
        { barcode, name, timestamp: Date.now() },
        ...prev.filter((item) => item.barcode !== barcode),
      ].slice(0, MAX_SCANS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { history, addScan, clearHistory, isLoaded };
}
