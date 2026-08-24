'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const COLORS = ['#a855f7', '#ec4899', '#6366f1', '#22d3ee', '#f59e0b', '#10b981'];

interface TechOrbitProps {
  count?: number;
}

export default function TechOrbit({ count = 8 }: TechOrbitProps) {
  const groupRef = useRef<THREE.Group>(null);

  const orbs = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const orbitRadius = 1.6 + (i % 3) * 0.6;
      return {
        angle,
        orbitRadius,
        color: COLORS[i % COLORS.length],
        size: 0.06 + Math.random() * 0.1,
        speed: 0.3 + Math.random() * 0.4,
        tilt: (Math.random() - 0.5) * Math.PI * 0.5,
      };
    });
  }, [count]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = t * 0.12;

    groupRef.current.children.forEach((child, i) => {
      const orb = orbs[i];
      const a = orb.angle + t * orb.speed;
      child.position.x = Math.cos(a) * orb.orbitRadius;
      child.position.y = Math.sin(a * 0.5 + orb.tilt) * 0.6;
      child.position.z = Math.sin(a) * orb.orbitRadius;
    });
  });

  return (
    <group>
      {/* Central core */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#a855f7" emissive="#6d28d9" emissiveIntensity={0.6} roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Orbiting nodes */}
      <group ref={groupRef}>
        {orbs.map((orb, i) => (
          <mesh key={i}>
            <sphereGeometry args={[orb.size, 16, 16]} />
            <meshStandardMaterial
              color={orb.color}
              emissive={orb.color}
              emissiveIntensity={0.4}
              roughness={0.2}
              metalness={0.7}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
