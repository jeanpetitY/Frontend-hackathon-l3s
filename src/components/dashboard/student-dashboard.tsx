import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function StudentDashboard({ onOpenAssessment, onViewReport }: { onOpenAssessment: () => void; onViewReport: () => void }) {
  return (
    <div className="animate-enter px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ef5b60]">Student workspace</p>
        <h1 className="mt-2 text-3xl font-medium tracking-[-0.035em] text-[#343a46] dark:text-white sm:text-[38px]">Welcome back, Alex.</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Submit your work, defend your reasoning and understand every score.</p>
      </div>

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#22262e]">
        <div className="grid lg:grid-cols-[1fr_330px]">
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-violet-100 px-2.5 py-1 text-[10px] font-bold text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">PROGRAMMING</span><span className="text-xs font-semibold text-slate-400">CS-421 · Applied Machine Learning</span></div>
            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.025em] text-[#3d4351] dark:text-white">Model selection defence</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">Submit your report, source code and results. The oral examination will ask evidence-linked questions about your design choices.</p>
            <div className="mt-6 flex flex-wrap gap-5 text-xs text-slate-500 dark:text-slate-400"><span className="flex items-center gap-2"><Icon className="size-4 text-[#ef5b60]" name="calendar" />Due 4 October, 17:00</span><span className="flex items-center gap-2"><Icon className="size-4 text-[#ef5b60]" name="microphone" />10–15 minute defence</span><span className="flex items-center gap-2"><Icon className="size-4 text-[#ef5b60]" name="shield" />Professor-approved rubric</span></div>
            <Button className="mt-7" onClick={onOpenAssessment} type="button">Open assessment <Icon className="size-4" name="arrow-right" /></Button>
          </div>
          <div className="border-t border-slate-200 bg-[#f6f7f9] p-6 dark:border-slate-700 dark:bg-[#1b1f26] lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Assessment journey</p>
            <div className="mt-5 space-y-4">
              <Journey number="1" label="Submit work" state="Current" active />
              <Journey number="2" label="AI analysis" state="After submission" />
              <Journey number="3" label="Oral examination" state="When ready" />
              <Journey number="4" label="Evidence-linked feedback" state="After review" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">My courses</p><h2 className="mt-1 text-xl font-semibold text-[#3d4351] dark:text-white">Enrolled courses</h2></div><span className="text-xs text-slate-400">3 active</span></div>
        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <CourseCard code="CS-421" title="Applied Machine Learning" detail="1 assessment due" color="bg-violet-500" />
          <CourseCard code="INF-312" title="Web Information Systems" detail="No pending work" color="bg-emerald-500" />
          <CourseCard code="SEM-204" title="Research Methods Seminar" detail="Feedback available" color="bg-sky-500" onClick={onViewReport} />
        </div>
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-[#22262e]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-4"><span className="grid size-11 shrink-0 place-items-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-300"><Icon className="size-5" name="check" /></span><div><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Research proposal defence completed</p><p className="mt-1 text-xs text-slate-400">Your report contains criterion scores, cited evidence and recommendations.</p></div></div><Button onClick={onViewReport} type="button" variant="secondary">View feedback</Button></div>
      </section>
    </div>
  );
}

function Journey({ number, label, state, active = false }: { number: string; label: string; state: string; active?: boolean }) {
  return <div className="flex items-center gap-3"><span className={`grid size-7 place-items-center rounded-full text-[11px] font-bold ${active ? "bg-[#ef5b60] text-white" : "bg-white text-slate-400 dark:bg-slate-800"}`}>{number}</span><div><p className={`text-xs font-semibold ${active ? "text-[#3d4351] dark:text-white" : "text-slate-500 dark:text-slate-400"}`}>{label}</p><p className="mt-0.5 text-[10px] text-slate-400">{state}</p></div></div>;
}

function CourseCard({ code, title, detail, color, onClick }: { code: string; title: string; detail: string; color: string; onClick?: () => void }) {
  return <button className="rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-[#22262e]" onClick={onClick} type="button"><span className={`block h-1.5 w-10 rounded-full ${color}`} /><p className="mt-4 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{code}</p><h3 className="mt-2 text-base font-semibold text-[#3d4351] dark:text-white">{title}</h3><p className="mt-4 text-xs text-slate-500 dark:text-slate-400">{detail}</p></button>;
}
