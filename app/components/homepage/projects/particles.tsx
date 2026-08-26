'use client';
import React, { useEffect, useRef } from 'react';

const BLUE_SHADES = [
  '#60a5fa', // blue-400
  '#2563eb', // blue-600
  '#1d4ed8', // blue-700
];

class Particle {
  x: number;
  y: number;
  type: 'float' | 'burst';
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;

  constructor(x: number, y: number, type: 'float' | 'burst') {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = BLUE_SHADES[Math.floor(Math.random() * BLUE_SHADES.length)];
    
    if (type === 'float') {
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = -Math.random() * 0.5 - 0.1;
      this.maxLife = Math.random() * 200 + 100;
      this.size = Math.random() * 3 + 1;
    } else {
      // Heart burst math approximation or general radial burst
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.maxLife = Math.random() * 40 + 20;
      this.size = Math.random() * 4 + 2;
    }
    this.life = this.maxLife;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    
    if (this.type === 'burst') {
      this.size *= 0.95; // shrink burst particles
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    
    // Fade out based on life
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.globalAlpha = alpha * 0.6; // Keep them slightly transparent
    ctx.fill();
    ctx.globalAlpha = 1.0;
  }
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;

    let floatParticles: Particle[] = [];
    let burstParticles: Particle[] = [];
    const FLOAT_COUNT = 140;

    // Initialize float particles
    for (let i = 0; i < FLOAT_COUNT; i++) {
      const p = new Particle(Math.random() * width, Math.random() * height, 'float');
      p.life = Math.random() * p.maxLife; // stagger starting life
      floatParticles.push(p);
    }

    const spawnHeartBurst = (x: number, y: number) => {
      const count = 140;
      for (let i = 0; i < count; i++) {
        burstParticles.push(new Particle(x, y, 'burst'));
      }
    };

    // Add a click listener to spawn burst particles
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      spawnHeartBurst(e.clientX - rect.left, e.clientY - rect.top);
    };
    canvas.addEventListener('click', handleClick);

    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw float particles
      for (let i = floatParticles.length - 1; i >= 0; i--) {
        const p = floatParticles[i];
        p.update();
        p.draw(ctx);

        if (p.life <= 0 || p.y < 0) {
          // Respawn at bottom
          floatParticles[i] = new Particle(Math.random() * width, height + 10, 'float');
        }
      }

      // Update and draw burst particles
      for (let i = burstParticles.length - 1; i >= 0; i--) {
        const p = burstParticles[i];
        p.update();
        p.draw(ctx);
        if (p.life <= 0) {
          burstParticles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 opacity-40 mix-blend-screen"
    />
  );
}
