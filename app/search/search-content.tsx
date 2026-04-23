"use client";

import { useRouter } from "next/navigation";
import { useProductSearch } from "@/lib/hooks";
import ScanningScreen from "@/app/components/home/ScanningScreen";
import PageTransition from "@/app/components/shared/PageTransition";
import ErrorScreen from "@/app/components/shared/ErrorScreen";

export default function SearchContent() {
  const router = useRouter();
  const { barcode, product, loading, error, cancelSearch } = useProductSearch();

  // Show loading screen while initializing or fetching
  if (!barcode || loading) {
    return (
      <ScanningScreen
        productName={barcode || "Scanning..."}
        barcode={barcode || undefined}
        onCancel={barcode ? cancelSearch : undefined}
      />
    );
  }

  // Show error only when we have a barcode and there's an actual error
  if (error || !product) {
    return (
      <PageTransition>
        <ErrorScreen barcode={barcode} onBack={() => router.push("/")} />
      </PageTransition>
    );
  }
}
