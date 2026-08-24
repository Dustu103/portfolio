'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

interface SceneWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function SceneWrapper({ children, className = '' }: SceneWrapperProps) {
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
