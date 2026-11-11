"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShieldCheck, Sun, Eye, Flame, CheckCircle2 } from "lucide-react";

interface TintOption {
  percentage: number;
  name: string;
  category: string;
  uvRejection: string;
  irHeatRejection: string;
  glareReduction: string;
  opacityClass: string;
  popular?: boolean;
  legalNote: string;
  description: string;
}

const TINT_OPTIONS: TintOption[] = [
  {
    percentage: 5,
    name: "5% Limo Black",
    category: "Máxima Privacidad",
    uvRejection: "99.9%",
    irHeatRejection: "96%",
    glareReduction: "94%",
    opacityClass: "bg-black/95",
    legalNote: "Ideal para vidrios traseros y laterales posteriores.",
    description: "Bloqueo visual casi total del exterior hacia adentro. Máxima discreción.",
  },
  {
    percentage: 20,
    name: "20% Dark Smoke",
    category: "Factory Match",
    uvRejection: "99.5%",
    irHeatRejection: "92%",
    glareReduction: "82%",
    opacityClass: "bg-black/80",
    popular: true,
    legalNote: "Iguala la tonalidad de privacidad original de fábrica (SUV/Pickups).",
    description: "El equilibrio perfecto entre estética agresiva, visibilidad y privacidad.",
  },
  {
    percentage: 35,
    name: "35% Medium Sport",
    category: "Equilibrio Diario",
    uvRejection: "99.0%",
    irHeatRejection: "88%",
    glareReduction: "65%",
    opacityClass: "bg-black/65",
    legalNote: "Tonalidad estándar permitida en la mayoría de normativas vehiculares.",
    description: "Excelente visibilidad nocturna manteniendo una apariencia elegante y deportiva.",
  },
  {
    percentage: 50,
    name: "50% Light Neutral",
    category: "Sutil & Confort",
    uvRejection: "99.0%",
    irHeatRejection: "84%",
    glareReduction: "48%",
    opacityClass: "bg-black/45",
    legalNote: "Aprobado para conductores que buscan cero problemas de visión nocturna.",
    description: "Protección térmica notable con oscurecimiento apenas perceptible.",
  },
  {
    percentage: 70,
    name: "70% Clear Nano-Ceramic",
    category: "Protección Invisible",
    uvRejection: "99.9%",
    irHeatRejection: "95%",
    glareReduction: "25%",
    opacityClass: "bg-blue-950/20",
    legalNote: "Especialmente diseñado para parabrisas frontales completos.",
    description: "Rechaza el calor extremo sin alterar la visibilidad ni la estética original.",
  },
];

export function TintSimulator() {
  const [selected, setSelected] = useState<TintOption>(TINT_OPTIONS[1]);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl border border-white/10 bg-zinc-950/90 p-6 md:p-10 shadow-2xl backdrop-blur-xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-400 mb-2">
            <Sun className="h-3.5 w-3.5" /> Simulador Interactivo de Tonalidades
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Elige el nivel de oscuridad para tu auto
          </h2>
          <p className="text-sm text-zinc-400 mt-1">
            Compara el porcentaje de transmisión luminosa (VLT) y el rechazo térmico real.
          </p>
        </div>

        {/* Selected badge with Framer Motion counter effect */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-white/10 rounded-2xl px-5 py-3">
          <div className="text-right">
            <div className="text-xs text-zinc-400">Tono Seleccionado</div>
            <div className="text-lg font-bold text-white">{selected.name}</div>
          </div>
          <motion.div
            key={selected.percentage}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="h-10 w-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-black text-amber-400"
          >
            {selected.percentage}%
          </motion.div>
        </div>
      </div>

      {/* Simulator Vehicle Window Display with Motion Crossfade */}
      <div className="my-8 relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-8 text-center min-h-[260px] flex flex-col justify-between">
        <div className="relative mx-auto w-full max-w-2xl py-6">
          <div className="relative h-36 w-full rounded-2xl bg-zinc-800/40 border border-zinc-700/50 p-3 flex items-center justify-center overflow-hidden">
            {/* Interior car view background */}
            <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />
            
            {/* Passenger / Interior silhouette */}
            <div className="relative z-0 flex items-center justify-around w-full opacity-40 px-8 text-xs text-zinc-400">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-600 mb-1" />
                <div className="w-16 h-8 rounded-t-xl bg-zinc-700" />
                <span>Conductor</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-zinc-600 mb-1" />
                <div className="w-16 h-8 rounded-t-xl bg-zinc-700" />
                <span>Copiloto</span>
              </div>
            </div>

            {/* Tint Glass Layer with Framer Motion animated opacity */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selected.percentage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "absolute inset-0 flex items-center justify-center backdrop-blur-[0.5px]",
                  selected.opacityClass
                )}
              >
                <div className="relative z-10 text-center px-4 py-2 rounded-lg bg-black/60 border border-white/10 text-white font-mono text-sm font-bold shadow-xl">
                  Vista exterior simulada ({selected.percentage}% VLT)
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Selected Specs Bar with motion transition */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/5">
          <div className="bg-zinc-900/60 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1 justify-center sm:justify-start">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Rechazo UV
            </div>
            <motion.div
              key={selected.uvRejection}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl font-bold text-white"
            >
              {selected.uvRejection}
            </motion.div>
          </div>
          <div className="bg-zinc-900/60 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1 justify-center sm:justify-start">
              <Flame className="h-4 w-4 text-amber-400" /> Rechazo Calor (IR)
            </div>
            <motion.div
              key={selected.irHeatRejection}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl font-bold text-white"
            >
              {selected.irHeatRejection}
            </motion.div>
          </div>
          <div className="bg-zinc-900/60 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1 justify-center sm:justify-start">
              <Eye className="h-4 w-4 text-blue-400" /> Reducción Destello
            </div>
            <motion.div
              key={selected.glareReduction}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-xl font-bold text-white"
            >
              {selected.glareReduction}
            </motion.div>
          </div>
          <div className="bg-zinc-900/60 rounded-xl p-3 border border-white/5">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1 justify-center sm:justify-start">
              <CheckCircle2 className="h-4 w-4 text-purple-400" /> Categoría
            </div>
            <motion.div
              key={selected.category}
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-sm font-semibold text-zinc-200 truncate"
            >
              {selected.category}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Buttons Selector with Framer Motion layoutId pill */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {TINT_OPTIONS.map((item) => {
          const isActive = selected.percentage === item.percentage;
          return (
            <button
              key={item.percentage}
              onClick={() => setSelected(item)}
              className={cn(
                "relative flex flex-col items-center justify-center p-4 rounded-2xl border text-center transition-colors cursor-pointer",
                isActive
                  ? "border-amber-400 text-white"
                  : "border-white/10 bg-zinc-900/50 hover:bg-zinc-800/50 text-zinc-300"
              )}
            >
              {/* Framer Motion Sliding Pill Background */}
              {isActive && (
                <motion.div
                  layoutId="activeTintTab"
                  className="absolute inset-0 rounded-2xl bg-amber-500/15 border border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              {item.popular && (
                <span className="absolute -top-2.5 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-[10px] font-black uppercase text-black px-2 py-0.5 rounded-full shadow">
                  Más Popular
                </span>
              )}
              <span className="relative z-10 text-2xl font-black">{item.percentage}%</span>
              <span className="relative z-10 text-xs font-medium text-zinc-400 mt-1">
                {item.name.replace(`${item.percentage}% `, "")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Description & Legal notes */}
      <div className="mt-6 p-4 rounded-xl bg-zinc-900/40 border border-white/5 text-xs text-zinc-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p>
          <strong className="text-zinc-200">Recomendación:</strong> {selected.description}
        </p>
        <span className="text-amber-400/90 font-medium whitespace-nowrap">
          {selected.legalNote}
        </span>
      </div>
    </div>
  );
}
