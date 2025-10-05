# Sonnet-Only Mode - Interactive Workflow Guide

**Cost:** $0/month (uses Claude Max 20x plan)
**Mode:** Interactive agent handoffs in Claude Code
**No API calls. No costs. 100% manual orchestration.**

---

## ⚠️ IMPORTANT: This is NOT automated

This workflow is **intentionally manual** to:
- ✅ Avoid API costs ($0/month)
- ✅ Give you full control over each step
- ✅ Learn from agent reasoning at each stage
- ✅ Intervene when needed

**If you want automation**, consider upgrading to Blueprint v5.2 (with costs).

---

## The 6-Agent Workflow

```
YOU → SUPERVISOR → PLANNER → RETRIEVER → IMPLEMENTER → VALIDATOR → REPORTER → FIM
     (manual)     (manual)    (manual)     (manual)      (manual)     (manual)
```

Each arrow is a **manual handoff** where you:
1. Read the agent's output
2. Copy the `HANDOFF` line
3. Invoke the next agent with `@<agent_file>.md`
4. Paste the STATE

---

## Step-by-Step Example

### Task: "Add multiply(a,b) function with tests"

---

### Step 1: Invoke SUPERVISOR

**In Claude Code (VS Code), type:**

```
@prompts/agents/00_supervisor.md I want to add a multiply(a,b) function with tests
```

**SUPERVISOR analyzes and responds:**

```markdown
# SUPERVISOR ANALYSIS

**Task:** Add multiply(a,b) function with tests
**Complexity:** SIMPLE (1 file + 1 test file)
**Scope:** 2 files max
**Skip RAG?** Yes (trivial task, patterns obvious)

**Decision:** Approve and handoff to PLANNER

HANDOFF: PLANNER | STATE: {"objective":"Add multiply(a,b) with tests","skip_rag":true,"max_files":2}
```

---

### Step 2: Invoke PLANNER

**Copy the STATE from SUPERVISOR, then type:**

```
@prompts/agents/01_planner.md

Current State:
{"objective":"Add multiply(a,b) with tests","skip_rag":true,"max_files":2}
```

**PLANNER responds:**

```markdown
# PLANNER BREAKDOWN

**Tasks:**
1. Create src/multiply.js with multiply(a,b) function
2. Create tests/multiply.test.js with test cases
3. Update src/index.js exports

**Files to touch:** ["src/multiply.js", "tests/multiply.test.js", "src/index.js"]

**Acceptance criteria:**
- Tests pass
- Coverage ≥80%
- Lint pass

**Skip RAG?** Yes (task marked skip_rag=true)

HANDOFF: IMPLEMENTER | STATE: {"objective":"Add multiply(a,b) with tests","skip_rag":true,"tasks":["Create src/multiply.js","Create tests","Update exports"],"files_touched":["src/multiply.js","tests/multiply.test.js","src/index.js"],"acceptance_criteria":["Tests pass","Coverage ≥80%","Lint pass"]}
```

**Note:** PLANNER skipped RETRIEVER because `skip_rag=true`

---

### Step 3: Invoke IMPLEMENTER

**Copy the STATE from PLANNER:**

```
@prompts/agents/03_implementer.md

Current State:
{"objective":"Add multiply(a,b) with tests","skip_rag":true,"tasks":["Create src/multiply.js","Create tests","Update exports"],"files_touched":["src/multiply.js","tests/multiply.test.js","src/index.js"],"acceptance_criteria":["Tests pass","Coverage ≥80%","Lint pass"]}
```

**IMPLEMENTER responds:**

```javascript
# IMPLEMENTER OUTPUT

## File 1: src/multiply.js (NEW)

/**
 * Multiply two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
export function multiply(a, b) {
  return a * b;
}

## File 2: tests/multiply.test.js (NEW)

import { multiply } from '../src/multiply.js';

describe('multiply', () => {
  test('multiplies positive numbers', () => {
    expect(multiply(2, 3)).toBe(6);
  });

  test('multiplies negative numbers', () => {
    expect(multiply(-2, 3)).toBe(-6);
  });

  test('multiplies by zero', () => {
    expect(multiply(5, 0)).toBe(0);
  });
});

## File 3: src/index.js (MODIFIED)

// Add to exports:
export { multiply } from './multiply.js';

HANDOFF: VALIDATOR | STATE: {"objective":"Add multiply(a,b) with tests","changes":[{"file":"src/multiply.js","status":"NEW"},{"file":"tests/multiply.test.js","status":"NEW"},{"file":"src/index.js","status":"MODIFIED"}],"acceptance_criteria":["Tests pass","Coverage ≥80%","Lint pass"]}
```

**👉 YOU NOW APPLY THE CHANGES:**
1. Create `src/multiply.js` with the code above
2. Create `tests/multiply.test.js` with tests
3. Update `src/index.js` exports

---

### Step 4: Invoke VALIDATOR

**After applying changes, run validation yourself:**

```bash
npm run build
npm test
npm run lint
npm run coverage
```

**Then report results to VALIDATOR:**

```
@prompts/agents/04_validator.md

Current State:
{"objective":"Add multiply(a,b) with tests","changes":[...],"acceptance_criteria":["Tests pass","Coverage ≥80%","Lint pass"]}

Validation Results:
- Build: PASS
- Tests: PASS (3 tests)
- Lint: PASS
- Coverage: 85.3% (line coverage)
```

**VALIDATOR responds:**

```markdown
# VALIDATOR ASSESSMENT

**Results:**
- ✅ Build: PASS
- ✅ Tests: PASS (3/3)
- ✅ Lint: PASS
- ✅ Coverage: 85.3% (≥80% ✓)

**Overall:** PASS

**Decision:** All criteria met. Ready for report.

HANDOFF: REPORTER | STATE: {"objective":"Add multiply(a,b) with tests","validation":{"build":"PASS","test":"PASS","lint":"PASS","coverage":0.853},"overall":"PASS"}
```

---

### Step 5: Invoke REPORTER

**Final handoff:**

```
@prompts/agents/05_reporter.md

Current State:
{"objective":"Add multiply(a,b) with tests","validation":{"build":"PASS","test":"PASS","lint":"PASS","coverage":0.853},"overall":"PASS"}
```

**REPORTER responds:**

```markdown
# Implementation Report: Add multiply(a,b) function

**Status:** ✅ SUCCESS
**Duration:** ~5 minutes
**Attempts:** 1

## Summary

Successfully implemented `multiply(a,b)` function with comprehensive test coverage. All validation checks passed on first attempt.

## Changes Made

- ✅ `src/multiply.js` (NEW) - Core multiply function
- ✅ `tests/multiply.test.js` (NEW) - 3 test cases
- ✅ `src/index.js` (MODIFIED) - Added export

## Validation Results

| Check    | Status | Details           |
|----------|--------|-------------------|
| Build    | ✅ PASS | No errors         |
| Tests    | ✅ PASS | 3/3 passing       |
| Lint     | ✅ PASS | No violations     |
| Coverage | ✅ PASS | 85.3% (target 80%) |

## Acceptance Criteria

- [x] Tests pass
- [x] Coverage ≥80%
- [x] Lint pass

## Next Steps

None. Task complete. Ready to commit.

FIM
```

**✅ DONE! The workflow is complete when you see `FIM`**

---

## When to Use RETRIEVER

If PLANNER says `needs_rag: true`, insert RETRIEVER step:

**After PLANNER, before IMPLEMENTER:**

```
@prompts/agents/02_retriever.md

Current State:
{..."rag_queries":["How are functions exported in this project?"]}
```

**RETRIEVER will:**
1. Search codebase with grep/read
2. Find 3-5 relevant code snippets
3. Return with confidence score

**Then continue to IMPLEMENTER with snippets included.**

---

## Retry Logic

If VALIDATOR says **FAIL** and `attempt=1`:

**VALIDATOR will handoff back to IMPLEMENTER:**

```markdown
HANDOFF: IMPLEMENTER | STATE: {...,"attempt":2,"validation_errors":["Test X failed","Lint error Y"]}
```

**You then:**
1. Fix the issues based on validation errors
2. Invoke IMPLEMENTER again with the updated STATE
3. Apply new changes
4. Re-run validation
5. Invoke VALIDATOR again

**Max 2 attempts total.** If attempt=2 fails, VALIDATOR hands off to REPORTER with FAIL status.

---

## Why Manual?

### Pros:
- ✅ **$0/month** (no API costs)
- ✅ **Full control** (review each step)
- ✅ **Learning** (see agent reasoning)
- ✅ **Intervention** (fix issues immediately)

### Cons:
- ❌ **Slower** (~5 min vs ~30 sec automated)
- ❌ **Manual copying** (handoff states)
- ❌ **Requires attention** (can't walk away)

---

## Tips for Speed

1. **Keep agent files open** in tabs (00-05)
2. **Use keyboard shortcuts** for @mentions
3. **Copy STATE immediately** after each response
4. **Pre-run validation** before invoking VALIDATOR
5. **Use templates** for common tasks

---

## Template for Quick Copy-Paste

**Starting a task:**
```
@prompts/agents/00_supervisor.md <YOUR TASK HERE>
```

**Each handoff:**
```
@prompts/agents/<NEXT_AGENT>.md

Current State:
<PASTE STATE FROM PREVIOUS AGENT>
```

---

## Comparison: Manual vs Automated

| Feature | Sonnet-Only (Manual) | Blueprint v5.2 (Auto) |
|---------|----------------------|-----------------------|
| **Cost** | $0/month | ~$200-500/month |
| **Speed** | ~5 min per task | ~30 sec per task |
| **Control** | Full | Delegated |
| **RAG** | Manual grep | Hybrid BM25+Vector |
| **Validation** | You run commands | Auto-runs |
| **Learning** | High (see reasoning) | Low (black box) |

---

## Next Steps

1. ✅ Read [prompts/agents/00_supervisor.md](../prompts/agents/00_supervisor.md)
2. ✅ Try a simple task (change ESLint rule)
3. ✅ Graduate to medium task (add new function)
4. ✅ Track your workflow speed
5. ✅ After 10-20 tasks, decide: keep manual or upgrade to automation

---

## FAQ

**Q: Can I automate this?**
A: Yes, but it requires API calls ($$$). See Blueprint v5.2.

**Q: What if I mess up the STATE?**
A: Just restart from SUPERVISOR. STATE is cumulative, so missing fields will break downstream agents.

**Q: Can I skip agents?**
A: Only RETRIEVER (if `skip_rag=true`). Otherwise, follow the exact workflow.

**Q: How do I know if a task is too complex?**
A: SUPERVISOR will reject it and ask you to break it down.

---

**Ready to try?** Start with:

```
@prompts/agents/00_supervisor.md Change ESLint no-console rule to warning
```

🤖 Happy agent orchestration! (manually) 😊
