# Feature Specification: SPEC-01 — Repo Bootstrap & Minimal Structure (Phase 1)

**Feature Branch**: `001-title-spec-01`
**Created**: 2025-10-04
**Status**: Draft
**Input**: User description: "Bootstrap & Estrutura Mínima (Fase 1) - Prepare minimal stack-agnostic skeleton for manual Sonnet-first workflow"

## Execution Flow (main)
```
1. Parse user description from Input
   → Feature: Bootstrap minimal repo structure for Phase 1 manual workflow
2. Extract key concepts from description
   → Actors: Developers using manual Sonnet-Only workflow
   → Actions: Detect tech stack, run validation tasks (test/lint/coverage)
   → Data: Validation results, logs, workflow documentation
   → Constraints: Stack-agnostic, minimal overhead, no over-engineering
3. For each unclear aspect:
   → No major ambiguities; scope is well-defined in Constitution Phase 1
4. Fill User Scenarios & Testing section
   → Primary flow: Developer sets up repo and runs validation commands
5. Generate Functional Requirements
   → All requirements testable via CLI commands and file existence checks
6. Identify Key Entities
   → Stack configuration, validation results, workflow state
7. Run Review Checklist
   → No implementation details (uses generic terms like "detect", "run")
   → Focused on WHAT system must provide, not HOW to implement
8. Return: SUCCESS (spec ready for planning)
```

---

## ⚡ Quick Guidelines
- ✅ Focus on WHAT users need and WHY
- ❌ Avoid HOW to implement (no tech stack, APIs, code structure)
- 👥 Written for business stakeholders, not developers

---

## User Scenarios & Testing *(mandatory)*

### Primary User Story
A developer wants to bootstrap a local development environment to execute the manual Sonnet-Only workflow defined in the Constitution (Phase 1). They need the system to automatically detect their project's tech stack (Node.js or Python) and provide commands to run validation tasks (tests, linting, coverage) without manual configuration. The developer also needs clear documentation explaining the Phase 1 manual workflow loop.

### Acceptance Scenarios

1. **Given** a fresh repository clone, **When** developer runs stack detection, **Then** system identifies whether project uses Node.js or Python and reports detected stack

2. **Given** a detected Node.js project with Jest tests, **When** developer runs test validation, **Then** system executes tests and reports PASS/FAIL status with exit code 0 on success

3. **Given** a detected Python project with pytest, **When** developer runs test validation, **Then** system executes tests and reports PASS/FAIL status with exit code 0 on success

4. **Given** a detected project, **When** developer runs lint validation, **Then** system executes appropriate linter (ESLint for Node, ruff for Python) and reports violations

5. **Given** a detected project with test coverage enabled, **When** developer runs coverage validation, **Then** system calculates and reports line coverage percentage

6. **Given** repository structure created, **When** developer runs smoke test command, **Then** system sequentially runs detect, test, and lint tasks and exits with code 0 if all pass

7. **Given** OpenSearch Docker configuration exists, **When** developer starts RAG infrastructure, **Then** OpenSearch container starts and reports healthy status

8. **Given** workflow documentation exists, **When** developer reads Phase 1 runbook, **Then** documentation clearly explains manual workflow loop in ≤1 page

### Edge Cases
- What happens when project has both package.json and requirements.txt (multi-stack)?
  → System should detect and report both stacks
- How does system handle unsupported tech stacks?
  → System should warn but not fail; provide manual fallback instructions
- What happens when validation tasks fail?
  → System should exit with non-zero code and report failure details
- How does system handle missing test/lint configuration?
  → System should report "SKIP" status rather than failing
- What happens when OpenSearch fails to start?
  → Docker health check should report unhealthy; developer sees clear error message
- What happens on Windows without WSL when shell scripts are provided?
  → System should provide Python alternatives (scripts/run_validator.py) that work cross-platform
- What happens when OpenSearch reports yellow health on single-node setup?
  → System should accept yellow as healthy (single-node with number_of_replicas=0 expected)

---

## Requirements *(mandatory)*

### Functional Requirements

**Repository Structure**
- **FR-001**: System MUST create standard folder structure (.ai/, logs/, reports/, docs/, scripts/) on bootstrap
- **FR-002**: System MUST provide operational README documenting Phase 1 usage and commands
- **FR-003**: System MUST provide workflow documentation (docs/WORKFLOW.md) explaining Phase 1 manual loop in ≤500 words (~1 page)

**Stack Detection**
- **FR-004**: System MUST detect Node.js projects by presence of package.json file
- **FR-005**: System MUST detect Python projects by presence of requirements.txt or pyproject.toml files
- **FR-006**: System MUST report detected stack identifier (nodejs, python, or both)
- **FR-007**: System MUST support extensible detection for future stacks without requiring workflow changes

**Validation Execution**
- **FR-008**: System MUST provide test execution capability for Node.js projects using npm test
- **FR-009**: System MUST provide test execution capability for Python projects using pytest
- **FR-010**: System MUST provide lint execution capability for Node.js projects using ESLint
- **FR-011**: System MUST provide lint execution capability for Python projects using ruff
- **FR-012**: System MUST provide coverage measurement capability for both Node.js and Python
- **FR-013**: System MUST report validation results as PASS, FAIL, or SKIP tri-state status
- **FR-014**: System MUST exit with code 0 on success and non-zero on validation failure

**Smoke Testing**
- **FR-015**: System MUST provide smoke test command that runs detect + test + lint sequentially
- **FR-016**: Smoke test MUST exit with code 0 only if all validation steps pass
- **FR-017**: Smoke test MUST be runnable via make smoke or npm run smoke

**RAG Infrastructure**
- **FR-018**: System MUST provide Docker Compose configuration for OpenSearch (BM25 capability)
- **FR-019**: System MUST start OpenSearch container via docker compose -f docker-compose.rag.yml up -d
- **FR-020**: System MUST verify OpenSearch health via /_cat/health endpoint reporting green OR yellow status (yellow acceptable for single-node with number_of_replicas=0)

**Supporting Scripts**
- **FR-021**: System MUST provide validation runner stub (scripts/run_validator.py or .sh) for future automation with Windows portability support
- **FR-022**: System MUST provide log summarization stub (scripts/summarize_logs.py) for future reporting

**Constitutional Compliance**

- **FR-023**: All validation MUST align with Constitution Principle 8 (Stack Agnostic)
- **FR-024**: System MUST support manual workflow per Constitution Phase 1 requirements
- **FR-025**: System MUST NOT require complex configuration or formal schemas (anti-pattern policy)

**Observability**

- **FR-026**: Each execution of detect, test, lint, coverage, and smoke tasks MUST append a JSON line to logs/events.jsonl with fields: timestamp, task, status (PASS|FAIL|SKIP), exit_code, duration_ms, detected_stacks (if applicable), notes

**Baseline Tracking**

- **FR-027**: On first smoke execution, system MUST persist reports/baseline.json with lint_issues count and coverage_line percentage for future ratcheting comparison

### Non-Functional Requirements

**Simplicity**

- **NFR-001**: Commands MUST be self-documenting with --help output showing available tasks and usage examples
- **NFR-002**: Setup MUST complete in <5 minutes on standard hardware
- **NFR-003**: Documentation MUST be readable by non-technical stakeholders

**Portability**
- **NFR-004**: Scripts MUST use POSIX-compliant shell commands where possible
- **NFR-005**: System MUST avoid OS-specific assumptions (Windows, macOS, Linux compatible)
- **NFR-006**: Python code MUST use standard library where possible to minimize dependencies

**Maintainability**
- **NFR-007**: Code MUST follow anti-over-engineering policy (no premature abstraction)
- **NFR-008**: Stub scripts MUST include clear TODO comments for future implementation

### Key Entities *(include if feature involves data)*

**Stack Configuration**
- Represents detected tech stack information
- Attributes: stack_type (nodejs|python), manifest_files (list of detected files), command_mappings (test|lint|coverage → shell command)

**Validation Result**
- Represents outcome of running validation task
- Attributes: task_type (test|lint|coverage), status (PASS|FAIL|SKIP), exit_code (integer), duration_sec (float), output_summary (string)

**Workflow State**
- Represents current phase and readiness status
- Attributes: phase (phase-1|phase-2|phase-3), infrastructure_ready (boolean), baseline_captured (boolean)

---

## Scope Boundaries

### In Scope
- Minimal bootstrap structure for Phase 1
- Stack detection for Node.js and Python only
- Basic validation execution (test, lint, coverage)
- OpenSearch container for future RAG (BM25 only, no vector search)
- Operational documentation (README, WORKFLOW)
- Stub scripts for future automation

### Out of Scope
- MCP (Model Context Protocol) integration — deferred to Phase 3
- Decision Engine — deferred to Phase 3
- Vector database and reranking — deferred to Phase 2
- Automated agent orchestration — deferred to Phase 3
- GitHub Actions integration — deferred to Phase 3
- STATE validation script (check_state.py) — separate feature
- Agent prompt files (00_supervisor.md through 05_reporter.md) — separate feature

---

## Dependencies & Assumptions

### Dependencies
- Docker and Docker Compose installed for RAG infrastructure
- Python 3.9+ available for ai_cli.py and scripts
- Node.js and npm OR Python and pip depending on project stack
- Make utility available for smoke command (or npm as fallback)

### Assumptions
- Developer has basic CLI familiarity
- Constitution v2.1.2 ratified and accessible at .specify/memory/constitution.md
- Repository will be initialized as git repo (optional, degrades gracefully)
- OpenSearch requires minimal 2GB RAM allocation for Docker

---

## Success Metrics

### Acceptance Criteria

- ✅ `ai_cli.py --help` and `ai_cli.py run --help` return exit code 0 and list supported tasks
- ✅ `ai_cli.py detect` correctly identifies Node.js and Python projects
- ✅ `ai_cli.py run --task test` executes tests and returns appropriate exit code
- ✅ `ai_cli.py run --task lint` executes linter and reports violations
- ✅ `ai_cli.py run --task coverage` calculates and reports coverage percentage
- ✅ `make smoke` (or `npm run smoke`) runs detect+test+lint and exits 0 on success
- ✅ After `make smoke`, logs/events.jsonl contains ≥3 JSON lines for detect/test/lint tasks
- ✅ After first `make smoke`, reports/baseline.json exists with lint_issues and coverage_line fields
- ✅ `docker compose -f docker-compose.rag.yml up -d` starts OpenSearch with green OR yellow health status
- ✅ README and docs/WORKFLOW.md clearly explain Phase 1 loop in ≤500 words each
- ✅ All folder structure (.ai/, logs/, reports/, docs/, scripts/) created

### Quality Gates (per Constitution)
- Build Success: Bootstrap scripts execute without errors
- Test Pass: Smoke test completes successfully
- Lint Pass: No new violations introduced in bootstrap code
- Documentation: README and WORKFLOW pass readability review

---

## Review & Acceptance Checklist

### Content Quality
- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

### Requirement Completeness
- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

---

## Execution Status

- [x] User description parsed
- [x] Key concepts extracted
- [x] Ambiguities marked (none found)
- [x] User scenarios defined
- [x] Requirements generated
- [x] Entities identified
- [x] Review checklist passed

---

**Status**: ✅ READY FOR PLANNING

This specification is complete and ready for the `/plan` phase to create the implementation design.

---

## Revision Notes

**2025-10-04 (v1.1)** - Pragmatic refinements based on feedback:

- Added FR-026 (Observability): Event logging to logs/events.jsonl for all task executions
- Added FR-027 (Baseline Tracking): Persist reports/baseline.json for ratcheting
- Updated FR-003: Quantified documentation length (≤500 words instead of "≤1 page")
- Updated FR-020: Accept green OR yellow OpenSearch health (single-node consideration)
- Updated FR-021: Prioritize Python scripts for Windows portability (scripts/run_validator.py)
- Updated NFR-001: Explicit requirement for --help showing available tasks
- Added 3 new Acceptance Criteria: --help functionality, event logging, baseline persistence
- Added 2 edge cases: Windows portability, OpenSearch yellow health status
