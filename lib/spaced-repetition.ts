// Simplified Leitner-style spaced repetition.
// Boxes: 0 (new) → 5 (mastered). Higher box = longer interval before review.

export type Rating = 'easy' | 'hard' | 'again';

export interface CardState {
  id: string;
  box: number; // 0..5
  due: number; // epoch ms
  lapses: number;
  lastReview: number;
}

const INTERVAL_MS = [
  0,                     // box 0: review now
  10 * 60 * 1000,        // 10 min
  60 * 60 * 1000,        // 1 hr
  24 * 60 * 60 * 1000,   // 1 day
  3 * 24 * 60 * 60 * 1000, // 3 days
  7 * 24 * 60 * 60 * 1000, // 1 week
];

export function newCard(id: string): CardState {
  return { id, box: 0, due: Date.now(), lapses: 0, lastReview: 0 };
}

export function review(card: CardState, rating: Rating, now = Date.now()): CardState {
  let box = card.box;
  let lapses = card.lapses;
  if (rating === 'easy') box = Math.min(5, box + 1);
  else if (rating === 'hard') box = Math.max(0, box);
  else { box = 0; lapses += 1; }
  return { ...card, box, lapses, lastReview: now, due: now + INTERVAL_MS[box] };
}

export function dueCards(cards: CardState[], now = Date.now()): CardState[] {
  return cards.filter(c => c.due <= now).sort((a, b) => a.due - b.due);
}
