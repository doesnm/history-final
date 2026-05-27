import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllTopics, getTopic, getTopics } from '@/lib/content-loader';
import { ConceptCard } from '@/components/theory/ConceptCard';
import { ScholarCard } from '@/components/theory/ScholarCard';
import { TimelineList } from '@/components/theory/TimelineList';
import { ExpandedNotes } from '@/components/theory/ExpandedNotes';
import { ComparativeTableView } from '@/components/theory/ComparativeTable';
import { TopicVisit } from '@/components/theory/TopicVisit';

export async function generateStaticParams() {
  const topics = await getTopics();
  return topics.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const topic = await getTopic(params.slug);
  if (!topic) return { title: 'Lecture not found' };
  return { title: `${topic.title} · History KZ`, description: topic.overview };
}

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const topic = await getTopic(params.slug);
  if (!topic) notFound();

  const all = await getTopics();
  const idx = all.findIndex(t => t.slug === topic.slug);
  const prev = idx > 0 ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
      <TopicVisit slug={topic.slug} />

      <header className="mb-8">
        <Link href="/theory" className="text-sm text-kz-blue hover:underline">← All lectures</Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="chip">Lecture {topic.number}</span>
        </div>
        <h1 className="heading text-3xl sm:text-4xl font-bold mt-2">{topic.title}</h1>
      </header>

      <section className="card bg-kz-sky dark:bg-kz-blue/10 border-kz-blue/20">
        <h2 className="heading font-semibold text-kz-blue-dark">📝 Lecture Overview</h2>
        <p className="mt-2 leading-relaxed">{topic.overview}</p>
      </section>

      {topic.coreConcepts.length > 0 && (
        <Section title="💡 Core Concepts & Definitions">
          <div className="grid sm:grid-cols-2 gap-4">
            {topic.coreConcepts.map((c, i) => <ConceptCard key={i} concept={c} />)}
          </div>
        </Section>
      )}

      {topic.expandedNotes.length > 0 && (
        <Section title="📑 Expanded Notes">
          <ExpandedNotes notes={topic.expandedNotes} />
        </Section>
      )}

      {topic.keyScholars.length > 0 && (
        <Section title="👤 Key Figures">
          <div className="grid sm:grid-cols-2 gap-4">
            {topic.keyScholars.map((s, i) => <ScholarCard key={i} scholar={s} />)}
          </div>
        </Section>
      )}

      {topic.comparativeTables?.map((tbl, i) => (
        <Section key={i} title={`📊 ${tbl.title}`}>
          <ComparativeTableView table={tbl} />
        </Section>
      ))}

      {topic.timeline.length > 0 && (
        <Section title="🗓️ Timeline">
          <TimelineList events={topic.timeline} />
        </Section>
      )}

      {topic.realWorldExamples && topic.realWorldExamples.length > 0 && (
        <Section title="🇰🇿 Real-World Examples">
          <ul className="card space-y-2 list-disc pl-5">
            {topic.realWorldExamples.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </Section>
      )}

      <Section title="⚡ Must Memorize">
        <ul className="card bg-kz-sand dark:bg-kz-gold/10 border-kz-gold/40 space-y-2">
          {topic.mustMemorize.map((m, i) => (
            <li key={i} className="flex gap-2"><span aria-hidden>⚡</span><span className="font-medium">{m}</span></li>
          ))}
        </ul>
      </Section>

      <Section title="📎 Exam Cheat Sheet">
        <div className="card font-mono text-sm whitespace-pre-wrap">{topic.cheatSheet}</div>
      </Section>

      {topic.mnemonics && topic.mnemonics.length > 0 && (
        <Section title="🧠 Mnemonics">
          <ul className="card space-y-2">
            {topic.mnemonics.map((m, i) => <li key={i}>🧠 {m}</li>)}
          </ul>
        </Section>
      )}

      <nav className="mt-12 flex justify-between gap-3 border-t border-[var(--border)] pt-6">
        {prev ? (
          <Link href={`/theory/${prev.slug}`} className="btn-ghost">← {prev.shortTitle}</Link>
        ) : <span />}
        <Link href={`/quiz/${topic.slug}`} className="btn-gold">🎯 Topic quiz</Link>
        {next ? (
          <Link href={`/theory/${next.slug}`} className="btn-ghost">{next.shortTitle} →</Link>
        ) : <span />}
      </nav>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="heading text-xl font-bold mb-3">{title}</h2>
      {children}
    </section>
  );
}
