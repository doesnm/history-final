'use client';
import { useState } from 'react';
import type { ExpandedNote } from '@/lib/types';

export function ExpandedNotes({ notes }: { notes: ExpandedNote[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-2">
      {notes.map((n, i) => (
        <details
          key={i}
          open={open === i}
          onToggle={(e) => {
            if (e.currentTarget.open) setOpen(i);
            else setOpen((prev) => (prev === i ? null : prev));
          }}
          className="card cursor-pointer group"
        >
          <summary className="font-semibold flex justify-between items-center list-none">
            <span>{n.heading}</span>
            <span className="text-kz-blue transition group-open:rotate-180" aria-hidden>▾</span>
          </summary>
          <div className="mt-3 text-sm leading-relaxed whitespace-pre-line">{n.body}</div>
        </details>
      ))}
    </div>
  );
}
