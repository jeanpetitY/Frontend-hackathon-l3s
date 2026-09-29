import Image from "next/image";

import { ThemeToggle } from "@/components/ui/theme-toggle";

export function AppHeader() {
  return (
    <header className="relative z-20 bg-[#5f6678] text-white shadow-sm dark:bg-[#242832]">
      <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center justify-between px-5 sm:px-8">
        <a aria-label="OralEval home" className="flex items-center" href="#">
          <Image alt="OralEval — Defend your thinking" height={44} priority src="/oraleval-logo-light.svg" width={180} />
        </a>

        <nav className="hidden items-center gap-7 text-sm text-white/85 md:flex" aria-label="Primary navigation">
          <a className="font-medium text-white" href="#">Workspace</a>
          <a className="transition hover:text-white" href="#">Assessments</a>
          <a className="transition hover:text-white" href="#">Results</a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md bg-white/10 px-3 py-2 text-xs font-medium text-white/90 sm:flex">
            <span className="size-1.5 rounded-full bg-emerald-400" /> Prototype
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
