'use client';

import { Points, PointMaterial } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface ParticleSphereProps {
  count?: number;
  radius?: number;
}

function generateSpherePoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * (0.7 + Math.random() * 0.3);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

export default function ParticleSphere({ count = 2500, radius = 2.2 }: ParticleSphereProps) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => generateSpherePoints(count, radius), [count, radius]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    ref.current.rotation.y = t * 0.09;
    ref.current.rotation.x = Math.sin(t * 0.05) * 0.2;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#a855f7"
        size={0.022}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.75}
      />
    </Points>
  );
}
