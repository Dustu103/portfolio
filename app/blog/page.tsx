import { personalData } from "@/utils/data/personal-data";
import type { BlogPost } from "@/types/portfolio";
import { blogsData } from "@/utils/data/blogs-data";
import BlogCard from "../components/homepage/blog/blog-card";

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

async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <div className="py-8">
      <div className="flex justify-center my-5 lg:py-8">
        <div className="flex items-center">
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
          <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-2xl rounded-md">
            All Blog
          </span>
          <span className="w-24 h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-8 xl:gap-10">
        {blogs.map((blog, i) => (
          <BlogCard blog={blog} key={i} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}

export default BlogPage;
