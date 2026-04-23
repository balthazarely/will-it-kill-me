import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useBarcodeLookup } from "./useBarcodeLookup";
import { useScanHistory } from "./useScanHistory";

export function useProductSearch() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const rawBarcode = searchParams.get("barcode");
  const [barcode, setBarcode] = useState<string | null>(null);
  const initializedRef = useRef(false);
  const { addScan } = useScanHistory();

  // Stabilize barcode value to prevent multiple query initializations
  useEffect(() => {
    if (rawBarcode && !initializedRef.current) {
      setBarcode(rawBarcode);
      initializedRef.current = true;
    }
  }, [rawBarcode]);

  const { product, loading, error } = useBarcodeLookup(barcode);

  // Auto-redirect to product page on success
  useEffect(() => {
    if (product && barcode) {
      addScan(barcode, product.name);
      router.push(`/product/${barcode}`);
    }
  }, [product, barcode, router, addScan]);

  const cancelSearch = useCallback(() => {
    queryClient.cancelQueries({ queryKey: ["barcode", barcode] });
    router.push("/");
  }, [barcode, queryClient, router]);

  return {
    barcode,
    product,
    loading,
    error,
    cancelSearch,
  };
}
