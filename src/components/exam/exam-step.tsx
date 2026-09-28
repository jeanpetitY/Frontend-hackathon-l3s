import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Question } from "@/types/exam";

type ExamStepProps = {
  answer: string;
  currentIndex: number;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  question: Question;
  total: number;
};

const categoryStyles = {
  Understanding: "bg-blue-50 text-blue-700 ring-blue-100",
  Justification: "bg-violet-50 text-violet-700 ring-violet-100",
  Evidence: "bg-amber-50 text-amber-700 ring-amber-100",
  Challenge: "bg-rose-50 text-rose-700 ring-rose-100",
};

export function ExamStep({ answer, currentIndex, onAnswerChange, onSubmit, question, total }: ExamStepProps) {
  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="animate-enter grid gap-5 lg:grid-cols-[280px_1fr]">
      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Live examination</p>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600"><span className="size-1.5 rounded-full bg-emerald-500" />Active</span>
        </div>
        <p className="mt-6 text-3xl font-medium tracking-[-0.04em] text-[#3d4351]">{String(currentIndex + 1).padStart(2, "0")}<span className="text-base text-slate-300"> / {String(total).padStart(2, "0")}</span></p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#ef5b60] transition-all" style={{ width: `${progress}%` }} /></div>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-md bg-rose-50 text-[#ef5b60]"><Icon className="size-4" name="document" /></span>
            <div><p className="max-w-[170px] truncate text-xs font-bold text-slate-700">ml_project_report.pdf</p><p className="mt-0.5 text-[11px] text-slate-400">8 pages · analysed</p></div>
          </div>
        </div>

        <div className="mt-6 rounded-md bg-[#5f6678] p-4 text-white">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#ffb7b9]"><Icon className="size-3.5" name="sparkles" />Examiner note</div>
          <p className="mt-3 text-xs leading-5 text-slate-300">Explain your reasoning naturally. The assessment focuses on understanding, not perfect wording.</p>
        </div>
      </aside>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-6 py-5 sm:px-9">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className={`rounded-full px-3 py-1.5 text-[11px] font-bold ring-1 ${categoryStyles[question.category]}`}>{question.category}</span>
            <span className="text-xs font-medium text-slate-400">Adaptive difficulty · Intermediate</span>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-9 sm:py-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ef5b60]">Question {currentIndex + 1}</p>
          <h1 className="mt-4 max-w-3xl text-[28px] font-medium leading-[1.22] tracking-[-0.025em] text-[#3d4351] sm:text-[34px]">{question.prompt}</h1>

          <blockquote className="mt-7 rounded-r-md border-l-2 border-[#ef5b60] bg-slate-50 px-5 py-4">
            <p className="text-sm italic leading-6 text-slate-600">“{question.excerpt}”</p>
            <footer className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">{question.source}</footer>
          </blockquote>

          <label className="mt-7 block text-sm font-semibold text-[#3d4351]" htmlFor="answer">Your response</label>
          <textarea
            autoFocus
            className="mt-3 min-h-40 w-full resize-y rounded-md border border-slate-300 bg-[#fbfcfe] px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#ef5b60] focus:bg-white focus:ring-3 focus:ring-rose-100"
            id="answer"
            onChange={(event) => onAnswerChange(event.target.value)}
            placeholder="Walk the examiner through your reasoning..."
            value={answer}
          />

          <div className="mt-5 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-400">Grounded against the submitted work and evaluation rubric.</p>
            <Button disabled={!answer.trim()} onClick={onSubmit} type="button">
              {currentIndex === total - 1 ? "Complete examination" : "Submit & continue"}
              <Icon className="size-4" name="chevron-right" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
