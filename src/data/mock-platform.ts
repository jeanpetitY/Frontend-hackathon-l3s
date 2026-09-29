export type CourseType = "Seminar" | "Coursework" | "Thesis" | "Programming";

export type Course = {
  id: string;
  code: string;
  title: string;
  type: CourseType;
  students: number;
  assessments: number;
  color: string;
};

export const courses: Course[] = [
  { id: "ai", code: "CS-421", title: "Applied Machine Learning", type: "Programming", students: 34, assessments: 3, color: "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300" },
  { id: "web", code: "INF-312", title: "Web Information Systems", type: "Coursework", students: 48, assessments: 2, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300" },
  { id: "research", code: "SEM-204", title: "Research Methods Seminar", type: "Seminar", students: 18, assessments: 2, color: "bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300" },
];

export const criteria = [
  { id: "understanding", label: "Conceptual understanding", weight: 30, source: "Learning objective 2" },
  { id: "justification", label: "Design justification", weight: 25, source: "Assignment rubric" },
  { id: "evidence", label: "Use of evidence", weight: 20, source: "Teaching materials" },
  { id: "reasoning", label: "Critical reasoning", weight: 25, source: "Suggested by AI" },
];

export const activity = [
  { student: "Maya Okafor", assessment: "Model selection defence", status: "Ready for review", time: "12 min ago" },
  { student: "Leon Weber", assessment: "Model selection defence", status: "Oral exam pending", time: "36 min ago" },
  { student: "Sara Lindholm", assessment: "Research proposal", status: "Submitted", time: "1 h ago" },
];
