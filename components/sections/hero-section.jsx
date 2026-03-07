"use client";

import { useLanguage } from "@/components/ui/language-provider";
import { SectionReveal } from "@/components/ui/section-reveal";

const CV_FILE_PATH = "/farzad-hammdard-full%20cv.pdf";
const HERO_VIDEO_PATH = "/home-hero.mp4";

function scrollToSection(id) {
  const section = document.querySelector(id);
  if (!section) {
    return;
  }
  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function HeroSection() {
  const { t } = useLanguage();

  return (
    <section id="home" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-14 pt-10 sm:px-6 lg:px-8">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <SectionReveal type="left" className="space-y-5">
          <p className="inline-flex rounded-full border border-sky-300/30 bg-sky-300/10 px-3 py-1 text-xs text-sky-100">
            {t("hero_badge")}
          </p>
          <h1 className="text-3xl font-bold leading-tight text-white sm:text-5xl">{t("hero_title")}</h1>
          <p className="text-sm leading-7 text-slate-300 sm:text-base">{t("hero_desc")}</p>

          <div className="stagger-children flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => scrollToSection("#projects")}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              {t("hero_cta_projects")}
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("#contact")}
              className="rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-white/45"
            >
              {t("hero_cta_contact")}
            </button>
            <a
              href={CV_FILE_PATH}
              className="rounded-full border border-sky-300/50 px-5 py-2.5 text-sm font-semibold text-sky-100 transition hover:bg-sky-400/10"
            >
              {t("nav_cv")}
            </a>
          </div>
        </SectionReveal>

        <SectionReveal
          type="right"
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl transition hover:-translate-y-1"
        >
          <div className="relative aspect-[4/3] w-full">
            <video
              className="h-full w-full object-cover"
              src={HERO_VIDEO_PATH}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
