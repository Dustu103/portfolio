'use client';
import React, { useEffect, useState } from 'react';
import { Project } from '@/types/portfolio';
import { IoClose, IoLayersOutline } from 'react-icons/io5';
import { 
  FaGithub, 
  FaExternalLinkAlt, 
  FaCopy, 
  FaCheck, 
  FaChartBar
} from 'react-icons/fa';
import { 
  HiOutlineCpuChip, 
  HiOutlineShieldExclamation, 
  HiOutlineSparkles 
} from 'react-icons/hi2';
import { CaseStudyFormatter } from './case-study-formatter';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

type TabType = 'architecture' | 'challenges' | 'solutions';

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('architecture');
  const [copiedAll, setCopiedAll] = useState(false);

  // Keyboard Escape listener & body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  if (!project.case_study) return null;

  const handleCopyFullCaseStudy = () => {
    const fullText = `# ${project.name} - Engineering Case Study\n\n` +
      `## 01. System Architecture\n${project.case_study?.architecture}\n\n` +
      `## 02. Technical Challenges\n${project.case_study?.technical_challenge}\n\n` +
      `## 03. Solutions & Benchmarks\n${project.case_study?.solution}\n`;

    navigator.clipboard.writeText(fullText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2200);
  };

  // Count challenges and solutions for tab badges
  const challengeCount = (project.case_study.technical_challenge.match(/CHALLENGE\s+\d+/gi) || []).length;
  const solutionCount = (project.case_study.solution.match(/SOLUTION\s+\d+/gi) || []).length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-300">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-[#030712]/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Main Glassmorphic Modal Window */}
      <div className="relative w-full max-w-5xl xl:max-w-6xl max-h-[94vh] bg-[#090d1a] border border-[#1f2847] rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(22,242,179,0.18)] overflow-hidden flex flex-col z-10">
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-6 border-b border-[#1c2442] bg-[#0c1224]/90 backdrop-blur-lg flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold tracking-wider uppercase bg-[#16f2b3]/15 text-[#16f2b3] border border-[#16f2b3]/30">
                  SYSTEM ARCHITECTURE SPECIFICATION
                </span>
                {project.language && (
                  <span className="hidden md:inline-block text-xs font-mono text-gray-400">
                    • {project.language.split(',')[0]}
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-teal-100 to-[#16f2b3] bg-clip-text text-transparent">
                {project.name}
              </h2>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {project.demo_url && (
                <a
                  href={project.demo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-400 hover:to-emerald-500 rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:scale-105"
                >
                  <FaExternalLinkAlt size={11} />
                  <span className="hidden xs:inline">Live</span> Demo
                </a>
              )}

              {project.html_url && (
                <a
                  href={project.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-300 hover:text-white bg-[#151c33] hover:bg-[#1d2747] border border-[#222e54] rounded-xl transition-all"
                >
                  <FaGithub size={14} />
                  <span className="hidden sm:inline">Code</span>
                </a>
              )}

              <button
                onClick={handleCopyFullCaseStudy}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-300 hover:text-white bg-[#151c33] hover:bg-[#1d2747] border border-[#222e54] rounded-xl transition-all"
                title="Copy entire case study to markdown"
              >
                {copiedAll ? <FaCheck className="text-[#16f2b3]" size={12} /> : <FaCopy size={12} />}
                <span>{copiedAll ? 'Copied' : 'Share'}</span>
              </button>

              <button 
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 sm:p-2.5 text-gray-400 hover:text-pink-400 bg-[#151c33] hover:bg-pink-500/20 rounded-xl transition-all border border-[#222e54] hover:border-pink-500/30"
              >
                <IoClose size={20} />
              </button>
            </div>
          </div>

          {/* Tab Navigation Pill Bar */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto custom-scrollbar pt-1">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
                activeTab === 'architecture'
                  ? 'bg-[#16f2b3]/15 text-[#16f2b3] border-[#16f2b3]/40 shadow-[0_0_15px_rgba(22,242,179,0.15)] font-semibold'
                  : 'bg-[#0f1426] text-gray-400 border-transparent hover:text-gray-200 hover:bg-[#161d36]'
              }`}
            >
              <HiOutlineCpuChip size={16} />
              <span>01. System Architecture</span>
            </button>

            <button
              onClick={() => setActiveTab('challenges')}
              className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
                activeTab === 'challenges'
                  ? 'bg-pink-500/15 text-pink-400 border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.15)] font-semibold'
                  : 'bg-[#0f1426] text-gray-400 border-transparent hover:text-gray-200 hover:bg-[#161d36]'
              }`}
            >
              <HiOutlineShieldExclamation size={16} />
              <span>02. Technical Challenges</span>
              {challengeCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-pink-500/20 text-pink-300">
                  {challengeCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('solutions')}
              className={`flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap border ${
                activeTab === 'solutions'
                  ? 'bg-violet-500/15 text-violet-400 border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.15)] font-semibold'
                  : 'bg-[#0f1426] text-gray-400 border-transparent hover:text-gray-200 hover:bg-[#161d36]'
              }`}
            >
              <HiOutlineSparkles size={16} />
              <span>03. Solutions & Benchmarks</span>
              {solutionCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-violet-500/20 text-violet-300">
                  {solutionCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 custom-scrollbar">
          
          {/* SECTION 1: ARCHITECTURE */}
          {activeTab === 'architecture' && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#1a2342]">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#16f2b3]/20 text-[#16f2b3] font-mono font-bold text-xs">
                  01
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                  System Architecture & Hardware Foundations
                </h3>
              </div>
              <CaseStudyFormatter 
                content={project.case_study.architecture} 
                sectionType="architecture" 
              />
            </section>
          )}

          {/* SECTION 2: TECHNICAL CHALLENGES */}
          {activeTab === 'challenges' && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#1a2342]">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-pink-500/20 text-pink-400 font-mono font-bold text-xs">
                  02
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                  Real Engineering Challenges & Bottlenecks
                </h3>
              </div>
              <CaseStudyFormatter 
                content={project.case_study.technical_challenge} 
                sectionType="challenge" 
              />
            </section>
          )}

          {/* SECTION 3: THE SOLUTIONS */}
          {activeTab === 'solutions' && (
            <section className="space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#1a2342]">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-violet-500/20 text-violet-400 font-mono font-bold text-xs">
                  03
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-wide">
                  Algorithmic Solutions & Quantified Impact
                </h3>
              </div>
              <CaseStudyFormatter 
                content={project.case_study.solution} 
                sectionType="solution" 
              />
            </section>
          )}

          {/* Tech Stack Pills Footer */}
          {project.language && (
            <div className="pt-6 border-t border-[#1a2342]">
              <div className="flex items-center gap-2 mb-3">
                <IoLayersOutline className="text-teal-400" size={15} />
                <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-widest">
                  Technologies, Standards & Protocols
                </h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.language.split(',').map((tech, i) => (
                  <span 
                    key={i} 
                    className="px-3 py-1 text-xs font-mono font-medium text-teal-200 bg-[#0e162d] border border-[#212f5a] rounded-lg shadow-sm hover:border-[#16f2b3]/50 transition-colors"
                  >
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
