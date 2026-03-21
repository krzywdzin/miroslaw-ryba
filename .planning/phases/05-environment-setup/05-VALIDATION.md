---
phase: 5
slug: environment-setup
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x + @testing-library/react |
| **Config file** | vitest.config.ts (exists) |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test && pnpm typecheck` |
| **Estimated runtime** | ~25 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test && pnpm typecheck`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 25 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | ENVR-01, ENVR-02 | unit | `pnpm test -- --filter environment` | ❌ W0 | ⬜ pending |
| 05-01-02 | 01 | 1 | ENVR-03, ENVR-04 | unit | `pnpm test -- --filter environment` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `pnpm dlx shadcn add alert-dialog table` — new shadcn components
- [ ] `tests/features/environment/` — test directory stubs

*Test infrastructure exists from Phase 1.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Entity table sorts and filters | ENVR-01 | Interactive table behavior | Click column headers, use filter inputs |
| Agent profile cards display correctly | ENVR-02 | Visual layout verification | View agent grid, check icon/personality/stance |
| Confirmation dialog before simulation | ENVR-03 | Modal interaction | Click "Uruchom symulację", verify dialog shows params |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 25s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
