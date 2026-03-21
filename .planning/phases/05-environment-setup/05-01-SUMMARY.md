---
phase: 05-environment-setup
plan: 01
subsystem: ui
tags: [zustand, tanstack-query, shadcn, radix, i18n, table, alert-dialog, environment]

# Dependency graph
requires:
  - phase: 04-graph-construction
    provides: graphId for entity fetching, NodeDetailPanel Sheet pattern
  - phase: 02-app-shell-and-cross-cutting-concerns
    provides: shadcn component patterns, i18n infrastructure, AppShell routing
provides:
  - useEnvironmentStore (Zustand persist store for environment pipeline step)
  - useEntities hook (TanStack Query for entity fetching)
  - useAgentProfiles hook (TanStack Query for profile fetching)
  - usePrepareStatus hook (polling for prepare status)
  - EntityTable component (sortable, filterable entity table)
  - EntityDetailPanel component (Sheet slide-out with relationship list)
  - Table and AlertDialog shadcn UI primitives
  - i18n environment namespace (PL + EN)
  - /environment route registered
affects: [05-environment-setup, 06-simulation-monitoring]

# Tech tracking
tech-stack:
  added: [@radix-ui/react-alert-dialog, @tanstack/react-table]
  patterns: [inline-sort-filter-table, environment-pipeline-store]

key-files:
  created:
    - src/features/environment/hooks/useEnvironmentStore.ts
    - src/features/environment/hooks/useEntities.ts
    - src/features/environment/hooks/useAgentProfiles.ts
    - src/features/environment/hooks/usePrepareStatus.ts
    - src/features/environment/components/EntityTable.tsx
    - src/features/environment/components/EntityDetailPanel.tsx
    - src/features/environment/index.ts
    - src/components/ui/table.tsx
    - src/components/ui/alert-dialog.tsx
    - src/locales/pl/environment.json
    - src/locales/en/environment.json
    - tests/features/environment/environment-store.test.ts
    - tests/features/environment/entity-table.test.tsx
  modified:
    - src/i18n/config.ts
    - src/app/App.tsx
    - package.json

key-decisions:
  - "Inline Array.sort/filter for entity table instead of @tanstack/react-table hooks (simpler for 3 columns)"
  - "EntityDetailPanel reuses Sheet pattern from NodeDetailPanel with relationship list"
  - "relationshipCounts passed as optional prop (Record<string, number>) since entity schema lacks relationship data"

patterns-established:
  - "Environment pipeline store: Zustand persist with loading/review/preparing/ready steps"
  - "Entity table: inline sort/filter with type dropdown, sortable column headers"

requirements-completed: [ENVR-01]

# Metrics
duration: 18min
completed: 2026-03-21
---

# Phase 5 Plan 01: Environment Setup Foundation Summary

**Zustand environment store, 4 data hooks, shadcn Table/AlertDialog primitives, sortable entity table with detail panel, PL+EN i18n, and /environment route**

## Performance

- **Duration:** 18 min
- **Started:** 2026-03-21T13:21:37Z
- **Completed:** 2026-03-21T13:40:36Z
- **Tasks:** 2
- **Files modified:** 17

## Accomplishments
- Environment feature foundation with Zustand persist store tracking pipeline step, simulationId, prepareTaskId, entityTypes
- Sortable, filterable entity table (ENVR-01) with type filter dropdown, 3 sortable columns, and Sheet detail panel showing relationships
- All 4 data-fetching hooks ready: useEntities, useAgentProfiles, usePrepareStatus, useEnvironmentStore
- shadcn Table and AlertDialog UI primitives available for Plan 02
- PL+EN i18n environment namespace with full translations for entities, agents, parameters, and launch dialogs

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies, create UI primitives, store, hooks, i18n, and route** - `7d56908` (feat)
2. **Task 2: Entity table with sort, filter, and detail panel** - `e520a78` (feat)

## Files Created/Modified
- `src/features/environment/hooks/useEnvironmentStore.ts` - Zustand persist store for environment pipeline step
- `src/features/environment/hooks/useEntities.ts` - TanStack Query hook for entity fetching with staleTime Infinity
- `src/features/environment/hooks/useAgentProfiles.ts` - TanStack Query hook for profile fetching
- `src/features/environment/hooks/usePrepareStatus.ts` - Polling hook for prepare status via usePollingQuery
- `src/features/environment/components/EntityTable.tsx` - Sortable filterable entity table with type dropdown
- `src/features/environment/components/EntityDetailPanel.tsx` - Sheet slide-out with relationship list
- `src/features/environment/index.ts` - Feature exports with placeholder EnvironmentPage
- `src/components/ui/table.tsx` - shadcn Table component
- `src/components/ui/alert-dialog.tsx` - shadcn AlertDialog component
- `src/locales/pl/environment.json` - Polish translations
- `src/locales/en/environment.json` - English translations
- `src/i18n/config.ts` - Added environment namespace
- `src/app/App.tsx` - Added /environment route
- `package.json` - Added @radix-ui/react-alert-dialog, @tanstack/react-table
- `tests/features/environment/environment-store.test.ts` - 8 store tests
- `tests/features/environment/entity-table.test.tsx` - 8 entity table tests

## Decisions Made
- Used inline Array.sort/filter instead of @tanstack/react-table hooks for entity table (simpler for 3 columns, research confirmed either approach is fine)
- Entity relationship counts passed as optional prop since EntitySchema does not include relationship data natively
- EntityDetailPanel follows NodeDetailPanel Sheet pattern exactly with relationship list display
- Used pnpm (not npm) for dependency installation per project lockfile

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- npm install failed due to project using pnpm (pnpm-lock.yaml present, pnpm config in package.json) - switched to pnpm add

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All hooks and data layer ready for Plan 02 (agent cards, parameter form, page composition)
- Table and AlertDialog components available for agent grid and launch confirmation
- /environment route registered, placeholder page ready for replacement
- i18n translations cover all Plan 02 UI strings

---
*Phase: 05-environment-setup*
*Completed: 2026-03-21*
