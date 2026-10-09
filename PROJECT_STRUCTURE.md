# Project Architecture & Deep-Dive Case Study Specification

This document is the **authoritative specification** for how projects and case studies are structured, written, and rendered in this portfolio.

---

> [!CAUTION]
> ### 🚨 CRITICAL DIRECTIVE FOR ALL AI AGENTS: ZERO-TOLERANCE FOR SHALLOW PARAGRAPHS
> 
> **DO NOT write a brief 2–3 sentence summary.** 
> If you generate a single, superficial paragraph for `architecture`, `technical_challenge`, or `solution`, your output is **DEFECTIVE AND INVALID**.
>
> In this portfolio, projects are **not** high-level resume blurbs. They are **senior/staff-level engineering post-mortems and architectural deep-dives** (typically **800–2,000+ words total** across the 3 fields). Every case study must detail concrete latency budgets, subsystem topologies, concurrency traps, exact algorithmic mechanics, and quantifiable benchmarks.
>
> **Before writing any case study, review the gold standards in this repository:**
> - [`utils/data/case-studies/razorpay.ts`](file:///utils/data/case-studies/razorpay.ts) — *Autonomous Revenue Recovery Ecosystem (19KB, 13 microservices, 5-layer waterfall, statutory tax engine, causal Net-EV math)*
> - [`utils/data/case-studies/compress-lab.ts`](file:///utils/data/case-studies/compress-lab.ts) — *CompressLab (10KB, 33 C++20 codecs, bitstream I/O, KwKwK paradox, ANS state inversion)*
> - [`utils/data/case-studies/recon.ts`](file:///utils/data/case-studies/recon.ts) — *Recon (10KB, tiered SLAs, DNS rebinding SSRF firewall, 15 RPM LLM rate-limit handling, AST repair)*

---

## 1. Why Agents Default to "Small Paragraphs" (And How to Prevent It)

AI agents typically generate shallow 1-paragraph summaries because:
1. **Generic LLM Summarization Bias**: Models default to brevity unless explicitly instructed with strict structural scaffolding and length expectations.
2. **Missing Subsections**: When given a single string field (`architecture`), models collapse everything into one sentence instead of breaking it down into subsystems, latency budgets, and trade-offs.
3. **Vague Prompts**: Without explicit requirements for *numbered challenges* and *verifiable metrics*, models speak in hand-waving generalities like *"we used Redis for high performance"*.

**The Rule**: Every project case study must strictly adhere to the multi-section anatomical blueprint detailed below.

---

## 2. Project Data Schema

Every project implements the `Project` interface defined in [`types/portfolio.ts`](file:///types/portfolio.ts):

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
    architecture: string;          // 300–600+ words (multi-section engineering breakdown)
    technical_challenge: string;   // 300–600+ words (3–5 numbered concrete bottlenecks with RCAs)
    solution: string;              // 300–800+ words (1-to-1 matching algorithmic solutions + metrics)
  };
}
```

### Field Breakdown & Validation Rules

| Field | Type | Required | Expected Depth & Rules |
| :--- | :--- | :---: | :--- |
| `id` | `number` | **Yes** | Unique integer (e.g. `1, 2, 3...`). Used for graph traversal indexing. |
| `name` | `string` | **Yes** | Clear, professional system name (e.g. `"Autonomous Revenue Recovery Ecosystem"`). |
| `description` | `string` | **Yes** | High-impact overview (3–5 sentences) highlighting the scale, problem domain, and core engineering innovation. |
| `language` | `string` | **Yes** | Comma-separated tech stack (e.g. `"Go, Python, TypeScript, Next.js 14, FastAPI, Redis, PostgreSQL, Docker"`). The card displays the top 5; the modal displays all. |
| `demo_url` | `string` | No | Live public deployment URL. If provided, powers live screenshot preview and Demo button. Leave `""` if internal/offline. |
| `html_url` | `string` | No | GitHub repository link. Powers the Code button. Omit if private/proprietary. |
| `image` | `string` | No | Fallback screenshot path (e.g. `"/project/my-app.png"` or remote CDN URL). |
| `case_study` | `object` | **Mandatory** | The comprehensive engineering deep-dive rendered in [`project-modal.tsx`](file:///app/components/homepage/projects/project-modal.tsx). |
| `case_study.architecture` | `string` | **Mandatory** | **Minimum 300–600 words.** Must contain Latency SLAs, Component Breakdown, Storage Partitioning, and Architectural Trade-offs. |
| `case_study.technical_challenge` | `string` | **Mandatory** | **Minimum 300–600 words.** Must contain 3 to 5 numbered, technically specific bottlenecks (`CHALLENGE 1`, `CHALLENGE 2`, etc.) with root-cause analysis. |
| `case_study.solution` | `string` | **Mandatory** | **Minimum 300–800 words.** Must map 1-to-1 to challenges (`SOLUTION 1`, `SOLUTION 2`, etc.) detailing algorithms, state machines, and hard before/after metrics. |

---

## 3. The 3-Pillar Deep-Dive Anatomy

The case study modal renders using `whitespace-pre-line`. Use **ALL CAPS SUBHEADINGS**, bullet points (`•`), sub-bullets (`-`), and clear double line breaks (`\n\n`) to structure each section.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 01. SYSTEM ARCHITECTURE                                                    │
│  ├─ Latency Tiers, Throughput SLAs & Scale Targets                         │
│  ├─ Subsystem & Component Topology (Ingestion, Mesh, Workers, Gateways)    │
│  ├─ Ephemeral vs. Persistent State Partitioning (Redis vs PostgreSQL/Mongo)│
│  └─ Technology Trade-Offs (Why Tool A was selected over Tool B)            │
├────────────────────────────────────────────────────────────────────────────┤
│ 02. TECHNICAL CHALLENGES                                                   │
│  ├─ CHALLENGE 1 — [Exact Failure / Concurrency / Protocol Trap]            │
│  ├─ CHALLENGE 2 — [Memory / Rate Limit / Drift Bottleneck]                 │
│  ├─ CHALLENGE 3 — [Data Consistency / Network / Compliance Constraint]     │
│  └─ CHALLENGE 4 — [Optional 4th/5th Edge-Case Failure Mode]                │
├────────────────────────────────────────────────────────────────────────────┤
│ 03. THE SOLUTIONS & MEASURED IMPACT                                        │
│  ├─ SOLUTION 1 — [Algorithmic Fix, State Machine & Verified Metrics]       │
│  ├─ SOLUTION 2 — [Circuit Breaker, Deduplication & Performance Gains]      │
│  ├─ SOLUTION 3 — [Mathematical Invariant, Queue Topology & Load Drop]      │
│  └─ SOLUTION 4 — [Matching Fix for Challenge 4]                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Pillar 1: `case_study.architecture` Requirements
Must explicitly break down:
1. **Latency Tiers & SLAs**: Explicit P95/P99 latency ceilings (e.g. `<15ms edge classification`, `<50ms session evaluation`, background queue deadlines).
2. **Subsystems / Component Topology**: Name every service, daemon, or worker, stating its port, runtime (e.g. Go Fiber, Python FastAPI, Express), and exact role.
3. **Storage Partitioning**: Clearly delineate what data lives in Ephemeral RAM (Redis sorted sets, bloom filters, mutex locks) vs. Canonical Durable Persistence (PostgreSQL, MongoDB).
4. **Architectural Trade-Offs**: Detail why specific decisions were made (e.g., polyglot split vs monorepo, synchronous gRPC vs event streams, S-Learner vs Doubly Robust estimator).

### Pillar 2: `case_study.technical_challenge` Requirements
Must contain **3 to 5 numbered challenges**, each formatted as:
`CHALLENGE <N> — <UPPERCASE DESCRIPTIVE TITLE>`
- **No generic statements**: NEVER write *"It was challenging to make the database fast under heavy load"*.
- **Specify root causes**: Detail the exact concurrency deadlocks, race conditions, DNS rebinding vectors, ISO 8583 bank clearing codes, KwKwK self-referential paradoxes, 15 RPM LLM rate-limit asphyxiations, or cache stampedes.
- Explain why naive or off-the-shelf implementations failed.

### Pillar 3: `case_study.solution` Requirements
Must match challenges **1-to-1**, formatted as:
`SOLUTION <N> — <UPPERCASE DESCRIPTIVE TITLE>`
- Detail the **exact algorithmic and engineering mechanics**: e.g., probabilistic early-expiration algorithms (XFetch), singleflight request coalescing, branchless 64-bit word accumulator shifting, AST JSON repair heuristics, or write-behind batching queues.
- Detail **fail-safe mechanisms**: circuit breakers, deterministic rule fallbacks, variance gating.
- **Provide hard quantitative metrics**:
  - Latency drop (e.g. *reduced P99 from 2,540ms to 9ms*).
  - Throughput / Load (e.g. *sustained 45,000 QPS with 78% reduction in DB CPU utilization*).
  - Error elimination (e.g. *0 deadlocks across 100,000 synthetic stress events*).
  - Business / Recovery lift (e.g. *+51.3% revenue recovery lift, ₹28,500 bank bounce fees prevented*).

---

## 4. Anti-Pattern vs. Required Standard Comparison

### ❌ The Rejected Anti-Pattern (DO NOT DO THIS)
```typescript
// REJECTED: Lazy 1-paragraph summary — INSTANT FAILURE
case_study: {
  architecture: "The application is built using Next.js on the frontend and Go on the backend. It uses Redis for caching and PostgreSQL for database storage.",
  technical_challenge: "The main challenge was handling high traffic and preventing database slow-downs when multiple users accessed the site at the same time.",
  solution: "We added Redis caching to speed up read queries and used Docker to deploy the services reliably."
}
```

### ✅ The Required Standard (DO THIS)
```typescript
// ACCEPTED: Deep-dive systems architecture with concrete mechanics & metrics
case_study: {
  architecture: `The system is architected across decoupled microservices organized around strict latency tiers:

LATENCY TIERS & SERVICE BOUNDARIES
• Tier 0 — Edge Ingestion Proxy (Go Fiber, port 3001): Target P95 < 5ms. HMAC-SHA256 payload verification, Redis bloom filter deduplication, and atomic Redis Stream appending.
• Tier 1 — Diagnostic & State Engine: Target P95 < 15ms. In-memory classification waterfall running deterministic invariants before asynchronous dispatch.
• Tier 2 — Background Reconciliation Daemons: Asynchronous event workers consuming via Redis consumer groups with at-least-once delivery semantics.

STORAGE PARTITIONING
• Ephemeral RAM (Redis 7.0): TTL-governed sliding-window rate counters, bloom filters, and sorted sets for active sessions.
• Canonical Persistence (PostgreSQL 16): ACID-compliant transactional ledger with partitioned event logs and audit trails.`,

  technical_challenge: `CHALLENGE 1 — DATABASE DEADLOCKS UNDER HIGH-CONCURRENCY WRITE BURSTS
Under sudden traffic surges exceeding 30,000 concurrent events, simultaneous row-level updates on shared inventory records caused severe PostgreSQL deadlock cascades (SQLSTATE 40P01), triggering 504 gateway timeouts.

CHALLENGE 2 — CACHE STAMPEDES ON HOT-KEY EXPIRATION
When heavily queried cache keys expired simultaneously during flash events, thousands of concurrent worker goroutines bypassed the cache to hit the primary database at once, overwhelming connection pools and driving CPU utilization to 100%.

CHALLENGE 3 — LLM COMPLETION TRUNCATION & MALFORMED JSON PAYLOADS
Complex schema extractions frequently breached context completion windows or were truncated mid-stream, causing JSON.parse() crashes that dropped 8.4% of incoming client payloads.`,

  solution: `SOLUTION 1 — IN-MEMORY WRITE-BEHIND QUEUE & PESSIMISTIC BATCHING
Replaced direct row writes with an in-memory Redis ring buffer and dedicated Go batch worker. Writes are acknowledged in <2ms, while the worker flushes coalesced updates in micro-batches of 500 rows every 50ms, completely eliminating database deadlocks (0 deadlocks across 500,000 synthetic test runs).

SOLUTION 2 — PROBABILISTIC EARLY EXPIRATION (XFETCH) & SINGLEFLIGHT
Implemented the XFetch optimal cache refreshing algorithm combined with Go's sync/singleflight package. Redundant concurrent queries collapse into a single database read, while background goroutines refresh stale keys before expiration, reducing database CPU load by 78%.

SOLUTION 3 — DETERMINISTIC AST REPAIR PIPELINE
Engineered an AST-based JSON repair state machine that intercepts truncated tokens, balances unclosed quotes/brackets, and validates partial payloads against Zod schemas, recovering 99.4% of truncated responses without redundant re-inferences.`
}
```

---

## 5. UI Rendering & Markdown Formatting Rules

The portfolio renders case studies in [`app/components/homepage/projects/project-modal.tsx`](file:///app/components/homepage/projects/project-modal.tsx):
- Text is wrapped in a `<p className="... whitespace-pre-line">` container.
- **Section Headers**: Use UPPERCASE lines (e.g. `LATENCY TIERS & SLAS`, `STORAGE PARTITIONING`).
- **Bullets**: Use `•` followed by a space. Use `-` for sub-bullets.
- **Paragraphs**: Always separate sections with double line breaks (`\n\n`).
- **Code Terms**: Mention concrete terms (ports, protocols, algorithms, table names, HTTP status codes, SQL states).

---

## 6. Step-by-Step Workflow: Adding a Project

### Step 1: Create Case Study File
Create [`utils/data/case-studies/<project-slug>.ts`](file:///utils/data/case-studies/):

```typescript
import type { Project } from '@/types/portfolio';

export const myProject: Project = {
  id: 9,
  name: "My Project Name",
  description: "3–5 sentence punchy summary highlighting scale, problem domain, and engineering achievements.",
  demo_url: "https://myproject.com", // or ""
  html_url: "https://github.com/Dustu103/my-repo",
  image: "/project/my-project.png",
  language: "Go, TypeScript, Next.js 14, PostgreSQL, Redis, Docker",
  case_study: {
    architecture: `...`,          // Full multi-section deep-dive (300–600+ words)
    technical_challenge: `...`,   // 3–5 numbered concrete challenges (300–600+ words)
    solution: `...`               // 1-to-1 matching solutions with metrics (300–800+ words)
  }
};
```

### Step 2: Export in `utils/data/case-studies/index.ts`
```typescript
export { myProject } from './my-project';
```

### Step 3: Register in `utils/data/projects-data.ts`
```typescript
import { myProject } from './case-studies';

export const projectsData: Project[] = [
  // ... existing projects
  myProject,
];
```

### Step 4: Add Screenshot / Asset
Place image at:
```
public/project/my-project.png
```

### Step 5: Validate TypeScript Build
Run in terminal:
```bash
npx tsc --noEmit
```
Must pass with zero errors.

---

## 7. Pre-Scaffolded Production Template (Copy & Fill Out)

Copy this template when creating any new project case study:

```typescript
import type { Project } from '@/types/portfolio';

export const myProjectNameProject: Project = {
  id: 0, // Next available ID
  name: "System / Platform Name",
  description: "Comprehensive 3–5 sentence executive summary explaining what the system does, who it serves, its operational scale, and the core engineering innovation.",
  demo_url: "", // Live URL or ""
  html_url: "https://github.com/Dustu103/repo-name",
  image: "/project/project-image.png",
  language: "Language1, Framework, Database, Cache, Infrastructure",
  case_study: {
    architecture: `The system is engineered as [topology overview] designed to guarantee [SLA / reliability metric]:

LATENCY TIERS & SERVICE LEVEL AGREEMENTS
• Tier 0 — Edge Ingestion & Auth (/api/v1/*): Target P95 < [X]ms, P99 < [Y]ms. [Details on token validation, hashing, rate-limiting].
• Tier 1 — Core Processing & Pipeline Engine: Target P95 < [X]ms, P99 < [Y]ms. [Details on serialization, streaming, state validation].
• Tier 2 — Background Workers & Scheduled Jobs: [Details on queues, workers, cron daemons, batch flush windows].

COMPONENT TOPOLOGY & SERVICE DECOUPLING
• [Service A] ([Runtime/Framework], port [XXXX]): [Responsibilities, communication protocols gRPC/HTTP/WebSocket].
• [Service B] ([Runtime/Framework], port [XXXX]): [Responsibilities, event handling, worker logic].
• [Service C] ([Runtime/Framework], port [XXXX]): [Responsibilities, model inference or specialized computation].

STORAGE & STATE PARTITIONING
• Ephemeral Layer ([Redis/Memory Store]): Manages [session mutexes, bloom filters, sorted sets, sliding-window rate counters].
• Durable Layer ([PostgreSQL/MongoDB]): Houses [ACID transactional records, relational schemas, audit logs].

ARCHITECTURAL TRADE-OFFS
• [Decision A vs B]: [Detailed rationale explaining why this pattern was chosen over alternatives and its operational trade-offs].`,

    technical_challenge: `CHALLENGE 1 — [UPPERCASE BOTTLENECK / CONCURRENCY / PROTOCOL FAILURE]
[Explain the exact technical failure mode, race condition, or protocol trap. Detail why naive approaches fail and the consequences on system stability].

CHALLENGE 2 — [UPPERCASE PERFORMANCE / SCALE / LATENCY WALL]
[Detail the exact bottleneck: memory consumption, thread pool exhaustion, unindexed scan degradation, network roundtrip bloat, or rate-limit ceilings].

CHALLENGE 3 — [UPPERCASE DATA INTEGRITY / STATE DESYNCHRONIZATION]
[Describe the state desync, distributed transaction failure, cache inconsistency, or schema truncation problem].

CHALLENGE 4 — [UPPERCASE EDGE-CASE / SECURITY / PROTOCOL CONSTRAINT]
[Describe edge cases, security vectors like SSRF/DNS rebinding, compliance restrictions, or unexpected protocol responses].`,

    solution: `SOLUTION 1 — [UPPERCASE ALGORITHMIC FIX / DATA STRUCTURE / STATE MACHINE]
[Detail the exact engineering mechanics: state machines, locking primitives, batching algorithms, or pipeline restructuring].
• Impact & Metrics: [Concrete measured improvement, e.g. latency reduced by X%, 0 failures across N tests].

SOLUTION 2 — [UPPERCASE CACHING / OPTIMIZATION / CONCURRENCY CONTROLS]
[Explain the algorithmic caching strategy, singleflight coalescing, connection pooling, or memory alignment applied].
• Impact & Metrics: [Concrete measured improvement, e.g. throughput increased to X QPS, CPU reduced by Y%].

SOLUTION 3 — [UPPERCASE DISTRIBUTED CONSISTENCY / QUEUE TOPOLOGY]
[Detail the event stream consumer group, write-behind buffer, idempotent retry key, or transaction isolation level].
• Impact & Metrics: [Concrete measured improvement, e.g. 100% data consistency, zero dropped packets].

SOLUTION 4 — [UPPERCASE FAILOVER / FIREWALL / RESILIENCY ENGINE]
[Detail the circuit breaker, pre-resolution DNS socket guard, AST repair mechanism, or deterministic fallback].
• Impact & Metrics: [Concrete measured improvement, e.g. 99.4% payload recovery, 0 security bypasses].`
  }
};
```

---

## 8. Agent Pre-Completion Checklist

Before marking any project creation or case study task complete, verify:
- [ ] **Word Count Check**: Is the case study at least **800–1,500+ words total**? (Never single paragraphs).
- [ ] **Structural Check**: Does `architecture` detail Latency Tiers, Component Breakdown, Storage Partitioning, and Trade-offs?
- [ ] **Numbered Challenges**: Does `technical_challenge` contain 3 to 5 numbered challenges (`CHALLENGE 1 — ...`) with deep root causes?
- [ ] **Numbered Solutions**: Does `solution` match 1-to-1 (`SOLUTION 1 — ...`) with concrete algorithms and verifiable metrics?
- [ ] **Typing & Export**: Is the project typed as `Project`, exported in `index.ts`, and included in `projectsData`?
- [ ] **TypeScript Build**: Did `npx tsc --noEmit` pass with zero errors?
