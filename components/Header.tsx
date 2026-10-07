'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, FileDown, Plus, User, LogOut, Layers } from 'lucide-react';

interface HeaderProps {
  activeTab: 'outcomes' | 'plan' | 'pdf';
  setActiveTab: (tab: 'outcomes' | 'plan' | 'pdf') => void;
  hasPlan: boolean;
  onReset: () => void;
  onPdfClick: () => void;
}

export function Header({
  activeTab,
  setActiveTab,
  hasPlan,
  onReset,
  onPdfClick,
}: HeaderProps) {
  const { user, logout, openAuthModal, openSavedPlansModal, savedPlans } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <button
          onClick={() => setActiveTab('outcomes')}
          className="text-left group flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
        >
          <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
            Masa 5 Fikir
          </span>
        </button>

        {/* Zone 2: 3-section tab controls */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('outcomes')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'outcomes'
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            1. Öğrenme Çıktıları
          </button>

          <button
            onClick={() => hasPlan && setActiveTab('plan')}
            disabled={!hasPlan}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'plan'
                ? 'bg-emerald-50 text-emerald-800'
                : hasPlan
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            2. 5E Ders Planı
          </button>

          <button
            onClick={() => hasPlan && setActiveTab('pdf')}
            disabled={!hasPlan}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'pdf'
                ? 'bg-emerald-50 text-emerald-800'
                : hasPlan
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                : 'text-slate-300 cursor-not-allowed'
            }`}
          >
            3. Planı İndir (PDF)
          </button>
        </nav>

        {/* Zone 3: Primary Actions and Auth */}
        <div className="flex items-center gap-2">
          {hasPlan && (
            <>
              <button
                onClick={onReset}
                title="Yeni bir ders planı başlat"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Yeni</span>
              </button>

              <button
                onClick={onPdfClick}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Pdf Al</span>
              </button>
            </>
          )}

          {user ? (
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <button
                onClick={openSavedPlansModal}
                title="Kayıtlı Ders Planlarım"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Planlarım</span>
                <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                  {savedPlans.length}
                </span>
              </button>

              <div
                title={`${user.name} (${user.branch || 'Öğretmen'})`}
                className="hidden lg:flex items-center gap-1.5 px-2 py-1 text-xs text-slate-600 bg-slate-50 rounded-lg"
              >
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px]">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="font-semibold text-slate-800 max-w-[100px] truncate">
                  {user.name}
                </span>
              </div>

              <button
                onClick={logout}
                title="Çıkış Yap"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Giriş Yap</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 py-1.5 px-2 bg-slate-50/50">
        <button
          onClick={() => setActiveTab('outcomes')}
          className={`px-2.5 py-1 text-xs font-medium rounded ${
            activeTab === 'outcomes' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-600'
          }`}
        >
          1. Çıktılar
        </button>
        <button
          onClick={() => hasPlan && setActiveTab('plan')}
          disabled={!hasPlan}
          className={`px-2.5 py-1 text-xs font-medium rounded ${
            activeTab === 'plan'
              ? 'bg-emerald-100 text-emerald-800 font-bold'
              : hasPlan
              ? 'text-slate-600'
              : 'text-slate-300'
          }`}
        >
          2. 5E Planı
        </button>
        <button
          onClick={() => hasPlan && setActiveTab('pdf')}
          disabled={!hasPlan}
          className={`px-2.5 py-1 text-xs font-medium rounded ${
            activeTab === 'pdf'
              ? 'bg-emerald-100 text-emerald-800 font-bold'
              : hasPlan
              ? 'text-slate-600'
              : 'text-slate-300'
          }`}
        >
          3. PDF İndir
        </button>
      </div>
    </header>
  );
}
