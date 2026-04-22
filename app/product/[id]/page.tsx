"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { scanBarcode } from "@/lib/api";
import ResultsPage from "@/app/components/ResultsPage";
import PageTransition from "@/app/components/PageTransition";
import ScanCorners from "@/app/components/ScanCorners";
import { useRouter } from "next/navigation";
import { theme } from "@/lib/theme";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const {
    data: product,
    isPending: loading,
    error,
  } = useQuery({
    queryKey: ["barcode", id],
    queryFn: async () => {
      return scanBarcode(id);
    },
    enabled: !!id,
  });

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
          {/* Animated viewfinder */}
          <div className="relative w-[200px] h-[200px] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08] flex-shrink-0 mx-auto mb-6">
            <ScanCorners color={theme.hex.primary600} size={24} thickness={2} />

            {/* Animated scan line - back and forth */}
            <motion.div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-400 to-transparent"
              style={{
                boxShadow: `0_0_8px_${theme.hex.primary600}`,
              }}
              animate={{
                top: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
            />

            {/* Search emoji */}
            <div className="absolute inset-0 flex items-center justify-center text-[56px] animate-pulse">
              🔍
            </div>

            {/* Shimmer overlay */}
            <div
              className="absolute inset-0 bg-[length:400px_100%] animate-shimmer"
              style={{
                background: `linear-gradient(105deg,transparent 40%,rgba(${theme.rgb.primary400},0.08) 50%,transparent 60%)`,
                backgroundSize: "400px 100%",
              }}
            />
          </div>

          {/* Status text */}
          <p className="text-gray-300 font-medium">
            Loading product details...
          </p>
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
            onClick={handleBack}
            className="w-full px-4 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700 cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
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
