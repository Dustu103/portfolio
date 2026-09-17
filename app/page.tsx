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
import Blog from "./components/homepage/blog";
import type { BlogPost } from "@/types/portfolio";

async function getBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const blogs = await getBlogs();

  return (
    <div suppressHydrationWarning>
      <ParticlesBackground />
      <HeroSection />
      <AboutSection />
      <Experience />
      <Skills />
      <Projects />
      <ProcessSequence />
      <Blog blogs={blogs} />
      <Education />
      <ContactSection />
    </div>
  );
}
