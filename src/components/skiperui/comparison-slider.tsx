"use client";

import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/context/LocaleContext";

interface ComparisonSliderProps {
  className?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export function ComparisonSlider({
  className,
  beforeLabel,
  afterLabel,
}: ComparisonSliderProps) {
  const { t, image } = useLocale();
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onClick={(e) => handleMove(e.clientX)}
      className={cn(
        "relative h-72 sm:h-96 w-full select-none overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl cursor-ew-resize",
        className
      )}
    >
      {/* Before Layer (Clear glass / exposed) */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-amber-950/30 via-zinc-900 to-zinc-950" style={image("compare_before") ? { backgroundImage: `linear-gradient(rgba(79,38,0,.38),rgba(0,0,0,.5)), url("${image("compare_before")?.url}")`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}>
        <div className="text-center p-6">
          <div className="inline-block px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-xs font-semibold mb-2">
            {t("compare.beforeBadge")}
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-zinc-100">
            {t("compare.beforeTitle")}
          </h4>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mt-1 mx-auto">
            {t("compare.beforeBody")}
          </p>
        </div>
        <span className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1 text-xs font-bold text-zinc-300 backdrop-blur">
          {beforeLabel ?? t("compare.beforeLabel")}
        </span>
      </div>

      {/* After Layer (Ceramic Tint / Protected) with clip path */}
      <div
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-zinc-950 via-zinc-900 to-black overflow-hidden"
        style={{
          clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
          backgroundImage: image("compare_after") ? `linear-gradient(rgba(0,0,0,.67),rgba(0,0,0,.78)), url("${image("compare_after")?.url}")` : undefined,
          backgroundSize: "cover", backgroundPosition: "center",
        }}
      >
        <div className="text-center p-6">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-2">
            {t("compare.afterBadge")}
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-white">
            {t("compare.afterTitle")}
          </h4>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mt-1 mx-auto">
            {t("compare.afterBody")}
          </p>
        </div>
        <span className="absolute bottom-4 right-4 rounded-lg bg-amber-500/80 px-3 py-1 text-xs font-bold text-black backdrop-blur">
          {afterLabel ?? t("compare.afterLabel")}
        </span>
      </div>

      {/* Slider Divider Bar & Handle */}
      <div
        className="absolute bottom-0 top-0 w-0.5 bg-gradient-to-b from-amber-400 via-white to-amber-400 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-zinc-900 border-2 border-amber-400 flex items-center justify-center shadow-xl">
          <svg
            className="w-4 h-4 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              d="M8 9l-4 3 4 3m8-6l4 3-4 3"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
