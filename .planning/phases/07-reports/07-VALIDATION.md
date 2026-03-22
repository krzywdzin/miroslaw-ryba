---
phase: 7
slug: reports
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 7 — Validation Strategy

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
| 07-01-01 | 01 | 1 | REPT-01 | unit | `npx vitest run src/features/reports` | ❌ W0 | ⬜ pending |
| 07-01-02 | 01 | 1 | REPT-02, REPT-03 | unit | `npx vitest run src/features/reports` | ❌ W0 | ⬜ pending |
| 07-02-01 | 02 | 2 | REPT-04 | unit | `npx vitest run src/features/reports` | ❌ W0 | ⬜ pending |
| 07-02-02 | 02 | 2 | REPT-01 | unit | `npx vitest run src/features/reports` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/features/reports/__tests__/` — test directory
- [ ] Test stubs for report store, hooks, and components

*Existing test infrastructure covers framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Markdown renders correctly with tables | REPT-01 | Visual rendering | Load report page, check tables render with borders |
| Print CSS produces clean PDF | REPT-02 | Browser print dialog | Press Ctrl+P, verify clean layout without UI chrome |
| Scroll spy highlights correct section | REPT-01 | Visual scroll tracking | Scroll through report, verify sidebar highlights |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
