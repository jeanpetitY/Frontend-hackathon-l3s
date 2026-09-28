import { Icon } from "@/components/ui/icon";

export function AppHeader() {
  return (
    <header className="relative z-20 bg-[#5f6678] text-white shadow-sm">
      <div className="mx-auto flex h-[68px] w-full max-w-[1240px] items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="relative grid size-9 place-items-center rounded-full border border-white/50 text-white">
            <Icon className="size-[18px]" name="sparkles" />
          </div>
          <div>
            <p className="text-[19px] font-semibold tracking-[-0.02em]">OralEval</p>
            <p className="text-[10px] font-medium tracking-[0.08em] text-white/65">RESEARCH ASSESSMENT</p>
          </div>
        </div>

        <nav className="hidden items-center gap-7 text-sm text-white/85 md:flex" aria-label="Primary navigation">
          <a className="transition hover:text-white" href="#workflow">Workflow</a>
          <a className="transition hover:text-white" href="#architecture">Architecture</a>
          <span className="text-white/40">Team 2</span>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-medium text-white/90 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Demo ready
          </div>
          <div className="grid size-9 place-items-center rounded-full bg-[#ef5b60] text-xs font-bold text-white">T2</div>
        </div>
      </div>
    </header>
  );
}
