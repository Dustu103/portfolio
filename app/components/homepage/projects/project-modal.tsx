'use client';
import React, { useEffect } from 'react';
import { Project } from '@/types/portfolio';
import { IoClose } from 'react-icons/io5';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!project.case_study) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-[#0a0d14]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content container */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#0d1224] border border-[#1f223c] rounded-2xl shadow-[0_0_50px_rgba(22,242,179,0.15)] overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="flex justify-between items-center p-6 border-b border-[#1f223c] bg-[#11152c]">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide bg-gradient-to-r from-[#16f2b3] to-pink-500 bg-clip-text text-transparent">
            {project.name} - Case Study
          </h2>
          <button 
            onClick={onClose}
            className="p-2 bg-[#0d1224] hover:bg-pink-500/20 text-gray-400 hover:text-pink-500 rounded-full transition-colors border border-[#1f223c]"
          >
            <IoClose size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-8 custom-scrollbar">
          
          <section className="space-y-3">
            <h3 className="text-xl font-bold text-[#e6e6e6] border-l-4 border-[#16f2b3] pl-3 flex items-center gap-2">
              <span className="text-[#16f2b3]">01.</span> System Architecture
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {project.case_study.architecture}
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-[#e6e6e6] border-l-4 border-pink-500 pl-3 flex items-center gap-2">
              <span className="text-pink-500">02.</span> Technical Challenge
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {project.case_study.technical_challenge}
            </p>
          </section>

          <section className="space-y-3">
            <h3 className="text-xl font-bold text-[#e6e6e6] border-l-4 border-violet-500 pl-3 flex items-center gap-2">
              <span className="text-violet-500">03.</span> The Solution
            </h3>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              {project.case_study.solution}
            </p>
          </section>

          {/* Tags */}
          {project.language && (
            <div className="pt-6 border-t border-[#1f223c]">
              <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">Tech Stack Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.language.split(',').map((tech, i) => (
                  <span key={i} className="px-3 py-1 text-sm font-medium text-white bg-[#11152c] border border-gray-700 rounded-full shadow-sm">
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
