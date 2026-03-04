"use client";

import Image from "next/image";
import { SectionTitle } from "@/components/ui/section-title";
import { useLanguage } from "@/components/ui/language-provider";

export function GallerySection({ galleryImages }) {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle title={t("gallery_title")} description={t("gallery_desc")} />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {galleryImages.map((item) => (
          <article
            key={item.id}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-sky-300/35"
          >
            <div
              className="relative aspect-[4/3] cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => window.open(item.src, "_blank", "noopener,noreferrer")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  window.open(item.src, "_blank", "noopener,noreferrer");
                }
              }}
            >
              <Image src={item.src} alt={item.title} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 33vw" />
            </div>
            <p className="p-3 text-sm text-slate-200">{item.title}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
