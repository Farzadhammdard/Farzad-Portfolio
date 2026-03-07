"use client";

import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/components/ui/language-provider";
import { useTheme } from "@/components/ui/theme-provider";

export function ThemeToggle() {
  const { language } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const label = language === "fa" ? "تغییر تم" : "Toggle theme";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] text-[var(--ui-text-primary)] transition hover:-translate-y-0.5 hover:bg-[var(--ui-surface-strong)]"
      aria-label={label}
      title={label}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
