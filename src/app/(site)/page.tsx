import { Hero } from "@/components/sections/Hero";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
