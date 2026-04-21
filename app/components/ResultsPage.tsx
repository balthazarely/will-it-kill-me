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
      {/* Product Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">{product.name}</h2>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className={`w-2 h-2 rounded-full ${
                dot <= product.analysis.score
                  ? getScoreColor(product.analysis.score)
                  : 'bg-zinc-700'
              }`}
            />
          ))}
          <span className={`ml-2 font-medium ${getScoreColor(product.analysis.score)}`}>
            {product.analysis.score}/5
          </span>
        </div>
      </div>

      {/* Verdict */}
      <div className={`p-4 rounded-lg border ${getScoreBgColor(product.analysis.score)}`}>
        <p className="text-sm text-gray-300">{product.analysis.verdict}</p>
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
            { label: 'Calories', value: product.nutriments['energy-kcal_100g'], unit: 'kcal' },
            { label: 'Fat', value: product.nutriments['fat_100g'], unit: 'g' },
            { label: 'Sat. Fat', value: product.nutriments['saturated-fat_100g'], unit: 'g' },
            { label: 'Carbs', value: product.nutriments['carbohydrates_100g'], unit: 'g' },
            { label: 'Sugar', value: product.nutriments['sugars_100g'], unit: 'g' },
            { label: 'Protein', value: product.nutriments['proteins_100g'], unit: 'g' },
            { label: 'Salt', value: product.nutriments['salt_100g'], unit: 'g' },
            { label: 'Fiber', value: product.nutriments['fiber_100g'], unit: 'g' },
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
