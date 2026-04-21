'use client';

import { useState } from 'react';
import { type Product } from '@/lib/api';
import { getScoreColor, getScoreBgColor } from '@/lib/scoreUtils';

interface ResultsPageProps {
  product: Product;
  onReset: () => void;
}

export default function ResultsPage({ product, onReset }: ResultsPageProps) {
  const [expandedIngredients, setExpandedIngredients] = useState(false);

  return (
    <div className="space-y-4">
      {/* Product Header with Image */}
      <div className="mb-6 flex gap-4 items-start">
        {/* Product Image */}
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-24 h-24 rounded-lg shadow-lg object-cover shrink-0"
          />
        )}

        {/* Title and Brand */}
        <div className="flex-1">
          {product.brand && (
            <p className="text-sm text-gray-400 mb-1">{product.brand}</p>
          )}
          <h2 className="text-2xl font-bold">{product.name}</h2>
        </div>
      </div>

      {/* Score - Health Rating */}
      <div className={`mb-6 p-6 rounded-2xl border-2 ${getScoreBgColor(product.analysis.score)}`}>
        <div className="mb-4">
          <p className="text-sm text-white mb-2">Health Score</p>
          <div className="flex items-baseline gap-1">
            <p className={`text-6xl font-bold ${getScoreColor(product.analysis.score)}`}>
              {product.analysis.score}
            </p>
            <p className="text-white text-sm">out of 5</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-zinc-900 rounded-full h-2 mb-4 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${getScoreColor(product.analysis.score)}`}
            style={{ width: `${(product.analysis.score / 5) * 100}%` }}
          />
        </div>

        <div className={`text-sm font-semibold ${getScoreColor(product.analysis.score)}`}>
          {product.analysis.score === 5 && "✓ Excellent choice"}
          {product.analysis.score === 4 && "✓ Good choice"}
          {product.analysis.score === 3 && "⚠ Proceed with caution"}
          {product.analysis.score === 2 && "⚠ Not recommended"}
          {product.analysis.score === 1 && "☠ Avoid"}
        </div>
      </div>

      {/* Verdict */}
      <div className={`p-4 rounded-lg ${getScoreBgColor(product.analysis.score)}`}>
        <p className="text-sm text-white leading-relaxed">{product.analysis.verdict}</p>
      </div>

      {/* Flags */}
      {product.analysis.flags.length > 0 && (
        <div className="pt-2">
          <div className="flex items-start gap-2 mb-2">
            <span className="text-yellow-400 text-lg mt-0.5">⚠</span>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2">
                {product.analysis.flags.map((flag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-full text-xs text-gray-300"
                  >
                    {flag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nutrition Grid */}
      <div className="pt-2">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Nutrition per 100g</h3>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Calories', value: product.nutriments?.['energy-kcal_100g'], unit: 'kcal' },
            { label: 'Fat', value: product.nutriments?.['fat_100g'], unit: 'g' },
            { label: 'Sat. Fat', value: product.nutriments?.['saturated-fat_100g'], unit: 'g' },
            { label: 'Carbs', value: product.nutriments?.['carbohydrates_100g'], unit: 'g' },
            { label: 'Sugar', value: product.nutriments?.['sugars_100g'], unit: 'g' },
            { label: 'Protein', value: product.nutriments?.['proteins_100g'], unit: 'g' },
            { label: 'Salt', value: product.nutriments?.['salt_100g'], unit: 'g' },
            { label: 'Fiber', value: product.nutriments?.['fiber_100g'], unit: 'g' },
          ].map((nutrient) => (
            <div
              key={nutrient.label}
              className="bg-zinc-900 p-3 rounded-lg border border-zinc-800"
            >
              <p className="text-xs text-gray-500 mb-1">{nutrient.label}</p>
              <p className="text-lg font-semibold">
                {nutrient.value !== null && nutrient.value !== undefined
                  ? nutrient.value.toFixed(1)
                  : '—'}
              </p>
              <p className="text-xs text-gray-600">{nutrient.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestion */}
      <div className="flex gap-3 pt-2">
        <span className="text-lg">💡</span>
        <p className="text-sm text-gray-300">{product.analysis.suggestion}</p>
      </div>

      {/* Ingredients */}
      <div className="pt-2">
        <button
          onClick={() => setExpandedIngredients(!expandedIngredients)}
          className="w-full py-2 px-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm font-medium text-left hover:border-zinc-700 transition-colors flex justify-between items-center"
        >
          Ingredients
          <span className="text-xs text-gray-500">{expandedIngredients ? '▼' : '▶'}</span>
        </button>
        {expandedIngredients && (
          <div className="mt-3 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
            <p className="text-sm text-gray-300 leading-relaxed">{product.ingredients}</p>
          </div>
        )}
      </div>

      {/* Scan Again Button */}
      <button
        onClick={onReset}
        className="w-full mt-6 px-4 py-3 bg-zinc-900 text-white border border-zinc-700 font-medium rounded-lg hover:border-zinc-600 transition-colors"
      >
        Scan Another Product
      </button>
    </div>
  );
}
