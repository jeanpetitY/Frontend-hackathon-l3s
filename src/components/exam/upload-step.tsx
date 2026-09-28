import Image from "next/image";
import type { ChangeEvent } from "react";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

type UploadStepProps = {
  fileName: string | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onStart: () => void;
};

const workflow = [
  { number: "01", title: "Student input", text: "PDF, report or code", color: "border-sky-300" },
  { number: "02", title: "Analysis", text: "Claims and decisions", color: "border-emerald-300" },
  { number: "03", title: "Questions", text: "Personalised prompts", color: "border-amber-300" },
  { number: "04", title: "Oral exam", text: "Interactive defence", color: "border-rose-300" },
  { number: "05", title: "Evaluation", text: "Evidence-based rubric", color: "border-violet-300" },
  { number: "06", title: "Report", text: "Results and insights", color: "border-blue-300" },
];

export function UploadStep({ fileName, onFileChange, onStart }: UploadStepProps) {
  return (
    <div className="animate-enter">
      <section className="bg-[#5f6678] px-5 pb-24 pt-11 text-center text-white sm:pb-28 sm:pt-14">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ff9a9d]">AI-powered oral examination</p>
          <h1 className="mt-4 text-[38px] font-light leading-[1.08] tracking-[-0.035em] sm:text-[50px]">Can the student defend<br className="hidden sm:block" /> what they submitted?</h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-7 text-white/72 sm:text-base">OralEval transforms a student&apos;s own work into a personalised oral defence, then evaluates understanding, justification and critical reasoning.</p>
        </div>
      </section>

      <div className="relative mx-auto -mt-14 w-full max-w-[1180px] px-5 sm:px-8">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_4px_16px_rgba(45,53,72,0.12)]">
          <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 sm:px-7">
            <span className="h-5 w-1 rounded-full bg-[#ef5b60]" />
            <div><h2 className="text-[17px] font-semibold text-[#363b47]">Start a new assessment</h2><p className="mt-0.5 text-xs text-slate-500">Upload one student submission to generate a personalised examination</p></div>
          </div>

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_250px] lg:items-stretch">
            <label className="group flex min-h-44 cursor-pointer items-center gap-5 rounded-md border border-dashed border-slate-300 bg-[#fafbfc] px-6 py-7 transition hover:border-[#ef5b60] hover:bg-rose-50/30">
              <input accept="application/pdf" className="sr-only" onChange={onFileChange} type="file" />
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#fff0f0] text-[#ef5b60] transition group-hover:scale-105">
                <Icon className="size-5" name={fileName ? "document" : "upload"} />
              </span>
              <span className="min-w-0 text-left">
                <span className="block truncate text-[15px] font-semibold text-[#3d4351]">{fileName ?? "Drop a PDF here, or browse"}</span>
                <span className="mt-1.5 block text-xs leading-5 text-slate-500">{fileName ? "Ready for document analysis" : "Research report, essay or project submission · max 10 MB"}</span>
              </span>
            </label>

            <div className="flex flex-col justify-center rounded-md bg-[#f5f6f8] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Quick demo</p>
              <p className="mt-2 text-sm leading-5 text-slate-600">No document yet? Explore the full journey with a sample ML report.</p>
              <Button className="mt-4" fullWidth onClick={onStart} type="button">
                {fileName ? "Analyse submission" : "Launch demo"}
                <Icon className="size-4" name="arrow-right" />
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-8" id="workflow">
          <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ef5b60]">How it works</p><h2 className="mt-1 text-[22px] font-medium text-[#3d4351]">From submission to defensible assessment</h2></div><p className="hidden text-xs text-slate-500 sm:block">Six connected stages · one transparent workflow</p></div>
          <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {workflow.map((item, index) => (
              <div className={`relative rounded-md border-t-[3px] ${item.color} bg-white px-4 py-4 shadow-sm`} key={item.number}>
                <p className="text-[10px] font-bold text-slate-400">{item.number}</p>
                <p className="mt-2 text-sm font-semibold text-[#3d4351]">{item.title}</p>
                <p className="mt-1 text-[11px] leading-4 text-slate-500">{item.text}</p>
                {index < workflow.length - 1 && <span className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 text-slate-300 lg:block">→</span>}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 mt-12 scroll-mt-24 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm" id="architecture">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:px-7">
            <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#ef5b60]">System design</p><h2 className="mt-1 text-[20px] font-medium text-[#3d4351]">OralEval architecture</h2></div>
            <p className="max-w-md text-xs leading-5 text-slate-500">The LLM core supports analysis, question generation, examination and evaluation, with privacy and monitoring across the pipeline.</p>
          </div>
          <div className="bg-[#fafbfc] p-3 sm:p-5">
            <Image alt="OralEval system architecture showing the six processing stages, LLM core, security, data storage and monitoring" className="h-auto w-full rounded border border-slate-200 bg-white" height={1024} priority src="/architecture.png" width={1536} />
          </div>
        </section>
      </div>
    </div>
  );
}
