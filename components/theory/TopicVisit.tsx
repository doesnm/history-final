'use client';
import { useEffect } from 'react';
import { useProgress } from '@/lib/store';

export function TopicVisit({ slug }: { slug: string }) {
  const markVisited = useProgress(s => s.markVisited);
  useEffect(() => { markVisited(slug); }, [slug, markVisited]);
  return null;
}
