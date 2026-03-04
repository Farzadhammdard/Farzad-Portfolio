"use client";

import Image from "next/image";
import { SectionTitle } from "@/components/ui/section-title";
import { useLanguage } from "@/components/ui/language-provider";

function getGalleryTranslation(t, index) {
  const translations = {
    1: t("gallery_work_01"),
    2: t("gallery_work_02"),
    3: t("gallery_work_03"),
    4: t("gallery_work_04"),
    5: t("gallery_work_05"),
    6: t("gallery_work_06"),
    7: t("gallery_work_07"),
    8: t("gallery_work_08"),
    9: t("gallery_work_09"),
    10: t("gallery_work_10"),
    11: t("gallery_work_11"),
    12: t("gallery_work_12")
  };
  return translations[index] || `Gallery ${index}`;
}

export function GallerySection({ galleryImages }) {
  const { t } = useLanguage();

  return (
    <section id="gallery" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle title={t("gallery_title")} description={t("gallery_desc")} />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {galleryImages.map((item, index) => {
          const translatedTitle = getGalleryTranslation(t, index + 1);
          return (
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
                <Image src={item.src} alt={translatedTitle} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 33vw" />
              </div>
              <p className="p-3 text-sm text-slate-200">{translatedTitle}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

