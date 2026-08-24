'use client';
import React, { useState } from 'react';

import { personalData } from '@/utils/data/personal-data';
import { projectsData } from '@/utils/data/projects-data';
import type { Project } from '@/types/portfolio';
import ProjectCard from './project-card';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

// Asymmetrical Binary Tree Coordinates (Percentages for responsiveness)
// Center of the node will be placed at these coordinates.
const treePositions = [
  { x: 50, y: 15 }, // 0: Root
  { x: 25, y: 50 }, // 1: Left Child (0)
  { x: 75, y: 60 }, // 2: Right Child (0)
  { x: 10, y: 85 }, // 3: Left Child (1)
  { x: 40, y: 95 }, // 4: Right Child (1)
  { x: 60, y: 90 }, // 5: Left Child (2)
  { x: 90, y: 105 }, // 6: Right Child (2)
];

const treeEdges = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 2, to: 6 },
];

const Projects = () => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  // Compute shortest path from Root (0) to selected target node
  const getActivePathEdges = (target: number | null) => {
    if (target === null) return new Set<string>();
    const pathEdges = new Set<string>();
    let current = target;
    while (current > 0) {
      const parent = Math.floor((current - 1) / 2);
      pathEdges.add(`${parent}-${current}`);
      current = parent;
    }
    return pathEdges;
  };

  const activePathEdges = getActivePathEdges(selectedNode);

  return (
    <div id='projects' className="relative z-50 my-12 lg:my-24">
      <div className="sticky top-10 z-30">
        <div className="w-[80px] h-[80px] bg-violet-100 rounded-full absolute -top-3 left-0 translate-x-1/2 filter blur-3xl opacity-30"></div>
        <div className="flex items-center justify-start relative">
          <span className="bg-[#1a1443] absolute left-0 w-fit text-white px-5 py-3 text-xl rounded-md shadow-[0_0_20px_rgba(26,20,67,0.5)]">
            PROJECT TREE
          </span>
          <span className="w-full h-[2px] bg-gradient-to-r from-[#1a1443] to-transparent"></span>
        </div>
      </div>

      <div className="pt-24 pb-12 w-full flex justify-center">
        {projectsData.length > 0 ? (
          <div className="w-full overflow-x-auto custom-scrollbar pb-8 px-4">
            <div className={`relative min-w-[800px] w-full max-w-6xl mx-auto border border-dashed border-[#1f223c]/50 rounded-3xl bg-[#0d1224]/30
              ${projectsData.length <= 3 ? 'h-[900px] sm:h-[1100px]' : 
                projectsData.length <= 5 ? 'h-[1200px] sm:h-[1400px]' : 
                'h-[1500px] sm:h-[1700px] lg:h-[1900px]'}`}
            >
              
              {/* SVG Connecting Edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#16f2b3" stopOpacity="0.5" />
                  </linearGradient>
                </defs>
                {treeEdges.map((edge, i) => {
                  const fromPos = treePositions[edge.from];
                  const toPos = treePositions[edge.to];
                  const edgeKey = `${edge.from}-${edge.to}`;
                  const isActive = activePathEdges.has(edgeKey);

                  // Only draw edge if BOTH projects exist in data
                  if (edge.from < projectsData.length && edge.to < projectsData.length) {
                    return (
                      <g key={i}>
                        {/* Background dimmed line */}
                        <line 
                          x1={`${fromPos.x}%`} 
                          y1={`${fromPos.y}%`} 
                          x2={`${toPos.x}%`} 
                          y2={`${toPos.y}%`} 
                          stroke="#1f223c" 
                          strokeWidth="2" 
                          strokeDasharray="6 6"
                        />
                        {/* Active glowing line with marching ants animation */}
                        <line 
                          x1={`${fromPos.x}%`} 
                          y1={`${fromPos.y}%`} 
                          x2={`${toPos.x}%`} 
                          y2={`${toPos.y}%`} 
                          stroke="url(#edge-gradient)" 
                          strokeWidth={isActive ? "5" : "0"} 
                          strokeDasharray="8 8"
                          className="transition-all duration-500 ease-out"
                        >
                          {isActive && (
                            <animate 
                              attributeName="stroke-dashoffset" 
                              from="40" to="0" 
                              dur="0.6s" 
                              repeatCount="indefinite" 
                            />
                          )}
                        </line>
                      </g>
                    );
                  }
                  return null;
                })}
              </svg>

              {/* Circular Project Nodes */}
              {projectsData.slice(0, 7).map((project: Project, index: number) => {
                const pos = treePositions[index];
                if (!pos) return null;
                return (
                  <div 
                    key={index} 
                    className={`absolute transition-all duration-300 ${selectedNode === index ? 'z-40' : 'z-10 hover:z-30'}`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <ProjectCard 
                      project={project} 
                      isSelected={selectedNode === index}
                      onSelect={() => setSelectedNode(selectedNode === index ? null : index)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-400">No projects found on GitHub.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
