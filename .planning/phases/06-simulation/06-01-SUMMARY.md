---
phase: 06-simulation
plan: 01
subsystem: ui
tags: [zustand, polling, i18n, react-hooks, tanstack-query]

requires:
  - phase: 01-foundation
    provides: Vite project, Zustand, TanStack Query, i18n setup
  - phase: 04-graph
    provides: usePollingQuery hook pattern, useBuildStatus reference
  - phase: 05-environment
    provides: useEnvironmentStore Zustand persist pattern
provides:
  - Zustand simulation store with persist middleware
  - Polling hooks for run status, actions, and timeline
  - Elapsed time and scroll anchor utility hooks
  - Polish and English simulation translations with plural forms
affects: [06-simulation plan 02 UI components]

tech-stack:
  added: []
  patterns: [staggered polling intervals (2000/2500/3000ms), simulation state machine]

key-files:
  created:
    - src/features/simulation/hooks/useSimulationStore.ts
    - src/features/simulation/hooks/useRunStatus.ts
    - src/features/simulation/hooks/useSimulationActions.ts
    - src/features/simulation/hooks/useSimulationTimeline.ts
    - src/features/simulation/hooks/useElapsedTime.ts
    - src/features/simulation/hooks/useScrollAnchor.ts
    - src/locales/pl/simulation.json
    - src/locales/en/simulation.json
    - tests/features/simulation/simulation-store.test.ts
    - tests/features/simulation/run-status.test.ts
    - tests/features/simulation/elapsed-time.test.ts
  modified:
    - src/i18n/config.ts

key-decisions:
  - "Staggered polling intervals (2000/2500/3000ms) to avoid request storms"
  - "Store partialize excludes activeRoundFilter and highlightedEventId from persistence (ephemeral UI state)"
  - "useElapsedTime resets to 0 when isRunning becomes false (clean state for next run)"

patterns-established:
  - "Simulation polling hook pattern: usePollingQuery wrapper with isComplete for terminal states"
  - "Simulation store follows useEnvironmentStore persist pattern exactly"

requirements-completed: [SIMU-01, SIMU-03, SIMU-04]

duration: 3min
completed: 2026-03-22
---

# Phase 6 Plan 1: Simulation Data Layer Summary

**Zustand simulation store with persist, three staggered polling hooks (run-status/actions/timeline), elapsed time counter, scroll anchor, and PL/EN i18n translations with plural forms**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-22T02:32:36Z
- **Completed:** 2026-03-22T02:35:12Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- Zustand store with 5 state fields, 6 actions, and persist middleware under 'mirofish-simulation' key
- Three polling hooks wrapping usePollingQuery at staggered intervals (2000ms/2500ms/3000ms) to avoid request storms
- useElapsedTime hook with setInterval-based second counter and automatic cleanup
- useScrollAnchor hook with passive scroll listener and smooth scrollToTop
- Complete Polish and English translation files with i18next plural forms (one/few/many)
- 19 tests across 3 test files all passing

## Task Commits

Each task was committed atomically:

1. **Task 1: Simulation store and polling hooks (RED)** - `36bd08f` (test)
2. **Task 1: Simulation store and polling hooks (GREEN)** - `eb50f6e` (feat)
3. **Task 2: i18n simulation namespace** - `8f1e667` (feat)

_Note: TDD task had RED and GREEN commits._

## Files Created/Modified
- `src/features/simulation/hooks/useSimulationStore.ts` - Zustand store with persist for simulation UI state
- `src/features/simulation/hooks/useRunStatus.ts` - Polls run-status at 2000ms, auto-stops on completed/failed/stopped
- `src/features/simulation/hooks/useSimulationActions.ts` - Polls actions at 2500ms with platform filter
- `src/features/simulation/hooks/useSimulationTimeline.ts` - Polls timeline at 3000ms
- `src/features/simulation/hooks/useElapsedTime.ts` - Counts elapsed seconds from start timestamp
- `src/features/simulation/hooks/useScrollAnchor.ts` - Detects scroll position, provides scrollToTop
- `src/locales/pl/simulation.json` - Polish translations with plural forms
- `src/locales/en/simulation.json` - English translations
- `src/i18n/config.ts` - Added simulation namespace registration
- `tests/features/simulation/simulation-store.test.ts` - 9 store tests
- `tests/features/simulation/run-status.test.ts` - 7 polling hook tests
- `tests/features/simulation/elapsed-time.test.ts` - 3 timer tests

## Decisions Made
- Staggered polling intervals (2000/2500/3000ms) to avoid concurrent request storms
- Store partialize excludes activeRoundFilter and highlightedEventId from persistence (ephemeral UI state)
- useElapsedTime resets to 0 when isRunning becomes false for clean state on next run

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 6 hooks ready to be consumed by simulation UI components in Plan 02
- Translation namespace registered and available via useTranslation('simulation')
- Store can be imported directly in simulation page components

## Self-Check: PASSED

All 11 files verified present. All 3 commit hashes verified in git log.

---
*Phase: 06-simulation*
*Completed: 2026-03-22*
