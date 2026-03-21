---
phase: 4
slug: graph-construction
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-21
---

# Phase 4 — Validation Strategy

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
| 04-01-01 | 01 | 1 | GRPH-01, GRPH-02 | unit | `pnpm test -- --filter upload` | ❌ W0 | ⬜ pending |
| 04-01-02 | 01 | 1 | GRPH-03 | unit | `pnpm test -- --filter build-status` | ❌ W0 | ⬜ pending |
| 04-02-01 | 02 | 2 | GRPH-04, GRPH-05 | unit | `pnpm test -- --filter graph` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `pnpm add reagraph react-dropzone` — graph + upload dependencies
- [ ] `tests/features/graph/upload.test.tsx` — stubs for upload component
- [ ] `tests/features/graph/graph-transforms.test.ts` — stubs for data transformation

*Test infrastructure exists from Phase 1.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Drag-and-drop file upload works | GRPH-01 | Browser file API | Drag files onto upload zone, verify they appear in list |
| Graph renders with zoom/pan | GRPH-04 | WebGL rendering | Build a graph, verify interactive visualization loads |
| Node click opens detail panel | GRPH-05 | WebGL event handling | Click a node, verify side panel slides out with entity info |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 25s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
