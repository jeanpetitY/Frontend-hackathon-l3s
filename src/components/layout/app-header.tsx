import Image from "next/image";

import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AppHeader() {
  return (
    <header className="relative z-20 border-b border-slate-200 bg-white text-slate-800 dark:border-slate-800 dark:bg-[#171b22] dark:text-white">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <a aria-label="OralEval home" className="flex items-center rounded-md transition-opacity hover:opacity-75" href="#">
          <Image alt="OralEval — Defend your thinking" className="dark:hidden" height={44} priority src="/oraleval-logo.svg" width={180} />
          <Image alt="" aria-hidden className="hidden dark:block" height={44} priority src="/oraleval-logo-light.svg" width={180} />
        </a>

        <nav className="hidden items-center gap-8 text-[13px] text-slate-500 dark:text-slate-400 md:flex" aria-label="Primary navigation">
          <a className="rounded-md px-3 py-2 font-semibold text-slate-900 transition hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800" href="#submission">Assessment</a>
          <a className="rounded-md px-3 py-2 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white" href="#criteria">Criteria</a>
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:inline">Programming course</span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
