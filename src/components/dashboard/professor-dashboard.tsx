import { courses, activity } from "@/data/mock-platform";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function ProfessorDashboard({ onCreateAssessment }: { onCreateAssessment: () => void }) {
  return (
    <div className="animate-enter px-5 py-7 sm:px-8 sm:py-9 xl:px-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ef5b60]">Professor workspace</p>
          <h1 className="mt-2 text-3xl font-medium tracking-[-0.035em] text-[#343a46] dark:text-white sm:text-[38px]">Good morning, Professor.</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Design assessments, review AI suggestions and moderate evidence-linked results.</p>
        </div>
        <Button onClick={onCreateAssessment} type="button"><Icon className="size-4" name="plus" />Create assessment</Button>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat icon="book" label="Active courses" value="3" note="100 enrolled students" />
        <Stat icon="document" label="Open assessments" value="5" note="2 close this week" />
        <Stat icon="microphone" label="Oral exams" value="18" note="7 awaiting review" />
        <Stat icon="bar-chart" label="Needs attention" value="4" note="Low-confidence decisions" accent />
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between gap-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Course Studio</p><h2 className="mt-1 text-xl font-semibold text-[#3d4351] dark:text-slate-100">Your courses</h2></div>
          <button className="text-sm font-semibold text-[#ef5b60] hover:text-[#d94c52]" onClick={onCreateAssessment} type="button">Manage courses →</button>
        </div>
        <div className="mt-4 grid gap-4 xl:grid-cols-3">
          {courses.map((course) => (
            <button className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-[#22262e] dark:hover:border-slate-600" key={course.id} onClick={onCreateAssessment} type="button">
              <div className="flex items-start justify-between gap-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${course.color}`}>{course.type}</span><span className="text-xs font-semibold text-slate-400">{course.code}</span></div>
              <h3 className="mt-4 text-[17px] font-semibold text-[#3d4351] transition group-hover:text-[#ef5b60] dark:text-slate-100">{course.title}</h3>
              <div className="mt-5 flex items-center gap-5 border-t border-slate-100 pt-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400"><span>{course.students} students</span><span>{course.assessments} assessments</span></div>
            </button>
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-[#22262e]">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-700"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">Live activity</p><h2 className="mt-1 text-lg font-semibold text-[#3d4351] dark:text-slate-100">Recent submissions</h2></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">Updated now</span></div>
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {activity.map((item) => <div className="grid gap-2 px-5 py-4 sm:grid-cols-[1fr_1.2fr_auto] sm:items-center" key={item.student}><div><p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{item.student}</p><p className="mt-0.5 text-xs text-slate-400">{item.time}</p></div><p className="text-xs text-slate-500 dark:text-slate-400">{item.assessment}</p><span className="w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{item.status}</span></div>)}
          </div>
        </div>

        <div className="rounded-xl bg-[#5f6678] p-6 text-white dark:bg-[#292e38]">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#ffb7b9]"><Icon className="size-4" name="sparkles" />AI assessment agent</div>
          <h2 className="mt-4 text-2xl font-medium leading-tight">Four decisions need human review.</h2>
          <p className="mt-3 text-sm leading-6 text-white/65">The agent flagged low evidence coverage or low confidence. Your approval remains authoritative.</p>
          <button className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#ffb7b9]" type="button">Review decisions <Icon className="size-4" name="arrow-right" /></button>
        </div>
      </section>
    </div>
  );
}

function Stat({ icon, label, value, note, accent = false }: { icon: Parameters<typeof Icon>[0]["name"]; label: string; value: string; note: string; accent?: boolean }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-[#22262e]"><div className="flex items-center justify-between"><span className={`grid size-10 place-items-center rounded-lg ${accent ? "bg-[#fff0f0] text-[#ef5b60]" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}><Icon className="size-[18px]" name={icon} /></span><span className="text-3xl font-semibold tracking-[-0.04em] text-[#3d4351] dark:text-white">{value}</span></div><p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{label}</p><p className="mt-1 text-xs text-slate-400">{note}</p></div>;
}
