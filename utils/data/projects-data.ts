import type { Project } from '@/types/portfolio';

export const projectsData: Project[] = [
  {
    id: 1,
    name: "ProYodha",
    description: "Architected an event-driven esports platform and career marketplace. Engineered a decoupled Go and AWS (SQS/SNS) microservices backend processing 100,000+ daily events and handling 10,000+ concurrent connections with strictly <50ms latency.",
    demo_url: "https://www.proyodha.com/landing", 
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop",
    language: "Go, TypeScript, Dart",
    case_study: {
      architecture: "ProYodha is built on an event-driven microservices architecture using Go and AWS. The system is fully decoupled, utilizing Amazon SQS and SNS for asynchronous event processing between services such as Authentication, Tournament Matchmaking, and Leaderboards. The data layer employs PostgreSQL for persistent state and Redis for high-speed caching.",
      technical_challenge: "The primary challenge was ensuring sub-50ms latency for the live tournament matchmaking and leaderboard updates during peak usage hours when thousands of concurrent users were submitting match results simultaneously, which historically caused database deadlocks.",
      solution: "I implemented a Write-Behind caching strategy using Redis. Instead of directly writing every match result to PostgreSQL, results are instantly written to a Redis sorted set (for the leaderboard) and placed onto an SQS queue. A dedicated Go worker service consumes this queue to batch-update the PostgreSQL database asynchronously, entirely eliminating database deadlocks and keeping API latency strictly under 50ms."
    }
  },
  {
    id: 2,
    name: "Connectopia",
    description: "Spearheaded the end-to-end development of a one-to-one communication web application, integrating user authentication, profile management, and secure messaging features. Designed and deployed a scalable RESTful API using Express, achieving a 30% improvement in data retrieval speed. Implemented a real-time chat feature using WebSocket and Socket.io, enhancing user engagement and reducing response time by 20%.",
    html_url: "https://github.com/Dustu103/Connectopia",
    demo_url: "#",
    language: "React, Express, MongoDB",
    case_study: {
      architecture: "Connectopia is a modern MERN stack application (MongoDB, Express, React, Node.js) featuring real-time WebSockets via Socket.io. The architecture is designed around strict End-to-End Encryption (E2EE), meaning the server acts purely as a blind relayer of encrypted payloads between clients, storing no plaintext data.",
      technical_challenge: "Users needed a collaborative 'Shared Canvas' (a persistent scratchpad for links and notes) that stayed in sync for all chat participants in real-time. The massive challenge was maintaining this real-time synchronization across devices while strictly preserving the existing End-to-End Encryption model without exposing canvas data to the server.",
      solution: "I decoupled the canvas state from the database and treated canvas updates as standard encrypted chat messages. Using Socket.io, when a user edits the canvas, the client encrypts the delta and emits a 'canvas_update' event. The server relays this encrypted payload to the recipient, who decrypts it locally and merges the state. This achieved seamless real-time collaboration while guaranteeing zero-knowledge server privacy."
    }
  },
  {
    id: 3,
    name: "Swar AI",
    description: "Architected a comprehensive Hybrid-EdTech platform featuring procedural 3D musical notation and advanced user analytics. Built as a monorepo containing a Next.js/React web client, a mobile app, and a robust microservices backend written in Go (auth, api-gateway, library, plan, social).",
    html_url: "https://github.com/Dustu103/swar-ai",
    demo_url: "https://swar-ai-kappa.vercel.app/",
    language: "Go, TypeScript, Next.js, Python",
    case_study: {
      architecture: "Swar AI is a monorepo-based Hybrid-EdTech platform consisting of a Next.js web client, a cross-platform mobile application, and a distributed Go microservices backend (Auth, API Gateway, Library, Plan, Social).",
      technical_challenge: "Generating and rendering procedural 3D musical notation in real-time required heavy client-side computation, which initially caused significant frame drops on lower-end mobile devices.",
      solution: "I offloaded the heavy procedural generation algorithms to the Go backend, which streams the pre-calculated 3D vertex data to the client. The Next.js frontend then simply renders the data using WebGL, ensuring a smooth 60FPS experience across all devices."
    }
  },
  {
    id: 4,
    name: "FocusGuard",
    description: "Developed a robust Android parental control application enforcing daily app usage limits and remote device pairing. Implemented a secure 6-digit synchronization backend allowing parents to remotely monitor installations and block specific applications.",
    html_url: "https://github.com/Dustu103/focusguard",
    demo_url: "#",
    language: "Java, Kotlin, Firebase",
    case_study: {
      architecture: "FocusGuard is a native Android application paired with a real-time Firebase backend. It features a master-slave architecture where the parent's device acts as the controller, sending remote commands via Firebase Cloud Messaging to a background service on the child's device.",
      technical_challenge: "Reliably enforcing app usage limits and blocking apps in the background is notoriously difficult on modern Android versions due to strict battery optimization and background execution limits (Doze mode).",
      solution: "I engineered a resilient background enforcement engine using Android's AccessibilityService API combined with a Foreground Service. This ensures the monitoring thread cannot be easily killed by the OS, allowing it to instantly detect when a restricted app is launched and draw a system-level overlay to block access."
    }
  },
  {
    id: 5,
    name: "Auction Platform",
    description: "Engineered a scalable real-time auction platform featuring live bidding, user authentication, and automated auction lifecycle management. Built with a high-performance backend to handle concurrent bid streams with minimal latency.",
    html_url: "https://github.com/Dustu103/auction_platform",
    demo_url: "#",
    language: "Node.js, React, WebSocket",
    case_study: {
      architecture: "A real-time auction platform powered by a Node.js backend and a React frontend. The system relies entirely on WebSockets for bi-directional communication to broadcast live bids to all connected clients instantly.",
      technical_challenge: "Handling concurrent bids on the same item at the exact same millisecond caused race conditions in the database, occasionally allowing a lower bid to overwrite a higher one.",
      solution: "I implemented a strict pessimistic locking mechanism on the database row for the active auction item, coupled with an in-memory Redis queue for incoming bids. This serialized the bid processing pipeline, guaranteeing absolute bid integrity while maintaining real-time broadcast speeds."
    }
  }
];
