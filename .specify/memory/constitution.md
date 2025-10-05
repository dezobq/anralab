<!--
SYNC IMPACT REPORT:
Version: 2.1.1 → 2.1.2 (PATCH - Operational safety caps)
Modified Sections:
  - Principle 2 (Explicit State) - Added --strict mode for consistency checks
  - Principle 3 (Security First) - Added Phase 1 FS/network execution warning
  - Principle 5 (Retrieval Quality) - Added RAG ingestion caps (max_bytes_per_doc, max_docs_per_run)
Added Sections:
  - Strict validation mode (check_state.py --strict) with 3 consistency rules
  - RAG ingestion caps to prevent index explosion
  - Phase 1 security reinforcement (review-only for FS/network snippets)
Removed Sections: None
Templates Requiring Updates:
  - ✅ .specify/templates/plan-template.md (no changes needed)
  - ✅ .specify/templates/spec-template.md (no changes needed)
  - ✅ .specify/templates/tasks-template.md (no changes needed)
Follow-up TODOs:
  - Update check_state.py to include --strict mode implementation
  - Create examples/state/*.json (≥3 valid handoffs)
  - Create docs/rag-gold.jsonl when Phase 2 begins
  - Capture lint/coverage baseline at Phase 1 start

RATIONALE FOR PATCH BUMP:
- Lightweight operational safety additions (caps, strict mode)
- No breaking changes to STATE schema or workflow
- Prevents known failure modes (index explosion, inconsistent STATE, unsafe execution)
- Maintains simplicity: 2 numeric caps, 3 strict rules, 1 security reminder

OPERATIONAL SAFETY:
- ✅ RAG caps: Prevents runaway index growth (1MB/doc, 10K docs/batch)
- ✅ Strict mode: Optional consistency checks (files_touched ↔ changes, skip_rag ↔ snippets, test files ↔ test status)
- ✅ Phase 1 FS/network: Explicit DO NOT execute reminder (defense in depth)
-->


# ANRA Lab AI-Assisted Development Constitution

**Purpose:** This constitution establishes the architectural principles, quality gates,
and governance model for building an AI-assisted development system from zero-state.
It does NOT describe current implementation—it defines the target state and the
immutable principles that will guide incremental construction.

**Current Reality:** As of ratification, NO agent code, NO RAG system, NO automation
exists. This constitution is the foundational blueprint.

**Anti-Pattern Policy:** This constitution rejects process porn and over-engineering.
Every principle must be executable with minimal overhead. Validation must be simple
before becoming sophisticated. Formal schemas, matrices, and duplicate logs are
forbidden until they provide measurable value.

---

## I. Foundational Principles (IMMUTABLE)

### 1. Progressive Enhancement Over Big Bang

**Principle:** The system MUST be built in phases, each delivering independent value
before moving to the next. No phase may be started until its predecessor demonstrates
measurable success.

**Rationale:** Zero-state projects fail when attempting full automation immediately.
Manual workflows validate assumptions before investing in automation.

**Enforcement:**
- Each phase MUST define success criteria before starting
- Phase N+1 CANNOT begin until Phase N gates pass
- Regression to earlier phase is acceptable; skipping ahead is forbidden

### 2. Explicit State Over Implicit Context

**Principle:** All agent workflows MUST operate on explicit STATE objects passed
between stages. No agent may assume context from prior interactions not captured
in STATE.

**STATE Contract:**
```json
{
  "objective": "string (original user task)",
  "phase": "string (current execution phase)",
  "context": {
    "skip_rag": "boolean (whether to bypass retrieval)",
    "complexity": "TRIVIAL|SIMPLE|MEDIUM|COMPLEX",
    "max_files": "number (scope constraint)"
  },
  "artifacts": {
    "tasks": ["array of subtasks"],
    "files_touched": ["array of file paths"],
    "snippets": ["code examples from retrieval"],
    "changes": [{"file": "path", "status": "NEW|MODIFIED|DELETED"}]
  },
  "validation": {
    "build": "PASS|FAIL|SKIP",
    "test": "PASS|FAIL|SKIP",
    "lint": "PASS|FAIL|SKIP",
    "coverage": "number (0.0-1.0)"
  },
  "metadata": {
    "attempts": "number (1-2)",
    "duration_sec": "number",
    "cost_usd": "number (if API mode)"
  }
}
```

**Validation Rules (enforced at handoff):**
- `objective` MUST be non-empty string (≥5 chars)
- `phase` MUST be one of: `phase-1`, `phase-2`, `phase-3`
- `context.complexity` MUST be one of: `TRIVIAL`, `SIMPLE`, `MEDIUM`, `COMPLEX`
- `context.max_files` MUST be integer 1-200
- `artifacts.tasks` MUST be non-empty array when PLANNER involved
- `validation.coverage` MUST be number 0.0-1.0
- `metadata.attempts` MUST be 1 or 2
- `metadata.duration_sec` MUST be ≥0

**Rationale:** Explicit STATE enables manual intervention (Sonnet-Only mode),
automated orchestration (Blueprint mode), and forensic debugging when workflows fail.
Simple validation rules prevent malformed handoffs without schema overhead.

**Validation Command:** `python scripts/check_state.py <state.json>` validates STATE fields.
Required fields: `objective` (string ≥5), `phase` ∈ {phase-1,phase-2,phase-3},
`context.skip_rag` (bool), `context.complexity` ∈ {TRIVIAL,SIMPLE,MEDIUM,COMPLEX},
`context.max_files` [1..200], `artifacts.tasks` (≥1), `validation.{build,test,lint}` ∈ {PASS,FAIL,SKIP},
`validation.coverage` [0..1], `metadata.attempts` [1..2], `metadata.duration_sec` ≥0, `metadata.cost_usd` ≥0.

**Strict Mode:** `python scripts/check_state.py --strict <state.json>` validates 3 extra consistency rules:
- `artifacts.files_touched` MUST be non-empty when `artifacts.changes` is non-empty
- `artifacts.snippets` MUST be non-empty when `context.skip_rag=false`
- `validation.test` MUST be PASS|FAIL when `artifacts.files_touched` contains test files

**Enforcement:**
- SUPERVISOR MUST validate STATE before proceeding (manual check Phase 1, `check_state.py` Phase 2+)
- Invalid STATE triggers workflow restart with error details
- Handoffs MUST include: `HANDOFF: NEXT_AGENT | STATE: {...}`
- Use `--strict` in Phase 2+ for consistency enforcement (Phase 1: optional)

### 3. Security First Over Convenience

**Principle:** AI-generated code is UNTRUSTED. Security constraints MUST NOT be
bypassed for convenience. All execution MUST be sandboxed (when automated), secrets
MUST be excluded, network MUST be isolated during validation.

**Security Policies (enforce by phase):**

**Phase 1 (Manual):**
- Generated code MUST be reviewed before execution
- NO execution of code that accesses environment variables, filesystem outside repo, or network
- **Critical:** If generated snippet touches filesystem/network, DO NOT execute — review only
- Secrets (API keys, tokens) MUST be masked in logs (replace with `***`)

**Phase 2+ (Automated):**
- Docker sandbox MUST enforce: `--network=none`, `--read-only`, non-root user
- Resource quotas MUST be enforced: 1 CPU, 512MB RAM, 5min timeout
- Command allowlist MUST validate before execution
- Forbidden patterns MUST be blocked: `curl`, `wget`, `eval`, `os.system`, destructive ops

**Audit Requirements (Phase 3+):**
- All validation attempts MUST be logged (even failures)
- Logs MUST be retained 90 days minimum
- Sandbox escapes MUST trigger security audit and workflow halt

**Rationale:** Generated code can contain RCE vectors, credential leaks, or quota
exhaustion. Security must be baked in from Phase 1, not retrofitted later.

**Enforcement:**
- Phase 1: Manual code review before execution (human-in-loop)
- Phase 2+: CI validates `--network=none` in validation jobs
- Attempted network access = FAIL + audit event (Phase 3+)

### 4. Test-First Over Implementation-First

**Principle:** For any feature with testable behavior, tests MUST be written,
committed, and verified to FAIL before implementation begins.

**Test Categories (in order):**
1. **Contract tests** - API/interface schemas (fail on missing implementation)
2. **Integration tests** - User story scenarios (fail on missing workflows)
3. **Unit tests** - Edge cases and validation (fail on missing functions)

**Rationale:** Tests written after code are biased toward making existing code pass.
Tests written first define the contract implementation must satisfy.

**Enforcement:**
- VALIDATOR agent MUST reject tasks without pre-existing failing tests
- Git commits of tests MUST precede commits of implementation
- Coverage threshold (≥70%) applies only to intentionally tested code

### 5. Retrieval Quality Over Retrieval Speed

**Principle:** When RAG is implemented, it MUST meet minimum quality thresholds
before being trusted for production use. A slow, accurate retriever beats a fast,
inaccurate one.

**Quality Baselines (enforce only when RAG exists):**
- **Recall@10 ≥ 70%** - Top-10 results must contain 70% of relevant documents
- **Precision@5 ≥ 60%** - Top-5 results must be 60% relevant
- **Latency p95 < 500ms** - 95th percentile retrieval under half-second

**Ingestion Caps (prevents index explosion):**
- **max_bytes_per_doc** = 1MB (skip files >1MB during indexing)
- **max_docs_per_run** = 10,000 (batch limit for incremental ingestion)

**Gold Standard Format (`docs/rag-gold.jsonl`):**
```jsonl
{"query_id": "q001", "query": "How to handle errors?", "relevant_docs": ["src/errors.py:1-50"], "rationale": "Error handling utilities"}
{"query_id": "q002", "query": "Database connection pattern", "relevant_docs": ["src/db.py:10-30", "tests/test_db.py:5-20"], "rationale": "Connection pooling example"}
```

**Relevance Definition:** A document is relevant when its `doc_id` (file:line_range)
matches the gold standard at the same granularity (chunk/file level) and directly
answers the query.

**Reactivation Policy:** When RAG is disabled due to Recall@10 < 65%, it MAY be
re-enabled only after weekly evaluation shows ≥70% recall for 1 consecutive week
(no "2 consecutive runs" overhead).

**Rationale:** Poor RAG quality (< 60% recall) causes implementer agents to work
without proper context, increasing bug rate 30-40% and reducing first-attempt
success from 80% to 50%. Ingestion caps prevent runaway index growth.

**Enforcement (when RAG implemented):**
- RAG MUST NOT be enabled until gold standard evaluation passes
- Fallback to grep/manual search MUST be available when confidence < 0.6
- Weekly eval failures MUST trigger automatic RAG disable
- Ingestion MUST skip files exceeding max_bytes_per_doc and log warning

### 6. Observability Over Optimism

**Principle:** Every task execution (manual or automated) MUST emit structured events
to enable forensic analysis, cost attribution, and success rate tracking.

**Event Schema (minimum required fields):**
```jsonl
{"event_id":"uuid","timestamp":"2025-10-04T10:30:00Z","task_id":"t123","objective":"Add multiply fn","mode":"sonnet_only","agent_chain":["SUPERVISOR","PLANNER","IMPLEMENTER","VALIDATOR","REPORTER"],"outcome":{"status":"SUCCESS","duration_sec":45,"attempts":1},"cost":{"total_usd":0.0,"model_breakdown":{"sonnet":0.0}},"quality":{"validation":{"build":"PASS","test":"PASS","lint":"PASS","coverage":0.85}},"decision":{"used_gpt5":false,"shadow_mode":false}}
```

**Output Format:** JSON Lines (`logs/events.jsonl`) - one event per line, no pretty-print

**File Location:** Single log file at `logs/events.jsonl` (no duplicate decision logs)

**Phase 1 Requirement:** Manual emission (copy STATE → format as event → append to logs/events.jsonl)

**Phase 3 Requirement:** Automated emission via `observability.py` module

**Circuit Breakers (Phase 3+):**
- Daily cost limit MUST halt execution at threshold, alert at 80%
- Failure rate MUST alert if >5 failures in 1 hour
- API degradation MUST activate fallback if >3 5xx errors in 10 minutes

**Rationale:** Without structured logging, you cannot answer:
- "Why is success rate dropping?"
- "Where is cost spiking?"
- "Which task types fail most?"

**Enforcement:**
- Events MUST be emitted even for failed workflows
- Log rotation MUST preserve 90 days minimum
- Dashboard generation (daily summary) MUST run automated (Phase 3+)

### 7. Shadow Validation Over Blind Deployment

**Principle:** Any automated decision engine (cost routing, complexity estimation,
RAG confidence thresholds) MUST operate in shadow-mode for 2-4 weeks before
production activation.

**Shadow-Mode Protocol (enforce only when decision engine exists):**
1. **Weeks 1-2:** Engine predicts but does NOT act; always use safe default (Sonnet)
2. **Week 3:** Analyze shadow log; calculate accuracy vs ground truth
3. **Week 4:** Tune thresholds if accuracy 70-80%, extend shadow if < 70%
4. **Week 5+:** Activate production ONLY if accuracy > 80% AND net benefit proven

**Accuracy Metric:**
- **Correct prediction** = Actual outcome matched predicted need
- **False positive** = Predicted complex, was actually simple (wasted cost)
- **False negative** = Predicted simple, actually needed complex (poor quality)

**Rationale:** Untested routing wastes money (false positives) or ships bugs
(false negatives). Shadow mode calibrates with zero production impact.

**Enforcement (when decision engine exists):**
- Production activation REQUIRES shadow analysis report showing accuracy > 80%
- Accuracy < 75% MUST trigger re-tuning or feature flag disable
- Shadow logs MUST be retained for quarterly re-evaluation

### 8. Stack Agnostic Over Stack Specific

**Principle:** The system MUST detect and adapt to project tech stacks (Node.js,
Python, Java, Go, etc.) without hardcoded assumptions or manual configuration.

**Detection Mechanism:**
- Scan for manifest files: `package.json`, `requirements.txt`, `pom.xml`, `go.mod`, etc.
- Return stack identifier: `nodejs`, `python`, `java-maven`, `java-gradle`, `go`
- Map to commands: `npm test` vs `pytest` vs `mvn test` vs `go test`

**Adapter Interface:**
```python
def detect_stack(repo_path: str) -> str:
    """Returns: 'nodejs' | 'python' | 'java-maven' | 'java-gradle' | 'go'"""

def run_build(stack: str) -> Result:
    """Maps to: npm run build | pip install | mvn compile | go build"""

def run_tests(stack: str) -> Result:
    """Maps to: npm test | pytest | mvn test | go test"""
```

**Rationale:** Hardcoded stack assumptions break when integrating with brownfield
projects. Detection + adapters enable drop-in usage.

**Enforcement:**
- New stack support MUST NOT require changes to agent prompts
- Stack detection MUST run before Phase 1 (planning) begins
- Unsupported stack MUST warn, not fail (fallback to manual commands)

---

## II. Bootstrap Phases (BUILD-OUT ROADMAP)

### Phase 0: Foundation (COMPLETE)

**State:** Templates exist (`.specify/templates/`), documentation exists
(`caos-planos/`), no implementation code.

**Deliverables:**
- ✅ Constitution v2.1.0 (this document)
- ✅ Specification template (spec-template.md)
- ✅ Planning template (plan-template.md)
- ✅ Tasks template (tasks-template.md)

**Success Criteria:**
- Constitution ratified
- Templates validated against constitutional principles
- No code implementation required

**Timeline:** Complete (foundation-only phase)

---

### Phase 1: Sonnet-Only Manual Workflow (NEXT)

**Objective:** Validate agent workflow and STATE protocol manually via Claude Code,
zero API costs, human-in-loop at every handoff.

**Scope:**
- Create 6 agent prompt files (SUPERVISOR, PLANNER, RETRIEVER, IMPLEMENTER, VALIDATOR, REPORTER)
- Define STATE schema and handoff protocol
- Use basic tools: `grep`, `read`, `bash`, `write`
- Manual copy-paste STATE between agents

**Mandatory Deliverables:**
```
prompts/agents/
├── 00_supervisor.md     # Analyzes task, validates STATE, sets skip_rag
├── 01_planner.md        # Breaks into tasks, identifies files, generates RAG queries
├── 02_retriever.md      # grep/read search, returns snippets, confidence score
├── 03_implementer.md    # Generates code from snippets/patterns
├── 04_validator.md      # Runs build/test/lint, max 2 attempts
└── 05_reporter.md       # Summarizes outcome, emits FIM

scripts/
└── check_state.py       # Simple Python validator (if/else rules, NOT JSON Schema)

examples/state/
├── valid_handoff_1.json  # SUPERVISOR → PLANNER
├── valid_handoff_2.json  # PLANNER → IMPLEMENTER (skip_rag=true)
└── valid_handoff_3.json  # VALIDATOR → REPORTER (success)
```

**Success Criteria:**
- Complete 10 trivial tasks (config changes, lint rules) at 80% success rate
- Complete 5 simple tasks (new function + tests) at 60% success rate
- STATE protocol proves robust (no ad-hoc context passing)
- Manual workflow averages < 10 min/task
- 90% of handoffs have valid STATE (manual verification)

**Exit Gates (ALL must pass):**
- ✅ All 6 agent prompts created and tested
- ✅ STATE validation script (check_state.py) exists and passes on ≥3 handoffs
- ✅ Lint baseline recorded: `git rev-parse HEAD` + current violation count
- ✅ Coverage baseline recorded: current `main` branch coverage percentage
- ✅ 10+ trivial tasks completed at ≥80% success rate
- ✅ 5+ simple tasks completed at ≥60% success rate
- ✅ 95% of handoffs have valid STATE (manual verification with check_state.py)

**Timeline:** 1 week (agent prompt creation + validation)

**Cost:** $0 (uses Claude Max subscription)

---

### Phase 2: RAG Core (After Phase 1 Success)

**Objective:** Implement semantic code search to improve RETRIEVER accuracy from
~60% (grep) to ~80% (hybrid BM25+Vector).

**Scope:**
- OpenSearch already running (docker-compose.rag.yml) ✅
- Ingest scripts exist (scripts/ingest_to_opensearch.py) ✅
- **MISSING:** Core retrieval functions (`src/rag/retriever.py`)
- **MISSING:** Reranker (RRF + Cross-Encoder)
- **MISSING:** Integration with RETRIEVER agent

**Implementation Checklist:**
```
src/rag/
├── __init__.py
├── retriever.py         # bm25_search(), vector_search(), hybrid_search()
├── reranker.py          # rrf_fusion(), cross_encoder_rerank()
└── embeddings.py        # SentenceTransformer wrapper

tests/rag/
├── test_retriever.py    # Unit tests for search functions
├── test_reranker.py     # RRF and CE reranking validation
└── test_integration.py  # End-to-end with OpenSearch

docs/
└── rag-gold.jsonl       # Gold standard (canonical format, ≥50 queries)
```

**Success Criteria:**
- Recall@10 ≥ 70% on project-specific gold standard (docs/rag-gold.jsonl)
- Reranker shows +20% recall improvement vs BM25-only
- Latency p95 < 500ms
- RETRIEVER agent success rate improves from 60% → 75%

**Timeline:** 2-3 weeks (11-15h implementation + validation)

**Cost:** $0 (local models: all-MiniLM-L6-v2, cross-encoder/ms-marco-MiniLM-L-6-v2)

**Exit Gate:** RAG gold standard evaluation passes (Recall@10 ≥ 70%) AND manual
testing shows RETRIEVER returning relevant snippets 75% of the time.

---

### Phase 3: Blueprint Automation (After Phase 2 Success)

**Objective:** Convert manual Sonnet-Only workflow to automated API orchestration
with observability, sandboxed validation, and decision engine.

**Scope:**
- API orchestrator (calls Anthropic/OpenAI APIs)
- Docker sandbox for ci_validate
- Structured events (logs/events.jsonl)
- Decision engine with shadow-mode
- GitHub Actions integration

**Implementation Checklist:**
```
src/
├── orchestrator_api.py      # Main API orchestration loop
├── decision_engine.py       # Shadow-mode + production routing
├── sandbox.py               # Docker wrapper for validation
└── observability.py         # Event emission + dashboard

docker/
├── Dockerfile.sandbox       # Validation sandbox image
└── safe-ai-cli.py           # Command allowlist wrapper

.github/workflows/
└── ai-assist.yml            # Issue label → automated PR
```

**Success Criteria:**
- Shadow-mode runs 2-4 weeks, achieves 80% decision accuracy
- Sandboxed validation prevents network access, enforces quotas
- Daily dashboard shows cost/task, success rate, RAG quality
- Automated workflow handles 20+ tasks/day at 80% success rate

**Timeline:** 4-6 weeks (32h implementation + shadow validation)

**Cost:** ~$200-500/month during shadow (100% Sonnet usage for testing)

**Exit Gate:** Shadow-mode analysis shows decision engine accuracy > 80% AND
automated workflow matches manual Sonnet-Only success rate (± 5%) before activating
production routing.

---

## III. Quality Gates (ENFORCE PER PHASE)

### Code Quality (Phase 1+)

**Enforced by:** VALIDATOR agent

**Gates:**
- **Build Success** - Zero compilation/transpilation errors
- **Test Pass** - 100% of written tests pass (no skips without justification)
- **Lint Ratcheting** - No NEW violations vs. baseline (baseline = Phase 1 start)
- **Coverage Ratcheting** - Line coverage MUST NOT decrease vs. main branch

**Ratcheting Policy:**
- Baseline recorded at Phase 1 start: `git rev-parse HEAD` + current violation count
- New code MUST NOT introduce violations
- Existing violations tolerated until technical debt paid
- Per-critical-path modules MAY have explicit ≥70% coverage threshold

**Retry Logic:**
- Max 2 attempts per task
- Attempt 1 fail → VALIDATOR hands back to IMPLEMENTER with validation_errors
- Attempt 2 fail → REPORTER marks FAIL, exits workflow

### RAG Quality (Phase 2+)

**Enforced by:** Weekly CI evaluation (eval_rag.py)

**Gates:**
- **Recall@10** - ≥70% of relevant docs in top-10 results
- **Precision@5** - ≥60% of top-5 results are relevant
- **Latency p95** - <500ms for 95th percentile queries
- **Gold Standard** - ≥50 query-answer pairs in docs/rag-gold.jsonl

**Degradation Handling:**
- If Recall@10 < 65%, disable RAG immediately, fallback to grep
- If latency p95 > 1000ms, reduce top-K from 10 → 5
- Alert on quality drop > 10% week-over-week
- Reactivation requires 1 week of ≥70% recall (no arbitrary "2 consecutive runs")

### Decision Engine Accuracy (Phase 3+)

**Enforced by:** Shadow-mode analysis (post 2-4 weeks)

**Gates:**
- **Shadow Accuracy** - ≥80% correct routing decisions
- **Net Benefit** - (cost saved via Sonnet) > (cost wasted via unnecessary GPT-5)
- **Minimum Samples** - ≥50 tasks analyzed before production activation

**Production Monitoring:**
- Weekly re-evaluation of decision accuracy
- Automatic fallback to Sonnet-only if accuracy drops < 75%
- Quarterly shadow-mode refresh (1 week) to recalibrate

---

## IV. Governance

### Amendment Process

1. **Proposal** - Document change with rationale, impact analysis, version bump
2. **Validation** - Update affected templates (plan/spec/tasks) to reflect change
3. **Approval** - Demonstrate change improves success rate, cost, or security
4. **Migration** - If breaking (MAJOR bump), provide migration guide

### Version Semantics

- **MAJOR (X.0.0)** - Breaking: STATE schema, workflow order, or principle removal
- **MINOR (x.Y.0)** - Additive: New principle, phase, or quality gate
- **PATCH (x.y.Z)** - Clarifications, typo fixes, threshold adjustments

### Compliance Review

- Agent prompts MUST reference applicable constitutional principles
- Phase advancement REQUIRES demonstrating prior phase success criteria
- Quality gate thresholds MAY be lowered during bootstrap, MUST NOT be removed
- Sandbox configuration MUST NOT be bypassed without documented exception

### Current Phase Status

**Active Phase:** Phase 0 (Foundation) - Complete
**Next Phase:** Phase 1 (Sonnet-Only Manual Workflow)
**Blocked Phases:** 2 (RAG), 3 (Automation) until Phase 1 success criteria met

### Operational References

- Sonnet-Only workflow guide: `caos-planos/SONNET_ONLY_INTERACTIVE_GUIDE.md`
- Blueprint v5.2 architecture: `caos-planos/blueprint-v5.2-production-ready.md`
- End-to-end integration: `caos-planos/END_TO_END_WORKFLOW.md`
- RAG implementation status: `caos-planos/RAG_IMPLEMENTATION_STATUS.md`

---

**Version**: 2.1.2
**Ratified**: 2025-10-04
**Last Amended**: 2025-10-04 (PATCH: operational safety caps)
**Next Review**: After Phase 1 completion (est. 2025-10-11)
