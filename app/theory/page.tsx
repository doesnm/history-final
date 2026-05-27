import Link from 'next/link';
import { getTopics } from '@/lib/content-loader';

export const metadata = { title: 'Theory · History of Kazakhstan' };

export default async function TheoryIndex() {
  const topics = await getTopics();
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="heading text-3xl font-bold">📖 Theory</h1>
      <p className="text-[color:var(--muted)] mt-2">10 lectures of the official Astana IT University manual.</p>
      <ol className="grid sm:grid-cols-2 gap-4 mt-6">
        {topics.map(t => (
          <li key={t.slug}>
            <Link href={`/theory/${t.slug}`} className="card flex gap-4 items-start hover:border-kz-blue transition">
              <span className="text-3xl">{t.emoji}</span>
              <div className="min-w-0">
                <div className="text-xs text-kz-blue-dark font-semibold">LECTURE {t.number}</div>
                <h2 className="heading font-semibold mt-0.5">{t.title}</h2>
                <p className="text-sm text-[color:var(--muted)] mt-1">{t.period}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
