'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useProgress } from '@/lib/store';
import { cn } from '@/lib/utils';

const NAV = [
  { href: '/theory', label: 'Theory', icon: '📖' },
  { href: '/quiz', label: 'Quizzes', icon: '🎯' },
  { href: '/flashcards', label: 'Cards', icon: '🃏' },
  { href: '/cheatsheet', label: 'Cheat Sheet', icon: '📋' },
  { href: '/dashboard', label: 'Progress', icon: '📊' },
];

export function Header() {
  const pathname = usePathname();
  const theme = useProgress(s => s.theme);
  const setTheme = useProgress(s => s.setTheme);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[var(--bg)]/80 border-b border-[var(--border)] no-print">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="inline-block w-7 h-7 rounded-lg bg-gradient-to-br from-kz-blue to-kz-gold" aria-hidden />
          <span className="hidden sm:inline">History KZ</span>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {NAV.map(item => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition',
                  active ? 'bg-kz-blue text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800',
                )}
              >
                <span className="mr-1">{item.icon}</span>
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-2 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle theme"
          >
            {mounted ? (theme === 'dark' ? '☀️' : '🌙') : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
}
