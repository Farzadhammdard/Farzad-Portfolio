"use client";

import { useLanguage } from "@/components/ui/language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] p-1 text-xs">
      <button
        type="button"
        onClick={() => setLanguage("fa")}
        className={`rounded-full px-3 py-1 transition ${
          language === "fa"
            ? "bg-[var(--ui-accent)] text-white"
            : "text-[var(--ui-text-muted)] hover:text-[var(--ui-text-primary)]"
        }`}
      >
        FA
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3 py-1 transition ${
          language === "en"
            ? "bg-[var(--ui-accent)] text-white"
            : "text-[var(--ui-text-muted)] hover:text-[var(--ui-text-primary)]"
        }`}
      >
        EN
      </button>
    </div>
  );
}
