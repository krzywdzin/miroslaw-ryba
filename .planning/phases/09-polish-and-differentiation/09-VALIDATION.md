---
phase: 9
slug: polish-and-differentiation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=verbose`
- **After every plan wave:** Run `npx vitest run --reporter=verbose`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | UIUX-04 | unit | `npx vitest run src/hooks/useTheme` | ❌ W0 | ⬜ pending |
| 09-01-02 | 01 | 1 | UIUX-07 | unit | `npx vitest run src/hooks/useKeyboardShortcuts` | ❌ W0 | ⬜ pending |
| 09-02-01 | 02 | 2 | - | build | `npx vitest run --reporter=verbose` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Test stubs for theme hook and keyboard shortcuts hook

*Existing test infrastructure covers framework needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Dark mode renders all pages correctly | UIUX-04 | Visual verification | Toggle dark mode, visit every pipeline page |
| OS preference detection | UIUX-04 | System setting | Change OS to dark, verify app follows |
| FOUC prevention | UIUX-04 | Load timing | Hard refresh, verify no flash |
| Keyboard shortcuts work | UIUX-07 | Global key events | Press 1-5, /, [, ], ? on each page |
| Shortcuts disabled in inputs | UIUX-07 | Focus context | Type in chat input, verify no navigation |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
