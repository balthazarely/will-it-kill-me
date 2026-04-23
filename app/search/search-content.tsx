"use client";

import { useRouter } from "next/navigation";
import { useProductSearch } from "@/lib/hooks";
import ScanningScreen from "@/app/components/home/ScanningScreen";
import PageTransition from "@/app/components/shared/PageTransition";
import ErrorScreen from "@/app/components/shared/ErrorScreen";

export default function SearchContent() {
  const router = useRouter();
  const { barcode, product, loading, error, cancelSearch } = useProductSearch();

  if (!barcode) {
    return (
      <PageTransition>
        <ErrorScreen barcode="unknown" onBack={() => router.push("/")} />
      </PageTransition>
    );
  }

  if (loading) {
    return <ScanningScreen productName={barcode} onCancel={cancelSearch} />;
  }

  if (error || !product) {
    return (
      <PageTransition>
        <ErrorScreen barcode={barcode} onBack={() => router.push("/")} />
      </PageTransition>
    );
  }
}
