import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ExperienceSection } from "@/components/sections/experience-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { Footer } from "@/components/sections/footer-section";
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

      <Footer />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}

