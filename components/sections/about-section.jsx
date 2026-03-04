"use client";

import { SectionTitle } from "@/components/ui/section-title";
import { useLanguage } from "@/components/ui/language-provider";

export function AboutSection() {
  const { t } = useLanguage();

  return (
    <section id="about" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle title={t("about_title")} description={t("about_desc")} />

          </section>
  );
}
