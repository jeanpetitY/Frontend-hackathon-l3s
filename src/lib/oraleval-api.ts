import type {
  AnswerEvaluationResponse,
  AssessmentReviewResponse,
  AssessmentSubmissionResponse,
  CognitiveLevel,
  EvidenceItem,
  EvaluationLevel,
  KnowledgeAspect,
  OralQuestion,
  SavedAnswerResponse,
  WorkflowResponse,
} from "@/types/api";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(
  /\/$/,
  "",
);

type WorkflowInput = {
  file: File;
  className: string;
  module: string;
  concepts: string[];
};

type EvaluationInput = {
  assessmentId: string;
  question: OralQuestion;
  answer: string;
  evidence: EvidenceItem[];
};

const taskDefaults: Record<
  EvaluationLevel,
  { cognitiveLevel: CognitiveLevel; difficulty: number; knowledgeAspect: KnowledgeAspect }
> = {
  Explain: { cognitiveLevel: "What", difficulty: 1, knowledgeAspect: "know-what" },
  Diagnose: { cognitiveLevel: "How", difficulty: 2, knowledgeAspect: "know-how" },
  Justify: { cognitiveLevel: "Why", difficulty: 3, knowledgeAspect: "know-why" },
  Modify: { cognitiveLevel: "What-if", difficulty: 4, knowledgeAspect: "know-how" },
  Dispositions: { cognitiveLevel: "What-if", difficulty: 4, knowledgeAspect: "know-why" },
};

function normalizeQuestion(
  question: OralQuestion,
  index: number,
  input: WorkflowInput,
): OralQuestion {
  const defaults = taskDefaults[question.level];

  return {
    ...question,
    task_id: question.task_id || `task-${String(index + 1).padStart(2, "0")}`,
    knowledge_aspect: question.knowledge_aspect || defaults.knowledgeAspect,
    cognitive_level: question.cognitive_level || defaults.cognitiveLevel,
    difficulty: question.difficulty || defaults.difficulty,
    module: question.module || input.module,
    concept: question.concept || input.concepts[0] || "Programming",
    related_context:
      question.related_context || "Student submission and extracted evidence",
    evidence_refs: question.evidence_refs ?? [],
  };
}

async function apiError(response: Response): Promise<Error> {
  try {
    const payload = (await response.json()) as { detail?: string | { msg?: string }[] };
    if (typeof payload.detail === "string") return new Error(payload.detail);
    if (Array.isArray(payload.detail)) {
      return new Error(payload.detail.map((item) => item.msg ?? "Invalid form value").join(" · "));
    }
  } catch {
    // The API may return an empty or non-JSON error response.
  }

  return new Error(`Backend request failed (${response.status}).`);
}

export async function runWorkflow(input: WorkflowInput): Promise<WorkflowResponse> {
  const form = new FormData();
  form.append("file", input.file);
  form.append("class_name", input.className);
  form.append("module", input.module);
  form.append("concepts", input.concepts.join(","));

  const response = await fetch(`${API_BASE_URL}/api/v1/workflow/run`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) throw await apiError(response);
  const payload = (await response.json()) as WorkflowResponse;

  return {
    ...payload,
    questions: payload.questions.map((question, index) =>
      normalizeQuestion(question, index, input),
    ),
  };
}

export async function evaluateAnswer(input: EvaluationInput): Promise<AnswerEvaluationResponse> {
  const relevantEvidence = input.evidence.filter((item) =>
    input.question.evidence_refs.includes(item.label),
  );
  const evidence = relevantEvidence.length > 0 ? relevantEvidence : input.evidence;
  const evidenceContext = evidence
    .map((item) => `${item.label}: ${item.claim} [${item.source}]`)
    .join("\n");

  const form = new FormData();
  form.append("assessment_id", input.assessmentId);
  form.append("task_id", input.question.task_id);
  form.append("level", input.question.level);
  form.append("knowledge_aspect", input.question.knowledge_aspect);
  form.append("cognitive_level", input.question.cognitive_level);
  form.append("difficulty", String(input.question.difficulty));
  form.append("module", input.question.module);
  form.append("concept", input.question.concept);
  form.append("related_context", input.question.related_context);
  form.append("question", input.question.question);
  form.append("answer", input.answer);
  form.append("intent", input.question.intent);
  form.append("evidence_refs", input.question.evidence_refs.join(","));
  form.append("evidence_context", evidenceContext);

  const response = await fetch(`${API_BASE_URL}/api/v1/evaluations`, {
    method: "POST",
    body: form,
  });

  if (!response.ok) throw await apiError(response);
  return (await response.json()) as AnswerEvaluationResponse;
}

function answerForm(input: EvaluationInput): FormData {
  const relevantEvidence = input.evidence.filter((item) =>
    input.question.evidence_refs.includes(item.label),
  );
  const evidence = relevantEvidence.length > 0 ? relevantEvidence : input.evidence;
  const form = new FormData();
  form.append("task_id", input.question.task_id);
  form.append("level", input.question.level);
  form.append("knowledge_aspect", input.question.knowledge_aspect);
  form.append("cognitive_level", input.question.cognitive_level);
  form.append("difficulty", String(input.question.difficulty));
  form.append("module", input.question.module);
  form.append("concept", input.question.concept);
  form.append("related_context", input.question.related_context);
  form.append("question", input.question.question);
  form.append("answer", input.answer);
  form.append("intent", input.question.intent);
  form.append("evidence_refs", input.question.evidence_refs.join(","));
  form.append(
    "evidence_context",
    evidence.map((item) => `${item.label}: ${item.claim} [${item.source}]`).join("\n"),
  );
  return form;
}

export async function saveAnswer(input: EvaluationInput): Promise<SavedAnswerResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/assessments/${input.assessmentId}/answers`,
    { method: "POST", body: answerForm(input) },
  );
  if (!response.ok) throw await apiError(response);
  return (await response.json()) as SavedAnswerResponse;
}

export async function submitAssessment(
  assessmentId: string,
): Promise<AssessmentSubmissionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assessments/${assessmentId}/submit`, {
    method: "POST",
  });
  if (!response.ok) throw await apiError(response);
  return (await response.json()) as AssessmentSubmissionResponse;
}

export async function getAssessmentReview(
  assessmentId: string,
): Promise<AssessmentReviewResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/assessments/${assessmentId}/review`);
  if (!response.ok) throw await apiError(response);
  return (await response.json()) as AssessmentReviewResponse;
}

export async function publishAssessment(
  assessmentId: string,
  scores: Record<string, number>,
): Promise<AssessmentReviewResponse> {
  const form = new FormData();
  form.append("score_overrides", JSON.stringify(scores));
  const response = await fetch(`${API_BASE_URL}/api/v1/assessments/${assessmentId}/publish`, {
    method: "POST",
    body: form,
  });
  if (!response.ok) throw await apiError(response);
  return (await response.json()) as AssessmentReviewResponse;
}
