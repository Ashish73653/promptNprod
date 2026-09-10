"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        disabled
        className="relative flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/80 text-amber-400 opacity-90 cursor-default"
      >
        <Sun className="w-4 h-4 text-amber-400" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="group relative flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 text-slate-700 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400 hover:border-cyan-500/40 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="sr-only">Toggle theme</span>
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-all duration-300 group-hover:rotate-90 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 transition-all duration-300 group-hover:-rotate-12 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(99,102,241,0.3)]" />
      )}
    </button>
  );
}
