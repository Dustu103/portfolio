'use client';
import * as React from 'react';
import Link from 'next/link';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Project } from '@/types/portfolio';

interface ProjectCardProps {
  project: Project;
  isSelected?: boolean;
  onSelect?: () => void;
}

function ProjectCard({ project, isSelected, onSelect }: ProjectCardProps) {
  // Extract technologies from the language string
  const technologies = project.language ? project.language.split(',').map(tech => tech.trim()) : [];

  return (
    <div 
      onClick={onSelect}
      className={`relative group w-[300px] h-[260px] sm:w-[450px] sm:h-[380px] transition-transform duration-500 hover:scale-105 cursor-pointer filter ${isSelected ? 'scale-105 drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]' : 'drop-shadow-[0_0_10px_rgba(22,242,179,0.1)] hover:drop-shadow-[0_0_20px_rgba(22,242,179,0.5)]'}`}
    >
      {/* Outer Hexagon (Border) */}
      <div 
        className={`absolute inset-0 transition-colors duration-500 ${isSelected ? 'bg-gradient-to-br from-pink-500 to-violet-600' : 'bg-[#1f223c] group-hover:bg-gradient-to-br group-hover:from-[#16f2b3] group-hover:to-violet-600'}`}
        style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
      >
        {/* Inner Hexagon (Content) */}
        <div 
          className="absolute inset-[2px] sm:inset-[3px] bg-[#0d1224] flex flex-col items-center justify-center overflow-hidden transition-colors duration-500"
          style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {project.image ? (
              <img 
                src={project.image} 
                alt={project.name}
                className="w-full h-full object-cover opacity-20 group-hover:opacity-10 transition-opacity duration-300"
              />
            ) : (
              <div className="w-full h-full opacity-20 bg-[url('/grid.svg')] bg-cover" />
            )}
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center p-2 sm:p-6 text-center w-[85%] sm:w-[75%]">
            <h3 className="text-xl sm:text-3xl font-extrabold text-white tracking-wide group-hover:text-[#16f2b3] transition-colors drop-shadow-lg mb-2 sm:mb-3">
              {project.name}
            </h3>
            
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3 sm:mb-5">
              {technologies.length > 0 ? (
                technologies.slice(0, 5).map((tech, idx) => ( 
                  <span key={idx} className="px-2 py-0.5 text-[9px] sm:text-xs font-bold text-white bg-gradient-to-r from-violet-600/50 to-pink-500/50 border border-violet-500/30 rounded-sm">
                    {tech}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500">No Tech Listed</span>
              )}
            </div>

            {project.description && (
              <p className="text-[10px] sm:text-sm text-gray-300 font-medium leading-relaxed line-clamp-3 sm:line-clamp-4 px-2 drop-shadow-sm">
                {project.description}
              </p>
            )}
          </div>

          {/* Hover Overlay Actions */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[#0d1224]/95 backdrop-blur-md">
            
            <p className="text-pink-500 font-bold tracking-widest text-sm mb-1 font-mono">
              {isSelected ? 'TARGET ACQUIRED' : 'INSPECT NODE'}
            </p>
            
            <div className="flex flex-row items-center gap-4">
              {project.demo_url && (
                <Link 
                  href={project.demo_url} 
                  target="_blank" 
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 hover:from-pink-400 hover:to-violet-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)]"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Details <FaExternalLinkAlt size={14} />
                </Link>
              )}
              {project.html_url && (
                <Link 
                  href={project.html_url} 
                  target="_blank" 
                  title="Source Code"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#11152c] border border-gray-700 hover:border-[#16f2b3] text-gray-300 hover:text-[#16f2b3] transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <FaGithub size={18} /> Code
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
