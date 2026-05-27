'use client';

import Link from 'next/link';
import type { TopicMeta } from '@/lib/types';
import { useProgress, exportProgress } from '@/lib/store';
import { ProgressBar } from '@/components/layout/ProgressBar';
import { pct } from '@/lib/utils';

export function DashboardView({ topics }: { topics: TopicMeta[] }) {
  const visited = useProgress(s => s.visitedTopics);
  const attempts = useProgress(s => s.attempts);
  const cards = useProgress(s => s.cards);
  const reset = useProgress(s => s.reset);

  const visitedCount = Object.keys(visited).length;
  const avg = attempts.length ? Math.round(attempts.reduce((a, b) => a + b.scorePct, 0) / attempts.length) : 0;
  const masteredCards = Object.values(cards).filter(c => c.box >= 4).length;

  // Per-topic stats
  const perTopic = topics.map(t => {
    const tAttempts = attempts.filter(a => a.topic === t.slug);
    const best = tAttempts.reduce((m, a) => Math.max(m, a.scorePct), 0);
    return { ...t, visited: !!visited[t.slug], best, attempts: tAttempts.length };
  });

  // Weakest = lowest average from recent attempts
  const weakBucket = new Map<string, number[]>();
  attempts.forEach(a => a.weakTopics.forEach(t => {
    weakBucket.set(t, [...(weakBucket.get(t) ?? []), 1]);
  }));
  const weak = Array.from(weakBucket.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 3)
    .map(([t]) => t);

  function downloadProgress() {
    const blob = new Blob([exportProgress()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `history-kz-progress-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6 space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Lectures studied" value={`${visitedCount}/${topics.length}`} />
        <StatCard label="Average score" value={`${avg}%`} />
        <StatCard label="Cards mastered" value={`${masteredCards}/${Object.keys(cards).length || 0}`} />
      </div>

      <section className="card">
        <h2 className="heading font-semibold mb-3">Progress by topic</h2>
        <div className="space-y-3">
          {perTopic.map(t => (
            <div key={t.slug}>
              <div className="flex items-center justify-between text-sm mb-1">
                <Link href={`/theory/${t.slug}`} className="hover:underline">
                  {t.emoji} {t.shortTitle}
                </Link>
                <span className="text-[color:var(--muted)]">
                  {t.visited ? '✓ studied' : '○ not opened'} · best {t.best}%
                </span>
              </div>
              <ProgressBar value={t.best} gold={t.best >= 70} />
            </div>
          ))}
        </div>
      </section>

      {weak.length > 0 && (
        <section className="card bg-amber-50 dark:bg-amber-900/10 border-amber-300/50">
          <h2 className="heading font-semibold">📌 Recommendations</h2>
          <p className="text-sm mt-1">Review these topics — they had the most mistakes:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {weak.map(t => (
              <Link key={t} href={`/theory/${t}`} className="chip hover:bg-kz-blue/20">{t}</Link>
            ))}
          </div>
        </section>
      )}

      <section className="card">
        <h2 className="heading font-semibold mb-3">Attempt history</h2>
        {attempts.length === 0 ? (
          <p className="text-[color:var(--muted)] text-sm">No attempts yet. <Link className="text-kz-blue hover:underline" href="/quiz">Start a quiz →</Link></p>
        ) : (
          <ul className="space-y-2 text-sm">
            {attempts.slice(0, 10).map(a => (
              <li key={a.id} className="flex justify-between items-center border-b border-[var(--border)] pb-2 last:border-0">
                <div>
                  <Link href={`/quiz/${a.topic}`} className="font-medium hover:underline">{a.topic}</Link>
                  <span className="text-[color:var(--muted)] ml-2">{new Date(a.timestamp).toLocaleString('en-US')}</span>
                </div>
                <span className="font-mono font-semibold">{a.scorePct}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex gap-3 flex-wrap">
        <button onClick={downloadProgress} className="btn-ghost">⬇️ Export progress</button>
        <button onClick={() => confirm('Delete all progress?') && reset()} className="btn-ghost text-red-500">🗑 Reset</button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="card text-center">
      <div className="text-xs uppercase tracking-wider text-[color:var(--muted)]">{label}</div>
      <div className="heading text-3xl font-bold mt-1 text-kz-blue">{value}</div>
    </div>
  );
}
