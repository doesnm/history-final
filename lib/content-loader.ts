import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import type { Topic, Question, Flashcard, TopicMeta } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

async function readJSON<T>(rel: string): Promise<T> {
  const buf = await fs.readFile(path.join(DATA_DIR, rel), 'utf8');
  return JSON.parse(buf) as T;
}

export async function getTopics(): Promise<TopicMeta[]> {
  return readJSON<TopicMeta[]>('topics.json');
}

export async function getTopic(slug: string): Promise<Topic | null> {
  try {
    return await readJSON<Topic>(`theory/${slug}.json`);
  } catch {
    return null;
  }
}

export async function getAllTopics(): Promise<Topic[]> {
  const metas = await getTopics();
  const topics = await Promise.all(metas.map(m => getTopic(m.slug)));
  return topics.filter((t): t is Topic => t !== null);
}

export async function getQuestions(topic?: string): Promise<Question[]> {
  if (topic) {
    try {
      return await readJSON<Question[]>(`questions/${topic}.json`);
    } catch {
      return [];
    }
  }
  const metas = await getTopics();
  const all = await Promise.all(metas.map(m => getQuestions(m.slug)));
  return all.flat();
}

export async function getFlashcards(): Promise<Flashcard[]> {
  return readJSON<Flashcard[]>('flashcards.json');
}

export async function getStats() {
  const topics = await getTopics();
  const questions = await getQuestions();
  const flashcards = await getFlashcards();
  return {
    topicCount: topics.length,
    questionCount: questions.length,
    flashcardCount: flashcards.length,
    conceptCount: topics.reduce((s, t) => s + t.conceptCount, 0),
  };
}
