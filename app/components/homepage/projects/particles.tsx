'use client';
import React, { useEffect, useRef } from 'react';

const HEART_COLORS = [
  '#ef4444', // red-500
  '#f43f5e', // rose-500
  '#ec4899', // pink-500
  '#d946ef', // fuchsia-500
  '#3b82f6', // blue-500
  '#60a5fa', // blue-400
  '#ffffff', // white
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
    this.color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
    
    if (type === 'float') {
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = -Math.random() * 0.5 - 0.1;
      this.maxLife = Math.random() * 200 + 100;
      this.size = Math.random() * 3 + 1;
    } else {
      // Heart burst math
      const t = Math.random() * Math.PI * 2;
      // standard heart parametric equations
      const hx = 16 * Math.pow(Math.sin(t), 3);
      const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
      
      // scale down the speed slightly
      const speedScale = Math.random() * 0.15 + 0.05;
      this.vx = hx * speedScale;
      this.vy = hy * speedScale;
      
      this.maxLife = Math.random() * 60 + 40;
      this.size = Math.random() * 6 + 3; // Make them slightly bigger
    }
    this.life = this.maxLife;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    
    if (this.type === 'burst') {
      this.size *= 0.98; // shrink burst particles slightly slower
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    if (this.type === 'burst') {
      const s = Math.max(0.1, this.size);
      // Draw a tiny heart instead of a circle
      ctx.moveTo(this.x, this.y + s);
      ctx.bezierCurveTo(this.x - s * 1.5, this.y - s * 0.5, this.x - s * 0.5, this.y - s * 1.5, this.x, this.y - s * 0.5);
      ctx.bezierCurveTo(this.x + s * 0.5, this.y - s * 1.5, this.x + s * 1.5, this.y - s * 0.5, this.x, this.y + s);
    } else {
      ctx.arc(this.x, this.y, Math.max(0.1, this.size), 0, Math.PI * 2);
    }
    ctx.fillStyle = this.color;
    
    // Fade out based on life
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.globalAlpha = alpha * 0.8; // Keep them bright
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
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x >= 0 && x <= width && y >= 0 && y <= height) {
        spawnHeartBurst(x, y);
      }
    };
    window.addEventListener('click', handleClick);

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
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 mix-blend-screen"
    />
  );
}
