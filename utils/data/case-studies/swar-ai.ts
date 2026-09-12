import type { Project } from '@/types/portfolio';

export const swarAiProject: Project = {
  id: 5,
  name: "Swar AI",
  description: "Architected a comprehensive Hybrid-EdTech platform featuring procedural 3D musical notation and advanced user analytics. Built as a monorepo containing a Next.js/React web client, a mobile app, and a robust microservices backend written in Go (auth, api-gateway, library, plan, social).",
  html_url: "https://github.com/Dustu103/swar-ai",
  demo_url: "https://swar-ai-kappa.vercel.app/",
  language: "Go, TypeScript, Next.js, Python, WebGL",
  case_study: {
    architecture: "Swar AI is a monorepo-based Hybrid-EdTech platform consisting of a Next.js web client, a cross-platform mobile application, and a distributed Go microservices backend (Auth, API Gateway, Library, Plan, Social).",
    technical_challenge: "Generating and rendering procedural 3D musical notation in real-time required heavy client-side computation, which initially caused significant frame drops on lower-end mobile devices.",
    solution: "I offloaded the heavy procedural generation algorithms to the Go backend, which streams the pre-calculated 3D vertex data to the client. The Next.js frontend then simply renders the data using WebGL, ensuring a smooth 60FPS experience across all devices."
  }
};
