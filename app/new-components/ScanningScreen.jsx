// ScanningScreen.jsx
import { useState, useEffect } from "react";
import ScanCorners from "./ScanCorners";

const STEPS = [
  "Reading ingredients",
  "Cross-referencing danger list",
  "Consulting science",
];

export default function ScanningScreen({ food }) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const id = setInterval(
      () => setDots((d) => (d.length >= 3 ? "" : d + ".")),
      400,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-white items-center justify-center gap-6 px-8">
      {/* Animated viewfinder */}
      <div className="relative w-[220px]  `h-55` rounded-2xl overflow-hidden bg-white/[0.03] border border-white/[0.08]">
        <ScanCorners color="#a78bfa" size={28} thickness={3} />

        {/* Scan line — uses custom animation defined in tailwind.config.js */}
        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-400 to-transparent animate-scan-line shadow-[0_0_12px_#a78bfa]" />

        {/* Food emoji */}
        <div className="absolute inset-0 flex items-center justify-center text-[64px] animate-pulse">
          {food.emoji}
        </div>

        {/* Shimmer overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(167,139,250,0.08)_50%,transparent_60%)] bg-[length:400px_100%] animate-shimmer" />
      </div>

      {/* Status text */}
      <div className="text-center">
        <p className="text-[17px] font-semibold tracking-tight mb-1.5">
          Analyzing {food.name}
        </p>
        <p className="text-[13px] text-white/40 font-medium">
          Running the numbers{dots}
        </p>
      </div>

      {/* Progress steps */}
      <div className="flex flex-col gap-2 w-full max-w-[260px]">
        {STEPS.map((step, i) => (
          <div
            key={step}
            className="flex items-center gap-2.5 animate-fade-up"
            style={{ animationDelay: `${i * 0.2}s`, animationFillMode: "both" }}
          >
            <div className="w-[18px] h-[18px] rounded-full shrink-0 bg-violet-400/15 border border-violet-400/30 flex items-center justify-center">
              {i < 2 ? (
                /* checkmark */
                <svg width="9" height="7" viewBox="0 0 9 7">
                  <path
                    d="M1 3.5L3.5 6 8 1"
                    stroke="#a78bfa"
                    strokeWidth="1.6"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                /* spinner */
                <div className="w-[6px] h-[6px] rounded-full border border-violet-400/20 border-t-violet-400 animate-spin" />
              )}
            </div>
            <span
              className={`text-[12px] font-medium ${i < 2 ? "text-white/50" : "text-white/35"}`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
