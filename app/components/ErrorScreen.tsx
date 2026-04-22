'use client';

interface ErrorScreenProps {
  barcode: string;
  onBack: () => void;
}

export default function ErrorScreen({ barcode, onBack }: ErrorScreenProps) {
  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white items-center justify-center gap-6 px-8">
      {/* Error Icon */}
      <div className="text-6xl mb-4">❌</div>

      {/* Error Title */}
      <h2 className="text-3xl font-bold text-center">Product Not Found</h2>

      {/* Error Details */}
      <div className="max-w-md text-center">
        <p className="text-gray-400 mb-3">
          We couldn't find any product information for barcode:
        </p>
        <p className="font-mono text-sm bg-zinc-900 p-3 rounded-lg border border-zinc-700 mb-4">
          {barcode}
        </p>
        <p className="text-sm text-gray-500">
          This could mean the barcode is invalid, the product isn't in our database, or the barcode may be damaged.
        </p>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-sm flex flex-col gap-3 pt-4">
        <button
          onClick={onBack}
          className="w-full px-6 py-3 bg-zinc-800 text-white font-medium rounded-xl hover:bg-zinc-700 transition-colors border border-zinc-700 cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
