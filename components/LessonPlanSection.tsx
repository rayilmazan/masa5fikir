'use client';

import React, { useState } from 'react';
import { LessonPlan } from '@/types/plan';
import { TimeChart } from './TimeChart';
import {
  Clock,
  BookOpen,
  Compass,
  Lightbulb,
  CheckCircle,
  Users,
  Sparkles,
  Layers,
  ArrowRight,
  Copy,
  Check,
  FileDown,
  AlertCircle,
  HelpCircle,
  ListOrdered,
} from 'lucide-react';

interface LessonPlanSectionProps {
  plan: LessonPlan;
  onGoToPdf: () => void;
  onBackToOutcomes: () => void;
}

const STAGE_THEMES: Record<
  string,
  { label: string; badgeBg: string; textCol: string; borderCol: string; icon: React.ReactNode }
> = {
  engage: {
    label: '1. Giriş (Engage)',
    badgeBg: 'bg-sky-50',
    textCol: 'text-sky-800',
    borderCol: 'border-sky-200',
    icon: <Sparkles className="w-4 h-4 text-sky-600" />,
  },
  explore: {
    label: '2. Keşfetme (Explore)',
    badgeBg: 'bg-emerald-50',
    textCol: 'text-emerald-800',
    borderCol: 'border-emerald-200',
    icon: <Compass className="w-4 h-4 text-emerald-600" />,
  },
  explain: {
    label: '3. Açıklama (Explain)',
    badgeBg: 'bg-amber-50',
    textCol: 'text-amber-800',
    borderCol: 'border-amber-200',
    icon: <BookOpen className="w-4 h-4 text-amber-600" />,
  },
  elaborate: {
    label: '4. Derinleştirme (Elaborate)',
    badgeBg: 'bg-purple-50',
    textCol: 'text-purple-800',
    borderCol: 'border-purple-200',
    icon: <Layers className="w-4 h-4 text-purple-600" />,
  },
  evaluate: {
    label: '5. Değerlendirme (Evaluate)',
    badgeBg: 'bg-rose-50',
    textCol: 'text-rose-800',
    borderCol: 'border-rose-200',
    icon: <CheckCircle className="w-4 h-4 text-rose-600" />,
  },
};

export function LessonPlanSection({
  plan,
  onGoToPdf,
  onBackToOutcomes,
}: LessonPlanSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    let text = `# ${plan.lessonName || 'Ders Planı'} - ${plan.subjectTopic || ''}\n`;
    text += `Sınıf: ${plan.gradeLevel} | Süre: ${plan.totalDurationMinutes} Dk (5E Modeli)\n\n`;
    text += `## Öğrenme Çıktıları:\n`;
    plan.learningOutcomes.forEach((o, i) => (text += `${i + 1}. ${o}\n`));
    text += `\n## 5E Ders Akışı:\n`;
    plan.stages.forEach((s) => {
      text += `\n### ${s.name} (${s.durationMinutes} Dk)\n`;
      text += `Amaç: ${s.objective}\n`;
      text += `Öğretmen Rolü: ${s.teacherAction}\n`;
      text += `Öğrenci Rolü: ${s.studentAction}\n`;
    });
    text += `\n## Masa 5  5 Fikir:\n`;
    plan.table5Ideas.forEach((t) => {
      text += `\n- ${t.title} [${t.targetStyle}]: ${t.description}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            2. Bölüm: 5E Ders Planı Önizleme
          </span>
          <h2 className="text-lg font-bold text-slate-900">
            {plan.lessonName} - {plan.subjectTopic}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>{plan.gradeLevel}</span>
            <span aria-hidden="true">·</span>
            <span>40 Dakika</span>
            <span aria-hidden="true">·</span>
            <span>5E Yapılandırmacı Model</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={copyToClipboard}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Kopyalandı</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Metni Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={onGoToPdf}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <FileDown className="w-4 h-4" />
            <span>Pdf Olarak Al</span>
          </button>
        </div>
      </div>

      {/* SVG Time Allocation Chart */}
      <TimeChart stages={plan.stages} totalMinutes={plan.totalDurationMinutes} />

      {/* Core Pedagogical Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
            Pedagojik Amaç & Temel Çerçeve
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {plan.pedagogicalGoal}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Hedeflenen Öğrenme Çıktıları
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {plan.learningOutcomes.map((outcome, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-semibold text-emerald-700 shrink-0">
                    ÖÇ {idx + 1}:
                  </span>
                  <span>{outcome.replace(/^Öğrenme Çıktısı \d+:\s*/i, '')}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Anahtar Kavramlar & Materyaller
            </h4>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {plan.keyConcepts?.map((k, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {k}
                </span>
              ))}
            </div>
            {plan.materialsNeeded && plan.materialsNeeded.length > 0 && (
              <p className="text-xs text-slate-500">
                <strong>Gerekli Araçlar:</strong> {plan.materialsNeeded.join(', ')}
              </p>
            )}
          </div>
        </div>

        {plan.misconceptions && plan.misconceptions.length > 0 && (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Olası Kavram Yanılgıları ve Dikkat Noktaları:</strong>{' '}
              {plan.misconceptions.join(' · ')}
            </div>
          </div>
        )}
      </div>

      {/* 5E Learning Stages (The Core 40-Minute Process) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Dersin İşlenişi: 5E Aşamaları (Toplam 40 Dakika)
          </h3>
          <span className="text-xs text-slate-500">
            Zamana ve modele göre adım adım akış
          </span>
        </div>

        <div className="space-y-4">
          {plan.stages.map((stage) => {
            const theme = STAGE_THEMES[stage.key] || {
              label: stage.name,
              badgeBg: 'bg-slate-100',
              textCol: 'text-slate-800',
              borderCol: 'border-slate-200',
              icon: <Clock className="w-4 h-4" />,
            };

            return (
              <div
                key={stage.key}
                className={`bg-white rounded-xl p-5 border ${theme.borderCol} shadow-xs space-y-3.5`}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${theme.badgeBg}`}>
                      {theme.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {stage.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {stage.objective}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold font-mono tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{stage.durationMinutes} Dakika</span>
                  </div>
                </div>

                {/* Specific stage highlights */}
                {stage.hookQuestion && (
                  <div className="p-3 bg-sky-50/70 rounded-lg border border-sky-100 text-xs text-sky-950">
                    <strong className="text-sky-800">Kanca / Merak Sorusu:</strong> &quot;{stage.hookQuestion}&quot;
                  </div>
                )}

                {stage.activityDetails && (
                  <div className="p-3 bg-emerald-50/70 rounded-lg border border-emerald-100 text-xs text-emerald-950">
                    <strong className="text-emerald-800">Keşif Etkinliği:</strong> {stage.activityDetails}
                  </div>
                )}

                {stage.scientificExplanations && (
                  <div className="p-3 bg-amber-50/70 rounded-lg border border-amber-100 text-xs text-amber-950">
                    <strong className="text-amber-800">Kavramsal / Bilimsel Odak:</strong> {stage.scientificExplanations}
                  </div>
                )}

                {stage.transferChallenge && (
                  <div className="p-3 bg-purple-50/70 rounded-lg border border-purple-100 text-xs text-purple-950">
                    <strong className="text-purple-800">Transfer Meydan Okuması:</strong> {stage.transferChallenge}
                  </div>
                )}

                {stage.exitTicketQuestions && stage.exitTicketQuestions.length > 0 && (
                  <div className="p-3 bg-rose-50/70 rounded-lg border border-rose-100 text-xs text-rose-950">
                    <strong className="text-rose-800">Çıkış Bileti (Exit Ticket) Soruları:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                      {stage.exitTicketQuestions.map((q, idx) => (
                        <li key={idx}>{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Dual Roles: Teacher Action & Student Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <Users className="w-3.5 h-3.5 text-slate-600" />
                      <span>Öğretmen Rolü & Yönlendirme</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {stage.teacherAction}
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5 mb-1">
                      <Compass className="w-3.5 h-3.5 text-slate-600" />
                      <span>Öğrenci Rolü & Aktif Eylemler</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {stage.studentAction}
                    </p>
                  </div>
                </div>

                {stage.materials && stage.materials.length > 0 && (
                  <div className="text-[11px] text-slate-500 pt-1">
                    <span className="font-semibold">Bu Aşamada Kullanılacaklar:</span> {stage.materials.join(', ')}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* "Masa 5  5 Fikir" Feature Section */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-lg space-y-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Masa 5  5 Fikir İstasyon Rehberi</span>
          </div>
          <h3 className="text-xl font-bold text-white">
            Sınıfta Uygulanabilecek 5 Yaratıcı Masa / İstasyon Fikri
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mt-1">
            Bu derste öğrencilerin aktif katılımını, işbirliğini ve farklı zeka/öğrenme stillerini desteklemek için sınıfta kurabileceğiniz 5 somut masa tekniği:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plan.table5Ideas.map((table) => (
            <div
              key={table.tableNumber}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 hover:border-emerald-400/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center justify-center font-bold text-xs font-mono">
                    M{table.tableNumber}
                  </span>
                  <span className="text-[11px] font-medium text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    {table.targetStyle}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white mb-1.5">
                  {table.title}
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed">
                  {table.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Differentiation & Rubric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Differentiation */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Farklılaştırma & Bireyselleştirme</span>
          </h4>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-800 block mb-1">
                Destek & Yapı İskelesi (Scaffolding):
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {plan.differentiation.support}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <strong className="text-slate-800 block mb-1">
                Zenginleştirme & Derinleştirme:
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {plan.differentiation.enrichment}
              </p>
            </div>
          </div>
        </div>

        {/* Assessment Rubric */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-3">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Biçimlendirici Değerlendirme Ölçütleri</span>
          </h4>

          <div className="space-y-2 text-xs">
            {plan.assessmentRubric.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1"
              >
                <div className="font-bold text-slate-800">
                  {idx + 1}. {item.criterion}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="text-emerald-800 bg-emerald-50/60 p-1.5 rounded">
                    <span className="font-semibold">Hedeflenen Düzey:</span> {item.proficient}
                  </div>
                  <div className="text-amber-800 bg-amber-50/60 p-1.5 rounded">
                    <span className="font-semibold">Geliştirilmeli:</span> {item.developing}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Preparation Notes */}
      {plan.teacherNotes && (
        <div className="p-4 bg-slate-100 rounded-xl text-xs text-slate-700 leading-relaxed border border-slate-200">
          <strong>Öğretmen Hazırlık ve Güvenlik Notları:</strong> {plan.teacherNotes}
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          onClick={onBackToOutcomes}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          ← 1. Bölüm: Öğrenme Çıktılarını Değiştir
        </button>

        <button
          onClick={onGoToPdf}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <span>3. Bölüm: PDF Raporunu Gör & İndir</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
