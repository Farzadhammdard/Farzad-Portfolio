"use client";

import Image from "next/image";
import { SectionTitle } from "@/components/ui/section-title";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useLanguage } from "@/components/ui/language-provider";

const WEB_PROJECTS = [
  {
    id: "kabul-asia-erp-fullstack",
    image: "/projects/kabul-asia-erp.jpg",
    url: "https://github.com/FarzadHammdard/kabul-asia-erp-fullstack"
  },
  {
    id: "image-finder",
    image: "/projects/image-finder.jpg",
    url: "https://github.com/FarzadHammdard/image-finder"
  },
  {
    id: "victor-ai",
    image: "/projects/victor-ai.jpg",
    url: "https://github.com/Farzadhammdard/victor-ai"
  }
];

function getWebProjectTranslations(t, index) {
  const translations = {
    1: {
      title: t("web_project_1_title"),
      description: t("web_project_1_desc")
    },
    2: {
      title: t("web_project_2_title"),
      description: t("web_project_2_desc")
    },
    3: {
      title: t("web_project_3_title"),
      description: t("web_project_3_desc")
    }
  };

  return translations[index] || { title: "", description: "" };
}

export function WebProjectsSection() {
  const { t } = useLanguage();

  return (
    <section id="web-projects" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <SectionReveal>
        <SectionTitle title={t("web_projects_title")} description={t("web_projects_desc")} />
      </SectionReveal>

      <SectionReveal className="stagger-children mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {WEB_PROJECTS.map((project, index) => {
          const translated = getWebProjectTranslations(t, index + 1);

          return (
            <article
              key={project.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-sky-300/35"
            >
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={project.image}
                  alt={translated.title || project.id}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </div>
              <div className="space-y-3 p-5">
                <h3 className="text-lg font-semibold text-white">{translated.title || project.id}</h3>
                <p className="text-sm text-slate-300">{translated.description}</p>

                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-sky-300/40 px-4 py-2 text-xs font-semibold text-sky-100 transition hover:bg-sky-400/10"
                >
                  {t("web_project_github")}
                </a>
              </div>
            </article>
          );
        })}
      </SectionReveal>
    </section>
  );
}
