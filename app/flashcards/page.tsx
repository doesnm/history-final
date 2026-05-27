import { getFlashcards, getTopics } from '@/lib/content-loader';
import { FlashcardsApp } from '@/components/flashcards/FlashcardsApp';

export const metadata = { title: 'Flashcards · History KZ' };

export default async function FlashcardsPage() {
  const cards = await getFlashcards();
  const topics = await getTopics();
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="heading text-3xl font-bold">🃏 Flashcards</h1>
      <p className="text-[color:var(--muted)] mt-2">Spaced repetition with Leitner boxes. Hard cards come back sooner.</p>
      <FlashcardsApp cards={cards} topics={topics} />
    </div>
  );
}
