---
phase: 1
slug: infrastructure-and-api-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-20
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x + @testing-library/react + playwright |
| **Config file** | vitest.config.ts (Wave 0 installs) |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test && pnpm test:e2e` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test && pnpm test:e2e`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | INFR-01 | integration | `docker compose up -d && curl localhost:5050/api` | ❌ W0 | ⬜ pending |
| 01-02-01 | 02 | 1 | INFR-02 | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 01-02-02 | 02 | 1 | INFR-03 | unit | `pnpm test -- --filter api-client` | ❌ W0 | ⬜ pending |
| 01-02-03 | 02 | 1 | INFR-04 | unit | `pnpm test -- --filter polling` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` — vitest configuration
- [ ] `playwright.config.ts` — playwright configuration
- [ ] `src/test/setup.ts` — test setup file
- [ ] `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test` — install test dependencies

*Test infrastructure is established as part of Phase 1 scaffold.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Docker backend responds | INFR-01 | Requires running Docker daemon | Run `docker compose up -d`, verify `curl http://localhost:5050/api` returns response |
| Vite dev server connects to backend | INFR-02 | Requires both services running | Start frontend with `pnpm dev`, open browser, check network tab for proxy requests |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
