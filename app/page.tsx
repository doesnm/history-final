import Link from 'next/link';
import { getStats, getTopics } from '@/lib/content-loader';
import { HomeProgress } from '@/components/home/HomeProgress';

export default async function HomePage() {
  const stats = await getStats();
  const topics = await getTopics();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-kz-blue via-cyan-500 to-kz-gold text-white p-8 sm:p-12">
        <div className="relative z-10 max-w-3xl">
          <span className="chip bg-white/20 text-white">🇰🇿 Astana IT University</span>
          <h1 className="heading text-3xl sm:text-5xl font-bold mt-4">
            History of Kazakhstan.<br />Final exam — 10 lectures.
          </h1>
          <p className="mt-4 text-lg opacity-90 max-w-2xl">
            Theory, quizzes, flashcards and a cheat sheet based on the official Astana IT University manual.
            Progress is saved automatically.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/theory" className="btn bg-white text-kz-blue-dark hover:bg-white/90">📖 Start with theory</Link>
            <Link href="/quiz" className="btn bg-kz-gold text-slate-900 hover:bg-kz-gold-dark">🎯 Take a quiz</Link>
            <Link href="/cheatsheet" className="btn bg-white/15 text-white border border-white/30 hover:bg-white/25">📋 Cheat sheet</Link>
          </div>
        </div>
        <div aria-hidden className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-white/10 blur-2xl" />
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
        <Stat label="Lectures" value={stats.topicCount} icon="📚" />
        <Stat label="Questions" value={stats.questionCount} icon="❓" />
        <Stat label="Concepts" value={stats.conceptCount} icon="💡" />
        <Stat label="Flashcards" value={stats.flashcardCount} icon="🃏" />
      </section>

      <HomeProgress totalTopics={stats.topicCount} />

      <section className="mt-10">
        <h2 className="heading text-2xl font-bold mb-4">Lectures</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map(t => (
            <Link key={t.slug} href={`/theory/${t.slug}`} className="card hover:border-kz-blue transition group">
              <div className="flex items-start justify-between gap-3">
                <span className="text-3xl" aria-hidden>{t.emoji}</span>
                <span className="chip">Lecture {t.number}</span>
              </div>
              <h3 className="heading font-semibold mt-3 group-hover:text-kz-blue transition">{t.shortTitle}</h3>
              <p className="text-sm text-[color:var(--muted)] mt-1">{t.period}</p>
              <div className="mt-3 flex gap-2 text-xs text-[color:var(--muted)]">
                <span>{t.conceptCount} concepts</span>
                <span>·</span>
                <span>{t.questionCount} questions</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: number; icon: string }) {
  return (
    <div className="card text-center">
      <div className="text-2xl" aria-hidden>{icon}</div>
      <div className="heading text-3xl font-bold mt-1 text-kz-blue">{value}</div>
      <div className="text-xs text-[color:var(--muted)] uppercase tracking-wide">{label}</div>
    </div>
  );
}
