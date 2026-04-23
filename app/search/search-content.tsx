"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { scanBarcode } from "@/lib/api";
import { useScanHistory } from "@/lib/useScanHistory";
import ScanningScreen from "@/app/components/ScanningScreen";
import PageTransition from "@/app/components/PageTransition";

export default function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const barcode = searchParams.get("barcode");
  const { addScan } = useScanHistory();

  const {
    data: product,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: ["barcode", barcode],
    queryFn: () => scanBarcode(barcode!),
    enabled: !!barcode,
  });

  // Auto-redirect to product page on success
  useEffect(() => {
    if (product && barcode) {
      addScan(barcode, product.name);
      router.push(`/product/${barcode}`);
    }
  }, [product, barcode, router, addScan]);

  if (!barcode) {
    return (
      <PageTransition>
        <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-3xl font-bold mb-4">Invalid Search</h2>
            <p className="text-gray-400 mb-6">No barcode provided.</p>
            <button
              onClick={() => router.push("/")}
              className="w-full px-4 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700 cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (loading) {
    return <ScanningScreen productName={barcode} onCancel={() => router.push("/")} />;
  }

  if (error || !product) {
    return (
      <PageTransition>
        <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
            <p className="text-gray-400 mb-6">
              Could not find a product with barcode: {barcode}
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full px-4 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700 cursor-pointer"
            >
              Back to Home
            </button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return null;
}
