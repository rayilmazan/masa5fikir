import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Masa 5 Fikir - 5E Modeli Ders Planı ve PDF Raporu',
  description: 'Öğrenme çıktılarına dayalı 5E modeli ile 40 dakikalık özgün ders planı ve grafik destekli PDF raporu hazırlayan öğretmen asistanı.',
  openGraph: {
    title: 'Masa 5 Fikir - 5E Modeli Ders Planı ve PDF Raporu',
    description: 'Öğrenme çıktılarına dayalı 5E modeli ile 40 dakikalık özgün ders planı ve grafik destekli PDF raporu hazırlayan öğretmen asistanı.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Masa 5 Fikir - 5E Modeli Ders Planı ve PDF Raporu',
    description: 'Öğrenme çıktılarına dayalı 5E modeli ile 40 dakikalık özgün ders planı ve grafik destekli PDF raporu hazırlayan öğretmen asistanı.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="tr">
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
