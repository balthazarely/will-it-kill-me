'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { scanBarcode } from '@/lib/api';
import ResultsPage from '@/app/components/ResultsPage';
import { useRouter } from 'next/navigation';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: product, isPending: loading, error } = useQuery({
    queryKey: ['barcode', id],
    queryFn: async () => {
      return scanBarcode(id);
    },
    enabled: !!id,
  });

  const handleReset = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-400">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-400 mb-6">The product could not be loaded.</p>
          <button
            onClick={handleReset}
            className="w-full px-4 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <main className="w-full max-w-md mx-auto py-8">
        <button
          onClick={handleReset}
          className="mb-6 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          ← Back
        </button>
        <div className="mb-8">
          <img src="/logo.png" alt="Scanr" className="h-32 w-auto" />
        </div>
        <ResultsPage product={product} onReset={handleReset} />
      </main>
    </div>
  );
}
