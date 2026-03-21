---
phase: 03-configuration-panel
plan: 02
subsystem: ui
tags: [react, radix-ui, docker, zep, polling, vite-plugin, connection-testing]

requires:
  - phase: 03-configuration-panel/01
    provides: Config store, schemas, ApiKeys/Model/Simulation sections, SectionNav
  - phase: 02-layout-shell
    provides: shadcn components (badge, alert, tooltip, skeleton), usePollingQuery, error handler

provides:
  - Zep Cloud config section with connection testing against Zep REST API
  - Docker management dashboard with container list, logs, resources, compose controls
  - Vite plugin proxying /docker-api/* to Docker Unix socket
  - Shared useConnectionTest hook for reusable mutation-based testing
  - scroll-area, tabs, progress shadcn UI components
  - Complete 5-section settings page

affects: [04-prediction-pipeline, 09-dark-mode]

tech-stack:
  added: ["@radix-ui/react-scroll-area", "@radix-ui/react-tabs", "@radix-ui/react-progress"]
  patterns: [vite-server-plugin-for-docker-proxy, shared-connection-test-hook, inline-confirmation-pattern, 10s-polling-for-docker]

key-files:
  created:
    - src/components/ui/scroll-area.tsx
    - src/components/ui/tabs.tsx
    - src/components/ui/progress.tsx
    - src/features/settings/hooks/useConnectionTest.ts
    - src/features/settings/components/ZepSection.tsx
    - src/features/settings/components/DockerSection.tsx
    - src/features/settings/components/docker/ContainerList.tsx
    - src/features/settings/components/docker/ContainerLogs.tsx
    - src/features/settings/components/docker/ContainerResources.tsx
    - src/features/settings/components/docker/ComposeControls.tsx
    - src/features/settings/hooks/useDockerStatus.ts
    - src/features/settings/types/docker.types.ts
    - tests/features/settings/docker-status.test.ts
  modified:
    - src/features/settings/components/ApiKeysSection.tsx
    - src/features/settings/SettingsPage.tsx
    - vite.config.ts

key-decisions:
  - "Shared useConnectionTest hook wraps useMutation for reuse across LLM and Zep tests"
  - "Docker proxy implemented as Vite server plugin (not separate Express server)"
  - "Compose up/down uses child_process.execSync for simplicity"
  - "Inline confirmation pattern: button text changes to 'Na pewno?' for 3 seconds"

patterns-established:
  - "Vite server plugin pattern: intercept /docker-api/* and proxy to Docker Unix socket"
  - "Inline confirmation for destructive actions: text swap with 3s timeout revert"
  - "Reusable connection test hook: useConnectionTest<T>(testFn) returns test/isPending/data/error/reset"

requirements-completed: [CONF-04, CONF-05]

duration: 5min
completed: 2026-03-21
---

# Phase 3 Plan 2: Zep Cloud & Docker Management Summary

**Zep Cloud section with REST API connection testing and Docker management dashboard with container controls, log viewer, resource monitoring, and compose controls via Vite proxy plugin**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-21T09:52:11Z
- **Completed:** 2026-03-21T09:57:30Z
- **Tasks:** 2
- **Files modified:** 16

## Accomplishments
- Built Zep Cloud section with API key/URL fields, connection test calling /api/v2/sessions, success card with session count, and auth/network error differentiation
- Built Docker management dashboard with 3 tabs (Kontenery, Logi, Zasoby), container list with status badges, start/stop/restart with inline confirmation, log viewer with auto-scroll, and CPU/memory progress bars
- Added Vite server plugin to proxy Docker API requests to Unix socket and compose commands via child_process
- Extracted shared useConnectionTest hook from ApiKeysSection and reused in ZepSection
- Created 3 new shadcn UI components (scroll-area, tabs, progress)

## Task Commits

Each task was committed atomically:

1. **Task 1: Zep Cloud section with connection testing** - `51c1538` (feat)
2. **Task 2: Docker management dashboard** - `1d658de` (feat)

## Files Created/Modified
- `src/components/ui/scroll-area.tsx` - Radix ScrollArea with vertical/horizontal scrollbar
- `src/components/ui/tabs.tsx` - Radix Tabs with fade-in animation on content switch
- `src/components/ui/progress.tsx` - Radix Progress bar for resource monitoring
- `src/features/settings/hooks/useConnectionTest.ts` - Shared hook wrapping useMutation for connection tests
- `src/features/settings/components/ZepSection.tsx` - Zep API key/URL form with connection test and success card
- `src/features/settings/types/docker.types.ts` - Docker container/stats types and helper functions
- `src/features/settings/hooks/useDockerStatus.ts` - Docker polling hooks (containers, stats, logs, actions, compose)
- `src/features/settings/components/DockerSection.tsx` - Docker dashboard with Tabs wrapper
- `src/features/settings/components/docker/ComposeControls.tsx` - Uruchom/Zatrzymaj backend buttons with confirmation
- `src/features/settings/components/docker/ContainerList.tsx` - Container table with status badges and action buttons
- `src/features/settings/components/docker/ContainerLogs.tsx` - Log viewer with container selector and auto-scroll
- `src/features/settings/components/docker/ContainerResources.tsx` - CPU/memory progress bars per container
- `vite.config.ts` - Added dockerProxyPlugin for /docker-api/* routing
- `src/features/settings/components/ApiKeysSection.tsx` - Refactored to use shared useConnectionTest hook
- `src/features/settings/SettingsPage.tsx` - Added ZepSection and DockerSection
- `tests/features/settings/docker-status.test.ts` - Tests for CPU calc, memory formatting, log header stripping

## Decisions Made
- Shared useConnectionTest hook wraps useMutation for reuse across LLM and Zep connection tests
- Docker proxy implemented as Vite server plugin rather than separate Express server for simplicity
- Compose up/down uses child_process.execSync pointing to ./mirofish/docker-compose.yml
- Inline confirmation pattern: button text changes to "Na pewno?" for 3 seconds, reverts if not clicked

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Complete 5-section settings page ready with all configuration capabilities
- All CONF requirements (01-07) addressed across Plans 01 and 02
- Docker management requires Docker Desktop running for live container data
- Ready for Phase 4 (prediction pipeline) which will use config values from the store

---
*Phase: 03-configuration-panel*
*Completed: 2026-03-21*
