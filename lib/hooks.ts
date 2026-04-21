import { useQuery } from '@tanstack/react-query';
import { scanBarcode, type Product } from './api';

export function useScanBarcode(barcode: string | null) {
  const { data, isPending, error, isError } = useQuery<Product, Error>({
    queryKey: ['barcode', barcode],
    queryFn: async () => {
      if (!barcode) {
        throw new Error('Barcode is required');
      }
      return scanBarcode(barcode);
    },
    enabled: !!barcode,
    retry: 1,
  });

  return {
    data,
    isPending: isPending && !!barcode,
    error,
    isError,
  };
}
