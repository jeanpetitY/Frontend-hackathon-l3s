"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { criteria } from "@/data/mock-platform";

export function AssessmentBuilder({ onBack }: { onBack: () => void }) {
  const [suggestionsAccepted, setSuggestionsAccepted] = useState(false);
  const [released, setReleased] = useState(false);

  return (
    <div className="animate-enter px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
      <button className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white" onClick={onBack} type="button"><Icon className="size-4" name="arrow-left" />Back to overview</button>
      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><div className="flex items-center gap-2"><span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">PROGRAMMING</span><span className="text-xs font-semibold text-slate-400">Draft</span></div><h1 className="mt-3 text-3xl font-medium tracking-[-0.035em] text-[#343a46] dark:text-white">Model selection defence</h1><p className="mt-2 text-sm text-slate-500 dark:text-slate-400">CS-421 · Applied Machine Learning</p></div><Button disabled={released} onClick={() => setReleased(true)} type="button">{released ? <><Icon className="size-4" name="check" />Released</> : <>Release assessment <Icon className="size-4" name="arrow-right" /></>}</Button></div>

      <div className="mt-8 grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <BuilderCard icon="book" number="01" title="Course context" subtitle="Ground the agent in professor-approved materials">
            <div className="grid gap-3 sm:grid-cols-3"><Material icon="document" label="Lecture 07" detail="Model validation.pdf" /><Material icon="code" label="Code template" detail="baseline.ipynb" /><Material icon="document" label="Rubric example" detail="defence-rubric.pdf" /></div>
            <button className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#ef5b60]" type="button"><Icon className="size-4" name="plus" />Add teaching material</button>
          </BuilderCard>

          <BuilderCard icon="document" number="02" title="Assessment contract" subtitle="One versioned contract constrains every agent stage">
            <div className="grid gap-4 sm:grid-cols-2"><Field label="Task description" value="Defend the model selection and evaluation strategy used in your project." /><Field label="Accepted inputs" value="PDF report · source code · notebook · figures" /><Field label="Allowed resources" value="Student submission and approved course materials" /><Field label="Oral examination" value="10–15 min · adaptive follow-up enabled" /></div>
          </BuilderCard>

          <BuilderCard icon="bar-chart" number="03" title="Evaluation rubric" subtitle="The same criteria guide question generation and scoring">
            <div className="space-y-3">{criteria.map((criterion) => <div className="flex flex-col gap-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700 sm:flex-row sm:items-center" key={criterion.id}><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{criterion.label}</p><p className="mt-1 text-[11px] text-slate-400">{criterion.source}</p></div><div className="flex items-center gap-3"><div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700"><div className="h-full rounded-full bg-[#ef5b60]" style={{ width: `${criterion.weight * 3.2}%` }} /></div><span className="w-8 text-right text-xs font-bold text-slate-600 dark:text-slate-300">{criterion.weight}%</span></div></div>)}</div>
          </BuilderCard>
        </div>

        <aside className="space-y-5">
          <div className="rounded-xl border border-dashed border-[#ef5b60] bg-[#fff7f7] p-5 dark:bg-rose-950/10">
            <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-[#ef5b60] text-white"><Icon className="size-5" name="sparkles" /></span><div><p className="text-sm font-semibold text-[#3d4351] dark:text-white">AI Criteria Agent</p><p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">Grounded in 3 materials</p></div></div>
            <div className="mt-5 space-y-3"><Suggestion accepted={suggestionsAccepted} label="Critical reasoning" reason="Coverage gap in the current rubric" /><Suggestion accepted={suggestionsAccepted} label="Evidence alignment" reason="Required by learning objective 2" /></div>
            <Button className="mt-5" fullWidth onClick={() => setSuggestionsAccepted(!suggestionsAccepted)} type="button" variant={suggestionsAccepted ? "secondary" : "primary"}>{suggestionsAccepted ? "Suggestions accepted" : "Review & accept suggestions"}</Button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#22262e]"><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Release checklist</p><div className="mt-4 space-y-3"><Check label="Course context attached" /><Check label="Input formats defined" /><Check label="Rubric weights total 100%" /><Check label="Enrolled students: 34" /></div><p className="mt-5 rounded-lg bg-slate-50 p-3 text-[11px] leading-5 text-slate-500 dark:bg-[#1b1f26] dark:text-slate-400">Students cannot submit work unless they are enrolled in this course.</p></div>
        </aside>
      </div>
    </div>
  );
}

function BuilderCard({ icon, number, title, subtitle, children }: { icon: Parameters<typeof Icon>[0]["name"]; number: string; title: string; subtitle: string; children: React.ReactNode }) { return <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#22262e]"><div className="flex items-center gap-4 border-b border-slate-100 px-5 py-4 dark:border-slate-700"><span className="grid size-10 place-items-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"><Icon className="size-[18px]" name={icon} /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-[10px] font-bold text-[#ef5b60]">{number}</span><h2 className="text-base font-semibold text-[#3d4351] dark:text-white">{title}</h2></div><p className="mt-0.5 text-xs text-slate-400">{subtitle}</p></div></div><div className="p-5">{children}</div></section>; }
function Material({ icon, label, detail }: { icon: Parameters<typeof Icon>[0]["name"]; label: string; detail: string }) { return <div className="rounded-lg bg-slate-50 p-4 dark:bg-[#1b1f26]"><Icon className="size-5 text-[#ef5b60]" name={icon} /><p className="mt-3 text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</p><p className="mt-1 truncate text-[11px] text-slate-400">{detail}</p></div>; }
function Field({ label, value }: { label: string; value: string }) { return <div><p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p><div className="mt-2 min-h-16 rounded-lg border border-slate-200 bg-[#fbfcfe] px-3 py-2.5 text-xs leading-5 text-slate-600 dark:border-slate-700 dark:bg-[#1b1f26] dark:text-slate-300">{value}</div></div>; }
function Suggestion({ label, reason, accepted }: { label: string; reason: string; accepted: boolean }) { return <div className="rounded-lg border border-rose-100 bg-white p-3 dark:border-rose-950/40 dark:bg-[#22262e]"><div className="flex items-center justify-between gap-3"><p className="text-xs font-semibold text-slate-700 dark:text-slate-200">{label}</p>{accepted && <Icon className="size-4 text-emerald-500" name="check" />}</div><p className="mt-1 text-[10px] leading-4 text-slate-400">{reason}</p></div>; }
function Check({ label }: { label: string }) { return <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300"><span className="grid size-5 place-items-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30"><Icon className="size-3" name="check" /></span>{label}</div>; }
