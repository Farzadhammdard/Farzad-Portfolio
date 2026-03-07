"use client";

import { SectionTitle } from "@/components/ui/section-title";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useLanguage } from "@/components/ui/language-provider";

export function AboutSection() {
  const { t, language } = useLanguage();
  const highlights =
    language === "fa"
      ? ["طراحی UI تمیز و مقیاس‌پذیر", "بهینه‌سازی سرعت و تجربه کاربری", "یکپارچه‌سازی فرانت‌اند با فرایند CNC"]
      : ["Clean and scalable UI design", "Performance-first user experience", "Frontend integration with CNC workflows"];

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <SectionReveal>
        <SectionTitle title={t("about_title")} description={t("about_desc")} />
      </SectionReveal>

      <SectionReveal className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {highlights.map((item) => (
            <li key={item} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
              {item}
            </li>
          ))}
        </ul>
      </SectionReveal>
    </section>
  );
}
