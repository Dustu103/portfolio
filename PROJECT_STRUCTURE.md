# Project Structure & Case Study Guide

This document explains how projects and case studies are structured in this portfolio, the exact data fields required, and a step-by-step template so you can easily add new projects in the future.

---

## 1. Project Data Schema

Every project is typed according to the `Project` interface defined in [`types/portfolio.ts`](file:///types/portfolio.ts):

```typescript
export interface Project {
  id: number;
  name: string;
  description: string;
  language: string | null;
  demo_url?: string;
  html_url?: string;
  image?: string;
  case_study?: {
    architecture: string;
    technical_challenge: string;
    solution: string;
  };
}
```

### Detailed Field Breakdown

| Field | Type | Required | Description & UI Placement |
| :--- | :--- | :---: | :--- |
| `id` | `number` | **Yes** | Unique numeric identifier (e.g. `1, 2, 3...`). Used for ordering and tree node graph indexing. |
| `name` | `string` | **Yes** | Project title displayed on the hexagon card and in the case study modal header. |
| `description` | `string` | **Yes** | Punchy, metric-driven summary (2–4 sentences) highlighted on the card node. Focus on scale, latency, architecture, or core value proposition. |
| `language` | `string` | **Yes** | Comma-separated tech stack string (e.g. `"Go, TypeScript, Next.js 14, PostgreSQL, Docker"`). The card displays the first 5 chips; the modal displays all pills. |
| `demo_url` | `string` | No | Live application URL. If valid, the card automatically fetches a dynamic live screenshot via WordPress mshots (`https://s0.wp.com/mshots/v1/...`). Also powers the **Demo** link button. |
| `html_url` | `string` | No | GitHub repository URL. Renders the **Code** button on card hover. Leave empty if proprietary/closed source. |
| `image` | `string` | No | Static fallback screenshot path (e.g., `"/project/my-app.png"` or remote CDN URL). Used if `demo_url` has no live screenshot or fails to load. |
| `case_study` | `object` | Recommended | Contains the 3-part deep-dive engineering breakdown shown inside the Case Study modal when clicking **📖 Read Case Study**. |
| `case_study.architecture` | `string` | Cond. | **01. System Architecture**: Decoupling, microservices/monolith design, event meshes, database/caching tiers, data flows. |
| `case_study.technical_challenge` | `string` | Cond. | **02. Technical Challenge**: Real bottlenecks, concurrency deadlocks, high-traffic latency spikes, data consistency, or compliance constraints. |
| `case_study.solution` | `string` | Cond. | **03. The Solution**: The specific engineering implementation, algorithms, write-behind caching, queues, or architectural patterns used to fix the challenge. |

---

## 2. Where & How Projects Appear in UI

1. **Interactive Tree Graph ([`app/components/homepage/projects/index.tsx`](file:///app/components/homepage/projects/index.tsx))**:
   - Rendered as connected hexagonal nodes in an interactive Dijkstra/BFS shortest-path animated graph.
   - The first 7 projects in `projectsData` populate the nodes in tree order (Root node, Left/Right children, Leaf nodes).
2. **Project Card ([`app/components/homepage/projects/project-card.tsx`](file:///app/components/homepage/projects/project-card.tsx))**:
   - Shows live screenshot preview background, title, tech tags, and description.
   - On hover reveals: **Read Case Study** (if `case_study` exists), **Demo** (if `demo_url` exists), and **Code** (if `html_url` exists).
3. **Case Study Modal ([`app/components/homepage/projects/project-modal.tsx`](file:///app/components/homepage/projects/project-modal.tsx))**:
   - Displays full-screen glassmorphic modal with structured sections:
     - `01. System Architecture` (Teal accent)
     - `02. Technical Challenge` (Pink accent)
     - `03. The Solution` (Violet accent)
     - Tech Stack pills list

---

## 3. Step-by-Step: Adding a New Project

### Step 1: Create a Case Study File
Create a new file in [`utils/data/case-studies/`](file:///utils/data/case-studies/) named `<project-slug>.ts`:

```typescript
// utils/data/case-studies/my-awesome-project.ts
import type { Project } from '@/types/portfolio';

export const myAwesomeProject: Project = {
  id: 8,
  name: "My Awesome Project",
  description: "High-performance distributed caching system processing 50,000 requests/sec with 99.99% uptime and sub-5ms response times.",
  demo_url: "https://my-awesome-project.vercel.app",
  html_url: "https://github.com/Dustu103/my-awesome-project",
  image: "/project/my-awesome-project.png", // optional fallback
  language: "Go, Redis, TypeScript, Next.js, Docker",
  case_study: {
    architecture: `Designed around a decoupled master-replica architecture with Redis Sentinel for automatic failover. Go microservices handle client connections via gRPC, streaming events into a Kafka cluster for audit logging.`,
    technical_challenge: `Under sudden traffic bursts exceeding 30,000 QPS, database connections were exhausted, resulting in connection pool timeouts and cascading 504 gateway errors.`,
    solution: `Implemented an in-memory two-tier cache with a probabilistic early-expiration algorithm (XFetch) and singleflight request coalescing in Go. This collapsed redundant concurrent queries into a single database read, reducing database CPU load by 78%.`
  }
};
```

### Step 2: Export in `utils/data/case-studies/index.ts`
Add the export line to [`utils/data/case-studies/index.ts`](file:///utils/data/case-studies/index.ts):

```typescript
export { myAwesomeProject } from './my-awesome-project';
```

### Step 3: Register in `utils/data/projects-data.ts`
Import and add it to `projectsData` in [`utils/data/projects-data.ts`](file:///utils/data/projects-data.ts):

```typescript
import {
  proyodhaProject,
  swarAiProject,
  razorpayProject,
  reconProject,
  connectopiaProject,
  focusGuardProject,
  auctionPlatformProject,
  myAwesomeProject, // <-- 1. Import here
} from './case-studies';

export const projectsData: Project[] = [
  proyodhaProject,
  swarAiProject,
  razorpayProject,
  reconProject,
  connectopiaProject,
  focusGuardProject,
  auctionPlatformProject,
  myAwesomeProject, // <-- 2. Add here in desired priority order
];
```

### Step 4 (Optional): Add Screenshot / Thumbnail
If providing a static screenshot, place an image at:
```
public/project/my-awesome-project.png
```
*(If `demo_url` is a working public website, Next.js will automatically try to generate live screenshots, with your image as the fallback).*

---

## 4. Copy-Paste Blank Template

```typescript
import type { Project } from '@/types/portfolio';

export const yourProjectNameProject: Project = {
  id: 0, // Set next sequential ID
  name: "Project Name",
  description: "High-impact description emphasizing metrics, engineering scale, and core problem solved.",
  demo_url: "https://example.com", // Or leave empty "" if no live preview
  html_url: "https://github.com/Dustu103/repo-name", // Or omit if proprietary
  image: "/project/project-name.png", // Or remote image URL
  language: "Tech1, Tech2, Tech3, Tech4",
  case_study: {
    architecture: `Explain how services, data flows, and infrastructure are connected. Mention protocols (REST/gRPC), databases (PostgreSQL/MongoDB), queues (Kafka/SQS/Redis), and deployment (Docker/AWS).`,
    technical_challenge: `Describe the hardest technical problem faced: latency bottlenecks, deadlock issues, race conditions, scaling limits, or edge-case failures.`,
    solution: `Detail the exact architectural or algorithmic fix applied, the trade-offs considered, and the resulting metrics/impact.`
  }
};
```
