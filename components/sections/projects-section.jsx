"use client";

import Image from "next/image";
import { SectionTitle } from "@/components/ui/section-title";
import { SectionReveal } from "@/components/ui/section-reveal";
import { useLanguage } from "@/components/ui/language-provider";

const HIDDEN_STACK_ITEMS = new Set(["Next.js", "TypeScript", "Tailwind", "Framer Motion"]);

function normalizeStack(stack) {
  if (Array.isArray(stack)) {
    return stack
      .map((tech) => String(tech).trim())
      .filter(Boolean);
  }

  if (typeof stack === "string") {
    return stack
      .split(/[,\u060C]/)
      .map((tech) => tech.trim())
      .filter(Boolean);
  }

  return [];
}

export function ProjectsSection({ projects = [], galleryImages = [] }) {
  const { t } = useLanguage();

  return (
    <section id="projects" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <SectionReveal>
        <SectionTitle title={t("projects_title")} description={t("projects_desc")} />
      </SectionReveal>

      <SectionReveal className="stagger-children mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => {
          const title = String(project?.title || "").trim() || `Project ${index + 1}`;
          const description = String(project?.description || "").trim();
          const visibleStack = normalizeStack(project?.stack).filter((tech) => !HIDDEN_STACK_ITEMS.has(tech));

          return (
            <article
              key={project.id || `project-${index}`}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-sky-300/35"
            >
              <div className="space-y-3 p-4">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                {description ? <p className="text-sm text-slate-300">{description}</p> : null}
                {visibleStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {visibleStack.map((tech, i) => (
                      <span key={`${tech}-${i}`} className="rounded-full bg-sky-500/20 px-2 py-1 text-xs text-sky-200">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </SectionReveal>

      {galleryImages.length > 0 && (
        <SectionReveal className="stagger-children mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((item, index) => {
            const title = String(item?.title || "").trim() || `${t("gallery_fallback")} ${index + 1}`;
            const specs = String(item?.specs || "").trim();

            return (
              <article
                key={item.id || `gallery-${index}`}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-sky-300/35"
              >
                <div
                  className="relative aspect-[4/3] cursor-pointer"
                  role="button"
                  tabIndex={0}
                  onClick={() => window.open(item.src, "_blank", "noopener,noreferrer")}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      window.open(item.src, "_blank", "noopener,noreferrer");
                    }
                  }}
                >
                  <Image src={item.src} alt={title} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 33vw" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent p-3">
                    <p className="text-sm font-semibold text-white">{title}</p>
                    {specs ? <p className="mt-1 text-xs text-slate-200/95">{specs}</p> : null}
                  </div>
                </div>
              </article>
            );
          })}
        </SectionReveal>
      )}
    </section>
  );
}
