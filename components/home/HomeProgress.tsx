'use client';

import { useProgress } from '@/lib/store';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { pct } from '@/lib/utils';

export function HomeProgress({ totalTopics }: { totalTopics: number }) {
  const visited = useProgress(s => s.visitedTopics);
  const attempts = useProgress(s => s.attempts);
  const visitedCount = Object.keys(visited).length;
  const avgScore = attempts.length
    ? Math.round(attempts.reduce((s, a) => s + a.scorePct, 0) / attempts.length)
    : 0;

  return (
    <section className="card mt-6">
      <div className="flex flex-wrap justify-between gap-2 mb-3">
        <h2 className="heading font-semibold">Your progress</h2>
        <span className="text-sm text-[color:var(--muted)]">
          {visitedCount} / {totalTopics} lectures · avg {avgScore}%
        </span>
      </div>
      <ProgressBar value={pct(visitedCount, totalTopics)} />
    </section>
  );
}
