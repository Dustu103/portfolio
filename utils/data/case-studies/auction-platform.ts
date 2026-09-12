import type { Project } from '@/types/portfolio';

export const auctionPlatformProject: Project = {
  id: 7,
  name: "Auction Platform",
  description: "Engineered a scalable real-time auction platform featuring live bidding, user authentication, and automated auction lifecycle management. Built with a high-performance backend to handle concurrent bid streams with minimal latency.",
  html_url: "https://github.com/Dustu103/auction_platform",
  demo_url: "",
  image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2070&auto=format&fit=crop",
  language: "Node.js, React, WebSocket, Redis",
  case_study: {
    architecture: "A real-time auction platform powered by a Node.js backend and a React frontend. The system relies entirely on WebSockets for bi-directional communication to broadcast live bids to all connected clients instantly.",
    technical_challenge: "Handling concurrent bids on the same item at the exact same millisecond caused race conditions in the database, occasionally allowing a lower bid to overwrite a higher one.",
    solution: "I implemented a strict pessimistic locking mechanism on the database row for the active auction item, coupled with an in-memory Redis queue for incoming bids. This serialized the bid processing pipeline, guaranteeing absolute bid integrity while maintaining real-time broadcast speeds."
  }
};
