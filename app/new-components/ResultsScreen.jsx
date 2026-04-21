// ResultsScreen.jsx
import { VERDICT_CONFIG } from '../constants';

export default function ResultsScreen({ food, result, onBack }) {
  const vc = VERDICT_CONFIG[result.verdict] ?? VERDICT_CONFIG.caution;
  const ingredients = food.ingredients
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const isFlagged = (ingredient) =>
    result.flagged?.some((f) =>
      ingredient.toLowerCase().includes(f.toLowerCase())
    ) ?? false;

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white overflow-y-auto">

      {/* Top bar */}
      <div className="flex items-center gap-2.5 px-5 pt-16 pb-3 border-b border-white/[0.06]">
        <button
          onClick={onBack}
          className="bg-white/[0.07] hover:bg-white/[0.12] border-none rounded-[10px] w-8 h-8 flex items-center justify-center cursor-pointer text-white/70 shrink-0 transition-colors"
        >
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
            <path d="M7 1L1 7l6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="text-[14px] font-semibold text-white/70 tracking-tight truncate">
          {food.emoji} {food.name}
        </span>
      </div>

      {/* Verdict card */}
      <div
        className={`mx-4 mt-4 ${vc.bgColor} border ${vc.borderColor} rounded-[20px] p-5 animate-fade-up`}
      >
        <p className={`text-[11px] font-bold tracking-[2.5px] uppercase ${vc.textColor} opacity-80 mb-2`}>
          Verdict
        </p>
        <p className={`text-[24px] font-bold tracking-tight leading-tight ${vc.textColor} mb-3`}>
          {vc.icon} {vc.label}
        </p>
        <p className="text-[14px] leading-relaxed text-white/75">
          {result.summary}
        </p>
        {result.highlights && result.highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {result.highlights.map((h) => (
              <span
                key={h}
                className={`text-[11px] font-semibold tracking-wide ${vc.tagBg} border ${vc.tagBorder} rounded-full px-2.5 py-0.5 ${vc.tagText}`}
              >
                {h}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Ingredients list */}
      <div className="mx-4 mt-3.5 animate-fade-up [animation-delay:100ms] [animation-fill-mode:both]">
        <p className="text-[11px] font-bold tracking-[2.5px] uppercase text-white/35 mb-2.5">
          Ingredients ({ingredients.length})
        </p>
        <div className="bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden">
          {ingredients.map((ing, i) => (
            <div
              key={i}
              className={`flex items-center gap-2 px-3.5 py-2.5 ${
                i < ingredients.length - 1 ? 'border-b border-white/[0.06]' : ''
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  isFlagged(ing) ? vc.dotColor : 'bg-white/15'
                }`}
              />
              <span
                className={`text-[13px] leading-snug ${
                  isFlagged(ing)
                    ? `font-semibold text-white/95`
                    : 'font-normal text-white/60'
                }`}
              >
                {ing}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-11" />
    </div>
  );
}
