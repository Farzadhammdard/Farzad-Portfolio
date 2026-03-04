"use client";

import { experience } from "@/lib/site-data";
import { SectionTitle } from "@/components/ui/section-title";
import { useLanguage } from "@/components/ui/language-provider";

export function ExperienceSection() {
  const { t } = useLanguage();

  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle title={t("experience_title")} description={t("experience_desc")} />

      <div className="mt-8 space-y-4">
        {experience.map((item) => (
          <article key={item.year} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{item.year}</p>
            <h3 className="mt-2 text-lg font-semibold text-white">{item.title}</h3>
            <p className="text-sm text-sky-100">{item.company}</p>
            <p className="mt-2 text-sm text-slate-300">{item.details}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
