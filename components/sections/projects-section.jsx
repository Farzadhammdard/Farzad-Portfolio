"use client";

import Image from "next/image";
import { SectionTitle } from "@/components/ui/section-title";
import { useLanguage } from "@/components/ui/language-provider";

function getProjectTranslations(t, index) {
  const translations = {
    1: { title: t("project_1_title"), desc: t("project_1_desc"), stack: t("project_1_stack") },
    2: { title: t("project_2_title"), desc: t("project_2_desc"), stack: t("project_2_stack") },
    3: { title: t("project_3_title"), desc: t("project_3_desc"), stack: t("project_3_stack") }
  };
  return translations[index] || { title: "", desc: "", stack: "" };
}

export function ProjectsSection({ projects }) {
  const { t } = useLanguage();

  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle title={t("projects_title")} description={t("projects_desc")} />

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => {
          const translated = getProjectTranslations(t, index + 1);
          return (
            <article
              key={project.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-sky-300/35"
            >
              <div
                className="relative h-48 w-full cursor-pointer"
                role="button"
                tabIndex={0}
                onClick={() => window.open(project.image, "_blank", "noopener,noreferrer")}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    window.open(project.image, "_blank", "noopener,noreferrer");
                  }
                }}
              >
                <Image src={project.image} alt={translated.title || project.title} fill className="object-cover" />
              </div>
              <div className="space-y-3 p-4">
                <h3 className="text-lg font-semibold text-white">{translated.title || project.title}</h3>
                <p className="text-sm text-slate-300">{translated.desc || project.description}</p>
                {translated.stack && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {translated.stack.split("،").map((tech, i) => (
                      <span key={i} className="rounded-full bg-sky-500/20 px-2 py-1 text-xs text-sky-200">
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

