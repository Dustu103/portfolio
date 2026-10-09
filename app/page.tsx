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
import { blogsData } from "@/utils/data/blogs-data";

async function getBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`https://dev.to/api/articles?username=${personalData.devUsername}`, { next: { revalidate: 1800 } });
    if (!res.ok) return blogsData;
    const fetched: BlogPost[] = await res.json();
    
    // Merge any missing blogs from blogsData
    const fetchedUrls = new Set(fetched.map(b => b.url?.toLowerCase()));
    const missingBlogs = blogsData.filter(b => !fetchedUrls.has(b.url?.toLowerCase()));
    
    const combined = [...fetched, ...missingBlogs];
    combined.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
    return combined;
  } catch {
    return blogsData;
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
