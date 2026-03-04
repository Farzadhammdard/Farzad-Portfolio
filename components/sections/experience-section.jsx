"use client";

import { SectionTitle } from "@/components/ui/section-title";
import { useLanguage } from "@/components/ui/language-provider";

function getExperienceTranslation(t, year) {
  const translations = {
    "2026": { title: t("experience_2026_title"), company: t("experience_2026_company"), details: t("experience_2026_details") },
    "2025": { title: t("experience_2025_title"), company: t("experience_2025_company"), details: t("experience_2025_details") },
    "2024": { title: t("experience_2024_title"), company: t("experience_2024_company"), details: t("experience_2024_details") }
  };
  return translations[year] || null;
}

const experienceData = [
  { year: "2026", title: "توسعه‌دهنده فرانت‌اند", company: "فریلنس", details: "طراحی رابط‌های وب مدرن با تمرکز بر سرعت، خوانایی و ساختار تمیز." },
  { year: "2025", title: "یکپارچه‌ساز محصولات CNC", company: "پروژه‌های کارگاهی", details: "طراحی جریان‌های نرم‌افزاری برای ساده‌سازی برنامه‌ریزی تولید CNC و تحویل پروژه." },
  { year: "2024", title: "فارغ‌التحصیل علوم کامپیوتر", company: "دانشگاه", details: "تمرکز بر مهندسی نرم‌افزار عملی و سیستم‌های فرانت‌اند آماده تولید." }
];

export function ExperienceSection() {
  const { t } = useLanguage();

  return (
    <section id="experience" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle title={t("experience_title")} description={t("experience_desc")} />

      <div className="mt-8 space-y-4">
        {experienceData.map((item) => {
          const translated = getExperienceTranslation(t, item.year);
          return (
            <article key={item.year} className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">{item.year}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{translated?.title || item.title}</h3>
              <p className="text-sm text-sky-100">{translated?.company || item.company}</p>
              <p className="mt-2 text-sm text-slate-300">{translated?.details || item.details}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

