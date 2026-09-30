"use client";

import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { evaluationLevels, pythonCode } from "@/data/python-demo";
import { getAssessmentReview, publishAssessment, runWorkflow, saveAnswer, submitAssessment } from "@/lib/oraleval-api";
import type {
  AnswerEvaluationResponse,
  AssessmentReviewResponse,
  AssessmentStatus,
  EvidenceItem,
  EvaluationLevel,
  KnowledgeAspect,
  OralQuestion,
  WorkflowResponse,
} from "@/types/api";

type DemoPhase = "context" | "analysis" | "exam" | "pending" | "report";
type UserRole = "student" | "professor";

const COURSE = {
  className: "Programming Fundamentals with Python",
  module: "Python Programming Fundamentals",
  concepts: [
    "Variables",
    "Data types",
    "Functions",
    "Parameters",
    "Return values",
    "Lists",
    "Tuples",
    "Dictionaries",
    "Sets",
    "Loops",
    "Conditionals",
    "Classes",
    "Exceptions",
    "Algorithms",
    "Testing",
  ],
};

const courseAreas = ["Functions", "Data structures", "Control flow", "Algorithms", "Testing"];

const knowledgeAspectDescription: Record<KnowledgeAspect, string> = {
  "know-what": "Concepts and constructs",
  "know-how": "Analysis and debugging",
  "know-why": "Rationale and adaptability",
};

const phases: { id: DemoPhase; label: string }[] = [
  { id: "context", label: "Course & code" },
  { id: "analysis", label: "Evidence extraction" },
  { id: "exam", label: "Oral evaluation" },
  { id: "pending", label: "Professor review" },
  { id: "report", label: "Criteria report" },
];

const criterionTheme: Record<
  EvaluationLevel,
  { accent: string; bar: string; difficulty: number }
> = {
  Explain: { accent: "text-emerald-700 dark:text-emerald-400", bar: "bg-emerald-600", difficulty: 1 },
  Diagnose: { accent: "text-amber-700 dark:text-amber-400", bar: "bg-amber-500", difficulty: 2 },
  Justify: { accent: "text-orange-700 dark:text-orange-400", bar: "bg-orange-500", difficulty: 3 },
  Modify: { accent: "text-rose-700 dark:text-rose-400", bar: "bg-rose-600", difficulty: 4 },
  Dispositions: { accent: "text-rose-700 dark:text-rose-400", bar: "bg-rose-600", difficulty: 4 },
};

export function ConnectedPythonDemo() {
  const [role, setRole] = useState<UserRole>("student");
  const [phase, setPhase] = useState<DemoPhase>("context");
  const [file, setFile] = useState<File | null>(null);
  const [code, setCode] = useState(pythonCode);
  const [workflow, setWorkflow] = useState<WorkflowResponse | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<OralQuestion | null>(null);
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>([]);
  const [answer, setAnswer] = useState("");
  const [evaluations, setEvaluations] = useState<AnswerEvaluationResponse[]>([]);
  const [review, setReview] = useState<AssessmentReviewResponse | null>(null);
  const [assessmentStatus, setAssessmentStatus] = useState<AssessmentStatus>("in_progress");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    setCode(await selected.text());
    setWorkflow(null);
    setError(null);
  }

  async function analyzeSubmission() {
    setIsAnalyzing(true);
    setError(null);

    try {
      const submission = file ?? new File([pythonCode], "student_grades.py", { type: "text/x-python" });
      const result = await runWorkflow({
        file: submission,
        className: COURSE.className,
        module: COURSE.module,
        concepts: COURSE.concepts,
      });
      if (result.questions.length === 0) throw new Error("The backend returned no oral questions.");
      setWorkflow(result);
      setPhase("analysis");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to analyze the submission.");
    } finally {
      setIsAnalyzing(false);
    }
  }

  function startExam() {
    setAnswer("");
    setEvaluations([]);
    setCompletedTaskIds([]);
    setError(null);
    setCurrentQuestion(workflow ? selectNextQuestion(workflow.questions, new Set()) : null);
    setPhase("exam");
  }

  async function submitAnswer() {
    const question = currentQuestion;
    if (!workflow || !question || !answer.trim()) return;

    setIsEvaluating(true);
    setError(null);

    try {
      await saveAnswer({
        assessmentId: workflow.assessment_id,
        question,
        answer: answer.trim(),
        evidence: workflow.evidence,
      });
      const nextCompletedTaskIds = [...completedTaskIds, question.task_id];
      setCompletedTaskIds(nextCompletedTaskIds);
      setAnswer("");

      const nextQuestion = selectNextQuestion(
        workflow.questions,
        new Set(nextCompletedTaskIds),
      );
      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
      } else {
        const submission = await submitAssessment(workflow.assessment_id);
        setAssessmentStatus(submission.status);
        setCurrentQuestion(null);
        setPhase("pending");
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to evaluate the answer.");
    } finally {
      setIsEvaluating(false);
    }
  }

  function restart() {
    setRole("student");
    setPhase("context");
    setCurrentQuestion(null);
    setCompletedTaskIds([]);
    setAnswer("");
    setEvaluations([]);
    setReview(null);
    setAssessmentStatus("in_progress");
    setWorkflow(null);
    setError(null);
  }

  async function switchRole(nextRole: UserRole) {
    setRole(nextRole);
    if (nextRole === "professor" && workflow && !review && assessmentStatus === "awaiting_professor_review") {
      setIsAnalyzing(true);
      setError(null);
      try {
        const draft = await getAssessmentReview(workflow.assessment_id);
        setReview(draft);
        setEvaluations(draft.items);
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Unable to load the review.");
      } finally {
        setIsAnalyzing(false);
      }
    }
    if (nextRole === "student" && review?.status === "published") setPhase("report");
    if (nextRole === "student" && assessmentStatus === "awaiting_professor_review") setPhase("pending");
  }

  async function publish(scores: Record<string, number>) {
    if (!workflow) return;
    setIsEvaluating(true);
    setError(null);
    try {
      const published = await publishAssessment(workflow.assessment_id, scores);
      setReview(published);
      setEvaluations(published.items);
      setAssessmentStatus(published.status);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to publish the result.");
    } finally {
      setIsEvaluating(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f6f7fa] transition-colors dark:bg-[#11151b]">
      <RoleSwitcher onChange={switchRole} role={role} status={review?.status ?? assessmentStatus} />
      {role === "student" && <PhaseNavigation phase={phase} onNavigate={setPhase} />}
      {role === "student" && phase === "context" && (
        <ContextPhase
          code={code}
          error={error}
          fileName={file?.name ?? "student_grades.py"}
          isLoading={isAnalyzing}
          onAnalyze={analyzeSubmission}
          onFileChange={handleFileChange}
        />
      )}
      {role === "student" && phase === "analysis" && workflow && (
        <AnalysisPhase
          code={code}
          onBack={() => setPhase("context")}
          onContinue={startExam}
          workflow={workflow}
        />
      )}
      {role === "student" && phase === "exam" && workflow && currentQuestion && (
        <ExamPhase
          answer={answer}
          completedCount={completedTaskIds.length}
          error={error}
          isLoading={isEvaluating}
          onAnswerChange={setAnswer}
          onBack={() => setPhase("analysis")}
          onSubmit={submitAnswer}
          question={currentQuestion}
          evidence={workflow.evidence}
          totalTasks={workflow.questions.length}
        />
      )}
      {role === "student" && phase === "pending" && (
        <PendingReviewPhase answerCount={completedTaskIds.length} onOpenProfessor={() => switchRole("professor")} />
      )}
      {role === "student" && phase === "report" && workflow && review?.status === "published" && (
        <ReportPhase evaluations={evaluations} onRestart={restart} workflow={workflow} />
      )}
      {role === "professor" && (
        <ProfessorReviewPhase
          error={error}
          isLoading={isAnalyzing}
          isPublishing={isEvaluating}
          onPublish={publish}
          onViewStudent={() => switchRole("student")}
          review={review}
        />
      )}
    </main>
  );
}

function RoleSwitcher({ onChange, role, status }: { onChange: (role: UserRole) => void; role: UserRole; status?: AssessmentReviewResponse["status"] }) {
  return (
    <div className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-[#11151b]">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between gap-4 px-5 py-2.5 sm:px-8">
        <div className="hidden items-center gap-2 text-xs text-slate-500 dark:text-slate-400 sm:flex">
          <span className={`size-2 rounded-full ${status === "published" ? "bg-emerald-500" : status === "awaiting_professor_review" ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-600"}`} />
          <span>{status === "published" ? "Result published" : status === "awaiting_professor_review" ? "Professor review required" : "Demo workspace"}</span>
        </div>
        <div className="ml-auto flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-[#191e26]" aria-label="Active profile">
          {(["student", "professor"] as UserRole[]).map((item) => (
            <button className={`min-h-8 cursor-pointer rounded-md px-3 text-xs font-semibold capitalize transition ${role === item ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"}`} key={item} onClick={() => onChange(item)} type="button">{item}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function PendingReviewPhase({ answerCount, onOpenProfessor }: { answerCount: number; onOpenProfessor: () => void }) {
  return (
    <div className="animate-enter mx-auto w-full max-w-[860px] px-5 py-12 sm:px-8 sm:py-20">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(31,41,55,0.06)] dark:border-slate-700 dark:bg-[#191e26]">
        <div className="h-1 bg-amber-400" />
        <div className="px-6 py-10 text-center sm:px-12 sm:py-14">
          <span className="mx-auto grid size-12 place-items-center rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"><Icon className="size-6" name="clock" /></span>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">Submitted for review</p>
          <h1 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-slate-900 dark:text-white">Your answers are with the professor.</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-300">The evaluation agent has prepared a private draft from {answerCount} answers. Scores and feedback remain hidden until the professor approves and publishes the report.</p>
          <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 divide-x divide-slate-200 rounded-lg bg-slate-50 py-4 dark:divide-slate-700 dark:bg-[#12171e]">
            <Metric label="Answers" value={String(answerCount)} />
            <Metric label="Status" value="Review" />
            <Metric label="Visibility" value="Private" />
          </div>
          <Button className="mt-8" onClick={onOpenProfessor} type="button" variant="secondary">Open professor profile <Icon className="size-4" name="arrow-right" /></Button>
        </div>
      </section>
    </div>
  );
}

function ProfessorReviewPhase({ error, isLoading, isPublishing, onPublish, onViewStudent, review }: { error: string | null; isLoading: boolean; isPublishing: boolean; onPublish: (scores: Record<string, number>) => Promise<void>; onViewStudent: () => void; review: AssessmentReviewResponse | null }) {
  const [scores, setScores] = useState<Record<string, number>>(() => Object.fromEntries(review?.items.map((item) => [item.task_id, item.score]) ?? []));

  if (!review) {
    return <div className="animate-enter mx-auto w-full max-w-[860px] px-5 py-16 text-center sm:px-8"><span className="mx-auto grid size-12 place-items-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"><Icon className="size-6" name="document" /></span><h1 className="mt-5 text-2xl font-semibold text-slate-900 dark:text-white">{isLoading ? "Loading the private draft…" : "No evaluation to review yet"}</h1><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{isLoading ? "The professor workspace is retrieving the agent evaluation." : "Complete and submit the student oral examination first."}</p>{error && <ErrorMessage message={error} />}</div>;
  }

  const published = review.status === "published";
  return (
    <div className="animate-enter mx-auto w-full max-w-[1040px] px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-[#d94f55] dark:text-rose-300">Professor workspace</p><h1 className="mt-2 text-3xl font-medium tracking-[-0.035em] text-slate-900 dark:text-white">Review the agent&apos;s evaluation.</h1><p className="mt-3 text-sm text-slate-600 dark:text-slate-400">{review.filename} · {review.items.length} answers · evidence-grounded draft</p></div><span className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${published ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" : "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300"}`}>{published ? "Published" : "Awaiting approval"}</span></div>
      <div className="mt-8 space-y-4">
        {review.items.map((item, index) => (
          <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#191e26] sm:p-6" key={item.task_id}>
            <div className="grid gap-5 sm:grid-cols-[1fr_120px]">
              <div><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-[11px] text-slate-400">{String(index + 1).padStart(2, "0")}</span><span className={`text-sm font-semibold ${criterionTheme[item.level].accent}`}>{item.level}</span><span className="font-mono text-[10px] text-slate-400">{item.knowledge_aspect}</span><ConfidenceBadge value={item.confidence} /></div><h2 className="mt-3 text-base font-semibold leading-6 text-slate-800 dark:text-slate-100">{item.question}</h2><div className="mt-4 rounded-lg bg-slate-50 p-4 dark:bg-[#12171e]"><p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">Student answer</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{item.student_answer}</p></div><p className="mt-4 text-xs leading-5 text-slate-600 dark:text-slate-300"><strong>Agent rationale:</strong> {item.rationale}</p><p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Suggested feedback: {item.feedback}</p></div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300">Approved score<input className="mt-2 h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-lg font-semibold text-slate-900 outline-none transition focus:border-rose-500 focus:ring-3 focus:ring-rose-100 disabled:opacity-70 dark:border-slate-600 dark:bg-[#12171e] dark:text-white dark:focus:ring-rose-950" disabled={published} max="5" min="0" onChange={(event) => setScores((current) => ({ ...current, [item.task_id]: Number(event.target.value) }))} step="0.1" type="number" value={scores[item.task_id] ?? item.score} /><span className="mt-1 block text-right text-[10px] font-normal text-slate-400">out of 5</span></label>
            </div>
          </article>
        ))}
      </div>
      <div className="sticky bottom-4 mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-[#191e26]/95 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{published ? "This report is visible to the student." : "Publishing makes the report visible to the student."}</p>{error && <ErrorMessage message={error} />}</div>{published ? <Button onClick={onViewStudent} type="button">View student result <Icon className="size-4" name="arrow-right" /></Button> : <Button disabled={isPublishing} onClick={() => onPublish(scores)} type="button">{isPublishing ? "Publishing…" : "Approve & publish"}<Icon className="size-4" name="check" /></Button>}</div>
    </div>
  );
}

function PhaseNavigation({
  phase,
  onNavigate,
}: {
  phase: DemoPhase;
  onNavigate: (phase: DemoPhase) => void;
}) {
  const current = phases.findIndex((item) => item.id === phase);

  return (
    <div className="border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-[#171b22]/95">
      <div className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-5 py-3 sm:hidden">
        <div>
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#d94f55]">Step {current + 1} of {phases.length}</p>
          <p className="mt-0.5 text-sm font-semibold text-slate-800 dark:text-slate-100">{phases[current].label}</p>
        </div>
        <div aria-label={`Step ${current + 1} of ${phases.length}`} className="flex gap-1.5">
          {phases.map((item, index) => <span className={`h-1.5 rounded-full transition-all ${index === current ? "w-7 bg-[#e9545a]" : index < current ? "w-3 bg-slate-500 dark:bg-slate-400" : "w-3 bg-slate-200 dark:bg-slate-700"}`} key={item.id} />)}
        </div>
      </div>
      <div className="mx-auto hidden w-full max-w-[1180px] items-center gap-10 px-8 sm:flex">
        {phases.map((item, index) => {
          const active = item.id === phase;
          const complete = index < current;
          return (
            <button
                className={`relative min-w-fit rounded-t-md px-2 py-4 text-[13px] transition ${active ? "font-semibold text-slate-900 dark:text-white" : complete ? "cursor-pointer text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/70 dark:hover:text-white" : "text-slate-400 dark:text-slate-600"}`}
                disabled={!complete}
                key={item.id}
                onClick={() => onNavigate(item.id)}
                type="button"
              >
                <span className="mr-2 font-mono text-[10px] text-slate-400">0{index + 1}</span>
                {item.label}
                {active && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#ef5b60]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContextPhase({
  code,
  error,
  fileName,
  isLoading,
  onAnalyze,
  onFileChange,
}: {
  code: string;
  error: string | null;
  fileName: string;
  isLoading: boolean;
  onAnalyze: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="animate-enter">
      <section className="border-b border-slate-200 bg-[radial-gradient(circle_at_85%_15%,#fff0f0_0,transparent_28%)] bg-white px-5 py-11 dark:border-slate-800 dark:bg-[radial-gradient(circle_at_85%_15%,rgba(239,91,96,0.09)_0,transparent_30%)] dark:bg-[#171b22] sm:px-8 sm:py-16">
        <div className="mx-auto max-w-[1180px]">
          <p className="inline-flex rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-[#c8464c] dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{COURSE.className} · {COURSE.module}</p>
          <h1 className="mt-5 max-w-3xl text-[38px] font-medium leading-[1.08] tracking-[-0.045em] text-[#272d38] dark:text-[#f5f7fa] sm:text-[54px]">
            Review a student&apos;s code through an oral examination.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Start from the submitted work. The questions will focus on purpose, design choices, debugging, modification and professional judgement.
          </p>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:py-14">
        <div>
          <div className="mb-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-200">Evaluation scope</span>
            {courseAreas.map((area) => <span className="text-slate-500 dark:text-slate-400" key={area}>{area}</span>)}
          </div>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(31,41,55,0.06)] dark:border-slate-700 dark:bg-[#191e26] dark:shadow-[0_18px_45px_rgba(0,0,0,0.2)]" id="submission">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700">
              <div><p className="text-xs text-slate-400">Student submission</p><h2 className="mt-1 text-base font-semibold text-[#3d4351] dark:text-white">{fileName}</h2></div>
              <label className="cursor-pointer rounded-md border border-transparent px-2.5 py-1.5 text-xs font-semibold text-[#c8464c] transition duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-[#a9383e] dark:text-rose-300 dark:hover:border-rose-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-200"><input accept=".py,.ipynb,.java,.js,.ts,.txt,.md,.json,.csv" className="sr-only" onChange={onFileChange} type="file" />Choose another file</label>
            </div>
            <pre className="max-h-[480px] min-w-0 overflow-auto bg-[#1b2028] p-6 text-[13px] leading-6 text-slate-200"><code>{code}</code></pre>
            <div className="flex flex-col gap-4 border-t border-slate-100 px-5 py-4 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs text-slate-400">UTF-8 source or text · up to 2 MB</p>{error && <ErrorMessage message={error} />}</div>
              <Button disabled={isLoading} onClick={onAnalyze} type="button">
                {isLoading ? "Reviewing submission…" : "Review submission"}
                {!isLoading && <Icon className="size-4" name="arrow-right" />}
              </Button>
            </div>
          </section>
        </div>

        <aside className="lg:border-l lg:border-slate-200 lg:pl-8 dark:lg:border-slate-700" id="criteria">
          <p className="text-sm font-semibold text-[#3d4351] dark:text-white">What teachers assess</p>
          <dl className="mt-4 space-y-3 border-y border-slate-200 py-4 dark:border-slate-700">
            {(Object.entries(knowledgeAspectDescription) as [KnowledgeAspect, string][]).map(([aspect, description]) => (
              <div className="grid grid-cols-[72px_1fr] gap-3" key={aspect}>
                <dt className="font-mono text-[11px] font-semibold text-slate-700 dark:text-slate-200">{aspect}</dt>
                <dd className="text-xs leading-5 text-slate-500 dark:text-slate-400">{description}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-slate-400">Cognitive progression</p>
          <div className="mt-2 grid grid-cols-4 overflow-hidden rounded-md text-center text-[11px] font-bold">
            <span className="bg-emerald-600 py-2 text-white">What</span>
            <span className="bg-amber-400 py-2 text-amber-950">How</span>
            <span className="bg-orange-500 py-2 text-white">Why</span>
            <span className="bg-rose-600 py-2 text-white">What-if</span>
          </div>
          <p className="mt-7 text-sm font-semibold text-[#3d4351] dark:text-white">Evaluation criteria</p>
          <ol className="mt-3 border-t border-slate-200 dark:border-slate-700">
            {evaluationLevels.map((item, index) => (
              <li className="grid grid-cols-[28px_1fr] gap-2 border-b border-slate-200 py-4 dark:border-slate-700" key={item.level}>
                <span className="font-mono text-xs font-semibold text-slate-400">0{index + 1}</span>
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={`text-sm font-semibold ${criterionTheme[item.level].accent}`}>{item.level}</h3>
                    <DifficultyMeter level={item.level} />
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">{item.knowledgeAspect} · {item.cognitiveLevel}</p>
                  <p className="mt-1 text-[13px] leading-5 text-slate-600 dark:text-slate-300">{item.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}

function AnalysisPhase({ code, onBack, onContinue, workflow }: { code: string; onBack: () => void; onContinue: () => void; workflow: WorkflowResponse }) {
  const concepts = [...new Set(workflow.evidence.flatMap((item) => item.related_concepts))].sort();
  const courseConceptNames = new Set(COURSE.concepts.map((concept) => concept.toLowerCase()));
  const courseConcepts = concepts.filter((concept) => courseConceptNames.has(concept.toLowerCase()));
  const detectedConcepts = concepts.filter((concept) => !courseConceptNames.has(concept.toLowerCase()));

  return (
    <div className="animate-enter mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 sm:py-10">
      <BackButton label="Back to course map" onClick={onBack} />
      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-[#d94f55] dark:text-rose-300">Submission review</p><h1 className="mt-2 text-3xl font-medium tracking-[-0.035em] text-[#2c323e] dark:text-[#f5f7fa]">Evidence found in {workflow.filename}</h1></div><p className="text-xs text-slate-500 dark:text-slate-400">{workflow.model}{workflow.fallback && " · demo mode"}</p></div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(31,41,55,0.05)] dark:border-slate-700 dark:bg-[#191e26] dark:shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
          <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-700"><p className="text-xs text-slate-400">Submitted file</p><h2 className="mt-1 text-base font-semibold text-[#3d4351] dark:text-white">{workflow.filename}</h2></div>
          <pre className="max-h-[470px] overflow-auto bg-[#1b2028] p-5 text-[13px] leading-6 text-slate-200"><code>{code}</code></pre>
          <div className="grid grid-cols-3 divide-x divide-slate-200 px-2 py-5 dark:divide-slate-700"><Metric label="Evidence" value={String(workflow.evidence.length)} /><Metric label="Concepts" value={String(concepts.length)} /><Metric accent label="Task pool" value={String(workflow.questions.length)} /></div>
          <div className="border-t border-slate-200 px-5 py-5 dark:border-slate-700">
            <ConceptGroup concepts={courseConcepts} label="Course concepts" />
            {detectedConcepts.length > 0 && (
              <div className="mt-4">
                <ConceptGroup concepts={detectedConcepts} label="Additional notions found" />
              </div>
            )}
          </div>
        </section>
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(31,41,55,0.05)] dark:border-slate-700 dark:bg-[#191e26] dark:shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
          <div><h2 className="text-lg font-semibold text-[#3d4351] dark:text-white">Evidence map</h2><p className="mt-1 text-xs text-slate-400">Each observation remains linked to its source and criterion.</p></div>
          <div className="mt-5 max-h-[470px] overflow-auto border-t border-slate-200 pr-1 dark:border-slate-700">
            {workflow.evidence.map((item) => <EvidenceCard item={item} key={`${item.label}-${item.source}`} />)}
          </div>
          <div className="mt-5 flex flex-col gap-4 border-t border-slate-200 pt-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"><p className="text-[13px] leading-5 text-slate-600 dark:text-slate-300">{workflow.questions.length} tasks · all answers are recorded before the final report.</p><Button onClick={onContinue} type="button">Begin examination <Icon className="size-4" name="arrow-right" /></Button></div>
        </section>
      </div>
    </div>
  );
}

function ExamPhase({ answer, completedCount, error, evidence, isLoading, onAnswerChange, onBack, onSubmit, question, totalTasks }: { answer: string; completedCount: number; error: string | null; evidence: EvidenceItem[]; isLoading: boolean; onAnswerChange: (value: string) => void; onBack: () => void; onSubmit: () => void; question: OralQuestion; totalTasks: number }) {
  const progress = (question.difficulty / 4) * 100;
  const sources = evidence.filter((item) => question.evidence_refs.includes(item.label));
  const isLastTask = completedCount + 1 === totalTasks;

  return (
    <div className="animate-enter mx-auto w-full max-w-[1120px] px-5 py-8 sm:px-8 sm:py-10">
      <BackButton label="Back to evidence" onClick={onBack} />
      <div className="mt-6 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-[#191e26] lg:rounded-none lg:border-0 lg:border-r lg:bg-transparent lg:p-0 lg:pr-7 dark:lg:bg-transparent">
          <p className="text-xs text-slate-400">Question {completedCount + 1} / {totalTasks}</p>
          <p className={`mt-2 text-lg font-semibold ${criterionTheme[question.level].accent}`}>{question.cognitive_level}</p>
          <div className="mt-3 h-1 overflow-hidden bg-slate-200 dark:bg-slate-700"><div className="h-full bg-[#ef5b60] transition-all" style={{ width: `${progress}%` }} /></div>
          <div className="mt-7 space-y-4">{evaluationLevels.map((item) => <div className={`flex items-center gap-3 text-xs ${item.level === question.level ? `font-semibold ${criterionTheme[item.level].accent}` : criterionTheme[item.level].difficulty < question.difficulty ? "text-slate-500" : "text-slate-400"}`} key={item.level}><span className={`h-1.5 w-4 ${item.level === question.level ? criterionTheme[item.level].bar : "bg-slate-300 dark:bg-slate-600"}`} />{item.level}</div>)}</div>
        </aside>
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(31,41,55,0.06)] dark:border-slate-700 dark:bg-[#191e26] dark:shadow-[0_18px_45px_rgba(0,0,0,0.2)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4 dark:border-slate-700"><div className="flex items-center gap-3"><span className={`text-sm font-semibold ${criterionTheme[question.level].accent}`}>{question.level}</span><span className="font-mono text-[10px] text-slate-400">{question.knowledge_aspect}</span><DifficultyMeter level={question.level} /></div><span className="text-xs text-slate-400">{question.module} · {question.concept}</span></div>
          <div className="p-6 sm:p-8"><h1 className="max-w-3xl text-[27px] font-medium leading-[1.25] tracking-[-0.025em] text-[#3d4351] dark:text-white sm:text-[34px]">{question.question}</h1>
            <div className="mt-6 border-l-2 border-slate-200 pl-4 dark:border-slate-600"><p className="text-xs text-slate-400">Reference in the submission</p><p className="mt-1 text-xs font-medium leading-5 text-slate-600 dark:text-slate-300">{sources.length > 0 ? sources.map((item) => `${item.label} · ${item.source}`).join(" | ") : question.evidence_refs.join(" · ")}</p></div>
            <label className="mt-6 block text-sm font-semibold text-slate-700 dark:text-slate-200" htmlFor="student-answer">Student answer</label>
            <textarea autoFocus className="mt-3 min-h-40 w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-[15px] leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#e9545a] focus:bg-white focus:ring-3 focus:ring-rose-100 dark:border-slate-600 dark:bg-[#12171e] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-rose-500 dark:focus:bg-[#151a22] dark:focus:ring-rose-950" id="student-answer" onChange={(event) => onAnswerChange(event.target.value)} placeholder="Explain your reasoning..." value={answer} />
            <div className="mt-5 flex flex-col items-end gap-3">{error && <ErrorMessage message={error} />}<Button disabled={!answer.trim() || isLoading} onClick={onSubmit} type="button">{isLoading ? "Evaluating answer…" : isLastTask ? "Complete evaluation" : "Evaluate & continue"}{!isLoading && <Icon className="size-4" name="arrow-right" />}</Button></div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ReportPhase({ evaluations, onRestart, workflow }: { evaluations: AnswerEvaluationResponse[]; onRestart: () => void; workflow: WorkflowResponse }) {
  const average = evaluations.length > 0 ? evaluations.reduce((sum, item) => sum + item.score, 0) / evaluations.length : 0;
  const strongest = useMemo(() => [...evaluations].sort((a, b) => b.score - a.score)[0], [evaluations]);
  const weakest = useMemo(() => [...evaluations].sort((a, b) => a.score - b.score)[0], [evaluations]);

  return (
    <div className="animate-enter mx-auto w-full max-w-[1120px] px-5 py-8 sm:px-8 sm:py-10">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_35px_rgba(31,41,55,0.06)] dark:border-slate-700 dark:bg-[#191e26] dark:shadow-[0_18px_45px_rgba(0,0,0,0.2)]">
        <div className="border-b border-slate-200 px-6 py-8 dark:border-slate-700 sm:px-9"><p className="text-sm font-medium text-[#ef5b60]">Assessment summary · {workflow.filename}</p><div className="mt-3 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl font-medium tracking-[-0.035em] text-[#343a46] dark:text-white sm:text-[40px]">Understanding, criterion by criterion.</h1><p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Based on {evaluations.length} oral responses and the submitted code.</p></div><div className="sm:text-right"><p className="text-xs text-slate-400">Overall score</p><p className="mt-1 text-4xl font-semibold text-[#343a46] dark:text-white">{average.toFixed(1)}<span className="text-base font-normal text-slate-400"> / 5</span></p></div></div></div>
        <div className="grid gap-8 p-6 sm:p-9 lg:grid-cols-[1.1fr_0.9fr]">
          <div><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Evaluation history</p><div className="mt-5 space-y-6">{evaluations.map((item, index) => <div key={`${item.level}-${index}`}><div className="flex items-end justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><p className={`text-sm font-semibold ${criterionTheme[item.level].accent}`}>{item.level}</p><span className="font-mono text-[10px] text-slate-400">{item.knowledge_aspect}</span><ConfidenceBadge value={item.confidence} /></div><p className="mt-1 text-xs leading-5 text-slate-400">{item.rationale}</p></div><p className={`text-sm font-bold ${criterionTheme[item.level].accent}`}>{item.score.toFixed(1)} / 5</p></div><div className="mt-2 h-1.5 overflow-hidden bg-slate-100 dark:bg-slate-700"><div className={`h-full ${criterionTheme[item.level].bar}`} style={{ width: `${item.score * 20}%` }} /></div><p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">{item.feedback}</p></div>)}</div></div>
          <aside className="rounded-lg bg-slate-50 p-5 dark:bg-[#12171e]"><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Feedback</p><div className="mt-6 space-y-5">{strongest && <ReportInsight label={`Strength · ${strongest.level}`} text={strongest.rationale} />}{weakest && <ReportInsight label={`Next focus · ${weakest.level}`} text={weakest.feedback} />}<ReportInsight label="Supporting evidence" text={`${workflow.evidence.length} observations across ${workflow.questions.length} questions.`} /></div></aside>
        </div>
        <div className="flex flex-col gap-4 border-t border-slate-100 px-6 py-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between sm:px-9"><p className="text-xs text-slate-400">{workflow.model}{evaluations.some((item) => item.fallback) && " · demo scoring"}</p><Button onClick={onRestart} type="button" variant="secondary"><Icon className="size-4" name="refresh" />Start again</Button></div>
      </section>
    </div>
  );
}

function selectNextQuestion(
  pool: OralQuestion[],
  completedTaskIds: Set<string>,
): OralQuestion | null {
  return pool
    .filter((question) => !completedTaskIds.has(question.task_id))
    .sort(
      (left, right) =>
        (left.difficulty ?? 4) - (right.difficulty ?? 4) ||
        (left.task_id ?? "").localeCompare(right.task_id ?? ""),
    )[0] ?? null;
}

function EvidenceCard({ item }: { item: EvidenceItem }) {
  return <div className="grid gap-3 border-b border-slate-200 py-5 last:border-b-0 dark:border-slate-700 sm:grid-cols-[112px_1fr]"><div><p className={`text-[13px] font-semibold ${criterionTheme[item.suggested_level].accent}`}>{item.suggested_level}</p><p className="mt-1 font-mono text-[11px] text-slate-500 dark:text-slate-400">{item.knowledge_aspect}</p><p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{item.label}</p></div><div><p className="text-[13px] font-medium leading-5 text-slate-700 dark:text-slate-200">{item.claim}</p><p className="mt-2 text-[11px] leading-5 text-slate-500 dark:text-slate-400">{item.source}{item.related_concepts.length > 0 && ` · ${item.related_concepts.join(" · ")}`}</p></div></div>;
}

function ConceptGroup({ concepts, label }: { concepts: string[]; label: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
      {concepts.length > 0 ? (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
          {concepts.map((concept) => (
            <li className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200" key={concept}>
              <span className="h-px w-2 bg-slate-400" />
              {concept}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-xs text-slate-400">None identified</p>
      )}
    </div>
  );
}

function ConfidenceBadge({ value }: { value: number }) {
  const percentage = Math.round(value * 100);
  const level = value >= 0.8 ? "High" : value >= 0.6 ? "Medium" : "Low";
  const style = value >= 0.8
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300"
    : value >= 0.6
      ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-300"
      : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold ${style}`} title={`Agent confidence: ${percentage}%`}>
      <span className="size-1.5 rounded-full bg-current" />
      Confidence {percentage}% · {level}
    </span>
  );
}

function DifficultyMeter({ level }: { level: EvaluationLevel }) {
  const theme = criterionTheme[level];

  return (
    <div aria-label={`Difficulty ${theme.difficulty} out of 4`} className="flex items-center gap-2">
      <span className="text-[10px] font-medium tabular-nums text-slate-500 dark:text-slate-400">{theme.difficulty}/4</span>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4].map((step) => (
          <span
            className={`h-1.5 w-2 ${step <= theme.difficulty ? theme.bar : "bg-slate-200 dark:bg-slate-700"}`}
            key={step}
          />
        ))}
      </span>
    </div>
  );
}

function Metric({ accent = false, label, value }: { accent?: boolean; label: string; value: string }) {
  return <div className="px-4"><p className="text-[10px] text-slate-400">{label}</p><p className={`mt-1 text-lg font-semibold ${accent ? "text-[#ef5b60]" : "text-slate-700 dark:text-slate-200"}`}>{value}</p></div>;
}

function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button className="group -ml-2 inline-flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white dark:hover:shadow-none" onClick={onClick} type="button"><Icon className="size-4 transition-transform group-hover:-translate-x-0.5" name="arrow-left" />{label}</button>;
}

function ErrorMessage({ message }: { message: string }) {
  return <p className="mt-2 max-w-xl text-xs font-semibold leading-5 text-red-600 dark:text-red-300">{message} Check that the backend is running on the configured API URL.</p>;
}

function ReportInsight({ label, text }: { label: string; text: string }) {
  return <div className="border-l-2 border-[#ef5b60] pl-3"><p className="text-xs font-bold text-slate-700 dark:text-slate-200">{label}</p><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p></div>;
}
