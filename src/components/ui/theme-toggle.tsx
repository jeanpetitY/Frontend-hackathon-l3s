"use client";

import { Icon } from "@/components/ui/icon";

export function ThemeToggle() {
  function toggleTheme() {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("oraleval-theme", nextTheme);
  }

  return (
    <button
      aria-label="Toggle color theme"
      className="grid size-9 cursor-pointer place-items-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600 transition duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:border-rose-900 dark:hover:bg-rose-950/30 dark:hover:text-rose-300"
      onClick={toggleTheme}
      title="Toggle light and dark theme"
      type="button"
    >
      <Icon className="theme-icon-light size-[17px]" name="moon" />
      <Icon className="theme-icon-dark size-[17px]" name="sun" />
    </button>
  );
}
