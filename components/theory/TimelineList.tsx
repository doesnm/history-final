import type { TimelineEvent } from '@/lib/types';

export function TimelineList({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="card relative">
      <div className="absolute left-7 top-5 bottom-5 w-px bg-kz-blue/30" aria-hidden />
      {events.map((e, i) => (
        <li key={i} className="relative pl-12 py-2">
          <span className="absolute left-4 top-3 w-3 h-3 rounded-full bg-kz-gold ring-4 ring-kz-gold/20" aria-hidden />
          <div className="text-sm font-mono font-semibold text-kz-blue-dark dark:text-kz-blue">{e.year}</div>
          <div className="text-sm">{e.event}</div>
        </li>
      ))}
    </ol>
  );
}
