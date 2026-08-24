'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';

interface SceneWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function SceneWrapper({ children, className = '' }: SceneWrapperProps) {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsSupported(!!gl);
    } catch (e) {
      setIsSupported(false);
    }
  }, []);

  // Avoid hydration mismatch by waiting for client-side check
  if (isSupported === null) {
    return <div className={className}></div>;
  }

  // Graceful degradation if WebGL is disabled
  if (!isSupported) {
    return (
      <div className={`flex flex-col items-center justify-center text-center p-4 text-gray-500 text-xs border border-dashed border-[#1f223c] rounded-full bg-[#0d1224] ${className}`}>
        <span>3D Ecosystem Unavailable</span>
        <span className="opacity-60 mt-1">(WebGL Disabled in Browser)</span>
      </div>
    );
  }

  return (
    <Canvas
      className={className}
      camera={{ position: [0, 0, 5], fov: 60 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        {children}
      </Suspense>
    </Canvas>
  );
}
