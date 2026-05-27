import { getTopics } from '@/lib/content-loader';
import { DashboardView } from '@/components/dashboard/DashboardView';

export const metadata = { title: 'Progress · History KZ' };

export default async function DashboardPage() {
  const topics = await getTopics();
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="heading text-3xl font-bold">📊 Progress</h1>
      <p className="text-[color:var(--muted)] mt-2">Stats are stored locally in your browser.</p>
      <DashboardView topics={topics} />
    </div>
  );
}
