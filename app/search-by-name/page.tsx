"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import PageTransition from "@/app/components/shared/PageTransition";

function SearchByNameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  const handleBack = () => {
    router.push("/");
  };

  return (
    <PageTransition>
      <div className="w-full min-h-screen bg-zinc-950 flex items-center justify-center px-6 py-8">
        <div className="text-center">
          <p className="text-white/70 mb-6">
            Searching for: <span className="text-white font-semibold">{name}</span>
          </p>
          <p className="text-white/50 mb-6">
            Product name search is coming soon!
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-primary-500 text-white font-medium rounded-xl hover:bg-primary-600 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </PageTransition>
  );
}

export default function SearchByNamePage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-zinc-950" />}>
      <SearchByNameContent />
    </Suspense>
  );
}
