"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getScoreColor, getScoreBgColor } from "@/lib/scoreUtils";
import PageTransition from "@/app/components/shared/PageTransition";

interface NutritionAnalysis {
  product_name?: string;
  score: number;
  verdict: string;
  flags?: string[];
  suggestion?: string;
  key_nutrients?: {
    calories?: string;
    sugars?: string;
    saturated_fat?: string;
    sodium?: string;
  };
  confidence?: "high" | "medium" | "low";
}

function SearchNutritionLabelContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  const error = searchParams.get("error");

  let analysis: NutritionAnalysis | null = null;
  if (dataParam) {
    try {
      analysis = JSON.parse(dataParam);
    } catch (e) {
      console.error("Failed to parse nutrition data:", e);
    }
  }

  const handleBack = () => {
    router.push("/");
  };

  if (error) {
    return (
      <PageTransition>
        <div className="p-4">
          <main className="w-full max-w-md mx-auto py-8 flex flex-col items-center justify-center min-h-screen">
            <p className="text-red-400 mb-6 text-center">
              Failed to analyze nutrition label. Please try again.
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white font-medium rounded-lg hover:border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </main>
        </div>
      </PageTransition>
    );
  }

  if (!analysis) {
    return (
      <PageTransition>
        <div className="p-4">
          <main className="w-full max-w-md mx-auto py-8 flex flex-col items-center justify-center min-h-screen">
            <p className="text-white/70 mb-6 text-center">
              No nutrition data available
            </p>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white font-medium rounded-lg hover:border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              ← Back
            </button>
          </main>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="p-4">
        <main className="w-full max-w-md mx-auto py-8">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-8 px-6 py-3 flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white font-medium rounded-lg hover:border-zinc-700 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            ← Back
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">
              {analysis.product_name || "Nutrition Label"}
            </h1>
            {analysis.confidence && (
              <p className="text-white/50 text-sm">
                Analysis confidence: {analysis.confidence}
              </p>
            )}
          </div>

          {/* Health Score */}
          <div
            className={`mb-6 p-6 rounded-2xl border-2 ${getScoreBgColor(analysis.score)}`}
          >
            <div className="mb-4">
              <p className="text-sm text-white mb-2">Health Score</p>
              <div className="flex items-baseline gap-1">
                <p
                  className={`text-6xl font-bold ${getScoreColor(analysis.score)}`}
                >
                  {analysis.score}
                </p>
                <p className="text-white text-sm">out of 5</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-zinc-900 rounded-full h-2 mb-4 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${getScoreColor(analysis.score)}`}
                style={{ width: `${(analysis.score / 5) * 100}%` }}
              />
            </div>

            <div className={`text-sm font-semibold ${getScoreColor(analysis.score)}`}>
              {analysis.verdict}
            </div>
          </div>

          {/* Key Nutrients */}
          {analysis.key_nutrients && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
              <h2 className="font-bold mb-3 text-sm">Key Nutrients</h2>
              <div className="space-y-2 text-sm">
                {analysis.key_nutrients.calories && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Calories</span>
                    <span className="font-semibold">{analysis.key_nutrients.calories}</span>
                  </div>
                )}
                {analysis.key_nutrients.sugars && (
                  <div className="flex justify-between">
                    <span className="text-red-400">Sugars</span>
                    <span className="font-semibold text-red-400">{analysis.key_nutrients.sugars}</span>
                  </div>
                )}
                {analysis.key_nutrients.saturated_fat && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Saturated Fat</span>
                    <span className="font-semibold">{analysis.key_nutrients.saturated_fat}</span>
                  </div>
                )}
                {analysis.key_nutrients.sodium && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Sodium</span>
                    <span className="font-semibold">{analysis.key_nutrients.sodium}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Flags */}
          {analysis.flags && analysis.flags.length > 0 && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
              <h2 className="font-bold mb-3 text-sm text-red-400">Concerns</h2>
              <div className="space-y-2">
                {analysis.flags.map((flag, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-red-400 font-bold mt-0.5">•</span>
                    <p className="text-white/70 text-sm">{flag}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestion */}
          {analysis.suggestion && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6">
              <h2 className="font-bold mb-2 text-sm">💡 Healthier Alternative</h2>
              <p className="text-white/70 text-sm">{analysis.suggestion}</p>
            </div>
          )}

          {/* Scan Another Button */}
          <button
            onClick={handleBack}
            className="w-full mt-6 px-4 py-3 bg-zinc-900 text-white border border-zinc-700 font-medium rounded-lg hover:border-zinc-600 transition-colors cursor-pointer"
          >
            Scan Another Label
          </button>
        </main>
      </div>
    </PageTransition>
  );
}

export default function SearchNutritionLabelPage() {
  return (
    <Suspense fallback={<div className="w-full min-h-screen bg-zinc-950" />}>
      <SearchNutritionLabelContent />
    </Suspense>
  );
}
