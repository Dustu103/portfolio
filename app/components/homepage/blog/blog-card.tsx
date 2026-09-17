import type { BlogPost } from '@/types/portfolio';
import { timeConverter } from '@/utils/time-converter';
import Image from 'next/image';
import Link from 'next/link';
import { BsHeartFill } from 'react-icons/bs';
import { FaCommentAlt } from 'react-icons/fa';

interface BlogCardProps {
  blog: BlogPost;
  priority?: boolean;
}

function BlogCard({ blog, priority = false }: BlogCardProps) {
  const coverImage = blog?.cover_image || blog?.social_image || '/folder_structure_placeholder.jpg';

  return (
    <div className="border border-[#1d293a] hover:border-[#464c6a] transition-all duration-500 bg-[#1b203e] rounded-lg relative group overflow-hidden flex flex-col justify-between">
      <div>
        <div className="h-44 lg:h-52 w-full cursor-pointer overflow-hidden rounded-t-lg relative">
          <Image
            src={coverImage}
            height={1080}
            width={1920}
            className='h-full w-full object-cover group-hover:scale-110 transition-all duration-300'
            alt={blog?.title || 'Blog cover'}
            priority={priority}
          />
        </div>
        <div className="p-3 sm:p-4 flex flex-col">
          <div className="flex justify-between items-center text-[#16f2b3] text-sm">
            <p>{blog?.published_at ? timeConverter(blog.published_at) : ''}</p>
            <div className="flex items-center gap-3">
              <p className="flex items-center gap-1">
                <BsHeartFill />
                <span>{blog?.public_reactions_count ?? 0}</span>
              </p>
              {blog?.comments_count > 0 &&
                <p className="flex items-center gap-1">
                  <FaCommentAlt />
                  <span>{blog?.comments_count}</span>
                </p>
              }
            </div>
          </div>
          <Link target='_blank' href={blog?.url || '#'}>
            <p className='my-2 lg:my-3 cursor-pointer text-lg text-white sm:text-xl font-medium hover:text-violet-500 transition-colors line-clamp-2'>
              {blog?.title}
            </p>
          </Link>
          <p className='mb-2 text-sm text-[#16f2b3]'>
            {`${blog?.reading_time_minutes ?? 1} Min Read`}
          </p>
          <p className='text-sm lg:text-base text-[#d3d8e8] pb-3 lg:pb-6 line-clamp-3'>
            {blog?.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default BlogCard;
