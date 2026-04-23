import { useQuery } from "@tanstack/react-query";
import { scanBarcode, ScanError } from "@/lib/api";
import { useMemo } from "react";

export function useBarcodeLookup(barcode: string | null) {
  const memoizedOptions = useMemo(
    () => ({
      queryKey: ["barcode", barcode],
      queryFn: ({ signal }: { signal: AbortSignal }) => scanBarcode(barcode!, signal),
      enabled: !!barcode,
      retry: (failureCount: number, error: Error) => {
        if (error instanceof ScanError) {
          return error.type === "network" && failureCount < 2;
        }
        return failureCount < 2;
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }),
    [barcode]
  );

  const {
    data: product,
    isPending: loading,
    error,
  } = useQuery(memoizedOptions);

  return {
    product,
    loading,
    error,
  };
}
