"use client";

import type { ChangeEvent } from "react";
import { useState } from "react";

import { ExamStep } from "@/components/exam/exam-step";
import { ProgressSteps } from "@/components/exam/progress-steps";
import { ReportStep } from "@/components/exam/report-step";
import { UploadStep } from "@/components/exam/upload-step";
import { questions } from "@/data/mock-exam";
import type { ExamStep as ExamStepName } from "@/types/exam";

export function OralEvalApp() {
  const [step, setStep] = useState<ExamStepName>("upload");
  const [fileName, setFileName] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) setFileName(file.name);
  }

  function startExam() {
    setQuestionIndex(0);
    setAnswers([]);
    setAnswer("");
    setStep("exam");
  }

  function submitAnswer() {
    const updatedAnswers = [...answers, answer.trim()];
    setAnswers(updatedAnswers);
    setAnswer("");
    if (questionIndex === questions.length - 1) setStep("report");
    else setQuestionIndex((index) => index + 1);
  }

  function restart() {
    setStep("upload");
    setFileName(null);
    setQuestionIndex(0);
    setAnswers([]);
    setAnswer("");
  }

  return (
    <main className="min-h-[calc(100vh-68px)] bg-[#f1f3f7]">
      {step === "upload" && <UploadStep fileName={fileName} onFileChange={handleFileChange} onStart={startExam} />}
      {step !== "upload" && (
        <div className="mx-auto w-full max-w-[1180px] px-5 py-8 sm:px-8 sm:py-10">
          <ProgressSteps currentStep={step} />
          <div className="mt-9 sm:mt-11">
          {step === "exam" && <ExamStep answer={answer} currentIndex={questionIndex} onAnswerChange={setAnswer} onSubmit={submitAnswer} question={questions[questionIndex]} total={questions.length} />}
          {step === "report" && <ReportStep answerCount={answers.length} fileName={fileName} onRestart={restart} />}
          </div>
        </div>
      )}
    </main>
  );
}
