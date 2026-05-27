import { notFound } from 'next/navigation';
import { getQuestions, getTopic, getTopics } from '@/lib/content-loader';
import { QuizRunner } from '@/components/quiz/QuizRunner';

export async function generateStaticParams() {
  const topics = await getTopics();
  return [...topics.map(t => ({ topic: t.slug })), { topic: 'all' }];
}

export default async function QuizPage({
  params,
  searchParams,
}: {
  params: { topic: string };
  searchParams: { mode?: string };
}) {
  const isAll = params.topic === 'all';
  const questions = isAll ? await getQuestions() : await getQuestions(params.topic);
  if (!questions.length) notFound();

  const topic = isAll ? null : await getTopic(params.topic);
  const title = isAll ? 'All topics' : topic?.title ?? params.topic;
  const mode = searchParams.mode === 'exam' ? 'exam' : 'practice';

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-6">
        <div className="chip">{mode === 'exam' ? '📝 Exam' : '🎓 Practice'}</div>
        <h1 className="heading text-2xl sm:text-3xl font-bold mt-2">{title}</h1>
        <p className="text-[color:var(--muted)] text-sm mt-1">{questions.length} questions</p>
      </header>
      <QuizRunner questions={questions} topicSlug={params.topic} mode={mode} />
    </div>
  );
}
