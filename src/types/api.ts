export type EvaluationLevel =
  | "Explain"
  | "Justify"
  | "Diagnose"
  | "Modify"
  | "Dispositions";

export type KnowledgeAspect = "know-what" | "know-how" | "know-why";
export type CognitiveLevel = "What" | "How" | "Why" | "What-if";

export type EvidenceItem = {
  label: string;
  claim: string;
  source: string;
  related_concepts: string[];
  suggested_level: EvaluationLevel;
  knowledge_aspect: KnowledgeAspect;
};

export type OralQuestion = {
  task_id: string;
  level: EvaluationLevel;
  knowledge_aspect: KnowledgeAspect;
  cognitive_level: CognitiveLevel;
  difficulty: number;
  module: string;
  concept: string;
  related_context: string;
  question: string;
  intent: string;
  evidence_refs: string[];
};

export type WorkflowResponse = {
  assessment_id: string;
  filename: string;
  evidence: EvidenceItem[];
  questions: OralQuestion[];
  model: string;
  fallback: boolean;
};

export type AnswerEvaluationResponse = {
  level: EvaluationLevel;
  knowledge_aspect: KnowledgeAspect;
  score: number;
  rationale: string;
  feedback: string;
  confidence: number;
  fallback: boolean;
};

export type AssessmentStatus =
  | "in_progress"
  | "evaluating"
  | "awaiting_professor_review"
  | "published";

export type SavedAnswerResponse = {
  assessment_id: string;
  task_id: string;
  answered_count: number;
  status: AssessmentStatus;
};

export type AssessmentSubmissionResponse = {
  assessment_id: string;
  answered_count: number;
  status: AssessmentStatus;
};

export type ReviewItem = AnswerEvaluationResponse & {
  task_id: string;
  question: string;
  student_answer: string;
  professor_adjusted: boolean;
};

export type AssessmentReviewResponse = {
  assessment_id: string;
  filename: string;
  status: AssessmentStatus;
  items: ReviewItem[];
  overall_score: number;
};
