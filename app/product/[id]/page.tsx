"use client";

import { useParams } from "next/navigation";
import { useBarcodeLookup } from "@/lib/hooks";
import ResultsPage from "@/app/components/product/ResultsPage";
import PageTransition from "@/app/components/shared/PageTransition";
import ScannerLoader from "@/app/components/home/ScannerLoader";
import ErrorScreen from "@/app/components/shared/ErrorScreen";
import { useRouter } from "next/navigation";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { product, loading, error } = useBarcodeLookup(id);

  const handleBack = () => {
    router.push("/");
  };

  const handleScanAgain = () => {
    router.push("/?camera=true");
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-6">
            <ScannerLoader emoji="🔍" />
          </div>
          <p className="text-gray-300 font-medium">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return <ErrorScreen barcode={id} onBack={handleBack} />;
  }

  return (
    <PageTransition>
      <div className="p-4">
        <main className="w-full max-w-md mx-auto py-8">
          <button
            onClick={handleBack}
            className="mb-8 px-6 py-3 flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white font-medium rounded-lg hover:border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            ← Back
          </button>
          <ResultsPage product={product} onReset={handleScanAgain} />
        </main>
      </div>
    </PageTransition>
  );
}
