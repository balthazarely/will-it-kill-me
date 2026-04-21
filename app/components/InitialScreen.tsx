import { motion } from 'framer-motion';
import { ScanItem } from '@/lib/useScanHistory';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

interface InitialScreenProps {
  barcode: string;
  onBarcodeChange: (value: string) => void;
  onScan: () => void;
  onCameraClick: () => void;
  loading: boolean;
  recentScans?: ScanItem[];
  onRecentScanClick?: (barcode: string) => void;
}

export default function InitialScreen({
  barcode,
  onBarcodeChange,
  onScan,
  onCameraClick,
  loading,
  recentScans,
  onRecentScanClick,
}: InitialScreenProps) {
  return (
    <motion.div
      className="flex flex-col h-full bg-zinc-950 text-white items-center justify-center gap-8 px-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Camera Button + Input Section */}
      <motion.div className="w-full max-w-sm flex flex-col gap-8" variants={itemVariants}>
        {/* Camera Button - Large & Primary */}
        <button
          onClick={onCameraClick}
          disabled={loading}
          className="w-full px-8 py-6 bg-gradient-to-r from-violet-600 to-violet-500 text-white font-semibold rounded-2xl hover:from-violet-700 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg shadow-lg hover:shadow-violet-500/30"
          title="Use camera to scan barcode"
        >
          📷 Open Camera
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
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
          />
          <button
            onClick={onScan}
            disabled={loading || !barcode.trim()}
            className="w-full px-4 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors border border-white/10"
          >
            {loading ? "Scanning..." : "Scan Barcode"}
          </button>
        </div>
      </motion.div>

      {/* Recent Scans */}
      {recentScans && recentScans.length > 0 && (
        <motion.div className="w-full max-w-sm" variants={itemVariants}>
          <p className="text-xs text-white/40 font-medium mb-2">Recent Scans</p>
          <div className="flex flex-wrap gap-2">
            {recentScans.map((scan) => (
              <button
                key={scan.barcode}
                onClick={() => onRecentScanClick?.(scan.barcode)}
                className="px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-sm text-white/90 hover:bg-white/20 hover:border-white/30 transition-colors"
              >
                {scan.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
