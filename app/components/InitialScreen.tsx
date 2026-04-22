import { motion } from "framer-motion";
import Link from "next/link";
import { theme } from "@/lib/theme";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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

interface InitialScreenProps {
  barcode: string;
  onBarcodeChange: (value: string) => void;
  onScan: () => void;
  onCameraClick: () => void;
  loading: boolean;
}

export default function InitialScreen({
  barcode,
  onBarcodeChange,
  onScan,
  onCameraClick,
  loading,
}: InitialScreenProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      className="flex flex-col h-full bg-zinc-950 text-white items-center justify-start gap-6 px-8 pt-6 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Subtitle */}
      <motion.p
        className="text-lg max-w-sm  text-white/70 text-center"
        variants={itemVariants}
      >
        Scan barcodes to find out if your food is trying to kill you.
      </motion.p>

      {/* Camera Button + Input Section */}
      <motion.div
        className="w-full max-w-sm flex flex-col gap-8"
        variants={itemVariants}
      >
        {/* Camera Button - Large & Primary */}
        <button
          onClick={onCameraClick}
          disabled={loading}
          className="w-full px-8 py-6 text-white font-semibold rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-lg shadow-lg"
          style={{
            ...(isHovering ? theme.styles.primaryGradientHover : theme.styles.primaryGradient),
            transition: "background 0.15s ease",
          }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          title="Use camera to scan barcode"
        >
          📷 Scan with Camera
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-white/40 font-medium">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Manual Input */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter barcode number"
            value={barcode}
            onChange={(e) => onBarcodeChange(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") onScan();
            }}
            disabled={loading}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
          />
          <button
            onClick={onScan}
            disabled={loading || !barcode.trim()}
            className="w-full px-4 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors border border-white/10"
          >
            {loading ? "Scanning..." : "Search Barcode"}
          </button>
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Links Section */}
      <motion.div className="w-full max-w-sm space-y-3" variants={itemVariants}>
        <Link
          href="/recent-scans"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 hover:border-white/20 cursor-pointer transition-colors text-center block"
        >
          📋 Recent Scans
        </Link>
        <Link
          href="/hall-of-shame"
          className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 hover:border-white/20 cursor-pointer transition-colors text-center block"
        >
          💀 Hall of Shame
        </Link>
      </motion.div>
    </motion.div>
  );
}
