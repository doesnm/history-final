import type { ComparativeTable } from '@/lib/types';

export function ComparativeTableView({ table }: { table: ComparativeTable }) {
  return (
    <div className="card overflow-x-auto p-0">
      <table className="w-full text-sm">
        <thead className="bg-kz-sky dark:bg-kz-blue/10">
          <tr>
            {table.headers.map((h, i) => (
              <th key={i} className="text-left px-4 py-2 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i} className="border-t border-[var(--border)]">
              {r.map((c, j) => <td key={j} className="px-4 py-2 align-top">{c}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
