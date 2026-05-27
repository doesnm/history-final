'use client';
import { cn } from '@/lib/utils';

export function ProgressBar({ value, className, gold = false }: { value: number; className?: string; gold?: boolean }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden', className)}>
      <div
        role="progressbar"
        aria-valuenow={v}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(
          'h-full transition-all duration-500',
          gold ? 'bg-gradient-to-r from-kz-gold to-amber-400' : 'bg-gradient-to-r from-kz-blue to-cyan-400',
        )}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}
