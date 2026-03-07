"use client";

import Link from "next/link";
import { useLanguage } from "@/components/ui/language-provider";

export function BlogPageContent({ posts }) {
  const { t } = useLanguage();

  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 pt-14 sm:px-6">
      <header className="mb-10">
        <p className="text-xs uppercase tracking-[0.2em] text-sky-200">{t("blog_eyebrow")}</p>
        <h1 className="mt-3 text-3xl font-bold text-white">{t("blog_title")}</h1>
      </header>

      <div className="space-y-5">
        {posts.length ? (
          posts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs text-sky-200">{post.date}</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{post.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{post.excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex rounded-full border border-sky-300/40 px-4 py-2 text-xs font-semibold text-sky-100"
              >
                {t("blog_read")}
              </Link>
            </article>
          ))
        ) : (
          <p className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">{t("blog_empty")}</p>
        )}
      </div>
    </main>
  );
}
