import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

export const metadata: Metadata = {
  title: 'History of Kazakhstan — Exam Prep',
  description: 'Final exam prep for History of Kazakhstan: theory, quizzes, flashcards, cheat sheet.',
  keywords: ['Kazakhstan', 'history', 'exam', 'Astana IT University'],
  authors: [{ name: 'Astana IT University' }],
  openGraph: {
    title: 'History of Kazakhstan — Exam Prep',
    description: '10 lectures, 100+ questions, flashcards and a cheat sheet.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00AFCA' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1220' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
