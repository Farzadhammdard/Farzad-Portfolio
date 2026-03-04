"use client";

import { useLanguage } from "@/components/ui/language-provider";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-full border border-white/20 bg-white/5 p-1 text-xs">
      <button
        type="button"
        onClick={() => setLanguage("fa")}
        className={`rounded-full px-3 py-1 transition ${
          language === "fa" ? "bg-accent text-white" : "text-slate-300 hover:text-white"
        }`}
      >
        FA
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`rounded-full px-3 py-1 transition ${
          language === "en" ? "bg-accent text-white" : "text-slate-300 hover:text-white"
        }`}
      >
        EN
      </button>
    </div>
  );
}
