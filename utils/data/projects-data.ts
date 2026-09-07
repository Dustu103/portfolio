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
    name: "Autonomous Revenue Recovery Ecosystem",
    description: "India processes 14 billion digital transactions every month — 1.4 billion of them fail. Every payment gateway reduces these to one lazy word: FAILED. This system disagrees. Built across 13 containerized microservices in Go, Python, and Next.js 14, it classifies every failure in under 15ms across 100+ raw bank clearing codes, then dispatches the mathematically correct recovery — a deterministic NACH mandate shield that lifted revenue +51.3% over blind retries, a causal uplift engine that suppresses discounts when margins don't justify intervention, Indian statutory tax law encoded as a live B2B collections engine, and a chargeback defense pipeline with VAMP ratio protection. Not a feature. A complete, production-grade autonomous financial immune system for Indian payments.",
    html_url: "https://github.com/Dustu103/Razorpay",
    demo_url: "",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2070&auto=format&fit=crop",
    language: "Go, Python, TypeScript, Next.js 14, FastAPI, Redis, PostgreSQL, Docker",
    case_study: {
      // ═══════════════════════════════════════════════════════════════════════
      // SECTION 1 — ARCHITECTURE
      // ═══════════════════════════════════════════════════════════════════════
      architecture: `The system is 13 containerized microservices — written in Go, Python (FastAPI), and Next.js 14 — organized around one foundational principle: decouple by latency tier.

Payment systems operate across three time horizons that cannot share infrastructure. A live checkout edge proxy must respond in under 50ms or the user bounces before seeing a recovery offer. A failure classification pipeline must complete in under 15ms or the Razorpay webhook times out. A CIBIL escalation, a B2B legal notice, or an overnight chargeback rebuttal review can run as a background job. Mixing these in a shared service would be catastrophic — long-running LLM calls saturating goroutine pools needed by edge proxies, and ML model weights bloating containers that need to cold-start in under 2 seconds.

THE INGESTION EDGE
All incoming Razorpay and bank webhooks land at ingestion-service (Go Fiber, port 3001). It performs three jobs and nothing else: validates the HMAC-SHA256 signature of every incoming payload, deduplicates events using a Redis bloom filter to prevent double-processing during network retries, writes the canonical transaction record to PostgreSQL, and pushes a lightweight job envelope onto a Redis Stream in under 5ms. The service has no ML dependencies, no business logic, and no awareness of downstream recovery pillars. It is deliberately dumb and fast.

THE EVENT MESH
Redis is not used as a simple queue here — it is the connective tissue of the entire system. Redis Streams (payment_events, dunning_jobs, mandate_jobs) allow each downstream consumer service to process events independently via consumer groups. Consumer groups provide exactly-once delivery guarantees even when services restart mid-processing. A failed classification job does not re-trigger dunning. A mandate event does not accidentally reach the chargeback classifier. Each consumer group maintains its own cursor into the stream.

THE CENTRALIZED ML INFERENCE GATEWAY
Every machine learning prediction in the entire ecosystem is served by a single FastAPI service — inference-service running at port 8000. It holds four distinct models in memory: a LightGBM payment diagnostics classifier, a Random Forest false-decline model, a dual LightGBM Causal S-Learner for checkout uplift, and a stacking ensemble for chargeback win-probability scoring. Services that need predictions fire a single HTTP POST and receive a response in 3–9ms.

This pattern exists for one reason: you cannot embed Python ML frameworks (LightGBM, scikit-learn, SHAP, Pandas, NumPy) into Go microservices. Go does not run Python natively, and CGo bindings for ML libraries are an operational and maintenance nightmare. Keeping ML in a dedicated Python gateway means every Go container stays under 40MB, cold-starts in under 2 seconds, and scales horizontally without dragging ML dependencies with it. The inference gateway scales independently on its own compute tier — or on a GPU instance if model complexity grows.

THE FOUR AUTONOMOUS RECOVERY PILLARS
classification-service is a Go worker (no HTTP port) that consumes payment_events from Redis. It owns the 5-layer diagnostic waterfall — running Layer 0 deterministic rules, Layer 1 RBI compliance invariants, Layer 2 ML inference, Layer 3 LLM reasoning for ambiguous cases, and Layer 4 ensemble arbitration — then writing a structured ClassificationResult to PostgreSQL and triggering the appropriate downstream recovery action.

nach-recovery-service is a Go Fiber daemon at port 3007 that owns all recurring mandate logic: SIP protection, EMI CIBIL guard, insurance lapse prevention, and permanent mandate suppression. It exposes POST /api/v1/evaluate-mandate for synchronous policy evaluation and GET /api/v1/nach-metrics for dashboard telemetry.

dropoff-service is a Go Fiber worker at port 3002 that monitors active checkout sessions in a Redis Sorted Set (active_checkout_sessions, scored by expiry timestamp). A background ticker continuously executes ZRANGEBYSCORE to atomically detect sessions that expired without reaching payment_status: success. For each detected drop-off, it calls the inference gateway to compute causal Net-EV and dispatches the optimal intervention — or suppresses entirely if margins are negative.

b2b-recovery-service is a Go cron daemon at port 3006 using robfig/cron/v3. It runs nightly at 00:01, queries PostgreSQL for all invoices where status = overdue, computes days_late = CURRENT_DATE - expire_by, and for any invoice crossing statutory thresholds (45 days for MSME, 180 days for any vendor) dispatches a legal notice drafting request to the inference gateway's Groq LLM agent.

THE CROSS-CUTTING SERVICES
compliance-service (FastAPI, port 3004) is a mandatory pre-dispatch gate that every outbound communication must pass through before reaching a customer. It enforces time window constraints (8:00 AM – 7:00 PM IST only), velocity rate limits (maximum 3 contacts per customer per day across all channels combined), and DPDP Right to Erasure — zeroing out telemetry signals in Redis preprocessing before any ML input vector is constructed.

chargeback-service (FastAPI, port 3005) owns the full dispute lifecycle: VAMP ratio evaluation, ML win-probability scoring, SHAP context extraction, concurrent Multi-LLM rebuttal generation, and hallucination scrubbing before dashboard presentation.

bnpl-edge-service (Go Fiber, port 8003) sits inline in the live checkout flow. It intercepts hard_decline events synchronously, calls the inference gateway under a strict 50ms circuit breaker, and surfaces a BNPL split-payment offer if the model clears the threshold — or fails silent with zero customer-visible impact if the ML layer is slow.

The Next.js 14 Operations Dashboard (port 3010) serves as the human-in-the-loop layer. Every AI-generated output — legal demand notices, chargeback rebuttals, false decline flags — lands on the dashboard requiring one-click compliance officer approval before dispatch. No AI output reaches a customer automatically.

PostgreSQL (port 5432) is the durable store: canonical transaction records, classification results, dispute records, B2B invoice state, NACH mandate metadata, and HITL approval queues. Redis (port 6379) is the ephemeral layer: event streams, active session tracking, rate-limit counters, bloom filters, and DPDP erasure flags.`,

      // ═══════════════════════════════════════════════════════════════════════
      // SECTION 2 — TECHNICAL CHALLENGE
      // ═══════════════════════════════════════════════════════════════════════
      technical_challenge: `The project began with one observation: India's payment infrastructure produces over 100 distinct raw failure codes — ISO 8583 card codes (05 Do Not Honor, 51 Insufficient Funds, 61 Exceeds Limit), NPCI UPI codes (U30 VPA Not Found, U16 Risk Threshold Breached), and NACH clearing codes (R02 Account Closed, R08 Payment Stopped, R10 Invalid Mandate) — and every standard gateway collapses all 100+ of them into a single state: FAILED. Then retries at 9:00 AM the next morning. Regardless of what actually broke.

That single architectural failure creates four completely separate downstream financial penalties, each requiring a completely different engineering discipline to solve.

CHALLENGE 1 — THE NACH MANDATE DESTRUCTION LOOP
Recurring mandates (Mutual Fund SIPs, Loan EMIs, Insurance Premiums) operate under strict regulatory clearing windows that standard retry engines are completely unaware of.

Every failed NACH debit charges the consumer a bank bounce fee of ₹250–₹500 immediately — regardless of the failure cause, regardless of whether the retry was sensible. After three consecutive bounce failures, an Asset Management Company is legally required to permanently cancel the customer's Mutual Fund SIP at the clearing house. Once cancelled, the SIP cannot be automatically reinstated. If a loan EMI remains unpaid past Day 30, the lending institution reports the borrower to CIBIL or Experian, placing a seven-year negative mark on their credit history. Insurance premium failures trigger policy lapse as early as the first missed payment for some products.

A standard fixed-retry engine fires all three NACH debits. It collects three bank bounce fees. It watches the SIP get cancelled. It reports the borrower to CIBIL. It does this because it has no knowledge of what NACH product type it is debiting, no knowledge of regulatory thresholds, and no ability to distinguish a mandate that is dead (account closed, R02) from one that is temporarily unfunded (R51, might succeed tomorrow).

CHALLENGE 2 — THE CLASSIFICATION LATENCY WALL
You cannot route a failure to the correct recovery strategy if you cannot classify it in time. Early prototypes routed failure classification synchronously through cloud LLMs — Groq API calls with a 2,540ms average round-trip. This caused webhook timeout failures on the Razorpay ingestion side, corrupted event processing, and caused payment events to be silently dropped. Moving to cloud LLMs also created a direct dependency on external API availability and quota limits.

The classification problem itself was harder than expected: 100+ distinct bank error codes needed to be disaggregated into five actionable recovery categories — permanent terminal failures (never retry), transient network errors (safe to retry immediately), behavioral soft declines (user intent issue, needs dunning), fraud filter false positives (legitimate customer blocked, needs reversal), and mandate-level regulatory violations (needs immediate escalation, not retry). Standard text classification approaches could not handle the domain-specific Indian banking telemetry without extensive feature engineering.

CHALLENGE 3 — THE MARGIN CANNIBALIZATION PROBLEM IN CHECKOUT RECOVERY
Conventional abandoned-cart solutions operate on correlation, not causation. They observe that users who received a WhatsApp discount voucher after dropping off had a higher conversion rate than users who received nothing — and conclude the voucher caused the improvement. This confounds treatment effect with selection effect: users who opened a WhatsApp message were already more motivated to complete their purchase. The voucher may have had zero causal impact on the outcome.

Blindly issuing 10%–20% discount vouchers to all drop-offs causes two directly measurable financial harms. First, margin cannibalization on users who would have converted organically — you paid ₹50–₹200 in discount for a sale you were going to make anyway. Second, Return-To-Origin destruction: sending recovery messages to high-risk COD customers who do not actually want the product induces them to place an order they will reject on delivery, generating ₹250 in dead courier fees plus the margin cost of the outbound shipment. The industry metric of "recovery rate" is meaningless without accounting for these costs.

CHALLENGE 4 — B2B INVOICE COLLECTION WITHOUT LEGAL LEVERAGE
Standard B2B collection tools send reminder emails. Corporate finance teams receiving reminder emails understand the implicit threat model perfectly: the worst case is another email. There is no financial pain, no legal consequence, and no calendar-driven urgency attached to a passive reminder.

The architectural problem here was also subtle: the triggering condition for the statutory penalties (45 days for Income Tax Act Section 43B(h), 180 days for CGST Rule 37) is purely temporal. An invoice at Day 44 past due is indistinguishable from one at Day 45 in any webhook-driven event architecture — because Razorpay only emits an invoice.expired webhook at the moment of expiration (Day 0), not at Day 45 or Day 180. A purely event-driven system could never trigger the tax lever at the correct statutory threshold. Every existing collection microservice built on webhook patterns fails this problem by design.

CHALLENGE 5 — CHARGEBACK DEFENSE WITH VAMP RATIO PROTECTION
Most merchants don't know that Visa operates an Acquirer Monitoring Program (VAMP) that tracks dispute ratios. A merchant exceeding 1.5% disputes relative to transaction volume faces escalating fines and eventual payment processing suspension. This means for some disputes, fighting and losing is catastrophically worse than immediately issuing a refund — not because the refund is cheap, but because the lost fight moves the VAMP ratio further toward the threshold. A win-probability model that doesn't account for the current VAMP ratio can give the correct dispute-level recommendation while making a portfolio-level mistake.

Additionally, assembling a compliant dispute rebuttal packet for a Visa chargeback reason code 10.4 (Card Absent) requires gathering IP fingerprints, 3DS authentication records, delivery confirmation with GPS coordinates, device trust scores, and velocity signatures — then structuring them in the exact format required by the specific payment network. Doing this manually at scale is impossible. Delegating it to an LLM without grounding its output in the actual transaction evidence produces hallucinated facts that will lose the dispute and expose the merchant to fraud liability.

CHALLENGE 6 — DPDP ACT AND RBI FAIR PRACTICE COMPLIANCE AT SCALE
Automated dunning systems operating in India must comply with the Digital Personal Data Protection Act 2023 and RBI fair practice codes simultaneously. Violations include contacting customers outside permitted hours (before 8:00 AM or after 7:00 PM IST), exceeding contact frequency limits (RBI caps certain categories at 3 per day), and most critically — continuing to use a customer's data after they have invoked their DPDP Right to Erasure. A system that filters opt-outs at the application layer but still feeds the data through its ML feature pipeline before filtering is technically non-compliant, because the model processing itself constitutes unauthorized data use.`,

      // ═══════════════════════════════════════════════════════════════════════
      // SECTION 3 — SOLUTION
      // ═══════════════════════════════════════════════════════════════════════
      solution: `Each challenge was solved with a different engineering discipline. The common thread: deterministic rule engines own every compliance invariant; probabilistic ML and LLMs are restricted to domains where imprecision is tolerable.

SOLUTION 1 — THE 5-LAYER CLASSIFICATION WATERFALL (< 15ms Edge Path)

The classification pipeline in classification-service runs as a Go worker consuming from Redis. Layers 0 and 1 are pure deterministic functions with zero network dependencies. Layers 2 and 3 fire concurrently using sync.WaitGroup — the ML inference call and the LLM call start simultaneously, and Layer 4 arbitrates the result.

Layer 0 is the NACH Governor — a pure Go state machine implemented in internal/nach/stopping.go. It evaluates three fields on the transaction: consecutive_failure_count, days_since_due_date, and the raw clearing code. If the clearing code is R02 (Account Closed), R08 (Payment Stopped), or R10 (Invalid Mandate), the event is permanently flagged nach_do_not_retry and execution terminates — no ML is called, no bank fee is ever burned on a dead mandate. This single check eliminated 114 wasted bank debit attempts across 100 mandate test cases.

Layer 1 validates RBI pre-debit notification compliance: if a recurring mandate debit is scheduled but the mandate_notification_sent_at timestamp shows the notification was sent less than 24 hours before debit_scheduled_at, the system blocks the debit and raises a compliance flag. This is not a probabilistic check. It is a hard invariant.

Layer 2 fires an HTTP POST to inference-service at /predict/payment. The in-memory LightGBM classifier processes features including the raw error code, payment rail (nach/upi/card), merchant category, transaction amount, time-of-day, and historical failure velocity. It returns a classification and confidence score in 3–9ms with 96.05% offline accuracy on 100+ error code categories.

Layer 3 fires concurrently with Layer 2 for ambiguous cases. A rail-aware prompt is constructed (NACH mandate failures get different context than UPI VPA errors) and sent to Groq Llama-3 70B with a strict Pydantic JSON schema enforcing deterministic output format. This path adds ~800ms but runs asynchronously — the checkout webhook is acknowledged before Layer 3 completes.

Layer 4 applies variance gating. If both Layer 2 and Layer 3 agree (sigma within 0.10), the higher-confidence result routes forward. If they disagree significantly, the system falls back to the most conservative deterministic baseline. A wrong classification is worse than a conservative one.

After classification, the worker executes post-ensemble orchestration: false decline routing (if the cause is fraud_filter_block and the Random Forest false-decline model returns likelihood > 0.85, the action becomes reverify_and_reverse), NACH-specific override (loan_emi failures on the nach rail with credit_score_risk consequence are hard-routed to WhatsApp regardless of the dunning channel model), and permanent suppression for unretryable mandate causes.

SOLUTION 2 — THE NACH MANDATE SHIELD (nach-recovery-service, Go, Port 3007)

The Governor Engine implements four product-specific policy circuits.

SIP Mandate Protection: At consecutive_failure_count = 2, the engine fires a pre-emptive sip_cancellation_risk_escalate event with Elevated urgency (SMS). Automated NACH retries are frozen. A UPI Autopay re-registration link is dispatched via WhatsApp before the third failure triggers AMC permanent cancellation at the clearing house. At failure count ≥ 3, the engine hard-blocks with confidence 1.0 — the SIP is already cancelled, and retrying serves no purpose except generating bounce fees.

Loan EMI CIBIL Guard: At days_since_due_date ≥ 28, the Governor overrides all probabilistic retry schedules and fires an immediate WhatsApp communication (credit_score_risk_escalate) giving the borrower 48 hours to make payment before the Day 30 CIBIL bureau reporting threshold. This is a calendar-computed invariant, not a model output.

Insurance Premium Lapse Guard: A single failure on an insurance_premium product type triggers immediate Elevated (SMS) escalation — policy_lapse_risk_escalate — because insurance policies can lapse on a single missed premium for some products.

Permanent Suppression: Clearing codes mandate_expired, account_frozen_or_closed, and incorrect_mandate_details mark the mandate nach_do_not_retry permanently. Every future scheduled debit attempt is blocked before it reaches the banking rail.

Empirical benchmark against industry blind-retry baseline (100 mandate test suite): Revenue recovered increased from ₹2,42,659 to ₹3,67,117 (+51.3% lift, +₹1,24,458). Recovery rate improved from 25.9% to 39.1% (+13.2 percentage points). Mandates recovered increased from 25 to 37. Wasted bank debit attempts dropped from 114 to 0. Bank bounce fees saved: ₹28,500. Governor pre-emption rate: 46% of mandates handled pre-emptively before hitting destructive thresholds. SIP recovery lift: +₹70,914 (+84.4%). EMI recovery lift: +₹43,492 (+30.5%). Insurance recovery lift: +₹10,053 (+62.9%).

SOLUTION 3 — CAUSAL UPLIFT ENGINE (dropoff-service, Go, Port 3002)

Active checkout sessions are registered in a Redis Sorted Set (active_checkout_sessions) scored by expiry timestamp. Granular telemetry events (cart_loaded, payment_selected, app_switch, otp_delay, vpa_error) are continuously appended to Redis lists (session:{id}:events). A background ticker executes ZRANGEBYSCORE active_checkout_sessions -inf <now> continuously to atomically detect sessions that expired without reaching payment_status: success.

For each detected drop-off, the service calls inference-service at /predict/intervention. The Causal S-Learner (LightGBM) estimates the Individual Treatment Effect — not conversion probability, but marginal lift: tau_i = E[Y_i | X_i, W=1] - E[Y_i | X_i, W=0]. This is the actual causal increment the intervention adds over the user's counterfactual behavior.

The Net Expected Value formula evaluates every available action a (WhatsApp nudge, 5% discount, 10% voucher, UPI intent link, no-discount reminder):

Delta_Pi_a = P_a * [(1 - r_a) * (CM - D_a) - r_a * K_RTO] - P_0 * [(1 - r_0) * CM - r_0 * K_RTO] - K_a

Where P_a and P_0 are conversion probabilities with and without treatment, r_a and r_0 are RTO probabilities, CM is gross contribution margin, D_a is discount depth, K_RTO is ₹250 non-recoverable return shipping cost, and K_a is ₹0.48 WhatsApp API dispatch cost.

If max_a(Delta_Pi_a) ≤ 0, the system suppresses intervention entirely. No message is sent. Margins are protected. In testing, this achieved approximately 88% of the theoretical Oracle profit — the maximum achievable if every intervention decision were made with perfect foresight. Guardrails enforce frequency capping (1 intervention per customer per 24 hours), quiet hours (no promotional contact between 21:00 and 09:00 per TRAI DND regulations), and Redis opt-out blacklist checking.

SOLUTION 4 — STATUTORY TAX LAW AS CODE (b2b-recovery-service, Go, Port 3006)

The B2B problem required solving the Temporal Webhook Fallacy before solving the collection problem. The architectural decision: Hybrid Event-Batch Pattern. The Razorpay invoice.expired webhook is used only to mark invoices as overdue in PostgreSQL. All statutory threshold evaluation happens in a Go cron daemon (robfig/cron/v3) that wakes at 00:01 nightly and computes days_late = CURRENT_DATE - expire_by for every open invoice.

At days_late ≥ 45 (MSME vendor): Section 43B(h) of the Income Tax Act is triggered. If a company fails to pay an MSME supplier within the statutory window, the unpaid invoice amount is disallowed as a business expense for that fiscal year — increasing the buyer's taxable income by the full invoice amount and generating a 25–30% corporate tax liability on that sum. The system extracts the supplier's Udyam MSME registration number, computes compound penal interest at 3× the RBI base lending rate (per MSMED Act Section 16), and fires the structured payload to inference-service's Groq Llama-3 70B legal drafting agent.

At days_late ≥ 180 (any vendor): CGST Rule 37 is triggered. The buyer is legally obligated to reverse their Input Tax Credit claimed on this invoice and pay 18% penal interest back to the government. The LLM draft cites the exact GST rule, invoice ID, amount, and ITC reversal quantum.

The Groq system prompt positions the model as an expert Indian corporate lawyer. The user prompt injects only verified facts from the database — customer name, invoice ID, amount due, days overdue, statutory citation, and computed penalty figure. The prompt explicitly instructs the model not to invent any facts not provided. The drafted notice is written to the b2b_tax_lever_approvals table with status = 'pending'. It requires compliance officer approval on the Next.js dashboard before dispatch. No AI-generated legal communication reaches a debtor automatically.

SOLUTION 5 — CHARGEBACK DEFENSE WITH VAMP PROTECTION (chargeback-service, FastAPI, Port 3005)

The pipeline runs four layers. Layer 1 is deterministic VAMP evaluation: if the merchant's current dispute ratio is approaching the 1.5% Visa/Mastercard threshold, the service overrides all downstream ML and recommends immediate auto-refund — protecting processing license health above dispute economics. Layer 2 calls inference-service for ML win-probability scoring and extracts TreeSHAP values to identify the top decision features (e.g., 3DS authenticated: true, delivery confirmed: true, AVS match: full). Layer 3 routes by dispute value: under ₹5,000 uses single Groq Llama-3 70B call; ₹5,000 and above fires Groq and Gemini concurrently in a Multi-LLM ensemble, scoring both outputs against the hard evidence anchors extracted by SHAP. Layer 4 runs a deterministic hallucination scrubber that validates every claim in the rebuttal against the source transaction data before the result is written to PostgreSQL. On a 15-scenario E2E test suite covering Visa 10.4 CE 3.0, RuPay 1065, and MC 4853 reason codes, the pipeline achieved 80% accuracy (12/15). The 3 failed cases were extreme high-value disputes (₹1,50,000+) where the LLM correctly inferred human review was warranted but the test expectation was auto_submit — a prompt engineering calibration issue, not a model failure.

SOLUTION 6 — DPDP COMPLIANCE GATE (compliance-service, FastAPI, Port 3004)

Three invariants enforced unconditionally, before any outbound dispatch. Time window guard: API-layer hard block outside 8:00 AM – 7:00 PM IST — not configurable, not overridable by business logic. Velocity rate limiter: Redis INCR with 24-hour TTL on key customer:{id}:contact_count, capped at 3 across all channels combined. Right to Erasure: When a DPDP erasure event fires, a Redis key customer:{id}:erased is set. The ML feature pipeline reads this key before constructing any input vector — if set, the customer's signals are zeroed in preprocessing before the model ever sees the data. This is not an application-layer filter applied after inference; it runs before the feature vector is built. The model never processes their data.`,
    }
  },
  {
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
