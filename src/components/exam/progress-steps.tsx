import { Icon } from "@/components/ui/icon";
import type { ExamStep } from "@/types/exam";

const steps: { id: ExamStep; label: string; eyebrow: string }[] = [
  { id: "upload", label: "Submission", eyebrow: "01" },
  { id: "exam", label: "Oral defence", eyebrow: "02" },
  { id: "report", label: "Assessment", eyebrow: "03" },
];

export function ProgressSteps({ currentStep }: { currentStep: ExamStep }) {
  const activeIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <nav aria-label="Examination progress" className="mx-auto w-full max-w-2xl">
      <ol className="flex items-center">
        {steps.map((step, index) => {
          const complete = index < activeIndex;
          const active = index === activeIndex;
          return (
            <li className="flex flex-1 items-center last:flex-none" key={step.id}>
              <div className="flex items-center gap-2.5">
                <span className={`grid size-8 place-items-center rounded-full border text-[11px] font-bold transition ${active ? "border-[#ef5b60] bg-[#ef5b60] text-white shadow-[0_5px_14px_rgba(239,91,96,0.2)]" : complete ? "border-[#ef5b60] bg-white text-[#ef5b60]" : "border-slate-200 bg-white text-slate-400"}`}>
                  {complete ? <Icon className="size-4" name="check" /> : step.eyebrow}
                </span>
                <span className={`hidden text-xs font-semibold sm:block ${active ? "text-[#3d4351]" : "text-slate-400"}`}>{step.label}</span>
              </div>
              {index < steps.length - 1 && <span className={`mx-3 h-px flex-1 sm:mx-5 ${complete ? "bg-[#ef5b60]" : "bg-slate-200"}`} />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
