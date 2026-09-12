import type { Project } from '@/types/portfolio';

export const proyodhaProject: Project = {
  id: 1,
  name: "ProYodha",
  description: "Architected an event-driven esports platform and career marketplace. Engineered a decoupled Go and AWS (SQS/SNS) microservices backend processing 100,000+ daily events and handling 10,000+ concurrent connections with strictly <50ms latency.",
  demo_url: "https://www.proyodha.com/landing",
  language: "Go, TypeScript, Dart",
  case_study: {
    architecture: "ProYodha is built on an event-driven microservices architecture using Go and AWS. The system is fully decoupled, utilizing Amazon SQS and SNS for asynchronous event processing between services such as Authentication, Tournament Matchmaking, and Leaderboards. The data layer employs PostgreSQL for persistent state and Redis for high-speed caching.",
    technical_challenge: "The primary challenge was ensuring sub-50ms latency for the live tournament matchmaking and leaderboard updates during peak usage hours when thousands of concurrent users were submitting match results simultaneously, which historically caused database deadlocks.",
    solution: "I implemented a Write-Behind caching strategy using Redis. Instead of directly writing every match result to PostgreSQL, results are instantly written to a Redis sorted set (for the leaderboard) and placed onto an SQS queue. A dedicated Go worker service consumes this queue to batch-update the PostgreSQL database asynchronously, entirely eliminating database deadlocks and keeping API latency strictly under 50ms."
  }
};
