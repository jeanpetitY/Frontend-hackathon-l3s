export type EvaluationLevel = "Explain" | "Justify" | "Diagnose" | "Modify" | "Dispositions";

export type DemoQuestion = {
  level: EvaluationLevel;
  knowledgeAspect: "know-what" | "know-how" | "know-why";
  intent: string;
  prompt: string;
  evidence: string;
};

export const pythonModules = [
  { chapter: "Module 1", title: "Python foundations", concepts: ["Variables", "Functions", "Classes"] },
  { chapter: "Module 2", title: "Data Structures", concepts: ["Lists", "Dictionaries", "Tuples", "Sets"], active: true },
  { chapter: "Module 3", title: "Iteration & algorithms", concepts: ["Loops", "Comprehensions", "Searching"] },
];

export const evaluationLevels = [
  { level: "Explain", knowledgeAspect: "know-what", cognitiveLevel: "What", summary: "Own code and basic knowledge", example: "What data structure are you using here?", color: "bg-emerald-600" },
  { level: "Diagnose", knowledgeAspect: "know-how", cognitiveLevel: "How", summary: "Execution and debugging", example: "What would you inspect first?", color: "bg-amber-500" },
  { level: "Justify", knowledgeAspect: "know-why", cognitiveLevel: "Why", summary: "Design choices and trade-offs", example: "Why a dictionary rather than a list?", color: "bg-orange-500" },
  { level: "Modify", knowledgeAspect: "know-how", cognitiveLevel: "What-if", summary: "Adapt code to new requirements", example: "How would you add an ID?", color: "bg-rose-600" },
  { level: "Dispositions", knowledgeAspect: "know-why", cognitiveLevel: "What-if", summary: "Quality and professional judgement", example: "What else would you improve or test?", color: "bg-rose-600" },
] as const;

export const pythonCode = `def average_grades(students):
    averages = {}
    for name, grades in students.items():
        if grades:
            averages[name] = sum(grades) / len(grades)
        else:
            averages[name] = 0
    return averages

students = {
    "Amina": [14, 17, 16],
    "Jonas": [11, 13],
    "Mei": [],
}

print(average_grades(students))`;

export const extractedEvidence = [
  { label: "Structure", value: "Student names map to lists of grades", level: "Explain" },
  { label: "Design decision", value: "A dictionary provides direct access by name", level: "Justify" },
  { label: "Failure surface", value: "Invalid grades can break the aggregation", level: "Diagnose" },
  { label: "Change point", value: "Each student record could include an ID", level: "Modify" },
  { label: "Quality signal", value: "Empty grade lists are handled explicitly", level: "Dispositions" },
];

export const demoQuestions: DemoQuestion[] = [
  { level: "Explain", knowledgeAspect: "know-what", intent: "Understanding code and constructs", prompt: "What are the keys and values in the students dictionary?", evidence: "Student data · lines 11–15" },
  { level: "Justify", knowledgeAspect: "know-why", intent: "Understanding design choices", prompt: "Why use each student's name as a dictionary key?", evidence: "Dictionary representation · lines 11–15" },
  { level: "Diagnose", knowledgeAspect: "know-how", intent: "Understanding operational mechanics", prompt: "If one grade were a string, how would you locate the problem?", evidence: "Aggregation expression · line 5" },
  { level: "Modify", knowledgeAspect: "know-how", intent: "Ability to adapt code", prompt: "How would you change the structure to store an ID for each student?", evidence: "Student representation and loop" },
  { level: "Dispositions", knowledgeAspect: "know-why", intent: "Professional judgement", prompt: "Before considering this finished, what else would you improve or test?", evidence: "Whole submission · quality review" },
];

export const demoScores = [
  { level: "Explain", score: 4.6, note: "Accurately describes purpose and output" },
  { level: "Diagnose", score: 3.4, note: "Finds the likely failure point" },
  { level: "Justify", score: 4.1, note: "Explains the missing-value decision" },
  { level: "Modify", score: 3.8, note: "Identifies relevant change locations" },
  { level: "Dispositions", score: 4.0, note: "Proposes alternatives and edge cases" },
];
