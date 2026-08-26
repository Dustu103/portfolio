'use client';
import React, { useState, useEffect } from 'react';

import { personalData } from '@/utils/data/personal-data';
import { projectsData } from '@/utils/data/projects-data';
import type { Project } from '@/types/portfolio';
import ProjectCard from './project-card';
import ProjectModal from './project-modal';
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
  const [sourceNode, setSourceNode] = useState<number | null>(0);
  const [targetNode, setTargetNode] = useState<number | null>(2);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(true);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<Project | null>(null);

  // Auto-play feature: randomly change nodes every 3 seconds
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const intervalId = setInterval(() => {
      const maxNodes = Math.min(projectsData.length, 7);
      if (maxNodes < 2) return;
      
      let newSource = Math.floor(Math.random() * maxNodes);
      let newTarget = Math.floor(Math.random() * maxNodes);
      
      while (newSource === newTarget) {
        newTarget = Math.floor(Math.random() * maxNodes);
      }
      
      setSourceNode(newSource);
      setTargetNode(newTarget);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [isAutoPlay]);

  // Compute shortest path from source to target using BFS (Dijkstra on unweighted graph)
  const getActivePathEdges = (start: number | null, end: number | null) => {
    if (start === null || end === null || start === end) return new Set<string>();
    
    // Build adjacency list
    const adj: Record<number, number[]> = {};
    treeEdges.forEach(edge => {
      if (!adj[edge.from]) adj[edge.from] = [];
      if (!adj[edge.to]) adj[edge.to] = [];
      adj[edge.from].push(edge.to);
      adj[edge.to].push(edge.from);
    });

    // BFS Queue
    const queue: { current: number, path: number[] }[] = [{ current: start, path: [start] }];
    const visited = new Set<number>([start]);

    while (queue.length > 0) {
      const { current, path } = queue.shift()!;
      if (current === end) {
        // Path found! Convert to edge strings formatted as "min-max"
        const edges = new Set<string>();
        for (let i = 0; i < path.length - 1; i++) {
          const a = path[i];
          const b = path[i + 1];
          edges.add(`${Math.min(a, b)}-${Math.max(a, b)}`);
        }
        return edges;
      }

      if (adj[current]) {
        for (const neighbor of adj[current]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push({ current: neighbor, path: [...path, neighbor] });
          }
        }
      }
    }
    return new Set<string>();
  };

  const activePathEdges = getActivePathEdges(sourceNode, targetNode);

  // Store timeout ID to clear it if user clicks again
  const [resumeTimeoutId, setResumeTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleNodeClick = (index: number) => {
    setIsAutoPlay(false); // Stop autoplay on user interaction
    
    // Automatically resume after 10 seconds of inactivity
    if (resumeTimeoutId) clearTimeout(resumeTimeoutId);
    const timeoutId = setTimeout(() => {
      setIsAutoPlay(true);
    }, 10000);
    setResumeTimeoutId(timeoutId);

    if (sourceNode === index) {
      // Deselect source
      setSourceNode(null);
      if (targetNode !== null) {
        setSourceNode(targetNode);
        setTargetNode(null);
      }
    } else if (targetNode === index) {
      // Deselect target
      setTargetNode(null);
    } else if (sourceNode === null) {
      setSourceNode(index);
    } else if (targetNode === null) {
      setTargetNode(index);
    } else {
      // Both set, reset source to new click
      setSourceNode(index);
      setTargetNode(null);
    }
  };

  return (
    <div id='projects' className="relative z-50 my-12 lg:my-24">
      <div className="hidden lg:flex flex-col items-center absolute top-16 left-4">
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
                    className={`absolute transition-all duration-300 ${sourceNode === index || targetNode === index ? 'z-40' : 'z-10 hover:z-30'}`}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <ProjectCard
                      project={project}
                      isSource={sourceNode === index}
                      isTarget={targetNode === index}
                      onSelect={() => handleNodeClick(index)}
                      onReadCaseStudy={() => setSelectedCaseStudy(project)}
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

      {/* Case Study Modal */}
      {selectedCaseStudy && (
        <ProjectModal 
          project={selectedCaseStudy} 
          onClose={() => setSelectedCaseStudy(null)} 
        />
      )}
    </div>
  );
};

export default Projects;

