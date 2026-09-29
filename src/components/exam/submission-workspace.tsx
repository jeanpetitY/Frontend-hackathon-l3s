import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type SubmissionWorkspaceProps = {
  fileName: string | null;
  onBack: () => void;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onStart: () => void;
};

export function SubmissionWorkspace({ fileName, onBack, onFileChange, onStart }: SubmissionWorkspaceProps) {
  return (
    <div className="animate-enter px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
      <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white" onClick={onBack} type="button"><Icon className="size-4" name="arrow-left" />Back to my courses</button>
      <div className="mt-6"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">PROGRAMMING</span><span className="text-xs font-semibold text-slate-400">CS-421 · Due 4 October</span></div><h1 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-[#343a46] dark:text-white">Model selection defence</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">The assessment agent will analyse your submission using the course context and professor-approved rubric before generating questions.</p></div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_340px]">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#22262e]">
          <div className="border-b border-slate-100 px-6 py-5 dark:border-slate-700"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#ef5b60]">Student input</p><h2 className="mt-1 text-xl font-semibold text-[#3d4351] dark:text-white">Submit your work</h2></div>
          <div className="p-6">
            <label className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-[#fafbfc] px-6 py-8 text-center transition hover:border-[#ef5b60] hover:bg-rose-50/30 dark:border-slate-600 dark:bg-[#1b1f26] dark:hover:border-[#ef5b60] dark:hover:bg-rose-950/10">
              <input accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.py,.ipynb,image/*" className="sr-only" onChange={onFileChange} type="file" />
              <span className="grid size-14 place-items-center rounded-full bg-[#fff0f0] text-[#ef5b60] transition group-hover:scale-105"><Icon className="size-6" name={fileName ? "check" : "upload"} /></span>
              <span className="mt-4 block max-w-md text-base font-semibold text-[#3d4351] dark:text-white">{fileName ?? "Drop your submission here, or browse"}</span>
              <span className="mt-2 block text-xs leading-5 text-slate-400">PDF · DOCX · PPTX · source code · notebook · ZIP · figures</span>
            </label>

            <div className="mt-5 grid gap-3 sm:grid-cols-4"><Format icon="document" label="Report" active={Boolean(fileName)} /><Format icon="code" label="Code" /><Format icon="image" label="Figures" /><Format icon="grid" label="Dataset" /></div>
            <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-6 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><Icon className="mt-0.5 size-4 shrink-0 text-emerald-500" name="shield" /><p className="max-w-lg text-xs leading-5 text-slate-500 dark:text-slate-400">Your submission is versioned, anonymized for analysis and always linked to the generated evidence graph.</p></div><Button onClick={onStart} type="button">{fileName ? "Analyse submission" : "Use demo submission"}<Icon className="size-4" name="arrow-right" /></Button></div>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#22262e]"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Accepted contract</p><div className="mt-4 space-y-4"><Policy icon="document" label="Submission" value="Report + implementation" /><Policy icon="lock" label="Resources" value="Course material only" /><Policy icon="microphone" label="Oral exam" value="10–15 minutes" /><Policy icon="calendar" label="Deadline" value="4 Oct · 17:00" /></div></div>
          <div className="rounded-xl bg-[#5f6678] p-5 text-white dark:bg-[#292e38]"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#ffb7b9]"><Icon className="size-4" name="sparkles" />What happens next</div><ol className="mt-4 space-y-3 text-xs text-white/75"><li>1. Extract assertions and evidence</li><li>2. Generate criterion-linked questions</li><li>3. Start the adaptive oral defence</li></ol></div>
        </aside>
      </div>
    </div>
  );
}

function Format({ icon, label, active = false }: { icon: Parameters<typeof Icon>[0]["name"]; label: string; active?: boolean }) { return <div className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-xs font-semibold ${active ? "border-[#ef5b60] bg-[#fff7f7] text-[#ef5b60] dark:bg-rose-950/15" : "border-slate-200 text-slate-500 dark:border-slate-700 dark:text-slate-400"}`}><Icon className="size-4" name={icon} />{label}</div>; }
function Policy({ icon, label, value }: { icon: Parameters<typeof Icon>[0]["name"]; label: string; value: string }) { return <div className="flex items-start gap-3"><span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"><Icon className="size-4" name={icon} /></span><div><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p><p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-200">{value}</p></div></div>; }
