"use client";

import Link from "next/link";
import { useLanguage } from "@/components/ui/language-provider";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm text-sky-200">404</p>
      <h1 className="mt-3 text-3xl font-bold text-white">{t("not_found_title")}</h1>
      <p className="mt-3 text-slate-300">{t("not_found_desc")}</p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-sky-300/40 px-5 py-2 text-sm text-sky-100 transition hover:bg-sky-400/10"
      >
        {t("not_found_back_home")}
      </Link>
    </main>
  );
}
