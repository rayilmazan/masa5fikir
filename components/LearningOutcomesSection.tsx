'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BookOpen, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Lightbulb } from 'lucide-react';

interface LearningOutcomesSectionProps {
  outcomesText: string;
  setOutcomesText: (v: string) => void;
  lessonName: string;
  setLessonName: (v: string) => void;
  gradeLevel: string;
  setGradeLevel: (v: string) => void;
  subjectTopic: string;
  setSubjectTopic: (v: string) => void;
  additionalNotes: string;
  setAdditionalNotes: (v: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const PRESET_EXAMPLES = [
  {
    title: 'Fen Bilimleri (6. Sınıf)',
    badge: 'Hücre & Yaşam',
    lessonName: 'Fen Bilimleri',
    gradeLevel: '6. Sınıf',
    subjectTopic: 'Bitki ve Hayvan Hücresinin Temel Yapısı',
    text: `Öğrenme Çıktısı 1: Bitki ve hayvan hücresinin temel kısımlarını (çekirdek, sitoplazma, hücre zarı) ve belirgin organellerini mikroskop veya model üzerinde karşılaştırarak ayırt eder.
Öğrenme Çıktısı 2: Hücre ve doku arasındaki organizasyon ilişkisini somut örnekler üzerinden açıklar.`,
  },
  {
    title: 'Matematik (7. Sınıf)',
    badge: 'Veri İşleme',
    lessonName: 'Matematik',
    gradeLevel: '7. Sınıf',
    subjectTopic: 'Daire Grafiği ve Veri Dönüşümleri',
    text: `Öğrenme Çıktısı 1: Verileri sütun veya çizgi grafiğinden daire grafiğine dönüştürür ve merkez açı oranlarını hesaplar.
Öğrenme Çıktısı 2: Daire grafiğindeki dilimleri gerçek yaşam bağlamlarında (bütçe, zaman yönetimi vb.) yorumlar.`,
  },
  {
    title: 'Sosyal Bilgiler (5. Sınıf)',
    badge: 'İklim & İnsan',
    lessonName: 'Sosyal Bilgiler',
    gradeLevel: '5. Sınıf',
    subjectTopic: 'İklimin İnsan Faaliyetlerine Etkisi',
    text: `Öğrenme Çıktısı 1: Türkiye'deki farklı iklim tiplerinin insanların beslenme, barınma ve ekonomik faaliyetlerine etkilerini kanıtlarla açıklar.
Öğrenme Çıktısı 2: İklim ve insan ilişkisine dair günlük hayattan problem durumlarına çözüm önerisi geliştirir.`,
  },
  {
    title: 'Türkçe (8. Sınıf)',
    badge: 'Anlam Bilgisi',
    lessonName: 'Türkçe',
    gradeLevel: '8. Sınıf',
    subjectTopic: 'Metin İçi Çıkarım ve Örtülü Anlam',
    text: `Öğrenme Çıktısı 1: Bilgilendirici ve edebi metinlerdeki doğrudan belirtilmeyen örtülü anlamları ve gerekçeleri tespit eder.
Öğrenme Çıktısı 2: Yazarın bakış açısını metindeki ipuçlarından hareketle sorgular ve kendi düşüncesiyle karşılaştırır.`,
  },
  {
    title: 'Bilişim & Kodlama (6. Sınıf)',
    badge: 'Algoritma',
    lessonName: 'Bilişim Teknolojileri ve Yazılım',
    gradeLevel: '6. Sınıf',
    subjectTopic: 'Algoritmik Düşünme ve Karar Yapıları',
    text: `Öğrenme Çıktısı 1: Günlük yaşamdaki bir problemin çözüm adımlarını koşul ve döngü yapılarını kullanarak akış şemasıyla modeller.
Öğrenme Çıktısı 2: Verilen bir algoritmadaki mantıksal hataları ayıklayarak doğru sonuca ulaşır.`,
  },
];

export function LearningOutcomesSection({
  outcomesText,
  setOutcomesText,
  lessonName,
  setLessonName,
  gradeLevel,
  setGradeLevel,
  subjectTopic,
  setSubjectTopic,
  additionalNotes,
  setAdditionalNotes,
  onGenerate,
  isLoading,
}: LearningOutcomesSectionProps) {
  const [showPresets, setShowPresets] = useState(false);

  const applyPreset = (preset: typeof PRESET_EXAMPLES[0]) => {
    setOutcomesText(preset.text);
    setLessonName(preset.lessonName);
    setGradeLevel(preset.gradeLevel);
    setSubjectTopic(preset.subjectTopic);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Banner with Generated Image & Pedagogical Statement */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 lg:p-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>Pedagojik Planlama Motoru</span>
              <span aria-hidden="true">·</span>
              <span>Gemini Flash</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Öğrenme Çıktısından 40 Dakikalık 5E Ders Planına
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              Öğrenme çıktılarınızı yapıştırın; yapay zeka uzmanı konuyu derinlemesine araştırsın, 5E Öğrenme Modeline uygun zaman dağılımını kurgulasın ve sınıfta uygulayabileceğiniz <strong>5 yaratıcı masa fikri</strong> ile grafik destekli PDF raporu hazırlasın.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tam 40 Dakika
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5E Pedagoji Modeli
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Masa 5 Fikir İstasyonları
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Grafikli PDF Çıktısı
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-48 sm:h-56 lg:h-64 rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <Image
              src="/images/hero.jpg"
              alt="Masa 5 Fikir Ders Planlama Görseli"
              fill
              className="object-cover"
              priority
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-4">
              <span className="text-xs text-white/90 font-medium">
                Sınıf İçi İstasyonlar & 5E Metodolojisi
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Preset quick loaders */}
        <div className="border-b border-slate-100 pb-5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-slate-900">
                Hızlı Örnekler ile Dene:
              </span>
            </div>
            <span className="text-xs text-slate-500">
              Tek tıkla hazır öğrenme çıktıları yükleyin
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {PRESET_EXAMPLES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all cursor-pointer group text-xs"
              >
                <div className="font-semibold text-slate-800 group-hover:text-emerald-700 truncate">
                  {preset.title}
                </div>
                <div className="text-[11px] text-slate-500 truncate mt-0.5">
                  {preset.badge}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Learning outcomes text area (Primary focus) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="outcomes-textarea"
              className="block text-sm font-bold text-slate-900"
            >
              1. Bölüm: Öğrenme Çıktıları <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-500">
              &quot;Öğrenme Çıktısı 1:&quot;, &quot;Öğrenme Çıktısı 2:&quot; formatında
            </span>
          </div>

          <p className="text-xs text-slate-600">
            Ders programınızdaki kazanımları veya öğrenme çıktılarını aşağıdaki alana yapıştırınız. Uzman model bu çıktılara göre konuyu araştırıp 40 dakikalık 5E planını kurgulayacaktır.
          </p>

          <textarea
            id="outcomes-textarea"
            rows={5}
            value={outcomesText}
            onChange={(e) => setOutcomesText(e.target.value)}
            placeholder={`Öğrenme Çıktısı 1: Fotosentez sürecinde ışık enerjisinin kimyasal enerjiye dönüşümünü deney verileri üzerinden açıklar.\nÖğrenme Çıktısı 2: Fotosentez hızını etkileyen faktörleri (ışık şiddeti, karbondioksit miktarı) karşılaştırarak çıkarımda bulunur.`}
            className="w-full p-4 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none text-sm text-slate-900 leading-relaxed font-sans placeholder:text-slate-400 transition-all resize-y"
          />
        </div>

        {/* Optional Context Metadata (No personal student data) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ders Adı (İsteğe Bağlı)
            </label>
            <input
              type="text"
              value={lessonName}
              onChange={(e) => setLessonName(e.target.value)}
              placeholder="Örn: Fen Bilimleri, Matematik"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sınıf / Kademe (İsteğe Bağlı)
            </label>
            <input
              type="text"
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value)}
              placeholder="Örn: 6. Sınıf, 9. Sınıf"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Konu / Tema (İsteğe Bağlı)
            </label>
            <input
              type="text"
              value={subjectTopic}
              onChange={(e) => setSubjectTopic(e.target.value)}
              placeholder="Örn: Canlılar ve Enerji İlişkileri"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
            />
          </div>
        </div>

        {/* Additional Pedagogical Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Öğretmen Notu / Sınıf Ortamı Odakları (İsteğe Bağlı)
          </label>
          <input
            type="text"
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Örn: Akıllı tahta mevcut, laboratuvar imkanı var, somut modelleme ağırlıklı olsun"
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 outline-none"
          />
        </div>

        {/* Privacy & KVKK Assurance */}
        <div className="flex items-center gap-2 p-3 bg-emerald-50/60 border border-emerald-200/70 rounded-xl text-xs text-emerald-900">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Gizlilik Güvencesi:</strong> Bu uygulama öğrenci adı, öğrenci numarası veya kişisel veri talep etmez ve kaydetmez. Yalnızca pedagojik öğrenme çıktıları işlenir.
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isLoading || !outcomesText.trim()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                <span>5E Planı ve Masa Fikirleri Oluşturuluyor...</span>
              </>
            ) : (
              <>
                <span>5E Ders Planını Oluştur (40 Dk)</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
