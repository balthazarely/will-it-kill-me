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
  return (
    <div className="mb-8">
      <input
        type="text"
        inputMode="numeric"
        placeholder="Enter barcode number"
        value={barcode}
        onChange={(e) => onBarcodeChange(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') onScan();
        }}
        disabled={loading}
        className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent mb-3"
      />
      <div className="flex gap-3">
        <button
          onClick={onScan}
          disabled={loading}
          className="flex-1 px-4 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Scanning...' : 'Scan'}
        </button>
        <button
          onClick={onCameraClick}
          disabled={loading}
          className="flex-1 px-4 py-3 bg-zinc-800 text-white font-medium rounded-lg border border-zinc-700 hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Use camera to scan barcode"
        >
          📷
        </button>
      </div>
    </div>
  );
}
