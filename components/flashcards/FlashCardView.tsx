'use client';
import type { Flashcard } from '@/lib/types';
import { cn } from '@/lib/utils';

export function FlashCardView({
  card,
  flipped,
  onFlip,
}: {
  card: Flashcard;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <button
      onClick={onFlip}
      aria-label="Flip card"
      className="flip-card relative w-full h-72 sm:h-80 block"
    >
      <div className={cn('flip-inner', flipped && 'flipped')}>
        <div className="flip-face card flex flex-col justify-center items-center text-center bg-gradient-to-br from-kz-blue/10 to-kz-sky">
          <span className="chip mb-3">{card.topic}</span>
          <p className="heading text-xl sm:text-2xl font-semibold leading-tight">{card.front}</p>
          <p className="text-xs text-[color:var(--muted)] mt-6">tap to flip →</p>
        </div>
        <div className="flip-face flip-back card flex flex-col justify-center items-center text-center bg-gradient-to-br from-kz-gold/20 to-kz-sand">
          <p className="text-base sm:text-lg leading-relaxed">{card.back}</p>
        </div>
      </div>
    </button>
  );
}
