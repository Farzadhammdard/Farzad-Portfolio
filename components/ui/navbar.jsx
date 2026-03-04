"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks } from "@/lib/site-data";
import { useLanguage } from "@/components/ui/language-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

const CV_FILE_PATH = "/farzad-hammdard-full%20cv.pdf";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-lg font-semibold text-white">
          {t("brand")}
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {navLinks.map((item) => (
            <Link key={item.href} href={`/${item.href}`} className="text-sm text-slate-300 transition hover:text-white">
              {t(item.key)}
            </Link>
          ))}
          <Link href="/blog" className="text-sm text-slate-300 transition hover:text-white">
            {t("nav_blog")}
          </Link>
          <Link href="/admin" className="text-sm text-slate-300 transition hover:text-white">
            {t("nav_admin")}
          </Link>
          <a
            href={CV_FILE_PATH}
            className="rounded-full border border-accent/70 px-4 py-2 text-xs font-semibold text-sky-100 transition hover:bg-accent/20"
          >
            {t("nav_cv")}
          </a>
          <LanguageSwitcher />
        </div>

        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-lg border border-white/20 p-2 text-slate-200"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="mx-4 mb-4 space-y-3 rounded-xl border border-white/10 bg-[#0a1324] p-4 md:hidden">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              onClick={() => setOpen(false)}
              className="block text-sm text-slate-200"
            >
              {t(item.key)}
            </Link>
          ))}
          <Link href="/blog" onClick={() => setOpen(false)} className="block text-sm text-slate-200">
            {t("nav_blog")}
          </Link>
          <Link href="/admin" onClick={() => setOpen(false)} className="block text-sm text-slate-200">
            {t("nav_admin")}
          </Link>
          <a
            href={CV_FILE_PATH}
            className="inline-flex rounded-full border border-accent/70 px-4 py-2 text-xs font-semibold text-sky-100"
          >
            {t("nav_cv")}
          </a>
          <div>
            <LanguageSwitcher />
          </div>
        </div>
      ) : null}
    </header>
  );
}
