'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Compass,
  BookOpen,
  Layers,
  CheckCircle,
  Clock,
  LayoutGrid,
  ImageIcon,
} from 'lucide-react';

export function HeroGraphic() {
  const [viewMode, setViewMode] = useState<'chart' | 'illustration'>('chart');

  return (
    <div className="relative h-64 sm:h-72 lg:h-80 w-full rounded-2xl overflow-hidden border border-white/15 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white p-4 sm:p-5 flex flex-col justify-between shadow-2xl">
      {/* Top Bar inside Graphic Card */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5 z-10">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
            5E Öğrenme Döngüsü & Masa Modeli
          </span>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-lg text-[11px]">
          <button
            type="button"
            onClick={() => setViewMode('chart')}
            className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'chart'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3 h-3" />
            <span>Grafik</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('illustration')}
            className={`px-2 py-1 rounded font-medium transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'illustration'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Görsel</span>
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <>
          {/* 5E Pedagogical Timeline Cycle */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 my-auto py-2 z-10">
            {/* 1. Giriş */}
            <div className="bg-sky-500/15 border border-sky-400/30 rounded-xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-between hover:bg-sky-500/25 transition-all group">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-tight">1. Giriş</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center my-1 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 text-sky-300" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-200 leading-tight">Merak & Kanca</span>
              <span className="text-[9px] font-mono text-sky-300 font-bold mt-1">6 Dk</span>
            </div>

            {/* 2. Keşfetme */}
            <div className="bg-emerald-500/15 border border-emerald-400/30 rounded-xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-between hover:bg-emerald-500/25 transition-all group">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tight">2. Keşfet</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center my-1 group-hover:scale-110 transition-transform">
                <Compass className="w-4 h-4 text-emerald-300" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-200 leading-tight">Aktif Deney</span>
              <span className="text-[9px] font-mono text-emerald-300 font-bold mt-1">11 Dk</span>
            </div>

            {/* 3. Açıklama */}
            <div className="bg-amber-500/15 border border-amber-400/30 rounded-xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-between hover:bg-amber-500/25 transition-all group">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-tight">3. Açıkla</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center my-1 group-hover:scale-110 transition-transform">
                <BookOpen className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-200 leading-tight">Kavram Yapısı</span>
              <span className="text-[9px] font-mono text-amber-300 font-bold mt-1">9 Dk</span>
            </div>

            {/* 4. Derinleştirme */}
            <div className="bg-purple-500/15 border border-purple-400/30 rounded-xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-between hover:bg-purple-500/25 transition-all group">
              <span className="text-[10px] font-bold text-purple-400 uppercase tracking-tight">4. Derinleştir</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center my-1 group-hover:scale-110 transition-transform">
                <Layers className="w-4 h-4 text-purple-300" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-200 leading-tight">Yeni Problem</span>
              <span className="text-[9px] font-mono text-purple-300 font-bold mt-1">9 Dk</span>
            </div>

            {/* 5. Değerlendirme */}
            <div className="bg-rose-500/15 border border-rose-400/30 rounded-xl p-2 sm:p-2.5 text-center flex flex-col items-center justify-between hover:bg-rose-500/25 transition-all group">
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-tight">5. Değerlendir</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center my-1 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-4 h-4 text-rose-300" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-200 leading-tight">Çıkış Bileti</span>
              <span className="text-[9px] font-mono text-rose-300 font-bold mt-1">5 Dk</span>
            </div>
          </div>

          {/* Bottom Masa 5 Fikir Stations Banner */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-2 sm:p-2.5 flex items-center justify-between flex-wrap gap-2 z-10 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              <span>Masa 5 Fikir İstasyonları:</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-300 flex-wrap">
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 font-medium">M1: Görsel</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 font-medium">M2: Mantıksal</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 font-medium">M3: Sosyal</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 font-medium">M4: Üretim</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30 font-medium">M5: Felsefi</span>
            </div>
            <div className="flex items-center gap-1 font-mono font-bold text-white text-[11px] bg-emerald-600/60 px-2 py-0.5 rounded-md">
              <Clock className="w-3 h-3 text-emerald-300" />
              <span>40 Dk</span>
            </div>
          </div>
        </>
      ) : (
        /* Alternative Illustration View */
        <div className="relative flex-1 w-full rounded-xl overflow-hidden border border-white/10 my-2">
          <Image
            src="/images/hero_v2.jpg"
            alt="Masa 5 Fikir Öğretmen ve Sınıf İllüstrasyonu"
            fill
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
            <span className="text-xs text-white/95 font-semibold">
              Çağdaş Sınıf İstasyonları & 5E Pedagoji Modeli
            </span>
          </div>
        </div>
      )}

      {/* Background Decorative Gradient Blobs */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
}
