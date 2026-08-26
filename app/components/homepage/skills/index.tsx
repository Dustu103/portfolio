"use client";

import React, { useState, useEffect } from 'react';
import { skillsData } from "@/utils/data/skills";
import { skillsImage } from "@/utils/skill-image";
import Image from "next/image";

function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  
  // State for sequential animation sequence
  const [activeInput, setActiveInput] = useState<number | null>(null);
  const [activeOutput, setActiveOutput] = useState<number | null>(null);
  const [coreProcessing, setCoreProcessing] = useState(false);

  const half = Math.ceil(skillsData.length / 2);
  const encoderSkills = skillsData.slice(0, half);
  const decoderSkills = skillsData.slice(half);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const coreRef = React.useRef<HTMLDivElement>(null);
  const encoderRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const decoderRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const [lines, setLines] = useState<{
    encoder: { x1: number; y1: number; x2: number; y2: number }[];
    decoder: { x1: number; y1: number; x2: number; y2: number }[];
  }>({
    // Pre-populate with default zeroed positions so the lines at least exist in the DOM
    encoder: encoderSkills.map(() => ({ x1: 0, y1: 0, x2: 0, y2: 0 })),
    decoder: decoderSkills.map(() => ({ x1: 0, y1: 0, x2: 0, y2: 0 }))
  });

  useEffect(() => {
    const updateLines = () => {
      if (!containerRef.current || !coreRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const coreRect = coreRef.current.getBoundingClientRect();
      
      if (coreRect.width === 0) return; // Hidden on mobile

      const coreCenterX = coreRect.left + coreRect.width / 2 - containerRect.left;
      const coreCenterY = coreRect.top + coreRect.height / 2 - containerRect.top;

      const newEncoderLines = encoderSkills.map((_, i) => {
        const el = encoderRefs.current[i];
        if (!el) return { x1: 0, y1: 0, x2: coreCenterX, y2: coreCenterY };
        const rect = el.getBoundingClientRect();
        return {
          x1: rect.right - containerRect.left,
          y1: rect.top + rect.height / 2 - containerRect.top,
          x2: coreRect.left - containerRect.left + 10,
          y2: coreCenterY
        };
      });

      const newDecoderLines = decoderSkills.map((_, i) => {
        const el = decoderRefs.current[i];
        if (!el) return { x1: 0, y1: 0, x2: coreCenterX, y2: coreCenterY };
        const rect = el.getBoundingClientRect();
        return {
          x1: coreRect.right - containerRect.left - 10,
          y1: coreCenterY,
          x2: rect.left - containerRect.left,
          y2: rect.top + rect.height / 2 - containerRect.top
        };
      });

      setLines({ encoder: newEncoderLines, decoder: newDecoderLines });
    };

    updateLines();
    
    // Force updates to catch any late layout shifts (fonts, images loading)
    const t1 = setTimeout(updateLines, 100);
    const t2 = setTimeout(updateLines, 500);
    const t3 = setTimeout(updateLines, 1000);
    
    window.addEventListener('resize', updateLines);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('resize', updateLines);
    };
  }, [encoderSkills.length, decoderSkills.length]);

  useEffect(() => {
    // If user is interacting, pause the automatic sequence
    if (hoveredSkill) {
      setActiveInput(null);
      setActiveOutput(null);
      setCoreProcessing(false);
      return;
    }

    const runSequence = () => {
      // 1. Trigger random input from Encoder
      const inIndex = Math.floor(Math.random() * encoderSkills.length);
      setActiveInput(inIndex);
      
      // 2. Wait for it to reach core (1 second travel time)
      setTimeout(() => {
        setActiveInput(null);
        setCoreProcessing(true); // Core flashes
        
        // 3. Core processes data for 500ms
        setTimeout(() => {
          setCoreProcessing(false);
          
          // 4. Generate random output to Decoder
          const outIndex = Math.floor(Math.random() * decoderSkills.length);
          setActiveOutput(outIndex);
          
          // 5. Output finishes traveling after 1 second
          setTimeout(() => {
            setActiveOutput(null);
          }, 1000);
          
        }, 500);
        
      }, 1000);
    };

    // Run first sequence immediately, then loop every 3 seconds
    runSequence();
    const interval = setInterval(runSequence, 3000);
    return () => clearInterval(interval);
  }, [hoveredSkill, encoderSkills.length, decoderSkills.length]);

  return (
    <div id="skills" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b] overflow-hidden pb-12">
      {/* Background glow */}
      <div className="w-[300px] h-[300px] bg-pink-500/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 filter blur-[100px] pointer-events-none -z-10"></div>

      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center absolute top-16 right-4">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          SKILLS
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>

      <div ref={containerRef} className="relative max-w-6xl mx-auto px-4 mt-8 lg:mt-16 flex flex-col lg:flex-row gap-8 lg:gap-0 items-center justify-between">
        
        {/* SVG Attention Matrix Connections (Desktop) */}
        <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
          <svg width="100%" height="100%" className="opacity-70">
             {/* Lines connecting Encoder to Attention Core */}
             {lines.encoder.map((pos, i) => {
                const isHovered = hoveredSkill && encoderSkills.includes(hoveredSkill as any);
                const isSeqActive = activeInput === i && !hoveredSkill;
                
                return (
                  <g key={`enc-line-${i}`}>
                    {/* Background Connection Line */}
                    <line 
                      x1={pos.x1} y1={pos.y1}
                      x2={pos.x2} y2={pos.y2}
                      stroke={isHovered || isSeqActive ? "#ec4899" : "#1f223c"}
                      strokeWidth={isHovered || isSeqActive ? "3" : "1"}
                      className="transition-all duration-300"
                    />
                    
                    {/* Sequential Data Packet (Auto) */}
                    {isSeqActive && (
                      <circle r="4" fill="#ec4899" className="shadow-[0_0_15px_#ec4899]">
                        <animate attributeName="cx" values={`${pos.x1};${pos.x2}`} dur="1s" fill="freeze" />
                        <animate attributeName="cy" values={`${pos.y1};${pos.y2}`} dur="1s" fill="freeze" />
                        <animate attributeName="opacity" values="0;1;1;0" dur="1s" fill="freeze" />
                      </circle>
                    )}
                    
                    {/* Continuous Data Packet (On Hover) */}
                    {isHovered && (
                      <circle r="4" fill="#ec4899" className="shadow-[0_0_10px_#ec4899]">
                        <animate attributeName="cx" values={`${pos.x1};${pos.x2}`} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="cy" values={`${pos.y1};${pos.y2}`} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0;1;1;0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                )
             })}
             
             {/* Lines connecting Attention Core to Decoder */}
             {lines.decoder.map((pos, i) => {
                const isHovered = hoveredSkill && decoderSkills.includes(hoveredSkill as any);
                const isSeqActive = activeOutput === i && !hoveredSkill;
                
                return (
                  <g key={`dec-line-${i}`}>
                    {/* Background Connection Line */}
                    <line 
                      x1={pos.x1} y1={pos.y1}
                      x2={pos.x2} y2={pos.y2}
                      stroke={isHovered || isSeqActive ? "#16f2b3" : "#1f223c"}
                      strokeWidth={isHovered || isSeqActive ? "3" : "1"}
                      className="transition-all duration-300"
                    />
                    
                    {/* Sequential Data Packet (Auto) */}
                    {isSeqActive && (
                      <circle r="4" fill="#16f2b3" className="shadow-[0_0_15px_#16f2b3]">
                        <animate attributeName="cx" values={`${pos.x1};${pos.x2}`} dur="1s" fill="freeze" />
                        <animate attributeName="cy" values={`${pos.y1};${pos.y2}`} dur="1s" fill="freeze" />
                        <animate attributeName="opacity" values="0;1;1;0" dur="1s" fill="freeze" />
                      </circle>
                    )}
                    
                    {/* Continuous Data Packet (On Hover) */}
                    {isHovered && (
                      <circle r="4" fill="#16f2b3" className="shadow-[0_0_10px_#16f2b3]">
                        <animate attributeName="cx" values={`${pos.x1};${pos.x2}`} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="cy" values={`${pos.y1};${pos.y2}`} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0;1;1;0" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                )
             })}
          </svg>
        </div>

        {/* ENCODER BLOCK */}
        <div className="relative z-10 w-full lg:w-1/3 group">
           <div className="flex justify-between items-center mb-6 border-b border-pink-500/20 pb-2 px-2">
             <h3 className="text-pink-500 font-mono text-xl font-bold flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
               [ENCODER_LAYER]
             </h3>
             <span className="text-xs text-gray-500 font-mono hidden sm:block">Input Embeddings</span>
           </div>
           <div className="flex flex-col gap-3">
             {encoderSkills.map((skill, i) => (
               <SkillChip 
                 key={`enc-${i}`} 
                 innerRef={(el) => { encoderRefs.current[i] = el; }}
                 skill={skill} 
                 isHovered={hoveredSkill === skill}
                 onHover={() => setHoveredSkill(skill)}
                 onLeave={() => setHoveredSkill(null)}
                 color="pink"
               />
             ))}
           </div>
        </div>

        {/* MULTI-HEAD ATTENTION CORE */}
        <div ref={coreRef}
          className={`relative z-10 hidden lg:flex w-64 h-64 rounded-full border-4 border-dashed items-center justify-center transition-all duration-300 cursor-crosshair group hover:border-[#16f2b3]
          ${coreProcessing ? 'border-[#ec4899] scale-110' : 'border-[#1f223c] scale-100'}`}
          style={{ animation: 'spin 20s linear infinite' }}
        >
           {/* Reverse spinning inner container to keep text upright */}
           <div 
             className="absolute inset-0 flex items-center justify-center"
             style={{ animation: 'spin 20s linear infinite reverse' }}
           >
             <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-300 
               ${hoveredSkill ? 'opacity-60 bg-gradient-to-r from-pink-500 to-[#16f2b3]' : 
                 coreProcessing ? 'opacity-80 bg-pink-500' : 'opacity-20 bg-[#16f2b3]/20 animate-pulse'}`} />
             
             <div className={`relative w-32 h-32 rounded-full flex flex-col items-center justify-center z-20 overflow-hidden transition-all duration-300
               ${coreProcessing ? 'bg-pink-900/50 border-4 border-pink-500 shadow-[0_0_50px_rgba(236,72,153,0.8)]' : 'bg-[#11152c] border-2 border-[#16f2b3] shadow-[0_0_40px_rgba(22,242,179,0.4)]'}`}>
               {/* Scanning line effect */}
               <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-transparent -translate-y-full animate-pulse
                 ${coreProcessing ? 'via-pink-500/40' : 'via-[#16f2b3]/20'}`} />
               <span className="text-white font-bold tracking-widest text-sm text-center">MULTI-HEAD</span>
               <span className={`font-mono text-xs mt-1 transition-colors ${coreProcessing ? 'text-pink-400 font-bold' : 'text-[#16f2b3]'}`}>ATTENTION</span>
             </div>
           </div>
        </div>

        {/* DECODER BLOCK */}
        <div className="relative z-10 w-full lg:w-1/3 group">
           <div className="flex justify-between items-center mb-6 border-b border-[#16f2b3]/20 pb-2 px-2">
             <h3 className="text-[#16f2b3] font-mono text-xl font-bold flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-[#16f2b3] animate-pulse"></span>
               [DECODER_LAYER]
             </h3>
             <span className="text-xs text-gray-500 font-mono hidden sm:block">Output Probabilities</span>
           </div>
           <div className="flex flex-col gap-3">
             {decoderSkills.map((skill, i) => (
               <SkillChip 
                 key={`dec-${i}`} 
                 innerRef={(el) => { decoderRefs.current[i] = el; }}
                 skill={skill} 
                 isHovered={hoveredSkill === skill}
                 onHover={() => setHoveredSkill(skill)}
                 onLeave={() => setHoveredSkill(null)}
                 color="green"
               />
             ))}
           </div>
        </div>

      </div>
    </div>
  );
}

function SkillChip({ skill, isHovered, onHover, onLeave, color, innerRef }: { skill: string, isHovered: boolean, onHover: () => void, onLeave: () => void, color: 'pink' | 'green', innerRef?: (el: HTMLDivElement | null) => void }) {
  const borderColor = color === 'pink' ? 'border-pink-500' : 'border-[#16f2b3]';
  const textColor = color === 'pink' ? 'text-pink-400' : 'text-[#16f2b3]';
  const shadowColor = color === 'pink' ? 'rgba(236,72,153,0.5)' : 'rgba(22,242,179,0.5)';
  
  return (
    <div 
      ref={innerRef}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`flex items-center gap-4 p-2.5 rounded-lg border bg-[#11152c] transition-all duration-300 cursor-pointer
      ${isHovered ? `${borderColor} shadow-[0_0_20px_${shadowColor}] scale-110 z-20` : 'border-[#1f223c] hover:border-gray-500 z-10'}`}
    >
      <div className="w-8 h-8 flex-shrink-0 bg-white/5 rounded p-1">
         <Image src={skillsImage(skill)?.src} alt={skill} width={32} height={32} className="w-full h-full object-contain" />
      </div>
      <span className={`font-mono text-sm sm:text-base ${isHovered ? 'text-white font-bold' : 'text-gray-300'}`}>{skill}</span>
      
      {/* Fake Vector Embedding Array */}
      <span className={`ml-auto text-xs font-mono hidden sm:block ${isHovered ? textColor : 'text-gray-600'}`}>
        [{(skill.length * 0.13 % 1).toFixed(2)}, {((skill.charCodeAt(0) * 0.07) % 1).toFixed(2)}]
      </span>
    </div>
  );
}

export default Skills;

