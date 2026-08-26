'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaCode, FaRocket, FaTools, FaCheck, FaServer, FaDatabase, FaBolt, FaCloud, FaShieldAlt, FaBug, FaSearch, FaTachometerAlt } from 'react-icons/fa';

const STEPS = [
  {
    num: '01',
    title: 'Architecture & Design',
    desc: 'Designing scalable, resilient microservices architectures built for high concurrency, fault tolerance, and strict sub-50ms latency requirements.',
    Icon: FaTools,
    subIcons: [FaServer, FaDatabase, FaShieldAlt]
  },
  {
    num: '02',
    title: 'Develop & Code Review',
    desc: 'Writing clean, type-safe code using Go, TypeScript, and modern frameworks. Enforcing rigorous peer code reviews to maintain high engineering standards.',
    Icon: FaCode,
    subIcons: [FaCheck, FaSearch, FaBolt]
  },
  {
    num: '03',
    title: 'Testing & QA',
    desc: 'Implementing comprehensive unit, integration, and end-to-end testing pipelines to ensure deterministic system behavior and prevent regressions.',
    Icon: FaBug,
    subIcons: [FaCheck, FaShieldAlt, FaSearch]
  },
  {
    num: '04',
    title: 'Load & Latency Testing',
    desc: 'Executing aggressive load testing and latency benchmarking (P99 analysis) to identify bottlenecks and optimize database querying and caching layers.',
    Icon: FaTachometerAlt,
    subIcons: [FaBolt, FaServer, FaDatabase]
  },
  {
    num: '05',
    title: 'Deploy & Monitor',
    desc: 'Automating CI/CD pipelines, orchestrating containerized environments, and implementing real-time observability to handle millions of daily events.',
    Icon: FaRocket,
    subIcons: [FaCloud, FaServer, FaRocket]
  }
];

export default function ProcessSequence() {
  return (
    <div id="process" className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      {/* Top Divider */}
      <div className="flex justify-center -translate-y-[1px]">
        <div className="w-3/4">
          <div className="h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent w-full" />
        </div>
      </div>

      <div className="hidden lg:flex flex-col items-center absolute top-16 right-4">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          ENGINEERING PROCESS
        </span>
        <span className="h-48 w-[2px] bg-[#1a1443]"></span>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-8 relative">
        {/* Decorative background glow behind terminal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-pink-500/10 blur-[100px] -z-10 rounded-full pointer-events-none" />

        {/* Terminal Window Container */}
        <div className="relative z-10 rounded-xl overflow-hidden bg-[#0a0d14]/95 backdrop-blur-xl border border-[#1f223c] shadow-2xl">
          {/* macOS Title Bar */}
          <div className="flex items-center px-4 py-3 bg-[#11152c] border-b border-[#1f223c]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
              <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
            <div className="flex-1 text-center text-xs text-gray-400 font-mono tracking-wider">
              arnab@system: ~/engineering_process
            </div>
          </div>

          {/* Terminal Body */}
          <div className="p-6 lg:p-10 font-mono text-sm lg:text-base flex flex-col gap-10">
            <div className="text-gray-400/80 mb-2 border-b border-[#1f223c] pb-4">
              <p>Last login: {new Date().toDateString()} on ttys001</p>
              <p className="mt-1">System Architecture & Engineering Process Initialized...</p>
              <p className="mt-1 text-pink-500/80">Running in high-concurrency mode.</p>
            </div>

            {STEPS.map((step, index) => (
              <TerminalCommand key={index} step={step} />
            ))}

            {/* Blinking Cursor at the end of the log */}
            <div className="flex items-center gap-2 mt-4 text-[#16f2b3]">
              <span className="hidden sm:inline">arnab@system:~/engineering_process$</span>
              <span className="sm:hidden">arnab@system:~$</span>
              <span className="w-2.5 h-5 bg-[#16f2b3] animate-pulse shadow-[0_0_8px_#16f2b3]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TerminalCommand({ step }: { step: any }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [typedCommand, setTypedCommand] = useState('');
  
  const command = `./execute_phase --id=${step.num}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger typing when the component scrolls into view
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '-10% 0px -10% 0px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) {
      let currentLength = 0;
      const interval = setInterval(() => {
        if (currentLength <= command.length) {
          setTypedCommand(command.slice(0, currentLength));
          currentLength++;
        } else {
          clearInterval(interval);
        }
      }, 40); // Fast typing speed mimicking a power user
      
      return () => clearInterval(interval);
    }
  }, [isVisible, command]);

  const isComplete = typedCommand === command;

  return (
    <div ref={containerRef} className="flex flex-col gap-3">
      {/* Terminal Prompt & Typing Command */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[#16f2b3] hidden sm:inline">arnab@system:~/engineering_process$</span>
        <span className="text-[#16f2b3] sm:hidden">arnab@system:~$</span>
        <span className="text-white font-semibold">{typedCommand}</span>
        {isVisible && !isComplete && <span className="w-2.5 h-5 bg-white animate-pulse" />}
      </div>

      {/* Command Output (Fades in smoothly after typing completes) */}
      <div 
        className={`pl-4 border-l-2 border-[#1f223c]/50 transition-all duration-700 ease-in-out overflow-hidden flex flex-col gap-4
        ${isComplete ? 'max-h-[500px] opacity-100 mt-2 py-2' : 'max-h-0 opacity-0'}`}
      >
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-lg bg-[#11152c] border border-[#1f223c] flex items-center justify-center">
             <step.Icon size={20} className="text-pink-500" />
           </div>
           <h3 className="text-xl font-bold text-[#e6e6e6] tracking-wide uppercase">
             [{step.title}]
           </h3>
        </div>
        
        <p className="text-gray-400 leading-relaxed max-w-2xl text-sm sm:text-base">
          {step.desc}
        </p>

        {/* System Status Logs */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-2 text-xs sm:text-sm font-semibold tracking-wider">
          <span className="flex items-center gap-2 text-[#16f2b3]">
            <FaCheck size={12} /> EXECUTION SUCCESS
          </span>
          <span className="flex items-center gap-2 text-pink-500">
            <FaBolt size={12} /> LATENCY &lt; 50ms
          </span>
        </div>
      </div>
    </div>
  );
}
