export interface CoreConcept {
  term: string;
  definition: string;
  example?: string;
}

export interface Scholar {
  name: string;
  years: string;
  contribution: string;
}

export interface TimelineEvent {
  year: number | string;
  event: string;
}

export interface ComparativeTable {
  title: string;
  headers: string[];
  rows: string[][];
}

export interface ExpandedNote {
  heading: string;
  body: string;
}

export interface Topic {
  slug: string;
  number: number;
  title: string;
  overview: string;
  coreConcepts: CoreConcept[];
  expandedNotes: ExpandedNote[];
  keyScholars: Scholar[];
  comparativeTables?: ComparativeTable[];
  realWorldExamples?: string[];
  timeline: TimelineEvent[];
  mustMemorize: string[];
  cheatSheet: string;
  mnemonics?: string[];
}

export type QuestionType = 'mcq' | 'truefalse' | 'fill' | 'match';

export interface BaseQuestion {
  id: string;
  topic: string;
  type: QuestionType;
  question: string;
  explanation: string;
}

export interface MCQQuestion extends BaseQuestion {
  type: 'mcq';
  options: string[];
  correctIndex: number;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'truefalse';
  answer: boolean;
}

export interface FillQuestion extends BaseQuestion {
  type: 'fill';
  answers: string[]; // accepted answers (case-insensitive)
}

export interface MatchQuestion extends BaseQuestion {
  type: 'match';
  pairs: { term: string; definition: string }[];
}

export type Question = MCQQuestion | TrueFalseQuestion | FillQuestion | MatchQuestion;

export interface Flashcard {
  id: string;
  topic: string;
  front: string;
  back: string;
}

export interface TopicMeta {
  slug: string;
  number: number;
  title: string;
  shortTitle: string;
  emoji: string;
  period: string;
  questionCount: number;
  conceptCount: number;
}
