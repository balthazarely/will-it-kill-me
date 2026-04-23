"use client";

import { motion } from "framer-motion";
import ScanCorners from "../shared/ScanCorners";
import { theme } from "@/lib/theme";

interface ScannerLoaderProps {
  emoji?: string;
}

export default function ScannerLoader({ emoji = "🔍" }: ScannerLoaderProps) {
  return (
    <div className="relative w-[200px] h-[200px] rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08] flex-shrink-0">
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

      {/* Emoji */}
      <div className="absolute inset-0 flex items-center justify-center text-[56px] animate-pulse">
        {emoji}
      </div>

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

      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 bg-[length:400px_100%] animate-shimmer"
        style={{
          background: `linear-gradient(105deg,transparent 40%,rgba(${theme.rgb.primary400},0.08) 50%,transparent 60%)`,
          backgroundSize: "400px 100%",
        }}
      />
    </div>
  );
}
