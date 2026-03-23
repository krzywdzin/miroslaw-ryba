---
phase: 07-reports
plan: 01
subsystem: ui
tags: [react-markdown, remark-gfm, tailwind-typography, scroll-spy, pdf-export, i18n]

# Dependency graph
requires:
  - phase: 02-shared
    provides: shadcn components, i18n infrastructure, shared hooks
  - phase: 01-foundation
    provides: API client, Zod schemas, routing
provides:
  - ReportPage with state machine (checking/generating/viewing/error)
  - ReportArticle with react-markdown + GFM prose rendering
  - ReportSidebar with scroll spy TOC
  - ReportToolbar with PDF and Markdown export
  - reports i18n namespace (PL + EN)
  - Print CSS for clean PDF export
affects: [07-reports-plan-02, 08-history]

# Tech tracking
tech-stack:
  added: [react-markdown, remark-gfm, "@tailwindcss/typography"]
  patterns: [scroll-spy-with-intersection-observer, state-machine-hook, print-css-for-pdf-export]

key-files:
  created:
    - src/features/reports/pages/ReportPage.tsx
    - src/features/reports/components/ReportArticle.tsx
    - src/features/reports/components/ReportSidebar.tsx
    - src/features/reports/components/ReportToolbar.tsx
    - src/features/reports/components/ReportProgress.tsx
    - src/features/reports/hooks/useReportGeneration.ts
    - src/features/reports/hooks/useScrollSpy.ts
    - src/features/reports/hooks/useReportExport.ts
    - src/features/reports/index.ts
    - src/locales/pl/reports.json
    - src/locales/en/reports.json
  modified:
    - package.json
    - pnpm-lock.yaml
    - src/styles/globals.css
    - src/i18n/config.ts
    - src/app/App.tsx

key-decisions:
  - "Slugify function duplicated in ReportArticle and ReportSidebar for independent rendering consistency"
  - "Print CSS added to globals.css rather than inline style tag for global scope"

patterns-established:
  - "State machine hook pattern: useReportGeneration with checking/generating/viewing/error states"
  - "Scroll spy via IntersectionObserver with rootMargin offset for fixed headers"

requirements-completed: [REPT-01, REPT-02, REPT-03]

# Metrics
duration: 4min
completed: 2026-03-23
---

# Phase 7 Plan 01: Report Viewing and Export Summary

**Report page with react-markdown rendering, scroll spy TOC sidebar, generation progress tracking, and PDF/Markdown export**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-23T12:14:32Z
- **Completed:** 2026-03-23T12:18:38Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments
- Full report viewing page with four-state orchestration (checking, generating, viewing, error)
- Markdown rendered via react-markdown with GFM tables/checklists and Tailwind prose styling
- Sticky TOC sidebar with IntersectionObserver-based scroll spy highlighting
- PDF export via window.print() with comprehensive print CSS and Markdown download via Blob
- Complete i18n coverage in reports namespace (PL + EN)

## Task Commits

Each task was committed atomically:

1. **Task 1: Install packages, configure typography plugin, create i18n namespace and hooks** - `bb48734` (feat)
2. **Task 2: Build report UI components, ReportPage orchestrator, and register routes** - `7841880` (feat)

## Files Created/Modified
- `src/features/reports/pages/ReportPage.tsx` - Page orchestrator with state machine rendering
- `src/features/reports/components/ReportArticle.tsx` - Markdown rendering with prose styling and heading IDs
- `src/features/reports/components/ReportSidebar.tsx` - TOC sidebar with scroll spy active section
- `src/features/reports/components/ReportToolbar.tsx` - PDF and Markdown export buttons
- `src/features/reports/components/ReportProgress.tsx` - Generation progress with section checklist
- `src/features/reports/hooks/useReportGeneration.ts` - Check/generate/poll orchestration hook
- `src/features/reports/hooks/useScrollSpy.ts` - IntersectionObserver scroll spy hook
- `src/features/reports/hooks/useReportExport.ts` - PDF print and Markdown download functions
- `src/features/reports/index.ts` - Barrel export for ReportPage
- `src/locales/pl/reports.json` - Polish translations for reports namespace
- `src/locales/en/reports.json` - English translations for reports namespace
- `src/styles/globals.css` - Typography plugin + print CSS rules
- `src/i18n/config.ts` - Reports namespace registration
- `src/app/App.tsx` - Route registration for /report/:simulationId and /history
- `package.json` - react-markdown, remark-gfm, @tailwindcss/typography dependencies

## Decisions Made
- Slugify function duplicated in ReportArticle and ReportSidebar for independent rendering consistency rather than extracting to a shared utility
- Print CSS added to globals.css rather than an inline style tag for proper global scope and cacheing

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed unused `t` variable in ReportPage wrapper**
- **Found during:** Task 2 (ReportPage creation)
- **Issue:** Outer ReportPage component declared `useTranslation` but only the inner ReportPageContent used it, causing TS6133 unused variable error
- **Fix:** Removed unused `const { t }` from outer component
- **Files modified:** src/features/reports/pages/ReportPage.tsx
- **Verification:** pnpm typecheck passes
- **Committed in:** 7841880 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Minor cleanup, no scope creep.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Report viewing infrastructure complete for plan 02 (history page, chat features)
- Route placeholder at /history ready for implementation
- All report API hooks available for reuse

---
*Phase: 07-reports*
*Completed: 2026-03-23*
