'use client';

import { useMemo, useState } from 'react';
import type { Question } from '@/lib/types';
import { gradeOne, type Answer } from '@/lib/quiz-engine';
import { cn, shuffle } from '@/lib/utils';

export function QuestionCard({
  question,
  answer,
  onAnswer,
  revealed,
}: {
  question: Question;
  answer?: Answer;
  onAnswer: (a: Answer) => void;
  revealed: boolean;
}) {
  return (
    <div className="card animate-fade-in">
      <div className="text-xs text-[color:var(--muted)] uppercase tracking-wider">{labelFor(question.type)}</div>
      <h3 className="heading text-lg font-semibold mt-1">{question.question}</h3>
      <div className="mt-4">
        {question.type === 'mcq' && (
          <MCQ q={question} answer={answer} onAnswer={onAnswer} revealed={revealed} />
        )}
        {question.type === 'truefalse' && (
          <TF q={question} answer={answer} onAnswer={onAnswer} revealed={revealed} />
        )}
        {question.type === 'fill' && (
          <Fill q={question} answer={answer} onAnswer={onAnswer} revealed={revealed} />
        )}
        {question.type === 'match' && (
          <Match q={question} answer={answer} onAnswer={onAnswer} revealed={revealed} />
        )}
      </div>
      {revealed && answer && (
        <Explanation question={question} answer={answer} />
      )}
    </div>
  );
}

function labelFor(t: Question['type']) {
  return { mcq: 'Multiple choice', truefalse: 'True / False', fill: 'Fill in', match: 'Match' }[t];
}

function MCQ({ q, answer, onAnswer, revealed }: any) {
  const chosen = answer?.type === 'mcq' ? answer.index : -1;
  return (
    <div className="space-y-2">
      {q.options.map((opt: string, i: number) => {
        const correct = revealed && i === q.correctIndex;
        const wrong = revealed && chosen === i && i !== q.correctIndex;
        return (
          <button
            key={i}
            onClick={() => !revealed && onAnswer({ type: 'mcq', index: i })}
            disabled={revealed}
            className={cn(
              'w-full text-left px-4 py-3 rounded-xl border transition',
              chosen === i ? 'border-kz-blue bg-kz-blue/5' : 'border-[var(--border)] hover:border-kz-blue/50',
              correct && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
              wrong && 'border-red-500 bg-red-50 dark:bg-red-900/20',
            )}
          >
            <span className="font-mono mr-2 text-[color:var(--muted)]">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function TF({ q, answer, onAnswer, revealed }: any) {
  const v = answer?.type === 'truefalse' ? answer.value : null;
  return (
    <div className="grid grid-cols-2 gap-3">
      {[true, false].map(val => {
        const isCorrect = revealed && val === q.answer;
        const isWrong = revealed && v === val && val !== q.answer;
        return (
          <button
            key={String(val)}
            onClick={() => !revealed && onAnswer({ type: 'truefalse', value: val })}
            disabled={revealed}
            className={cn(
              'px-4 py-4 rounded-xl border-2 font-semibold transition',
              v === val ? 'border-kz-blue bg-kz-blue/5' : 'border-[var(--border)]',
              isCorrect && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20',
              isWrong && 'border-red-500 bg-red-50 dark:bg-red-900/20',
            )}
          >
            {val ? '✓ True' : '✗ False'}
          </button>
        );
      })}
    </div>
  );
}

function Fill({ q, answer, onAnswer, revealed }: any) {
  const v = answer?.type === 'fill' ? answer.text : '';
  return (
    <div>
      <input
        type="text"
        value={v}
        onChange={(e) => onAnswer({ type: 'fill', text: e.target.value })}
        disabled={revealed}
        placeholder="Your answer..."
        className="w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-transparent focus:border-kz-blue focus:outline-none"
      />
      {revealed && (
        <p className="text-sm mt-2 text-[color:var(--muted)]">
          Accepted answers: <span className="font-mono">{q.answers.join(' / ')}</span>
        </p>
      )}
    </div>
  );
}

function Match({ q, answer, onAnswer, revealed }: any) {
  const mapping: Record<string, string> = answer?.type === 'match' ? answer.mapping : {};
  const defOptions = useMemo<string[]>(() => shuffle(q.pairs.map((p: any) => p.definition as string)), [q]);
  return (
    <div className="space-y-2">
      {q.pairs.map((p: any) => {
        const sel = mapping[p.term] ?? '';
        const correct = revealed && sel === p.definition;
        const wrong = revealed && sel && sel !== p.definition;
        return (
          <div key={p.term} className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <span className="font-semibold sm:w-1/3">{p.term}</span>
            <select
              value={sel}
              onChange={(e) => onAnswer({ type: 'match', mapping: { ...mapping, [p.term]: e.target.value } })}
              disabled={revealed}
              className={cn(
                'flex-1 px-3 py-2 rounded-lg border bg-transparent',
                correct ? 'border-emerald-500' : wrong ? 'border-red-500' : 'border-[var(--border)]',
              )}
            >
              <option value="">— choose —</option>
              {defOptions.map((d: string) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        );
      })}
    </div>
  );
}

function Explanation({ question, answer }: { question: Question; answer: Answer }) {
  const ok = gradeOne(question, answer);

  let correctHint: string | null = null;
  if (!ok) {
    if (question.type === 'mcq') {
      const letter = String.fromCharCode(65 + question.correctIndex);
      correctHint = `Correct answer: ${letter}. ${question.options[question.correctIndex]}`;
    } else if (question.type === 'truefalse') {
      correctHint = `Correct answer: ${question.answer ? 'True' : 'False'}`;
    } else if (question.type === 'fill') {
      correctHint = `Accepted answers: ${question.answers.join(' / ')}`;
    }
  }

  return (
    <div className={cn(
      'mt-4 p-3 rounded-xl text-sm border',
      ok ? 'border-emerald-500/30 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/5',
    )}>
      <div className="font-semibold">{ok ? '✅ Correct' : '❌ Incorrect'}</div>
      {correctHint && <div className="mt-1 font-medium text-[color:var(--foreground)]">{correctHint}</div>}
      {question.explanation && <div className="mt-1 text-[color:var(--muted)]">{question.explanation}</div>}
    </div>
  );
}
