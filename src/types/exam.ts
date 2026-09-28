export type ExamStep = "upload" | "exam" | "report";

export type QuestionCategory =
  | "Understanding"
  | "Justification"
  | "Evidence"
  | "Challenge";

export type Question = {
  id: number;
  category: QuestionCategory;
  prompt: string;
  excerpt: string;
  source: string;
};

export type Score = {
  label: string;
  score: number;
  description: string;
};
