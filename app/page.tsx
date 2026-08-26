import { personalData } from "@/utils/data/personal-data";
import AboutSection from "./components/homepage/about";
import ContactSection from "./components/homepage/contact";
import Education from "./components/homepage/education";
import Experience from "./components/homepage/experience";
import HeroSection from "./components/homepage/hero-section";
import Projects from "./components/homepage/projects";
import ProcessSequence from "./components/homepage/process";
import Skills from "./components/homepage/skills";
import ParticlesBackground from "./components/homepage/projects/particles";

export default async function Home() {
  return (
    <div suppressHydrationWarning>
      <ParticlesBackground />
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <ProcessSequence />
      <Education />
      <ContactSection />
    </div>
  );
}
