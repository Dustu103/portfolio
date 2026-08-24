'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt } from 'react-icons/fa';
import { Project } from '@/types/portfolio';

interface ProjectCardProps {
  project: Project;
}

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="w-full h-[450px] relative group overflow-hidden bg-[#0d1224] rounded-xl flex flex-col border border-[#1f223c] hover:border-violet-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all duration-300 cursor-pointer">
      
      {/* Background Image / Placeholder */}
      <div className="absolute inset-0 z-0">
        {project.image ? (
          <img 
            src={project.image} 
            alt={project.name}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-30 group-hover:scale-110 transition-all duration-700 ease-in-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-900/40 to-purple-900/40 opacity-50 group-hover:scale-110 transition-transform duration-700 ease-in-out">
            <span className="text-gray-600 text-3xl font-mono font-bold tracking-widest opacity-20 -rotate-45">
              {project.name.toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Persistent Top Badges */}
      <div className="absolute top-4 right-4 z-20 flex gap-2">
        {project.html_url && (
          <div className="bg-[#11152c]/90 backdrop-blur-md p-2 rounded-full border border-gray-700 text-gray-300 shadow-lg">
            <FaGithub size={18} />
          </div>
        )}
      </div>

      {/* Floating Content Pane (Slide Up on Hover) */}
      <div className="absolute bottom-0 left-0 w-full z-10 flex flex-col justify-end p-6 bg-gradient-to-t from-[#090b16] via-[#090b16]/95 to-transparent translate-y-[140px] md:translate-y-[120px] group-hover:translate-y-0 transition-transform duration-500 ease-out h-[350px]">
        
        {/* Title always visible at bottom */}
        <div className="mb-2">
          <h3 className="text-3xl font-extrabold text-white group-hover:text-[#16f2b3] transition-colors drop-shadow-md">
            {project.name}
          </h3>
          {project.language && (
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 shadow-[0_0_5px_#16f2b3]"></span>
              <span className="text-sm font-semibold tracking-wide text-gray-300 uppercase drop-shadow-sm truncate">
                {project.language}
              </span>
            </div>
          )}
        </div>
        
        {/* Hidden Details (Revealed on Hover) */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-75 flex flex-col justify-between flex-grow mt-4">
          
          <div className="overflow-y-auto custom-scrollbar pr-2 h-[120px]">
            <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
              {project.description || 'No description available for this project.'}
            </p>
          </div>
          
          {/* Footer Stats & Actions */}
          <div className="flex items-center justify-between border-t border-violet-500/30 pt-4 mt-4">
            
            <div className="flex gap-4 text-xs font-semibold text-gray-400">
              {project.stargazers_count > 0 && (
                <div className="flex items-center gap-1.5">
                  <FaStar className="text-yellow-400" size={14} />
                  <span>{project.stargazers_count}</span>
                </div>
              )}
              {project.forks_count > 0 && (
                <div className="flex items-center gap-1.5">
                  <FaCodeBranch className="text-blue-400" size={14} />
                  <span>{project.forks_count}</span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {project.html_url && (
                <Link 
                  href={project.html_url} 
                  target="_blank" 
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-white text-xs font-medium transition-colors border border-gray-600 backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaGithub size={12} /> Source
                </Link>
              )}
              
              {project.demo_url && (
                <Link 
                  href={project.demo_url} 
                  target="_blank" 
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all"
                  onClick={(e) => e.stopPropagation()}
                >
                  Visit <FaExternalLinkAlt size={10} />
                </Link>
              )}
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}

export default ProjectCard;
