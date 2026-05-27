import type { Scholar } from '@/lib/types';

export function ScholarCard({ scholar }: { scholar: Scholar }) {
  return (
    <div className="card flex gap-3">
      <div className="shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-kz-blue to-kz-gold flex items-center justify-center text-white font-bold">
        {scholar.name.charAt(0)}
      </div>
      <div className="min-w-0">
        <h3 className="heading font-semibold">{scholar.name}</h3>
        <p className="text-xs text-kz-blue-dark dark:text-kz-blue">{scholar.years}</p>
        <p className="text-sm mt-1">{scholar.contribution}</p>
      </div>
    </div>
  );
}
