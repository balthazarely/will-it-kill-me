import { Suspense } from "react";
import FoodScannerWrapper from "./components/FoodScannerWrapper";
import PageTransition from "./components/shared/PageTransition";

function ScannerLoader() {
  return (
    <div className="w-full h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-white/60">Loading scanner...</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        <Suspense fallback={<ScannerLoader />}>
          <FoodScannerWrapper />
        </Suspense>
      </div>
    </PageTransition>
  );
}
