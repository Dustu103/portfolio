import type { Project } from '@/types/portfolio';

export const connectopiaProject: Project = {
  id: 5,
  name: "Connectopia",
  description: "Spearheaded the end-to-end development of a one-to-one communication web application, integrating user authentication, profile management, and secure messaging features. Designed and deployed a scalable RESTful API using Express, achieving a 30% improvement in data retrieval speed. Implemented a real-time chat feature using WebSocket and Socket.io, enhancing user engagement and reducing response time by 20%.",
  html_url: "https://github.com/Dustu103/Connectopia",
  demo_url: "https://connectopia-mu.vercel.app/",
  language: "React, Express, MongoDB, Socket.io",
  case_study: {
    architecture: "Connectopia is a modern MERN stack application (MongoDB, Express, React, Node.js) featuring real-time WebSockets via Socket.io. The architecture is designed around strict End-to-End Encryption (E2EE), meaning the server acts purely as a blind relayer of encrypted payloads between clients, storing no plaintext data.",
    technical_challenge: "Users needed a collaborative 'Shared Canvas' (a persistent scratchpad for links and notes) that stayed in sync for all chat participants in real-time. The massive challenge was maintaining this real-time synchronization across devices while strictly preserving the existing End-to-End Encryption model without exposing canvas data to the server.",
    solution: "I decoupled the canvas state from the database and treated canvas updates as standard encrypted chat messages. Using Socket.io, when a user edits the canvas, the client encrypts the delta and emits a 'canvas_update' event. The server relays this encrypted payload to the recipient, who decrypts it locally and merges the state. This achieved seamless real-time collaboration while guaranteeing zero-knowledge server privacy."
  }
};
