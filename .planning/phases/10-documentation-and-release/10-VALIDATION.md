---
phase: 10
slug: documentation-and-release
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.x (existing — no new tests for docs) |
| **Config file** | vitest.config.ts |
| **Quick run command** | `npx vitest run --reporter=verbose` |
| **Full suite command** | `npx vitest run --reporter=verbose` |
| **Estimated runtime** | ~20 seconds |

---

## Sampling Rate

- **After every task commit:** Verify file existence and content structure
- **After every plan wave:** Run full test suite to confirm no regressions
- **Max feedback latency:** 5 seconds (file checks are instant)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 10-01-01 | 01 | 1 | DOCS-01, DOCS-02 | file check | `test -f README.md && test -f README.pl.md` | ✅ | ⬜ pending |
| 10-01-02 | 01 | 1 | DOCS-03, DOCS-04 | file check | `test -f docs/installation.md && test -f docs/configuration.md` | ✅ | ⬜ pending |
| 10-02-01 | 02 | 1 | DOCS-05, DOCS-06 | file check | `test -f CONTRIBUTING.md && test -f LICENSE` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*No test infrastructure needed — documentation phase uses file existence checks.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| README renders correctly on GitHub | DOCS-01 | GitHub markdown rendering | Push to repo, verify rendered README |
| Polish translation is complete | DOCS-02 | Content review | Compare README.md sections with README.pl.md |
| Installation steps work end-to-end | DOCS-03 | Runtime execution | Follow docs/installation.md on clean machine |
| Configuration steps are accurate | DOCS-04 | Runtime verification | Follow docs/configuration.md with real API keys |

---

## Validation Sign-Off

- [ ] All files exist at expected locations
- [ ] No broken links in documentation
- [ ] AGPL-3.0 license text is exact GNU version
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
