import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { readSiteContent } from "@/api/content-store";

export const dynamic = "force-dynamic";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Farzad Hammdard",
  jobTitle: "Frontend Developer",
  url: "https://farzad-portfolio.vercel.app",
  email: "farzadhammdard122@gmail.com"
};

export default async function HomePage() {
  const content = await readSiteContent();

  return (
    <>
      <main>
        <HeroSection galleryImages={content.galleryImages} />
        <AboutSection />
        <ProjectsSection projects={content.projects} />
        <GallerySection galleryImages={content.galleryImages} />
        <ExperienceSection />
        <ContactSection />
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-slate-300">
          © {new Date().getFullYear()} Farzad. ساخته شده با JavaScript، Next.js و Tailwind CSS.
        </div>
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
