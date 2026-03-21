---
phase: 02-app-shell-and-cross-cutting-concerns
plan: 03
subsystem: ui
tags: [error-handling, i18n, polish-plurals, loading-states, toast, sonner, skeleton]

requires:
  - phase: 02-01
    provides: shadcn components, i18n config, translation files, sonner toast
  - phase: 01-02
    provides: API error mapping (mapChineseError), ApiError class
provides:
  - Error handler with auto-retry and toast notifications (handleApiError)
  - Loading skeleton component (card/list/text variants)
  - Loading spinner component (sm/md sizes)
  - Inline error alert with retry button
  - Minimum screen width message (1024px gate)
  - Polish plural form verification (all 4 CLDR categories)
affects: [pipeline-stages, data-management, reporting]

tech-stack:
  added: []
  patterns: [auto-retry-with-toast, chinese-error-i18n-mapping, skeleton-loading]

key-files:
  created:
    - src/lib/error-handler.ts
    - src/components/shared/LoadingSkeleton.tsx
    - src/components/shared/LoadingSpinner.tsx
    - src/components/shared/ErrorAlert.tsx
    - src/components/shared/MinScreenMessage.tsx
    - tests/errors/error-handler.test.ts
    - tests/i18n/i18n.test.ts
    - tests/i18n/plurals.test.ts
  modified:
    - src/locales/pl/common.json
    - src/locales/en/common.json

key-decisions:
  - "Error handler uses Map for per-context retry counters enabling independent operation tracking"
  - "MinScreenMessage uses inline CSS media query (not Tailwind) for precise 1024px breakpoint"
  - "Polish plural tests cover all 4 CLDR categories including edge cases (teens, 22, 0)"

patterns-established:
  - "Auto-retry pattern: 2 silent retries then persistent toast with retry button"
  - "Error display pattern: toast for transient, ErrorAlert for inline, both with retry"
  - "Loading pattern: LoadingSkeleton for content areas, LoadingSpinner for buttons/actions"

requirements-completed: [I18N-04, UIUX-05, UIUX-06, UIUX-08]

duration: 3min
completed: 2026-03-21
---

# Phase 2 Plan 3: Cross-Cutting Patterns Summary

**Auto-retry error handler with Chinese error i18n mapping, loading skeleton/spinner components, inline error alert, min-screen gate, and Polish plural form verification across all 4 CLDR categories**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-21T03:02:41Z
- **Completed:** 2026-03-21T03:05:34Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments
- Error handler auto-retries 2x then shows persistent toast with retry button, maps Chinese errors to current locale
- Loading components (skeleton with card/list/text variants, spinner with sm/md sizes) ready for all subsequent phases
- Polish plural forms verified: 17 test cases covering one/few/many/other for simulation and agent nouns
- MinScreenMessage gates viewport below 1024px with translated message
- i18n configuration tests verify namespace loading, language switching, and fallback behavior

## Task Commits

Each task was committed atomically:

1. **Task 1 RED: Error handler tests** - `809a727` (test)
2. **Task 1 GREEN: Error handler implementation** - `1faaaff` (feat)
3. **Task 2: Loading/error components, min-screen, plural tests** - `62e501f` (feat)

## Files Created/Modified
- `src/lib/error-handler.ts` - Auto-retry error handler with toast notifications and Chinese error mapping
- `src/components/shared/LoadingSkeleton.tsx` - Skeleton loading with card/list/text variants
- `src/components/shared/LoadingSpinner.tsx` - SVG spinner with sm/md sizes
- `src/components/shared/ErrorAlert.tsx` - Inline error alert with optional retry button
- `src/components/shared/MinScreenMessage.tsx` - Full-viewport message for screens below 1024px
- `src/locales/pl/common.json` - Added minScreenWidth translation key
- `src/locales/en/common.json` - Added minScreenWidth translation key
- `tests/errors/error-handler.test.ts` - 6 tests for error handler behavior
- `tests/i18n/i18n.test.ts` - 6 tests for i18n configuration
- `tests/i18n/plurals.test.ts` - 17 tests for Polish plural forms

## Decisions Made
- Error handler uses Map for per-context retry counters enabling independent operation tracking
- MinScreenMessage uses inline CSS media query (not Tailwind) for precise 1024px breakpoint
- Polish plural tests cover all 4 CLDR categories including edge cases (teens, 22, 0)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All cross-cutting patterns established for Phase 2 complete
- Error handler ready for integration in API calls across pipeline phases
- Loading components ready for data-fetching UI in Phase 3+
- Polish plural forms verified, safe to use count-based translations everywhere

## Self-Check: PASSED

All 8 files verified present. All 3 commits verified in git log.

---
*Phase: 02-app-shell-and-cross-cutting-concerns*
*Completed: 2026-03-21*
