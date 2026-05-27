import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl">🏞️</div>
      <h1 className="heading text-3xl font-bold mt-4">Page not found</h1>
      <p className="text-[color:var(--muted)] mt-2">This lecture may not be written yet.</p>
      <Link href="/" className="btn-primary mt-6 inline-flex">Back to home</Link>
    </div>
  );
}
