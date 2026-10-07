'use client';

import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { AuthModal } from '@/components/AuthModal';
import { SavedPlansModal } from '@/components/SavedPlansModal';
import { LearningOutcomesSection } from '@/components/LearningOutcomesSection';
import { LessonPlanSection } from '@/components/LessonPlanSection';
import { PdfReportSection } from '@/components/PdfReportSection';
import { LessonPlan } from '@/types/plan';
import { AlertCircle } from 'lucide-react';

function HomeContent() {
  const [activeTab, setActiveTab] = useState<'outcomes' | 'plan' | 'pdf'>('outcomes');
  const [outcomesText, setOutcomesText] = useState<string>('');
  const [lessonName, setLessonName] = useState<string>('');
  const [gradeLevel, setGradeLevel] = useState<string>('');
  const [subjectTopic, setSubjectTopic] = useState<string>('');
  const [additionalNotes, setAdditionalNotes] = useState<string>('');

  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGeneratePlan = async () => {
    if (!outcomesText.trim()) {
      setErrorMessage('Lütfen en az bir öğrenme çıktısı giriniz.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          outcomesText,
          lessonName: lessonName.trim() || undefined,
          gradeLevel: gradeLevel.trim() || undefined,
          subjectTopic: subjectTopic.trim() || undefined,
          additionalNotes: additionalNotes.trim() || undefined,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const textContent = await response.text().catch(() => '');
        console.error('Non-JSON response received:', textContent.substring(0, 200));
        throw new Error(
          'Sunucudan beklenmeyen bir yanıt alındı. Lütfen birkaç saniye sonra tekrar deneyiniz.'
        );
      }

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Ders planı oluşturulurken bir hata oluştu.');
      }

      const generatedPlan: LessonPlan = data;
      setPlan(generatedPlan);
      // Seamlessly switch to Section 2 (5E Plan)
      setActiveTab('plan');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      console.error('Plan oluşturma hatası:', err);
      const msg = err instanceof Error ? err.message : 'Ders planı oluşturulurken beklenmedik bir hata oluştu.';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Yeni bir ders planı başlatmak istediğinize emin misiniz?')) {
      setPlan(null);
      setOutcomesText('');
      setLessonName('');
      setGradeLevel('');
      setSubjectTopic('');
      setAdditionalNotes('');
      setActiveTab('outcomes');
      setErrorMessage(null);
    }
  };

  const handlePdfClick = () => {
    if (plan) {
      setActiveTab('pdf');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoadSavedPlan = (savedPlan: LessonPlan) => {
    setPlan(savedPlan);
    setLessonName(savedPlan.lessonName || '');
    setGradeLevel(savedPlan.gradeLevel || '');
    setSubjectTopic(savedPlan.subjectTopic || '');
    if (savedPlan.learningOutcomes) {
      setOutcomesText(savedPlan.learningOutcomes.join('\n'));
    }
    setActiveTab('plan');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <div>
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasPlan={!!plan}
          onReset={handleReset}
          onPdfClick={handlePdfClick}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Global Error Banner */}
          {errorMessage && (
            <div className="no-print mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start justify-between gap-3 shadow-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">İşlem Başarısız Oldu</div>
                  <div className="text-xs text-rose-700 mt-0.5">{errorMessage}</div>
                </div>
              </div>
              <button
                onClick={() => setErrorMessage(null)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-900 cursor-pointer"
              >
                Kapat
              </button>
            </div>
          )}

          {/* Section 1: Öğrenme Çıktıları */}
          {activeTab === 'outcomes' && (
            <LearningOutcomesSection
              outcomesText={outcomesText}
              setOutcomesText={setOutcomesText}
              lessonName={lessonName}
              setLessonName={setLessonName}
              gradeLevel={gradeLevel}
              setGradeLevel={setGradeLevel}
              subjectTopic={subjectTopic}
              setSubjectTopic={setSubjectTopic}
              additionalNotes={additionalNotes}
              setAdditionalNotes={setAdditionalNotes}
              onGenerate={handleGeneratePlan}
              isLoading={isLoading}
            />
          )}

          {/* Section 2: 5E Ders Planı */}
          {activeTab === 'plan' && plan && (
            <LessonPlanSection
              plan={plan}
              onGoToPdf={() => {
                setActiveTab('pdf');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onBackToOutcomes={() => setActiveTab('outcomes')}
            />
          )}

          {/* Section 3: Planı İndir (PDF) */}
          {activeTab === 'pdf' && plan && (
            <PdfReportSection
              plan={plan}
              onBackToPlan={() => setActiveTab('plan')}
            />
          )}
        </main>
      </div>

      {/* Auth Modals */}
      <AuthModal />
      <SavedPlansModal onLoadPlan={handleLoadSavedPlan} />

      {/* Clean Footer (No-print) */}
      <footer className="no-print mt-12 border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Masa 5 Fikir</span>
            <span aria-hidden="true">·</span>
            <span>5E Modeli ile 40 Dakikalık Ders Planı ve PDF Raporlama</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600">
            <span>Vercel Postgres & Bulut Uyumlu</span>
            <span aria-hidden="true">·</span>
            <span>Öğrenci Kişisel Verisi Barındırmaz</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function HomePage() {
  return (
    <AuthProvider>
      <HomeContent />
    </AuthProvider>
  );
}

