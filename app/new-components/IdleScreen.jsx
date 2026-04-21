// IdleScreen.jsx
import { FOODS } from '../constants';
import ScanCorners from './ScanCorners';

export default function IdleScreen({ onScan }) {
  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white">

      {/* Header */}
      <div className="px-6 pt-16 pb-4">
        <p className="text-[11px] font-semibold tracking-[3px] uppercase text-white/35 mb-1.5">
          Food scanner
        </p>
        <h1 className="text-[28px] font-bold leading-tight tracking-tight">
          Will it<br />kill me?
        </h1>
      </div>

      {/* Viewfinder */}
      <div className="px-6 flex-1">
        <div className="relative rounded-2xl overflow-hidden bg-white/[0.04] border border-white/[0.08] h-[220px] flex items-center justify-center">
          {/* vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />
          {/* corner brackets */}
          <div className="absolute inset-5">
            <ScanCorners />
          </div>
          {/* center prompt */}
          <div className="relative z-10 text-center">
            <div className="w-12 h-12 rounded-[14px] bg-white/[0.07] border border-white/10 flex items-center justify-center mx-auto mb-2.5">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7z" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" />
                <path d="M3 9V6a1 1 0 0 1 1-1h3M3 15v3a1 1 0 0 0 1 1h3M21 9V6a1 1 0 0 0-1-1h-3M21 15v3a1 1 0 0 1-1 1h-3" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <p className="text-[13px] text-white/40 font-medium">Point at a food label</p>
          </div>
        </div>
      </div>

      {/* Demo food list */}
      <div className="px-6 pt-4 pb-3">
        <p className="text-[11px] font-semibold tracking-[2.5px] uppercase text-white/30 mb-2.5">
          Or tap to scan
        </p>
        <div className="flex flex-col gap-2">
          {FOODS.map((food) => (
            <button
              key={food.id}
              onClick={() => onScan(food)}
              className="flex items-center gap-3 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] rounded-[14px] px-3.5 py-2.5 text-left transition-colors duration-150 w-full"
            >
              <span className="text-[22px]">{food.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-semibold tracking-tight truncate">{food.name}</p>
                <p className="text-[11px] text-white/40 mt-0.5">{food.tagline}</p>
              </div>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" className="shrink-0">
                <path d="M1 1l5 5-5 5" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          ))}
        </div>
      </div>

      <div className="h-8" />
    </div>
  );
}
