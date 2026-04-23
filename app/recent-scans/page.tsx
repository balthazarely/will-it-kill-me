"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { theme } from "@/lib/theme";
import { containerVariants, itemVariants } from "@/lib/animationVariants";
import { useScanHistory } from "@/lib/hooks";
import ScanCorners from "@/app/components/shared/ScanCorners";
import PageTransition from "@/app/components/shared/PageTransition";

export default function RecentScansPage() {
  const router = useRouter();
  const { history, isLoaded } = useScanHistory();

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (!isLoaded) {
    return (
      <PageTransition>
        <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center px-6">
          <div className="text-center">
            <div className="relative w-[200px] h-[200px] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08] flex-shrink-0 mx-auto mb-6">
              <ScanCorners
                color={theme.hex.primary600}
                size={24}
                thickness={2}
              />

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

              <div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent animate-scan-line"
                style={{
                  boxShadow: `0_0_12px_${theme.hex.primary600}`,
                }}
              />

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

              <div className="absolute inset-0 flex items-center justify-center text-[56px] animate-pulse">
                ⏱️
              </div>

              <div
                className="absolute inset-0 bg-[length:400px_100%] animate-shimmer"
                style={{
                  background: `linear-gradient(105deg,transparent 40%,rgba(${theme.rgb.primary400},0.08) 50%,transparent 60%)`,
                  backgroundSize: "400px 100%",
                }}
              />
            </div>

            <p className="text-gray-300 font-medium">Loading scan history...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!history || history.length === 0) {
    return (
      <PageTransition>
        <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-6xl mb-4">📋</div>
            <h1 className="text-3xl font-bold mb-2 text-white">No Scans Yet</h1>
            <p className="text-white/60">Go back and scan something to build your history</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-zinc-950 text-white">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-zinc-950 px-4 py-4 border-b border-primary-600/20">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <button
                onClick={() => router.push("/")}
                className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-white font-medium rounded-lg hover:border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer flex items-center gap-2"
              >
                ← Back
              </button>
            </div>
            <h1 className="text-2xl font-bold mb-2">Recent Scans</h1>
            <p className="text-white/50 text-xs">
              Your scan history. Click any product to view details.
            </p>
          </div>
        </div>

        {/* Scans List */}
        <motion.div
          className="max-w-2xl mx-auto px-4 py-6 space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {history.map((scan) => (
            <motion.div key={scan.barcode} variants={itemVariants}>
              <Link href={`/product/${scan.barcode}`}>
                <motion.div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-zinc-800/50 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                        {scan.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">{scan.barcode}</p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap">
                      {formatTime(scan.timestamp)}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </PageTransition>
  );
}
