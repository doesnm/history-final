'use client';

import { useMemo, useState } from 'react';
import type { Flashcard, TopicMeta } from '@/lib/types';
import { useProgress } from '@/lib/store';
import { FlashCardView } from './FlashCardView';
import { cn, shuffle } from '@/lib/utils';

export function FlashcardsApp({ cards, topics }: { cards: Flashcard[]; topics: TopicMeta[] }) {
  const [filter, setFilter] = useState<string>('all');
  const stored = useProgress(s => s.cards);
  const rate = useProgress(s => s.rateCard);
  const ensure = useProgress(s => s.ensureCard);

  const queue = useMemo(() => {
    const filtered = filter === 'all' ? cards : cards.filter(c => c.topic === filter);
    // sort by due date (new cards first if never reviewed)
    const sorted = [...filtered].sort((a, b) => {
      const ca = stored[a.id]?.due ?? 0;
      const cb = stored[b.id]?.due ?? 0;
      return ca - cb;
    });
    return sorted;
  }, [cards, filter, stored]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const current = queue[idx % queue.length];
  if (!current) {
    return <div className="card mt-6 text-center">No cards match this filter.</div>;
  }
  const state = stored[current.id];

  function handle(rating: 'easy' | 'hard' | 'again') {
    ensure(current.id);
    rate(current.id, rating);
    setFlipped(false);
    setIdx(i => i + 1);
  }

  return (
    <div className="mt-6">
      <div className="flex gap-2 flex-wrap mb-4">
        <FilterChip active={filter === 'all'} onClick={() => setFilter('all')}>All ({cards.length})</FilterChip>
        {topics.map(t => (
          <FilterChip key={t.slug} active={filter === t.slug} onClick={() => setFilter(t.slug)}>
            {t.emoji} {t.shortTitle}
          </FilterChip>
        ))}
      </div>

      <FlashCardView card={current} flipped={flipped} onFlip={() => setFlipped(f => !f)} />

      <div className="mt-4 flex justify-between text-sm text-[color:var(--muted)]">
        <span>Card {idx + 1} · Box {state?.box ?? 0}/5</span>
        <button onClick={() => { setIdx(i => i + 1); setFlipped(false); }} className="hover:underline">Skip →</button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <button onClick={() => handle('again')} className="btn bg-red-500 text-white hover:bg-red-600">😣 Again</button>
        <button onClick={() => handle('hard')} className="btn bg-amber-500 text-white hover:bg-amber-600">🤔 Hard</button>
        <button onClick={() => handle('easy')} className="btn bg-emerald-500 text-white hover:bg-emerald-600">✅ Easy</button>
      </div>
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-medium border transition',
        active ? 'bg-kz-blue text-white border-kz-blue' : 'border-[var(--border)] hover:border-kz-blue/50',
      )}
    >{children}</button>
  );
}
