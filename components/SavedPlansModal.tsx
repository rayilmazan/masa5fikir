'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LessonPlan } from '@/types/plan';
import { X, BookOpen, Trash2, ArrowRight, Calendar, Clock, Layers } from 'lucide-react';

interface SavedPlansModalProps {
  onLoadPlan: (plan: LessonPlan) => void;
}

export function SavedPlansModal({ onLoadPlan }: SavedPlansModalProps) {
  const {
    isSavedPlansModalOpen,
    closeSavedPlansModal,
    savedPlans,
    deleteSavedPlan,
    user,
  } = useAuth();

  if (!isSavedPlansModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-bold text-slate-900">Kayıtlı Ders Planlarım</h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {user ? `${user.name} (${user.branch || 'Öğretmen'})` : 'Giriş Yapıldı'} · Toplam {savedPlans.length} plan
            </p>
          </div>
          <button
            onClick={closeSavedPlansModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {savedPlans.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-semibold text-slate-700 text-sm">
                Henüz kayıtlı bir ders planınız bulunmuyor.
              </div>
              <p className="text-xs max-w-sm mx-auto text-slate-400">
                Öğrenme çıktılarınızı girip 5E planınızı oluşturduktan sonra &quot;Planı Hesabıma Kaydet&quot; butonuna basarak burada saklayabilirsiniz.
              </p>
            </div>
          ) : (
            savedPlans.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500/60 bg-slate-50/50 hover:bg-white transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm truncate">
                        {item.title}
                      </span>
                      {item.grade && (
                        <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                          {item.grade}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-600 truncate">
                      {item.subject}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formattedDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        40 Dk
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={async () => {
                        if (confirm(`"${item.title}" planını silmek istediğinize emin misiniz?`)) {
                          await deleteSavedPlan(item.id);
                        }
                      }}
                      title="Planı Sil"
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        onLoadPlan(item.planJson);
                        closeSavedPlansModal();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <span>Aç & İncele</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
