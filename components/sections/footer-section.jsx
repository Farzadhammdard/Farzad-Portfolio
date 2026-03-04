"use client";

import { useLanguage } from "@/components/ui/language-provider";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
        {t("footer")}
      </div>
    </footer>
  );
}

