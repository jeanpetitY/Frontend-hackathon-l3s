import Image from "next/image";

export function AppFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0d1117]">
      <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-4">
          <a aria-label="OralEval home" className="rounded-md transition-opacity hover:opacity-70" href="#">
            <Image alt="OralEval" className="dark:hidden" height={34} src="/oraleval-logo.svg" width={138} />
            <Image alt="OralEval" className="hidden dark:block" height={34} src="/oraleval-logo-light.svg" width={138} />
          </a>
          <span className="hidden h-5 w-px bg-slate-200 dark:bg-slate-700 sm:block" />
          <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">Research prototype for evidence-grounded oral assessment.</p>
        </div>
        <p className="text-xs text-slate-400">L3S Retreat 2026 · Lüneburg</p>
      </div>
    </footer>
  );
}
