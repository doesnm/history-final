'use client';

import Link from 'next/link';
import type { QuizResult } from '@/lib/quiz-engine';

export function ResultScreen({ result, onRetry }: { result: QuizResult; onRetry: () => void }) {
  const grade =
    result.scorePct >= 90 ? { label: 'Excellent 🏆', color: 'text-emerald-500' } :
    result.scorePct >= 70 ? { label: 'Good 👍', color: 'text-kz-blue' } :
    result.scorePct >= 50 ? { label: 'Satisfactory', color: 'text-amber-500' } :
    { label: 'Needs review', color: 'text-red-500' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card text-center bg-gradient-to-br from-kz-blue/10 to-kz-gold/10">
        <div className="text-sm uppercase tracking-wider text-[color:var(--muted)]">Result</div>
        <div className={`heading text-6xl font-bold mt-2 ${grade.color}`}>{result.scorePct}%</div>
        <div className={`mt-1 font-semibold ${grade.color}`}>{grade.label}</div>
        <p className="text-[color:var(--muted)] mt-2">
          {result.correct} of {result.total} correct
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button onClick={onRetry} className="btn-primary">🔁 Try again</button>
          <Link href="/quiz" className="btn-ghost">All quizzes</Link>
          <Link href="/dashboard" className="btn-ghost">📊 Progress</Link>
        </div>
      </div>

      {result.weakTopics.length > 0 && (
        <div className="card">
          <h3 className="heading font-semibold">📌 Weak areas — worth reviewing</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.weakTopics.map(t => (
              <Link key={t} href={`/theory/${t}`} className="chip hover:bg-kz-blue/20">{t}</Link>
            ))}
          </div>
        </div>
      )}

      <details className="card">
        <summary className="font-semibold cursor-pointer">📝 Detailed breakdown</summary>
        <div className="mt-3 space-y-3">
          {result.perQuestion.map((g, i) => (
            <div key={g.questionId} className="border-t border-[var(--border)] pt-3 first:border-0 first:pt-0">
              <div className="text-xs text-[color:var(--muted)]">Question {i + 1} · {g.correct ? '✅' : '❌'}</div>
              <div className="font-medium">{g.expected.question}</div>
              <div className="text-sm text-[color:var(--muted)] mt-1">{g.expected.explanation}</div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
