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
      className="grid size-9 place-items-center rounded-md border border-white/15 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      onClick={toggleTheme}
      title="Toggle light and dark theme"
      type="button"
    >
      <Icon className="theme-icon-light size-[17px]" name="moon" />
      <Icon className="theme-icon-dark size-[17px]" name="sun" />
    </button>
  );
}
