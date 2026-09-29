import Image from "next/image";

export function AppFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#4f5668] text-white dark:bg-[#111419]">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-10 sm:px-8 sm:py-12">
        <div className="grid gap-9 md:grid-cols-[1.5fr_0.7fr_0.8fr] md:gap-12">
          <div>
            <a aria-label="OralEval home" className="inline-flex" href="#">
              <Image alt="OralEval — Defend your thinking" height={44} src="/oraleval-logo-light.svg" width={180} />
            </a>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/65">
              Evidence-grounded oral examinations that help educators assess how students reason, justify and defend their own work.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Explore</p>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li><a className="transition hover:text-white" href="#">Course Studio</a></li>
              <li><a className="transition hover:text-white" href="#">Assessments</a></li>
            </ul>
          </nav>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">Prototype status</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-xs font-medium text-white/80">
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(52,211,153,0.12)]" />
              Frontend demo ready
            </div>
            <p className="mt-3 text-xs leading-5 text-white/45">Role-aware product flow implemented.</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 OralEval. Research prototype.</p>
          <p>L3S Retreat 2026 · Lüneburg</p>
        </div>
      </div>
    </footer>
  );
}
