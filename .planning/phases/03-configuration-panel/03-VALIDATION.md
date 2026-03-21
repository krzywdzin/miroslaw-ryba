---
phase: 3
slug: configuration-panel
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x + @testing-library/react |
| **Config file** | vitest.config.ts (exists from Phase 1) |
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
| 03-01-01 | 01 | 1 | CONF-06 | unit | `pnpm test -- --filter config-store` | ❌ W0 | ⬜ pending |
| 03-01-02 | 01 | 1 | CONF-01, CONF-02, CONF-07 | unit | `pnpm test -- --filter api-config` | ❌ W0 | ⬜ pending |
| 03-02-01 | 02 | 2 | CONF-03, CONF-04 | unit | `pnpm test -- --filter config` | ❌ W0 | ⬜ pending |
| 03-02-02 | 02 | 2 | CONF-05 | unit | `pnpm test -- --filter docker` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `pnpm add react-hook-form @hookform/resolvers` — form dependencies
- [ ] `tests/features/settings/config-store.test.ts` — stubs for Zustand config store
- [ ] `tests/features/settings/api-config.test.tsx` — stubs for API config section

*Test infrastructure exists from Phase 1.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Auto-save persists across refresh | CONF-06 | Requires browser localStorage | Fill in API key, refresh page, verify value persists |
| Docker compose up starts backend | CONF-05 | Requires Docker daemon running | Click "Uruchom backend", verify containers start |
| LLM test generates response | CONF-07 | Requires valid API key + network | Enter valid API key, click "Testuj", verify response |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 25s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
