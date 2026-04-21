'use client';

import { useEffect, useRef, useState } from 'react';
import Quagga from '@ericblade/quagga2';
import { scanBarcode, type Product } from '@/lib/api';

export default function FoodScanner() {

  const [barcode, setBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [product, setProduct] = useState<Product | null>(null);
  const [expandedIngredients, setExpandedIngredients] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    if (!useCamera) return;

    const initQuagga = async () => {
      try {
        await Quagga.init(
          {
            inputStream: {
              name: 'Live',
              type: 'LiveStream',
              target: '#quagga-scanner',
              constraints: {
                facingMode: 'environment',
              },
            },
            decoder: {
              readers: [
                'code_128_reader',
                'ean_reader',
                'ean_8_reader',
                'upc_reader',
                'upc_e_reader',
              ],
              debug: {
                showCanvas: false,
                showPatternLabel: false,
                showFrequency: false,
                showErrors: false,
              },
            },
            locate: true,
          },
          (err) => {
            if (err) {
              setCameraError('Failed to initialize camera');
              setUseCamera(false);
              return;
            }

            Quagga.start();

            Quagga.onDetected((result) => {
              if (result.codeResult.code) {
                setBarcode(result.codeResult.code);
                setUseCamera(false);
                Quagga.stop();
              }
            });
          }
        );
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unable to access camera';
        setCameraError(msg);
        setUseCamera(false);
      }
    };

    initQuagga();

    return () => {
      try {
        Quagga.stop();
      } catch (e) {
        // Quagga might not be initialized
      }
    };
  }, [useCamera]);

  const handleScan = async () => {
    if (!barcode.trim()) {
      setError('Please enter a barcode');
      return;
    }

    setLoading(true);
    setError('');
    setProduct(null);

    try {
      const data = await scanBarcode(barcode);
      setProduct(data);
      setBarcode('');
    } catch (err) {
      setError('Product not found. Please check the barcode and try again.');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score <= 2) return 'text-green-400';
    if (score === 3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score <= 2) return 'bg-green-400/10 border-green-400/30';
    if (score === 3) return 'bg-yellow-400/10 border-yellow-400/30';
    return 'bg-red-400/10 border-red-400/30';
  };

  return (
    <div className="w-full">
      {/* Camera Error */}
      {cameraError && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-xs">{cameraError}</p>
        </div>
      )}

      {/* Camera View */}
      {useCamera && (
        <div className="mb-8">
          <div
            id="quagga-scanner"
            className="w-full rounded-lg bg-black mb-3 overflow-hidden"
            style={{ aspectRatio: '1' }}
          />
          <button
            onClick={() => {
              setUseCamera(false);
              setCameraError('');
            }}
            className="w-full px-4 py-2 bg-zinc-700 text-white font-medium rounded-lg hover:bg-zinc-600 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Input Section */}
      {!useCamera && (
        <div className="mb-8">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Enter barcode number"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleScan();
            }}
            disabled={loading}
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent mb-3"
          />
          <div className="flex gap-3">
            <button
              onClick={handleScan}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Scanning...' : 'Scan'}
            </button>
            <button
              onClick={() => setUseCamera(true)}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-zinc-800 text-white font-medium rounded-lg border border-zinc-700 hover:border-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Use camera to scan barcode"
            >
              📷
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Result Card */}
      {product && (
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
            onClick={() => {
              setProduct(null);
              setError('');
              setBarcode('');
            }}
            className="w-full mt-6 px-4 py-3 bg-zinc-900 text-white border border-zinc-700 font-medium rounded-lg hover:border-zinc-600 transition-colors"
          >
            Scan Another Product
          </button>
        </div>
      )}
    </div>
  );
}
