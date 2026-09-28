import type { Question, Score } from "@/types/exam";

export const questions: Question[] = [
  {
    id: 1,
    category: "Understanding",
    prompt: "Why did you choose Random Forest for this task?",
    excerpt: "We chose Random Forest because it is more robust to noisy data.",
    source: "Methodology · page 3",
  },
  {
    id: 2,
    category: "Evidence",
    prompt: "What evidence supports your conclusion that it performs better?",
    excerpt: "The model achieved an accuracy of 91% on the test set.",
    source: "Results · page 5",
  },
  {
    id: 3,
    category: "Challenge",
    prompt: "How would highly correlated features affect your method?",
    excerpt: "The dataset was evaluated using an 80/20 train-test split.",
    source: "Experimental setup · page 4",
  },
];

export const reportScores: Score[] = [
  { label: "Understanding", score: 4.4, description: "Clear command of core concepts" },
  { label: "Justification", score: 3.8, description: "Decisions are mostly well defended" },
  { label: "Evidence", score: 2.9, description: "Claims need stronger support" },
  { label: "Critical reasoning", score: 4.1, description: "Good awareness of trade-offs" },
];
