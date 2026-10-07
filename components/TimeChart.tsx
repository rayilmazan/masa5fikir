'use client';

import React from 'react';
import { LessonStage } from '@/types/plan';

interface TimeChartProps {
  stages: LessonStage[];
  totalMinutes?: number;
  compact?: boolean;
}

const STAGE_COLORS: Record<string, { fill: string; stroke: string; bg: string; text: string }> = {
  engage: { fill: '#0284c7', stroke: '#0369a1', bg: 'bg-sky-50', text: 'text-sky-800' }, // Giriş - Canlı mavi
  explore: { fill: '#059669', stroke: '#047857', bg: 'bg-emerald-50', text: 'text-emerald-800' }, // Keşfetme - Zümrüt yeşil
  explain: { fill: '#d97706', stroke: '#b45309', bg: 'bg-amber-50', text: 'text-amber-800' }, // Açıklama - Sıcak kehribar
  elaborate: { fill: '#7c3aed', stroke: '#6d28d9', bg: 'bg-purple-50', text: 'text-purple-800' }, // Derinleştirme - Mor
  evaluate: { fill: '#e11d48', stroke: '#be123c', bg: 'bg-rose-50', text: 'text-rose-800' }, // Değerlendirme - Gül kırmızı
};

export function TimeChart({ stages, totalMinutes = 40, compact = false }: TimeChartProps) {
  // Calculate polar coordinates for Donut chart
  const size = compact ? 140 : 180;
  const strokeWidth = compact ? 22 : 28;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  // Precompute segments immutably
  const computedStages = stages.map((stg, index) => {
    const pct = (stg.durationMinutes || 0) / totalMinutes;
    const priorPct = stages.slice(0, index).reduce((acc, curr) => acc + (curr.durationMinutes || 0) / totalMinutes, 0);
    return {
      ...stg,
      pct,
      strokeDasharray: `${pct * circumference} ${circumference}`,
      strokeDashoffset: -priorPct * circumference,
    };
  });

  return (
    <div className="w-full bg-slate-50/80 rounded-xl p-4 border border-slate-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-xs font-semibold tracking-wide uppercase text-slate-700">
          5E Modeli Süreç & Zaman Dağılım Grafiği (Toplam {totalMinutes} Dakika)
        </h4>
        <span className="text-xs font-mono tabular-nums text-slate-500">
          40 dk / 1 Ders Saati
        </span>
      </div>

      {/* Horizontal Timeline Bar */}
      <div className="w-full h-7 rounded-lg overflow-hidden flex border border-slate-300 shadow-inner mb-4">
        {stages.map((stg) => {
          const pct = ((stg.durationMinutes || 0) / totalMinutes) * 100;
          const color = STAGE_COLORS[stg.key] || { fill: '#475569', stroke: '#334155' };
          return (
            <div
              key={stg.key}
              style={{ width: `${pct}%`, backgroundColor: color.fill }}
              className="h-full flex items-center justify-center text-[11px] font-bold text-white tracking-wider transition-all relative group"
              title={`${stg.name}: ${stg.durationMinutes} Dk (%${Math.round(pct)})`}
            >
              <span className="truncate px-1 drop-shadow-sm">
                {stg.durationMinutes} dk
              </span>
            </div>
          );
        })}
      </div>

      {/* Donut and Legend Details */}
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        {/* SVG Donut */}
        <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform -rotate-90">
            {/* Background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
            />
            {/* Stage segments */}
            {computedStages.map((stg) => {
              const color = STAGE_COLORS[stg.key] || { fill: '#475569', stroke: '#334155' };

              return (
                <circle
                  key={stg.key}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={color.fill}
                  strokeWidth={strokeWidth}
                  strokeDasharray={stg.strokeDasharray}
                  strokeDashoffset={stg.strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xl font-bold text-slate-800 font-mono tabular-nums leading-none">
              40
            </span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">
              Dakika
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full text-xs">
          {stages.map((stg) => {
            const color = STAGE_COLORS[stg.key] || { fill: '#475569', bg: 'bg-slate-100', text: 'text-slate-800' };
            const pct = Math.round(((stg.durationMinutes || 0) / totalMinutes) * 100);
            return (
              <div
                key={stg.key}
                className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80 shadow-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-3 h-3 rounded-xs shrink-0"
                    style={{ backgroundColor: color.fill }}
                    aria-hidden="true"
                  />
                  <span className="font-medium text-slate-800 truncate">
                    {stg.name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2 font-mono tabular-nums text-slate-600">
                  <span className="font-semibold text-slate-900">{stg.durationMinutes} dk</span>
                  <span className="text-slate-400 text-[10px]">(%{pct})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
