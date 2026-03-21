---
phase: 6
slug: simulation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | SIMU-01 | unit | `npx vitest run src/features/simulation` | ❌ W0 | ⬜ pending |
| 06-01-02 | 01 | 1 | SIMU-01 | unit | `npx vitest run src/features/simulation` | ❌ W0 | ⬜ pending |
| 06-02-01 | 02 | 1 | SIMU-02, SIMU-03 | unit | `npx vitest run src/features/simulation` | ❌ W0 | ⬜ pending |
| 06-02-02 | 02 | 1 | SIMU-04 | unit | `npx vitest run src/features/simulation` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/features/simulation/__tests__/` — test directory for simulation feature
- [ ] Test stubs for simulation store, hooks, and components

*Existing test infrastructure (vitest, jsdom, testing-library) covers framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Split-screen layout renders correctly | SIMU-02 | Visual layout verification | Inspect 3-column layout at 1280px+ viewport |
| New posts animate in | SIMU-03 | Animation verification | Start simulation, watch for entrance transitions |
| Timeline round filtering | SIMU-04 | Cross-component interaction | Click round in timeline, verify feeds filter |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
