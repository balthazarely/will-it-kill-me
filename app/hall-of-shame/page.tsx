"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "@/lib/theme";
import { getScoreColor, getScoreBgColor } from "@/lib/scoreUtils";
import { useHallOfShame } from "@/lib/useHallOfShame";
import ScanCorners from "@/app/components/ScanCorners";
import PageTransition from "@/app/components/PageTransition";

const getSkullRating = (score: number): number => {
  return Math.max(1, 6 - Math.round(score));
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
};

export default function HallOfShamePage() {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { data: products, isPending, error } = useHallOfShame();

  if (isPending) {
    return (
      <PageTransition>
        <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center px-6">
          <div className="text-center">
            {/* Animated viewfinder */}
            <div className="relative w-[200px] h-[200px] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08] flex-shrink-0 mx-auto mb-6">
              <ScanCorners
                color={theme.hex.primary600}
                size={24}
                thickness={2}
              />

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
                  ease: "linear",
                }}
              />

              {/* Scan line — uses custom animation defined in tailwind.config.js */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent animate-scan-line"
                style={{
                  boxShadow: `0_0_12px_${theme.hex.primary600}`,
                }}
              />

              {/* Scanning lines */}
              <motion.div
                className="absolute left-0 right-0 h-[3px] pointer-events-none"
                style={{
                  backgroundColor: theme.hex.primary400,
                  boxShadow: `0_0_8px_${theme.hex.primary400}`,
                  zIndex: 10,
                  opacity: 0.6,
                }}
                animate={{
                  top: ["10%", "90%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />

              {/* Skull emoji */}
              <div className="absolute inset-0 flex items-center justify-center text-[56px] animate-pulse">
                💀
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
            <p className="text-gray-300 font-medium">Loading the worst...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error || !products || products.length === 0) {
    return (
      <PageTransition>
        <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">😇</div>
            <h1 className="text-3xl font-bold mb-2 text-white">
              Nothing Here Yet
            </h1>
            <p className="text-white/60">
              Go scan something terrible to build our hall of shame
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-zinc-950 text-white">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-gradient-to-b from-zinc-950 to-zinc-950/0 px-4 py-4 border-b border-primary-600/20">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => router.push("/")}
                className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-white font-medium rounded-lg hover:border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="text-2xl font-bold mb-2">Hall of Shame</h1>
            <p className="text-white/50 text-xs">
              The objectively worst food products ever scanned. Don't say we
              didn't warn you.
            </p>
          </div>
        </div>

        {/* Products List */}
        <motion.div
          className="max-w-2xl mx-auto px-4 py-6 space-y-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {products.map((product, index) => {
            const isExpanded = expandedId === product.barcode;

            return (
              <motion.div key={product.barcode} variants={itemVariants}>
                {/* Product Header */}
                <Link href={`/product/${product.barcode}`}>
                  <motion.div className="mb-2 flex gap-4 items-start cursor-pointer group hover:opacity-80 transition-opacity">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-lg shadow-lg object-cover shrink-0 group-hover:shadow-primary-600/50 transition-shadow"
                      />
                    )}

                    {/* Title and Brand */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          {product.brand && (
                            <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                              {product.brand}
                            </p>
                          )}
                        </div>
                        <p
                          className={`text-lg font-bold ${getScoreColor(product.score)} whitespace-nowrap`}
                        >
                          {product.danger_score}/100
                        </p>
                      </div>
                      <h2 className="text-lg font-bold group-hover:text-primary-400 transition-colors">
                        #{index + 1} {product.name}
                      </h2>
                    </div>
                  </motion.div>
                </Link>

                {/* Verdict */}
                <motion.div
                  className={`mb-3 p-3 rounded-lg ${getScoreBgColor(product.score)}`}
                  variants={itemVariants}
                >
                  <p className="text-xs text-white/70 leading-relaxed">
                    "{product.verdict}"
                  </p>
                </motion.div>

                {/* Expandable Section */}
                {(product.flags.length > 0 || product.scan_count > 0) && (
                  <>
                    <motion.button
                      onClick={() =>
                        setExpandedId(isExpanded ? null : product.barcode)
                      }
                      className="w-full py-2 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-medium text-left hover:border-zinc-700 transition-colors flex justify-between items-center cursor-pointer"
                      variants={itemVariants}
                    >
                      <span>Details</span>
                      <motion.span
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-xs text-gray-500"
                      >
                        ▼
                      </motion.span>
                    </motion.button>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2 p-3 bg-zinc-900/50 border border-zinc-700 rounded-lg space-y-2"
                        >
                          {/* Flags */}
                          {product.flags.length > 0 && (
                            <div>
                              <div className="flex flex-wrap gap-2">
                                {product.flags.map((flag, idx) => (
                                  <span
                                    key={idx}
                                    className="inline-block px-2 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-gray-300"
                                  >
                                    {flag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Stats */}
                          <div className="text-xs text-gray-400 pt-2 border-t border-zinc-700">
                            <span className="block">
                              Scanned {product.scan_count}x
                            </span>
                            <span className="block">
                              {product.additives_count} additives
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </PageTransition>
  );
}
