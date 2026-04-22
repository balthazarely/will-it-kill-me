"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ScanCorners from "./ScanCorners";
import { theme } from "@/lib/theme";


interface ScanningScreenProps {
  productName: string;
  emoji?: string;
  onCancel?: () => void;
}

export default function ScanningScreen({
  productName,
  emoji = "🍔",
  onCancel,
}: ScanningScreenProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const id = setInterval(
      () => setDots((d) => (d.length >= 3 ? "" : d + ".")),
      400,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-zinc-950 text-white items-center justify-center gap-3 px-6 py-6">
      {/* Animated viewfinder */}
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

        {/* Food emoji */}
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

      {/* Status text */}
      <div className="text-center mt-1">
        <p className="text-[15px] font-semibold tracking-tight mb-0.5">
          Analyzing {productName}
        </p>
        <p className="text-[14px] text-white/40 font-medium">
          Consulting a scientist<span className="inline-block w-[12px] text-left">{dots}</span>
        </p>
      </div>

      {/* Cancel Button */}
      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 px-6 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/10 cursor-pointer"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
