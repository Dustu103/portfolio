'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaCode, FaRocket, FaTools, FaCheck, FaServer, FaDatabase, FaBolt, FaCloud, FaShieldAlt } from 'react-icons/fa';

const STEPS = [
  {
    num: '01',
    title: 'Architect',
    desc: 'Designing scalable, resilient microservices architectures built for high concurrency and strict sub-50ms latency.',
    Icon: FaTools,
    subIcons: [FaServer, FaDatabase, FaShieldAlt]
  },
  {
    num: '02',
    title: 'Develop',
    desc: 'Writing clean, type-safe code using Go, TypeScript, and modern frameworks to bring the architecture to life.',
    Icon: FaCode,
    subIcons: [FaCheck, FaBolt, FaCloud]
  },
  {
    num: '03',
    title: 'Deploy & Scale',
    desc: 'Automating deployment pipelines and orchestrating containerized environments to handle millions of daily events.',
    Icon: FaRocket,
    subIcons: [FaServer, FaCloud, FaRocket]
  }
];

export default function ProcessSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate scroll progress (0 to 1) based on container position
      // Start progress when container top hits middle of screen
      const start = windowHeight * 0.8;
      const end = rect.height - windowHeight * 0.2;
      
      const scrolled = start - rect.top;
      const rawProgress = scrolled / end;
      
      setScrollProgress(Math.max(0, Math.min(1, rawProgress)));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      id="process" 
      ref={containerRef} 
      className="relative w-full py-32 px-4 lg:px-12 flex flex-col items-center"
    >
      <div className="absolute top-24 flex flex-col items-center">
        <span className="bg-[#1a1443] w-fit text-white p-2 px-5 text-xl rounded-md mb-4 shadow-[0_0_30px_rgba(236,72,153,0.3)]">
          MY PROCESS
        </span>
      </div>

      <div className="relative w-full max-w-5xl mt-32">
        {/* SVG Scroll Path */}
        <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-2 lg:-ml-1 z-0">
          <svg width="100%" height="100%" preserveAspectRatio="none">
            <line 
              x1="50%" y1="0" 
              x2="50%" y2="100%" 
              stroke="#1f223c" 
              strokeWidth="4" 
              strokeDasharray="10 10" 
            />
            <line 
              x1="50%" y1="0" 
              x2="50%" y2={`${scrollProgress * 100}%`} 
              stroke="url(#gradient-line)" 
              strokeWidth="4" 
              className="transition-all duration-200 ease-out"
            />
            <defs>
              <linearGradient id="gradient-line" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16f2b3" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Glowing Dot following progress */}
          <div 
            className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-pink-500 shadow-[0_0_20px_#ec4899] z-10 transition-all duration-200 ease-out flex items-center justify-center"
            style={{ top: `calc(${scrollProgress * 100}% - 12px)` }}
          >
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        </div>

        {/* Step Cards */}
        <div className="flex flex-col gap-32 relative z-10">
          {STEPS.map((step, index) => (
            <StepCard 
              key={index} 
              step={step} 
              index={index} 
              scrollProgress={scrollProgress} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StepCard({ step, index, scrollProgress }: { step: any, index: number, scrollProgress: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger active state when card is at least 40% visible
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          setIsActive(true);
        } else if (!entry.isIntersecting) {
          setIsActive(false);
        }
      },
      { threshold: [0, 0.4, 1], rootMargin: '-10% 0px -20% 0px' }
    );
    
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  // Determine if this step's position matches the global scroll progress line
  // We divide the 100% progress into chunks for each card
  const progressChunk = 1 / STEPS.length;
  const isLinePassing = scrollProgress > (index * progressChunk);

  const isEven = index % 2 === 0;

  return (
    <div 
      ref={cardRef}
      className={`relative flex w-full justify-start lg:justify-between items-center pl-24 lg:pl-0 transition-all duration-1000 ${
        isActive ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-24'
      }`}
    >
      {/* Spacer for desktop alternating layout */}
      <div className={`hidden lg:block w-5/12 ${!isEven ? 'order-3' : 'order-1'}`} />

      {/* Main Card */}
      <div className={`w-full lg:w-5/12 relative group ${isEven ? 'order-1 lg:text-right' : 'order-3 lg:text-left'}`}>
        
        {/* Subtle Background Glow when active */}
        <div className={`absolute inset-0 bg-gradient-to-r from-pink-500/10 to-violet-500/10 blur-xl rounded-3xl transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
        
        <div className={`relative bg-[#11152c]/80 backdrop-blur-md border ${isActive ? 'border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.15)]' : 'border-[#1f223c]'} p-8 rounded-3xl transition-all duration-500 overflow-hidden`}>
          
          <h4 className="text-pink-500 text-xl font-bold tracking-widest mb-2 font-mono">
            STEP {step.num}
          </h4>
          <h3 className="text-3xl font-extrabold text-white mb-4">
            {step.title}
          </h3>
          <p className="text-gray-400 leading-relaxed text-lg mb-8">
            {step.desc}
          </p>

          {/* Internal Icon Flourish */}
          <div className={`relative h-32 w-full flex items-center ${isEven ? 'lg:justify-end justify-center' : 'justify-center lg:justify-start'}`}>
            
            {/* Center Icon */}
            <div className={`relative z-20 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-transform duration-700 ${isActive ? 'scale-110' : 'scale-75 opacity-50'}`}>
              <step.Icon size={32} className="text-white" />
            </div>

            {/* Orbiting Satellite Icons */}
            {step.subIcons.map((SubIcon: any, i: number) => {
              // Calculate radial positions
              const angle = (i * 120 - 90) * (Math.PI / 180);
              const radius = isActive ? 70 : 0; // Expand radius when active
              const x = Math.cos(angle) * radius;
              const y = Math.sin(angle) * radius;

              return (
                <div
                  key={i}
                  className={`absolute z-10 w-10 h-10 rounded-full bg-[#1b2c68] border border-violet-500/30 flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]`}
                  style={{
                    transform: `translate(${x}px, ${y}px) scale(${isActive ? 1 : 0})`,
                    opacity: isActive ? 1 : 0,
                    transitionDelay: `${isActive ? i * 150 : 0}ms`,
                  }}
                >
                  <SubIcon size={16} className="text-[#16f2b3]" />
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
