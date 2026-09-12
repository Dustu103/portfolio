import type { Project } from '@/types/portfolio';

export const razorpayProject: Project = {
  id: 3,
  name: "Autonomous Revenue Recovery Ecosystem",
  description: "India processes 14 billion digital transactions every month — 1.4 billion of them fail. Every payment gateway reduces these to one lazy word: FAILED. This system disagrees. Built across 13 containerized microservices in Go, Python, and Next.js 14, it classifies every failure in under 15ms across 100+ raw bank clearing codes, then dispatches the mathematically correct recovery — a deterministic NACH mandate shield that lifted revenue +51.3% over blind retries, a causal uplift engine that suppresses discounts when margins don't justify intervention, Indian statutory tax law encoded as a live B2B collections engine, and a chargeback defense pipeline with VAMP ratio protection. Not a feature. A complete, production-grade autonomous financial immune system for Indian payments.",
  html_url: "https://github.com/Dustu103/Razorpay",
  demo_url: "",
  image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=2070&auto=format&fit=crop",
  language: "Go, Python, TypeScript, Next.js 14, FastAPI, Redis, PostgreSQL, Docker",
  case_study: {
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
• classification-service is a Go worker (no HTTP port) that consumes payment_events from Redis. It owns the 5-layer diagnostic waterfall — running Layer 0 deterministic rules, Layer 1 RBI compliance invariants, Layer 2 ML inference, Layer 3 LLM reasoning for ambiguous cases, and Layer 4 ensemble arbitration — then writing a structured ClassificationResult to PostgreSQL and triggering the appropriate downstream recovery action.
• nach-recovery-service is a Go Fiber daemon at port 3007 that owns all recurring mandate logic: SIP protection, EMI CIBIL guard, insurance lapse prevention, and permanent mandate suppression. It exposes POST /api/v1/evaluate-mandate for synchronous policy evaluation and GET /api/v1/nach-metrics for dashboard telemetry.
• dropoff-service is a Go Fiber worker at port 3002 that monitors active checkout sessions in a Redis Sorted Set (active_checkout_sessions, scored by expiry timestamp). A background ticker continuously executes ZRANGEBYSCORE to atomically detect sessions that expired without reaching payment_status: success. For each detected drop-off, it calls the inference gateway to compute causal Net-EV and dispatches the optimal intervention — or suppresses entirely if margins are negative.
• b2b-recovery-service is a Go cron daemon at port 3006 using robfig/cron/v3. It runs nightly at 00:01, queries PostgreSQL for all invoices where status = overdue, computes days_late = CURRENT_DATE - expire_by, and for any invoice crossing statutory thresholds (45 days for MSME, 180 days for any vendor) dispatches a legal notice drafting request to the inference gateway's Groq LLM agent.

THE CROSS-CUTTING SERVICES
• compliance-service (FastAPI, port 3004) is a mandatory pre-dispatch gate that every outbound communication must pass through before reaching a customer. It enforces time window constraints (8:00 AM – 7:00 PM IST only), velocity rate limits (maximum 3 contacts per customer per day across all channels combined), and DPDP Right to Erasure — zeroing out telemetry signals in Redis preprocessing before any ML input vector is constructed.
• chargeback-service (FastAPI, port 3005) owns the full dispute lifecycle: VAMP ratio evaluation, ML win-probability scoring, SHAP context extraction, concurrent Multi-LLM rebuttal generation, and hallucination scrubbing before dashboard presentation.
• bnpl-edge-service (Go Fiber, port 8003) sits inline in the live checkout flow. It intercepts hard_decline events synchronously, calls the inference gateway under a strict 50ms circuit breaker, and surfaces a BNPL split-payment offer if the model clears the threshold — or fails silent with zero customer-visible impact if the ML layer is slow.

The Next.js 14 Operations Dashboard (port 3010) serves as the human-in-the-loop layer. Every AI-generated output — legal demand notices, chargeback rebuttals, false decline flags — lands on the dashboard requiring one-click compliance officer approval before dispatch. No AI output reaches a customer automatically.

PostgreSQL (port 5432) is the durable store: canonical transaction records, classification results, dispute records, B2B invoice state, NACH mandate metadata, and HITL approval queues. Redis (port 6379) is the ephemeral layer: event streams, active session tracking, rate-limit counters, bloom filters, and DPDP erasure flags.`,

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

    solution: `Each challenge was solved with a different engineering discipline. The common thread: deterministic rule engines own every compliance invariant; probabilistic ML and LLMs are restricted to domains where imprecision is tolerable.

SOLUTION 1 — THE 5-LAYER CLASSIFICATION WATERFALL (< 15ms Edge Path)
The classification pipeline in classification-service runs as a Go worker consuming from Redis. Layers 0 and 1 are pure deterministic functions with zero network dependencies. Layers 2 and 3 fire concurrently using sync.WaitGroup — the ML inference call and the LLM call start simultaneously, and Layer 4 arbitrates the result.
• Layer 0 is the NACH Governor — a pure Go state machine. It evaluates consecutive_failure_count, days_since_due_date, and raw clearing code. If clearing code is R02 (Account Closed), R08 (Payment Stopped), or R10 (Invalid Mandate), the event is permanently flagged nach_do_not_retry and terminates. Eliminated 114 wasted bank debit attempts across 100 test cases.
• Layer 1 validates RBI pre-debit notification compliance: if a recurring mandate debit is scheduled but pre-debit notification was sent < 24 hours before debit, it hard-blocks the debit.
• Layer 2 fires an HTTP POST to inference-service at /predict/payment. The in-memory LightGBM classifier returns classification and confidence in 3–9ms with 96.05% offline accuracy on 100+ error code categories.
• Layer 3 fires concurrently with Layer 2 for ambiguous cases via Groq Llama-3 70B with strict Pydantic JSON schema.
• Layer 4 applies variance gating. If Layer 2 and Layer 3 agree (sigma within 0.10), the higher-confidence result routes forward. If they disagree, it falls back to a conservative deterministic baseline.

SOLUTION 2 — THE NACH MANDATE SHIELD (nach-recovery-service, Go, Port 3007)
The Governor Engine implements four product-specific policy circuits:
• SIP Mandate Protection: At consecutive_failure_count = 2, fires pre-emptive sip_cancellation_risk_escalate event. Retries frozen; UPI Autopay re-registration link dispatched via WhatsApp before 3rd failure triggers AMC cancellation.
• Loan EMI CIBIL Guard: At days_since_due_date >= 28, overrides retry schedules and fires immediate WhatsApp communication giving 48h before Day 30 CIBIL bureau reporting threshold.
• Insurance Premium Lapse Guard: Single failure triggers immediate SMS escalation because policies can lapse on a single missed premium.
• Permanent Suppression: Codes mandate_expired, account_frozen_or_closed, and incorrect_mandate_details mark mandate nach_do_not_retry permanently.
• Benchmark (100 mandate test suite): Revenue recovered increased from ₹2,42,659 to ₹3,67,117 (+51.3% lift, +₹1,24,458). Recovery rate improved from 25.9% to 39.1% (+13.2 percentage points). Wasted debit attempts dropped from 114 to 0. Bank bounce fees saved: ₹28,500.

SOLUTION 3 — CAUSAL UPLIFT ENGINE (dropoff-service, Go, Port 3002)
Active checkout sessions are tracked in Redis Sorted Sets. Drop-offs trigger Causal S-Learner (LightGBM) to estimate Individual Treatment Effect (tau_i = E[Y_i | X_i, W=1] - E[Y_i | X_i, W=0]). Net Expected Value formula evaluates every action against gross contribution margin, discount depth, RTO courier loss (₹250), and API dispatch cost (₹0.48). If max Net-EV <= 0, intervention is suppressed. Achieved ~88% of theoretical Oracle profit.

SOLUTION 4 — STATUTORY TAX LAW AS CODE (b2b-recovery-service, Go, Port 3006)
Hybrid Event-Batch Pattern: Go cron daemon wakes at 00:01 nightly.
• At days_late >= 45 (MSME vendor): Triggers Section 43B(h) of the Income Tax Act. Disallows unpaid expense for buyer, creating 25-30% corporate tax liability. Computes penal interest at 3x RBI base lending rate and drafts legal notice via Groq Llama-3 70B.
• At days_late >= 180: Triggers CGST Rule 37 requiring buyer to reverse Input Tax Credit with 18% penal interest.
All drafted notices require compliance officer approval on the Next.js Operations Dashboard before dispatch.

SOLUTION 5 — CHARGEBACK DEFENSE WITH VAMP PROTECTION (chargeback-service, FastAPI, Port 3005)
Evaluates Visa VAMP ratio before dispute economics — recommends auto-refund if approaching 1.5% dispute threshold. Extracts TreeSHAP values for ML win-probability scoring, generates grounded Multi-LLM rebuttals, and runs a deterministic hallucination scrubber verifying all claims against canonical transaction records.

SOLUTION 6 — DPDP COMPLIANCE GATE (compliance-service, FastAPI, Port 3004)
Enforces time windows (8 AM - 7 PM IST), velocity limits (<=3 contacts/day via Redis INCR), and Right to Erasure by zeroing customer signals in preprocessing before ML feature vector construction.`
  }
};
