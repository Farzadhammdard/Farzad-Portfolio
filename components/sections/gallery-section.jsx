"use client";

import Image from "next/image";
import { SectionTitle } from "@/components/ui/section-title";
import { useLanguage } from "@/components/ui/language-provider";

export function GallerySection({ galleryImages = [] }) {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle title={t("gallery_title")} description={t("gallery_desc")} />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
      </div>
    </section>
  );
}
