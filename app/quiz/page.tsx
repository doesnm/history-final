import Link from 'next/link';
import { getTopics } from '@/lib/content-loader';

export const metadata = { title: 'Quizzes · History KZ' };

export default async function QuizIndex() {
  const topics = await getTopics();
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="heading text-3xl font-bold">🎯 Quizzes</h1>
      <p className="text-[color:var(--muted)] mt-2">Pick a lecture to practice, or take exam mode across the whole course.</p>

      <div className="card mt-6 flex flex-wrap gap-3 items-center justify-between bg-gradient-to-r from-kz-blue/10 to-kz-gold/10">
        <div>
          <h2 className="heading font-semibold">📝 Exam mode</h2>
          <p className="text-sm text-[color:var(--muted)]">Random questions from all lectures · timed</p>
        </div>
        <Link href="/quiz/all?mode=exam" className="btn-gold">Start exam</Link>
      </div>

      <h2 className="heading text-xl font-bold mt-8 mb-3">By topic</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        {topics.map(t => (
          <Link key={t.slug} href={`/quiz/${t.slug}`} className="card flex items-center justify-between hover:border-kz-blue transition">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl">{t.emoji}</span>
              <div className="min-w-0">
                <div className="text-xs text-kz-blue-dark font-semibold">LECTURE {t.number}</div>
                <div className="heading font-semibold truncate">{t.shortTitle}</div>
              </div>
            </div>
            <span className="chip">{t.questionCount} Q</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
