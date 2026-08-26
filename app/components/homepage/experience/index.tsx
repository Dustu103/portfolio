'use client';
import { experiences } from "@/utils/data/experience";
import Image from "next/image";
import { BsPersonWorkspace } from "react-icons/bs";
import experienceLottie from '../../../assets/lottie/code.json';
import AnimationLottie from "../../helper/animation-lottie";
import GlowCard from "../../helper/glow-card";
import { useEffect, useRef, useState } from "react";

function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      const start = windowHeight * 0.8;
      const end = rect.height;
      const scrolled = start - rect.top;
      
      setScrollProgress(Math.max(0, Math.min(1, scrolled / end)));
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div id="experience" ref={containerRef} className="relative z-50 border-t my-12 lg:my-24 border-[#25213b]">
      <Image
        src="/section.svg"
        alt="Section background"
        width={1572}
        height={795}
        className="absolute top-0 -z-10"
        priority
      />

      <div className="hidden lg:flex flex-col items-center absolute top-16 left-4">
        <span className="bg-[#1a1443] w-fit text-white -rotate-90 p-2 px-5 text-xl rounded-md">
          EXPERIENCES
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>

      <div className="py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="flex justify-center items-start">
            <div className="w-full h-full sticky top-32">
              <AnimationLottie animationPath={experienceLottie} />
            </div>
          </div>

          <div className="relative">
            {/* Timeline Rail */}
            <div className="absolute left-[11px] top-8 bottom-12 w-[2px] bg-[#1f223c] z-0">
              {/* Active Gradient Scroll Line */}
              <div 
                className="w-full bg-gradient-to-b from-teal-400 via-blue-500 to-purple-600 transition-all duration-200 ease-out"
                style={{ height: `${scrollProgress * 100}%` }}
              />
            </div>

            <div className="flex flex-col gap-12 relative z-10 pl-12 lg:pl-16">
              {experiences.map((exp, index) => {
                const cardProgressThreshold = (index + 0.3) / experiences.length;
                const isPassed = scrollProgress > cardProgressThreshold;
                
                return (
                  <div key={exp.id} className="relative flex items-start gap-8">
                    
                    {/* Timeline Dot */}
                    <div className="absolute -left-12 lg:-left-16 flex flex-col items-center mt-6 shrink-0 z-20">
                      <div className={`w-6 h-6 rounded-full border-4 border-[#11152c] shadow-lg flex items-center justify-center transition-all duration-500 ${isPassed ? 'bg-pink-500 scale-125 shadow-[0_0_15px_#ec4899]' : 'bg-[#1f223c] scale-100'}`}>
                         <div className={`w-2 h-2 rounded-full transition-all duration-500 ${isPassed ? 'bg-white' : 'bg-transparent'}`} />
                      </div>
                    </div>

                    <div className="flex-grow w-full">
                      <GlowCard identifier={`experience-${exp.id}`}>
                        <div className="p-6 relative">
                          <Image
                            src="/blur-23.svg"
                            alt="Background blur"
                            width={1080}
                            height={200}
                            className="absolute bottom-0 opacity-80 pointer-events-none"
                          />
                          <div className="flex justify-between items-center mb-5">
                            <p className="text-xs sm:text-sm text-[#16f2b3] font-semibold tracking-wider bg-[#11152c]/50 px-3 py-1.5 rounded-full border border-[#1f223c]">
                              {exp.duration}
                            </p>
                          </div>
                          
                          <div className="flex items-start gap-x-5">
                            <div className="text-violet-500 transition-transform duration-300 hover:scale-110 mt-1 bg-[#0d1224] p-3.5 rounded-xl border border-[#1f223c] shadow-inner shrink-0">
                              <BsPersonWorkspace size={24} />
                            </div>
                            <div className="flex flex-col">
                              <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-[#16f2b3] transition-colors">
                                {exp.title}
                              </h3>
                              <h4 className="text-base sm:text-lg text-pink-500 font-medium mb-4 tracking-wide">
                                @ {exp.company}
                              </h4>
                              
                              {exp.description && (
                                <ul className="flex flex-col gap-3 text-sm sm:text-base text-gray-400">
                                  {exp.description.map((point, i) => (
                                    <li key={i} className="leading-relaxed flex gap-2">
                                      <span className="text-violet-500 mt-1.5 opacity-80 text-[10px]">▶</span>
                                      <span>{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </div>
                      </GlowCard>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Experience;

