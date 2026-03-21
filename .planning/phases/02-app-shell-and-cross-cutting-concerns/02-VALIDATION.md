---
phase: 2
slug: app-shell-and-cross-cutting-concerns
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x + @testing-library/react |
| **Config file** | vitest.config.ts (exists from Phase 1) |
| **Quick run command** | `pnpm test` |
| **Full suite command** | `pnpm test && pnpm typecheck` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm test`
- **After every plan wave:** Run `pnpm test && pnpm typecheck`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | UIUX-01 | unit | `pnpm test` | ❌ W0 | ⬜ pending |
| 02-01-02 | 01 | 1 | I18N-01 | unit | `pnpm test -- --filter i18n` | ❌ W0 | ⬜ pending |
| 02-02-01 | 02 | 1 | UIUX-02, UIUX-03 | unit | `pnpm test -- --filter layout` | ❌ W0 | ⬜ pending |
| 02-02-02 | 02 | 1 | I18N-02, I18N-03 | unit | `pnpm test -- --filter i18n` | ❌ W0 | ⬜ pending |
| 02-03-01 | 03 | 2 | UIUX-05, UIUX-06 | unit | `pnpm test -- --filter loading` | ❌ W0 | ⬜ pending |
| 02-03-02 | 03 | 2 | UIUX-08 | unit | `pnpm test -- --filter error` | ❌ W0 | ⬜ pending |
| 02-03-03 | 03 | 2 | I18N-04 | unit | `pnpm test -- --filter plural` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `tests/components/layout.test.tsx` — stubs for app shell layout tests
- [ ] `tests/i18n/i18n.test.ts` — stubs for i18n initialization and language switching
- [ ] `tests/components/loading.test.tsx` — stubs for loading/error state components

*Test infrastructure exists from Phase 1 (vitest + @testing-library/react).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Polish diacritics render correctly in Geist font | I18N-02 | Visual rendering check | Open app in browser, navigate through all stages, verify ą, ę, ś, ć, ź, ż, ó, ł, ń display correctly |
| Sidebar collapses smoothly on tablet viewport | UIUX-03 | Responsive behavior | Resize browser to <1024px, verify sidebar transitions to drawer |
| Skeleton screens match content layout | UIUX-05 | Visual match | Compare skeleton loading state with loaded content, verify shapes match |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
