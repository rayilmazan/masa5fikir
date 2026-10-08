'use client';

import React, { useRef, useState } from 'react';
import { LessonPlan } from '@/types/plan';
import { TimeChart } from './TimeChart';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import {
  FileDown,
  Printer,
  ArrowLeft,
  Info,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface PdfReportSectionProps {
  plan: LessonPlan;
  onBackToPlan: () => void;
}

export function PdfReportSection({ plan, onBackToPlan }: PdfReportSectionProps) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const currentDate = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleDownloadPdf = async () => {
    if (!reportRef.current || isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    setDownloadSuccess(false);

    try {
      const element = reportRef.current;

      // Render high-res canvas (scale 2 for crisp typography & charts)
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: element.scrollWidth,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Additional pages if needed (multi-page support)
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const safeName = (plan.lessonName || 'Ders_Plani')
        .trim()
        .replace(/[^a-zA-Z0-9çğışöüÇĞİŞÖÜ_-]/g, '_');
      
      pdf.save(`Masa5Fikir_${safeName}_5E_Plani.pdf`);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      // Fallback to native print if canvas fails
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Screen Control Header (Hidden when printing) */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
            3. Bölüm: Planı İndir & Rapor
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            Grafik Destekli Ders Planı Raporu
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Türkçe karakterler ve vektörel zaman dağılım grafikleriyle A4 formatında hazırlanmıştır.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={onBackToPlan}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Plana Dön</span>
          </button>

          <button
            onClick={handlePrint}
            title="Doğrudan yazıcıya gönder veya tarayıcıdan yazdır"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Yazıcıdan Al</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-emerald-400 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>PDF Hazırlanıyor...</span>
              </>
            ) : (
              <>
                <FileDown className="w-4 h-4" />
                <span>Pdf Olarak İndir (.pdf)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {downloadSuccess && (
        <div className="no-print p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-medium text-emerald-900 flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Ders planı PDF dosyanız başarıyla indirildi! Dosyalarınız &quot;İndirilenler&quot; (Downloads) klasörünüze kaydedilmiştir.
          </span>
        </div>
      )}

      {/* Helpful Hint Box (Hidden when printing) */}
      <div className="no-print p-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
        <div>
          <strong>Doğrudan İndirme:</strong> &quot;Pdf Olarak İndir&quot; butonuna tıkladığınızda planınız grafikler, Türkçe karakterler ve 5E şablonuyla birlikte doğrudan <strong>.pdf dosyası</strong> olarak cihazınıza indirilir. İsterseniz &quot;Yazıcıdan Al&quot; düğmesiyle direkt kağıda da yazdırabilirsiniz.
        </div>
      </div>

      {/* Printable / Downloadable Report Canvas (A4 Presentation) */}
      <div
        ref={reportRef}
        className="print-container bg-white text-slate-900 p-6 sm:p-10 lg:p-12 rounded-2xl border border-slate-200 shadow-md print:shadow-none print:border-none print:p-0 space-y-6"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                GÜNLÜK DERS PLANI · 5E ÖĞRENME MODELİ
              </div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight mt-0.5">
                {plan.lessonName}
              </h1>
              <div className="text-sm font-semibold text-slate-800 mt-0.5">
                Konu / Tema: {plan.subjectTopic}
              </div>
            </div>

            <div className="text-right text-xs text-slate-600 space-y-0.5 font-mono tabular-nums">
              <div><strong>Tarih:</strong> {currentDate}</div>
              <div><strong>Toplam Süre:</strong> 40 Dakika</div>
              <div><strong>Kademe:</strong> {plan.gradeLevel}</div>
              <div className="text-[11px] text-emerald-700 font-sans font-semibold">
                Masa 5 Fikir Modeli
              </div>
            </div>
          </div>
        </div>

        {/* Learning Outcomes Table */}
        <div className="page-break-inside-avoid">
          <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase tracking-wider text-slate-800 border-l-4 border-emerald-600">
            Öğrenme Çıktıları & Hedefler
          </div>
          <div className="p-3 border border-slate-200 border-t-0 space-y-1.5 text-xs text-slate-800 bg-white">
            {plan.learningOutcomes.map((outcome, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="font-bold text-emerald-800 shrink-0">
                  Öğrenme Çıktısı {idx + 1}:
                </span>
                <span>{outcome.replace(/^Öğrenme Çıktısı \d+:\s*/i, '')}</span>
              </div>
            ))}
            <div className="pt-1.5 mt-1.5 border-t border-slate-100 text-slate-600 text-[11px]">
              <strong>Pedagojik Odak:</strong> {plan.pedagogicalGoal}
            </div>
          </div>
        </div>

        {/* GRAPHIC SUPPORT: 5E Time Distribution Chart */}
        <div className="page-break-inside-avoid">
          <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase tracking-wider text-slate-800 border-l-4 border-sky-600">
            5E Modeli Süreç & Zaman Dağılım Grafiği (40 Dakika)
          </div>
          <div className="p-3 border border-slate-200 border-t-0 bg-white">
            <TimeChart stages={plan.stages} totalMinutes={40} compact />
          </div>
        </div>

        {/* 5E Step-by-Step Flow Table */}
        <div className="page-break-inside-avoid">
          <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase tracking-wider text-slate-800 border-l-4 border-amber-600">
            Dersin İşlenişi (Aşama, Süre ve Rol Dağılımı)
          </div>

          <table className="w-full text-left text-xs border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-50 text-slate-900 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300 w-24 font-bold">Aşama & Süre</th>
                <th className="p-2 border-r border-slate-300 w-1/4 font-bold">Öğretmen Rolü</th>
                <th className="p-2 border-r border-slate-300 w-1/4 font-bold">Öğrenci Rolü</th>
                <th className="p-2 font-bold">Etkinlik & Odak Noktası</th>
              </tr>
            </thead>
            <tbody>
              {plan.stages.map((stg, idx) => (
                <tr
                  key={stg.key}
                  className={`border-b border-slate-200 ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                  }`}
                >
                  <td className="p-2 border-r border-slate-300 align-top">
                    <div className="font-bold text-slate-900">{stg.name}</div>
                    <div className="font-mono tabular-nums text-emerald-800 font-semibold text-[11px] mt-0.5">
                      {stg.durationMinutes} Dakika
                    </div>
                  </td>
                  <td className="p-2 border-r border-slate-300 align-top text-slate-700 leading-relaxed">
                    {stg.teacherAction}
                  </td>
                  <td className="p-2 border-r border-slate-300 align-top text-slate-700 leading-relaxed">
                    {stg.studentAction}
                  </td>
                  <td className="p-2 align-top text-slate-700 leading-relaxed space-y-1">
                    {stg.hookQuestion && (
                      <div>
                        <strong>Kanca Soru:</strong> {stg.hookQuestion}
                      </div>
                    )}
                    {stg.activityDetails && (
                      <div>
                        <strong>Aktivite:</strong> {stg.activityDetails}
                      </div>
                    )}
                    {stg.scientificExplanations && (
                      <div>
                        <strong>Açıklama:</strong> {stg.scientificExplanations}
                      </div>
                    )}
                    {stg.transferChallenge && (
                      <div>
                        <strong>Transfer:</strong> {stg.transferChallenge}
                      </div>
                    )}
                    {stg.exitTicketQuestions && (
                      <div>
                        <strong>Çıkış Soruları:</strong> {stg.exitTicketQuestions.join('; ')}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Masa 5 Fikir Section in PDF */}
        <div className="page-break-inside-avoid">
          <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs uppercase tracking-wider text-slate-800 border-l-4 border-purple-600">
            Masa 5 Fikir: Sınıf İçi İstasyon & Masa Stratejileri
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 p-3 border border-slate-200 border-t-0 bg-white">
            {plan.table5Ideas.map((table) => (
              <div
                key={table.tableNumber}
                className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 font-mono">
                    Masa {table.tableNumber}
                  </span>
                  <span className="text-[10px] text-purple-800 font-semibold bg-purple-100 px-1.5 py-0.2 rounded">
                    {table.targetStyle}
                  </span>
                </div>
                <div className="font-semibold text-slate-800 mb-0.5">
                  {table.title}
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {table.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Differentiation and Assessment Rubric */}
        <div className="page-break-inside-avoid grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-lg p-3 text-xs">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-1.5">
              Farklılaştırma (Kapsayıcı Eğitim)
            </div>
            <div className="space-y-1.5 text-slate-700 text-[11px]">
              <div>
                <strong>Destek (Scaffolding):</strong> {plan.differentiation.support}
              </div>
              <div>
                <strong>Zenginleştirme:</strong> {plan.differentiation.enrichment}
              </div>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 text-xs">
            <div className="font-bold text-slate-900 border-b border-slate-200 pb-1 mb-1.5">
              Ölçme ve Değerlendirme Ölçütleri
            </div>
            <div className="space-y-1 text-[11px] text-slate-700">
              {plan.assessmentRubric.map((r, i) => (
                <div key={i} className="flex justify-between gap-1">
                  <span className="font-medium text-slate-900">{r.criterion}:</span>
                  <span className="text-slate-600 truncate">{r.proficient}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Formal Signatures Block */}
        <div className="page-break-inside-avoid pt-6 border-t border-slate-300 grid grid-cols-2 text-center text-xs text-slate-700">
          <div>
            <div className="font-bold text-slate-900 mb-8">Ders Öğretmeni</div>
            <div className="text-[11px] text-slate-500">İmza / Tarih</div>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-8">Okul Müdürü / Yönetici</div>
            <div className="text-[11px] text-slate-500">İmza / Mühür</div>
          </div>
        </div>
      </div>
    </div>
  );
}
