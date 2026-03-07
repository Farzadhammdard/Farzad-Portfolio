"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks } from "@/lib/site-data";
import { useLanguage } from "@/components/ui/language-provider";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const CV_FILE_PATH = "/farzad-hammdard-full%20cv.pdf";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-[color:var(--ui-border)] bg-[var(--ui-surface-muted)] backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-lg font-semibold text-[var(--ui-text-primary)]">
          {t("brand")}
        </Link>

        <div className="hidden items-center gap-5 md:flex">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              className="text-sm text-[var(--ui-text-muted)] transition hover:text-[var(--ui-text-primary)]"
            >
              {t(item.key)}
            </Link>
          ))}
          <Link href="/blog" className="text-sm text-[var(--ui-text-muted)] transition hover:text-[var(--ui-text-primary)]">
            {t("nav_blog")}
          </Link>
          <Link href="/admin" className="text-sm text-[var(--ui-text-muted)] transition hover:text-[var(--ui-text-primary)]">
            {t("nav_admin")}
          </Link>
          <a
            href={CV_FILE_PATH}
            className="rounded-full border border-[color:var(--ui-border-strong)] px-4 py-2 text-xs font-semibold text-[var(--ui-text-primary)] transition hover:bg-[color:color-mix(in_srgb,var(--ui-accent)_14%,transparent)]"
          >
            {t("nav_cv")}
          </a>
          <ThemeToggle />
          <LanguageSwitcher />
        </div>

        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-lg border border-[color:var(--ui-border)] bg-[var(--ui-surface)] p-2 text-[var(--ui-text-primary)]"
            aria-label={t("nav_toggle_menu")}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="mx-4 mb-4 max-h-[calc(100vh-5.25rem)] space-y-3 overflow-y-auto rounded-2xl border border-[color:var(--ui-border)] bg-[var(--ui-surface-strong)] p-4 md:hidden">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={`/${item.href}`}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-1.5 text-sm text-[var(--ui-text-muted)] transition hover:bg-[var(--ui-surface-muted)] hover:text-[var(--ui-text-primary)]"
            >
              {t(item.key)}
            </Link>
          ))}
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-2 py-1.5 text-sm text-[var(--ui-text-muted)] transition hover:bg-[var(--ui-surface-muted)] hover:text-[var(--ui-text-primary)]"
          >
            {t("nav_blog")}
          </Link>
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-2 py-1.5 text-sm text-[var(--ui-text-muted)] transition hover:bg-[var(--ui-surface-muted)] hover:text-[var(--ui-text-primary)]"
          >
            {t("nav_admin")}
          </Link>
          <a
            href={CV_FILE_PATH}
            className="inline-flex rounded-full border border-[color:var(--ui-border-strong)] px-4 py-2 text-xs font-semibold text-[var(--ui-text-primary)]"
          >
            {t("nav_cv")}
          </a>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      ) : null}
    </header>
  );
}
