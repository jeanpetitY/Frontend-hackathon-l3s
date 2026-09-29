import { reportScores } from "@/data/mock-exam";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type ReportStepProps = {
  answerCount: number;
  fileName: string | null;
  onRestart: () => void;
};

export function ReportStep({ answerCount, fileName, onRestart }: ReportStepProps) {
  return (
    <div className="animate-enter">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#22262e]">
        <div className="relative overflow-hidden bg-[#5f6678] px-6 py-8 text-white dark:bg-[#242832] sm:px-10 sm:py-9">
          <div className="absolute -right-24 -top-24 size-64 rounded-full border-[42px] border-[#ef5b60]/15" />
          <div className="absolute bottom-0 right-20 size-32 rounded-full bg-[#ef5b60]/15 blur-3xl" />
          <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#ffb7b9]"><Icon className="size-4" name="check" />Examination complete</div>
              <h1 className="mt-4 text-3xl font-light tracking-[-0.03em] sm:text-[42px]">A clear understanding,<br />with evidence gaps.</h1>
              <p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">Assessment generated from {fileName ?? "the demo machine-learning report"} and {answerCount} recorded responses.</p>
            </div>

            <div className="flex items-center gap-5 rounded-2xl border border-white/10 bg-white/[0.07] p-4 pr-6 backdrop-blur">
              <div className="score-ring grid size-20 place-items-center rounded-full" style={{ "--score": "76%" } as React.CSSProperties}>
                <div className="grid size-[66px] place-items-center rounded-full bg-[#5f6678]"><span className="text-xl font-bold">76</span></div>
              </div>
              <div><p className="text-xs font-medium text-slate-400">Overall score</p><p className="mt-1 text-lg font-bold">3.8 / 5.0</p><p className="mt-0.5 text-xs font-semibold text-emerald-300">Good performance</p></div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">Rubric breakdown</p><h2 className="mt-2 text-xl font-medium text-[#3d4351] dark:text-slate-100">Performance by dimension</h2></div><span className="hidden rounded-full bg-rose-50 px-3 py-1.5 text-[11px] font-bold text-[#ef5b60] dark:bg-rose-950/30 sm:block">Confidence · medium</span></div>
              <div className="mt-7 space-y-6">
                {reportScores.map((item) => <ScoreRow description={item.description} key={item.label} label={item.label} score={item.score} />)}
              </div>
            </div>

            <div className="rounded-md bg-[#f5f6f8] p-6 dark:bg-[#1b1f26]">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ef5b60]"><Icon className="size-4" name="sparkles" />Examiner synthesis</div>
              <p className="mt-5 text-lg font-medium leading-7 text-[#3d4351] dark:text-slate-100">The student understands why the model was selected and can discuss its trade-offs.</p>
              <div className="mt-6 space-y-4">
                <Insight color="bg-emerald-400" label="Strongest signal" text="Clear conceptual understanding and accurate use of terminology." />
                <Insight color="bg-amber-400" label="Follow-up recommended" text="Ask for stronger evidence and validation beyond one train-test split." />
              </div>
            </div>
          </div>

          <div className="mt-9 flex flex-col gap-4 border-t border-slate-100 pt-7 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-lg text-xs leading-5 text-slate-400">This prototype report uses mock scoring. The interface is ready to consume the FastAPI evaluation response.</p>
            <Button onClick={onRestart} type="button" variant="secondary"><Icon className="size-4" name="refresh" />Start a new examination</Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function ScoreRow({ description, label, score }: { description: string; label: string; score: number }) {
  return (
    <div>
      <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-bold text-slate-700 dark:text-slate-200">{label}</p><p className="mt-1 text-xs text-slate-400">{description}</p></div><p className="text-sm font-bold text-[#ef5b60]">{score.toFixed(1)} <span className="font-medium text-slate-300 dark:text-slate-600">/ 5</span></p></div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div className="h-full rounded-full bg-gradient-to-r from-[#ef5b60] to-[#ff9b87]" style={{ width: `${score * 20}%` }} /></div>
    </div>
  );
}

function Insight({ color, label, text }: { color: string; label: string; text: string }) {
  return <div className="flex gap-3"><span className={`mt-1.5 size-2 shrink-0 rounded-full ${color}`} /><div><p className="text-xs font-bold text-slate-700 dark:text-slate-200">{label}</p><p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{text}</p></div></div>;
}
