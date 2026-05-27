import type { CoreConcept } from '@/lib/types';

export function ConceptCard({ concept }: { concept: CoreConcept }) {
  return (
    <div className="card">
      <h3 className="heading font-semibold text-kz-blue-dark dark:text-kz-blue">{concept.term}</h3>
      <p className="text-sm mt-2 leading-relaxed">{concept.definition}</p>
      {concept.example && (
        <p className="text-xs text-[color:var(--muted)] mt-3 border-l-2 border-kz-gold pl-3 italic">
          {concept.example}
        </p>
      )}
    </div>
  );
}
