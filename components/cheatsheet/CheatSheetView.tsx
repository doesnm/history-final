'use client';

import { useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { cn } from '@/lib/utils';

type Item = { topic: string; slug: string; kind: 'event' | 'person' | 'fact'; year: string; text: string };

const KIND_LABEL = { event: '🗓️ Event', person: '👤 Person', fact: '⚡ Fact' };

export function CheatSheetView({ items }: { items: Item[] }) {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | Item['kind']>('all');

  const fuse = useMemo(() => new Fuse(items, { keys: ['text', 'topic', 'year'], threshold: 0.35 }), [items]);
  const results = useMemo(() => {
    let r = query ? fuse.search(query).map(x => x.item) : items;
    if (kind !== 'all') r = r.filter(i => i.kind === kind);
    return r;
  }, [query, kind, fuse, items]);

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-2 items-center no-print">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="🔍 Search by dates, names, facts..."
          className="flex-1 min-w-64 px-4 py-2 rounded-xl border border-[var(--border)] bg-transparent focus:border-kz-blue focus:outline-none"
        />
        {(['all', 'event', 'person', 'fact'] as const).map(k => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={cn(
              'px-3 py-2 rounded-xl text-sm font-medium border transition',
              kind === k ? 'bg-kz-blue text-white border-kz-blue' : 'border-[var(--border)] hover:border-kz-blue/50',
            )}
          >
            {k === 'all' ? 'All' : KIND_LABEL[k]}
          </button>
        ))}
        <button onClick={() => window.print()} className="btn-gold">🖨 Print / PDF</button>
      </div>

      <div className="mt-6 card p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-kz-sky dark:bg-kz-blue/10 sticky top-0">
            <tr>
              <th className="text-left px-3 py-2 w-24">Year</th>
              <th className="text-left px-3 py-2 w-32">Type</th>
              <th className="text-left px-3 py-2">Content</th>
              <th className="text-left px-3 py-2 w-48">Topic</th>
            </tr>
          </thead>
          <tbody>
            {results.map((it, i) => (
              <tr key={i} className="border-t border-[var(--border)]">
                <td className="px-3 py-2 font-mono whitespace-nowrap">{it.year || '—'}</td>
                <td className="px-3 py-2 whitespace-nowrap">{KIND_LABEL[it.kind]}</td>
                <td className="px-3 py-2">{it.text}</td>
                <td className="px-3 py-2 text-[color:var(--muted)]">{it.topic}</td>
              </tr>
            ))}
            {results.length === 0 && (
              <tr><td colSpan={4} className="px-3 py-8 text-center text-[color:var(--muted)]">Nothing found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-[color:var(--muted)] no-print">{results.length} items</p>
    </>
  );
}
