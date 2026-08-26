'use client';
import React, { useState } from 'react';

import { personalData } from '@/utils/data/personal-data';
import { projectsData } from '@/utils/data/projects-data';
import type { Project } from '@/types/portfolio';
import ProjectCard from './project-card';
import ParticlesBackground from './particles';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

// Asymmetrical Binary Tree Coordinates (Percentages for responsiveness)
// Center of the node will be placed at these coordinates.
const treePositions = [
  { x: 50, y: 16 }, // 0: Root
  { x: 25, y: 40 }, // 1: Left Child (0)
  { x: 75, y: 45 }, // 2: Right Child (0)
  { x: 12, y: 68 }, // 3: Left Child (1)
  { x: 38, y: 86 }, // 4: Right Child (1)
  { x: 62, y: 68 }, // 5: Left Child (2)
  { x: 88, y: 86 }, // 6: Right Child (2)
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
      <div className="hidden lg:flex flex-col items-center absolute top-16 -left-8">
        <span className="bg-[#1a1443] w-fit text-white -rotate-90 p-2 px-5 text-xl rounded-md">
          PROJECTS
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>

      <div className="pt-24 pb-12 w-full flex justify-center">
        {projectsData.length > 0 ? (
          <div className="w-full overflow-x-auto custom-scrollbar pb-8 px-4">
            <div className={`relative min-w-[800px] w-full max-w-6xl mx-auto border border-dashed border-[#1f223c]/50 rounded-3xl bg-[#0d1224]/30
              ${projectsData.length <= 3 ? 'h-[1200px] sm:h-[1400px]' :
                projectsData.length <= 5 ? 'h-[1500px] sm:h-[1800px]' :
                  'h-[1900px] sm:h-[2200px] lg:h-[2400px]'}`}
            >
              <ParticlesBackground />

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
                          stroke="rgba(22, 242, 179, 0.3)"
                          strokeWidth="3"
                          strokeDasharray="8 8"
                        />
                        {/* Active glowing line with marching ants animation */}
                        <line
                          x1={`${fromPos.x}%`}
                          y1={`${fromPos.y}%`}
                          x2={`${toPos.x}%`}
                          y2={`${toPos.y}%`}
                          stroke="url(#edge-gradient)"
                          strokeWidth={isActive ? "6" : "0"}
                          strokeDasharray="12 12"
                          className="transition-all duration-500 ease-out"
                        >
                          {isActive && (
                            <animate
                              attributeName="stroke-dashoffset"
                              from="48" to="0"
                              dur="0.8s"
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
