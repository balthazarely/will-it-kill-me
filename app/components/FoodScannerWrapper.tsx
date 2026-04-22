"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FoodScanner from "./FoodScanner";

export default function FoodScannerWrapper() {
  const searchParams = useSearchParams();
  const [shouldOpenCamera, setShouldOpenCamera] = useState(false);

  useEffect(() => {
    if (searchParams.get("camera") === "true") {
      setShouldOpenCamera(true);
    }
  }, [searchParams]);

  return <FoodScanner initialOpenCamera={shouldOpenCamera} />;
}
