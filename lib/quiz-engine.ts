import type { Question, MCQQuestion, TrueFalseQuestion, FillQuestion, MatchQuestion } from './types';
import { normalize } from './utils';

export type Answer =
  | { type: 'mcq'; index: number }
  | { type: 'truefalse'; value: boolean }
  | { type: 'fill'; text: string }
  | { type: 'match'; mapping: Record<string, string> }; // term -> definition

export interface GradedAnswer {
  questionId: string;
  correct: boolean;
  given: Answer;
  expected: Question;
}

export function gradeOne(q: Question, a: Answer): boolean {
  if (q.type === 'mcq' && a.type === 'mcq') {
    return (q as MCQQuestion).correctIndex === a.index;
  }
  if (q.type === 'truefalse' && a.type === 'truefalse') {
    return (q as TrueFalseQuestion).answer === a.value;
  }
  if (q.type === 'fill' && a.type === 'fill') {
    const accepted = (q as FillQuestion).answers.map(normalize);
    return accepted.includes(normalize(a.text));
  }
  if (q.type === 'match' && a.type === 'match') {
    const pairs = (q as MatchQuestion).pairs;
    return pairs.every(p => normalize(a.mapping[p.term] ?? '') === normalize(p.definition));
  }
  return false;
}

export interface QuizResult {
  total: number;
  correct: number;
  scorePct: number;
  perQuestion: GradedAnswer[];
  weakTopics: string[];
}

export function gradeAll(questions: Question[], answers: Record<string, Answer>): QuizResult {
  const perQuestion: GradedAnswer[] = questions.map(q => {
    const a = answers[q.id];
    const correct = a ? gradeOne(q, a) : false;
    return { questionId: q.id, correct, given: a ?? ({ type: q.type } as Answer), expected: q };
  });
  const correct = perQuestion.filter(p => p.correct).length;
  const wrongByTopic = new Map<string, number>();
  perQuestion.filter(p => !p.correct).forEach(p => {
    wrongByTopic.set(p.expected.topic, (wrongByTopic.get(p.expected.topic) ?? 0) + 1);
  });
  const weakTopics = Array.from(wrongByTopic.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);
  return {
    total: questions.length,
    correct,
    scorePct: questions.length ? Math.round((correct / questions.length) * 100) : 0,
    perQuestion,
    weakTopics,
  };
}
