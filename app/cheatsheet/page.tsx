import { getAllTopics, getTopics } from '@/lib/content-loader';
import { CheatSheetView } from '@/components/cheatsheet/CheatSheetView';

export const metadata = { title: 'Cheat Sheet · History KZ' };

export default async function CheatSheetPage() {
  const [topics, metas] = await Promise.all([getAllTopics(), getTopics()]);
  const titleBySlug = new Map(metas.map(m => [m.slug, m.shortTitle]));
  const flat = topics.flatMap(t => {
    const title = titleBySlug.get(t.slug) ?? t.title;
    return [
      ...t.timeline.map(e => ({ topic: title, slug: t.slug, kind: 'event' as const, year: String(e.year), text: e.event })),
      ...t.keyScholars.map(s => ({ topic: title, slug: t.slug, kind: 'person' as const, year: s.years, text: `${s.name} — ${s.contribution}` })),
      ...t.mustMemorize.map(m => ({ topic: title, slug: t.slug, kind: 'fact' as const, year: '', text: m })),
    ];
  });
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="heading text-3xl font-bold">📋 Cheat Sheet</h1>
      <p className="text-[color:var(--muted)] mt-2 no-print">
        All key dates, people and facts in one place. Search and print supported.
      </p>
      <CheatSheetView items={flat} />
    </div>
  );
}
