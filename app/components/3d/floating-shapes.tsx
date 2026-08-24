'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const SKILL_COLORS = ['#a855f7', '#ec4899', '#6366f1', '#22d3ee', '#f59e0b'];

interface FloatingShapesProps {
  count?: number;
}

interface ShapeData {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  phase: number;
}

export default function FloatingShapes({ count = 12 }: FloatingShapesProps) {
  const groupRef = useRef<THREE.Group>(null);

  const shapes = useMemo<ShapeData[]>(() => {
    return Array.from({ length: count }).map((_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 4,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: 0.08 + Math.random() * 0.22,
      color: SKILL_COLORS[i % SKILL_COLORS.length],
      speed: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }));
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      const data = shapes[i];
      child.rotation.x = data.rotation[0] + t * data.speed * 0.4;
      child.rotation.y = data.rotation[1] + t * data.speed * 0.3;
      child.position.y = data.position[1] + Math.sin(t * data.speed + data.phase) * 0.25;
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position} scale={shape.scale}>
          {i % 3 === 0 ? (
            <octahedronGeometry args={[1]} />
          ) : i % 3 === 1 ? (
            <tetrahedronGeometry args={[1]} />
          ) : (
            <icosahedronGeometry args={[1]} />
          )}
          <meshStandardMaterial
            color={shape.color}
            transparent
            opacity={0.55}
            wireframe={i % 2 === 0}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}
