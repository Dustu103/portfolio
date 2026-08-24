import { personalData } from '@/utils/data/personal-data';
import { projectsData } from '@/utils/data/projects-data';
import type { Project } from '@/types/portfolio';
import ProjectCard from './project-card';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const Projects = () => {
  return (
    <div id='projects' className="relative z-50 my-12 lg:my-24">
      <div className="sticky top-10">
        <div className="w-[80px] h-[80px] bg-violet-100 rounded-full absolute -top-3 left-0 translate-x-1/2 filter blur-3xl opacity-30"></div>
        <div className="flex items-center justify-start relative">
          <span className="bg-[#1a1443] absolute left-0 w-fit text-white px-5 py-3 text-xl rounded-md">
            PROJECTS
          </span>
          <span className="w-full h-[2px] bg-[#1a1443]"></span>
        </div>
      </div>

      <div className="pt-24">
        {projectsData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projectsData.slice(0, 4).map((project: Project, index: number) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No projects found on GitHub.</p>
        )}
        
        <div className="flex justify-center mt-10">
          <Link
            href={personalData.github}
            target="_blank"
            className="flex items-center gap-2 hover:gap-4 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-8 py-3 text-center text-xs font-medium uppercase tracking-wider text-white no-underline transition-all duration-200 ease-out hover:text-white hover:no-underline md:font-semibold"
          >
            <span>View All on GitHub</span>
            <FaArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;
