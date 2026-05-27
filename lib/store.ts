'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CardState, Rating } from './spaced-repetition';
import { newCard, review } from './spaced-repetition';

export interface QuizAttempt {
  id: string;
  topic: string;
  scorePct: number;
  total: number;
  correct: number;
  weakTopics: string[];
  timestamp: number;
}

interface ProgressState {
  visitedTopics: Record<string, number>; // slug -> last visited ts
  attempts: QuizAttempt[];
  cards: Record<string, CardState>;
  theme: 'light' | 'dark';
  markVisited: (slug: string) => void;
  addAttempt: (a: QuizAttempt) => void;
  rateCard: (id: string, rating: Rating) => void;
  ensureCard: (id: string) => void;
  setTheme: (t: 'light' | 'dark') => void;
  reset: () => void;
}

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      visitedTopics: {},
      attempts: [],
      cards: {},
      theme: 'light',
      markVisited: (slug) =>
        set(s => ({ visitedTopics: { ...s.visitedTopics, [slug]: Date.now() } })),
      addAttempt: (a) => set(s => ({ attempts: [a, ...s.attempts].slice(0, 100) })),
      ensureCard: (id) => {
        if (!get().cards[id]) set(s => ({ cards: { ...s.cards, [id]: newCard(id) } }));
      },
      rateCard: (id, rating) => set(s => {
        const c = s.cards[id] ?? newCard(id);
        return { cards: { ...s.cards, [id]: review(c, rating) } };
      }),
      setTheme: (theme) => set({ theme }),
      reset: () => set({ visitedTopics: {}, attempts: [], cards: {} }),
    }),
    { name: 'history-kz-progress', version: 1 }
  )
);

export function exportProgress() {
  const state = useProgress.getState();
  return JSON.stringify(
    { visitedTopics: state.visitedTopics, attempts: state.attempts, cards: state.cards },
    null,
    2,
  );
}
