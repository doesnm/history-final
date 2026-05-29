'use client';

import { useMemo, useState, useEffect } from 'react';
import type { Question } from '@/lib/types';
import { gradeAll, type Answer } from '@/lib/quiz-engine';
import { shuffle } from '@/lib/utils';
import { useProgress } from '@/lib/store';
import { QuestionCard } from './QuestionCard';
import { ResultScreen } from './ResultScreen';
import { ProgressBar } from '@/components/layout/ProgressBar';

const EXAM_TIME_MS = 15 * 60 * 1000;

export function QuizRunner({
  questions,
  topicSlug,
  mode,
}: {
  questions: Question[];
  topicSlug: string;
  mode: 'practice' | 'exam';
}) {
  const ordered = useMemo(
    () => (mode === 'exam' ? shuffle(questions).slice(0, Math.min(20, questions.length)) : questions),
    [questions, mode],
  );
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [startedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const addAttempt = useProgress(s => s.addAttempt);

  useEffect(() => {
    if (mode !== 'exam' || finished) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [mode, finished]);

  const remainingMs = mode === 'exam' ? Math.max(0, EXAM_TIME_MS - (now - startedAt)) : 0;
  useEffect(() => {
    if (mode === 'exam' && remainingMs === 0 && !finished) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remainingMs]);

  const current = ordered[idx];
  const result = finished ? gradeAll(ordered, answers) : null;

  function setAnswer(a: Answer) {
    setAnswers(s => ({ ...s, [current.id]: a }));
    if (mode === 'practice') setRevealed(s => ({ ...s, [current.id]: true }));
  }

  function next() {
    if (idx + 1 >= ordered.length) {
      submit();
    } else {
      setIdx(i => i + 1);
    }
  }

  function submit() {
    setFinished(true);
    const r = gradeAll(ordered, answers);
    addAttempt({
      id: `${Date.now()}`,
      topic: topicSlug,
      scorePct: r.scorePct,
      total: r.total,
      correct: r.correct,
      weakTopics: r.weakTopics,
      timestamp: Date.now(),
    });
  }

  if (finished && result) {
    return <ResultScreen result={result} onRetry={() => location.reload()} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-[color:var(--muted)]">Question {idx + 1} of {ordered.length}</span>
        {mode === 'exam' && (
          <span className="font-mono font-semibold">⏱ {fmt(remainingMs)}</span>
        )}
      </div>
      <ProgressBar value={((idx) / ordered.length) * 100} className="mb-6" />

      <QuestionCard
        question={current}
        answer={answers[current.id]}
        onAnswer={setAnswer}
        revealed={mode === 'practice' && !!revealed[current.id]}
      />

      <div className="mt-6 flex justify-between gap-3">
        <button onClick={() => setIdx(i => Math.max(0, i - 1))} disabled={idx === 0} className="btn-ghost">← Back</button>
        <button
          onClick={next}
          disabled={!answers[current.id]}
          className="btn-primary"
        >
          {idx + 1 === ordered.length ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

function fmt(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
