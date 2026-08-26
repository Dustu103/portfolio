"use client";

import { personalData } from "@/utils/data/personal-data";
import Image from "next/image";
import dynamic from "next/dynamic";

const SceneWrapper = dynamic(() => import('../../3d/scene-wrapper'), { ssr: false });
const FloatingShapes = dynamic(() => import('../../3d/floating-shapes'), { ssr: false });

function AboutSection() {
  return (
    <div id="about" className="my-12 lg:my-16 relative">
      <div className="hidden lg:flex flex-col items-center absolute top-16 right-4">
        <span className="bg-[#1a1443] w-fit text-white rotate-90 p-2 px-5 text-xl rounded-md">
          ABOUT ME
        </span>
        <span className="h-36 w-[2px] bg-[#1a1443]"></span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        <div className="order-2 lg:order-1">
          <p className="font-medium mb-5 text-[#16f2b3] text-xl uppercase">
            Who I am?
          </p>
          <p className="text-gray-200 text-sm lg:text-lg">
            {personalData.description}
          </p>
        </div>
        <div className="flex justify-center order-1 lg:order-2 relative">
          {/* 3D floating shapes background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <SceneWrapper className="w-full h-full">
              <ambientLight intensity={0.3} />
              <pointLight position={[2, 2, 2]} intensity={0.8} color="#a855f7" />
              <pointLight position={[-2, -1, -2]} intensity={0.4} color="#ec4899" />
              <FloatingShapes count={10} />
            </SceneWrapper>
          </div>
          <Image
            src={personalData.profile}
            width={280}
            height={280}
            alt={personalData.name}
            className="rounded-lg transition-all duration-1000 grayscale hover:grayscale-0 hover:scale-110 cursor-pointer relative z-10"
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  );
}

export default AboutSection;

