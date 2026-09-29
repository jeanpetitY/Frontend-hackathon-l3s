"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";

import { AssessmentBuilder } from "@/components/assessment/assessment-builder";
import { ProfessorDashboard } from "@/components/dashboard/professor-dashboard";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { WorkspaceShell, type UserRole, type WorkspaceView } from "@/components/dashboard/workspace-shell";
import { ExamStep } from "@/components/exam/exam-step";
import { ProgressSteps } from "@/components/exam/progress-steps";
import { ReportStep } from "@/components/exam/report-step";
import { SubmissionWorkspace } from "@/components/exam/submission-workspace";
import { questions } from "@/data/mock-exam";

export function OralEvalApp() {
  const [role, setRole] = useState<UserRole>("professor");
  const [view, setView] = useState<WorkspaceView>("dashboard");
  const [fileName, setFileName] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);

  function changeRole(nextRole: UserRole) {
    setRole(nextRole);
    setView("dashboard");
  }

  function navigate(nextView: WorkspaceView) {
    if (role === "professor" && ["submission", "exam", "report"].includes(nextView)) setRole("student");
    if (role === "student" && nextView === "builder") setRole("professor");
    if (nextView === "exam") startExam();
    else setView(nextView);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setFileName(file.name);
  }

  function startExam() {
    setQuestionIndex(0);
    setAnswers([]);
    setAnswer("");
    setView("exam");
  }

  function submitAnswer() {
    const updatedAnswers = [...answers, answer.trim()];
    setAnswers(updatedAnswers);
    setAnswer("");
    if (questionIndex === questions.length - 1) setView("report");
    else setQuestionIndex((index) => index + 1);
  }

  function restart() {
    setView("submission");
    setQuestionIndex(0);
    setAnswers([]);
    setAnswer("");
  }

  return (
    <WorkspaceShell onNavigate={navigate} onRoleChange={changeRole} role={role} view={view}>
      {role === "professor" && view === "dashboard" && <ProfessorDashboard onCreateAssessment={() => setView("builder")} />}
      {role === "professor" && view === "builder" && <AssessmentBuilder onBack={() => setView("dashboard")} />}
      {role === "student" && view === "dashboard" && <StudentDashboard onOpenAssessment={() => setView("submission")} onViewReport={() => setView("report")} />}
      {role === "student" && view === "submission" && <SubmissionWorkspace fileName={fileName} onBack={() => setView("dashboard")} onFileChange={handleFileChange} onStart={startExam} />}
      {role === "student" && (view === "exam" || view === "report") && (
        <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 sm:py-10">
          <ProgressSteps currentStep={view === "exam" ? "exam" : "report"} />
          <div className="mt-9 sm:mt-11">
            {view === "exam" && <ExamStep answer={answer} currentIndex={questionIndex} onAnswerChange={setAnswer} onSubmit={submitAnswer} question={questions[questionIndex]} total={questions.length} />}
            {view === "report" && <ReportStep answerCount={answers.length || 3} fileName={fileName} onRestart={restart} />}
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
