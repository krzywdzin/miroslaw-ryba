---
phase: 04-graph-construction
plan: 01
subsystem: ui
tags: [zustand, react-dropzone, reagraph, i18n, polling, graph-pipeline]

requires:
  - phase: 02-core-ui
    provides: "Shared components (ErrorAlert, LoadingSpinner, Card, Button, Badge), i18n config, AppShell routing"
  - phase: 01-project-scaffold
    provides: "API client (graphApi), Zod schemas, usePollingQuery hook, Vite/TS config"
provides:
  - "Graph pipeline Zustand store (useGraphStore) with persist"
  - "Build status polling hook (useBuildStatus)"
  - "File upload page with drag-and-drop, prediction input, and submission flow"
  - "Build progress 4-step mini-stepper component"
  - "Entity color/type constants for graph visualization"
  - "Routes /graph and /graph/view in App.tsx"
  - "Polish and English graph i18n namespace"
affects: [04-graph-construction, 05-simulation]

tech-stack:
  added: [reagraph, react-dropzone]
  patterns: [zustand-persist-partialize, usePollingQuery-wrapper, formdata-multipart-upload]

key-files:
  created:
    - src/features/graph/hooks/useGraphStore.ts
    - src/features/graph/hooks/useBuildStatus.ts
    - src/features/graph/lib/graph-colors.ts
    - src/features/graph/components/UploadDropzone.tsx
    - src/features/graph/components/FileList.tsx
    - src/features/graph/components/PredictionInput.tsx
    - src/features/graph/components/UploadForm.tsx
    - src/features/graph/components/BuildProgress.tsx
    - src/features/graph/pages/GraphUploadPage.tsx
    - src/features/graph/pages/GraphViewPage.tsx
    - src/features/graph/index.ts
    - src/locales/pl/graph.json
    - src/locales/en/graph.json
    - tests/features/graph/graph-store.test.ts
    - tests/features/graph/build-status.test.ts
    - tests/features/graph/upload.test.tsx
  modified:
    - src/app/App.tsx
    - src/i18n/config.ts
    - package.json
    - pnpm-lock.yaml

key-decisions:
  - "File objects stored in local component state, not Zustand store (File is not serializable)"
  - "useBuildStatus wraps usePollingQuery at 2s interval with completed/failed terminal states"
  - "statusToStep mapping exported from BuildProgress for reuse in view page"

patterns-established:
  - "Graph feature module structure: hooks/, components/, pages/, lib/, index.ts barrel"
  - "FormData multipart upload pattern: append files + simulation_requirement field"
  - "Pipeline step tracking: upload -> building -> done with Zustand persist"

requirements-completed: [GRPH-01, GRPH-02, GRPH-03]

duration: 26min
completed: 2026-03-21
---

# Phase 4 Plan 1: Graph Upload Pipeline Summary

**File upload page with react-dropzone, prediction input, Zustand pipeline store, and 4-step build progress stepper**

## Performance

- **Duration:** 26 min
- **Started:** 2026-03-21T12:05:54Z
- **Completed:** 2026-03-21T12:31:41Z
- **Tasks:** 2
- **Files modified:** 20

## Accomplishments
- Zustand graph store with localStorage persist for pipeline state (step, projectId, taskId, graphId, predictionGoal)
- Complete upload page with drag-and-drop dropzone, file list with size badges, prediction textarea, and "Buduj graf" submit button
- Build progress 4-step mini-stepper with visual states (completed/current/pending)
- Build status polling hook wrapping usePollingQuery at 2s interval
- Entity color constants and Polish type labels for graph visualization
- Routes /graph and /graph/view registered with i18n namespace

## Task Commits

Each task was committed atomically:

1. **Task 1: Graph store, hooks, i18n, and routing scaffold** - `064ac45` (feat)
2. **Task 2: Upload form with dropzone, file list, prediction input, and build progress** - `3a6e6a9` (feat)

## Files Created/Modified
- `src/features/graph/hooks/useGraphStore.ts` - Zustand store with persist for pipeline state
- `src/features/graph/hooks/useBuildStatus.ts` - Polling hook for task status via usePollingQuery
- `src/features/graph/lib/graph-colors.ts` - Entity color constants and type labels
- `src/features/graph/components/UploadDropzone.tsx` - Drag-and-drop file zone with react-dropzone
- `src/features/graph/components/FileList.tsx` - File list with names, sizes, remove buttons
- `src/features/graph/components/PredictionInput.tsx` - Textarea for prediction goal
- `src/features/graph/components/UploadForm.tsx` - Combined form with API submission flow
- `src/features/graph/components/BuildProgress.tsx` - 4-step mini-stepper with status mapping
- `src/features/graph/pages/GraphUploadPage.tsx` - Upload page with Card layout and redirect logic
- `src/features/graph/pages/GraphViewPage.tsx` - View page placeholder
- `src/features/graph/index.ts` - Barrel exports
- `src/locales/pl/graph.json` - Polish graph translations
- `src/locales/en/graph.json` - English graph translations
- `src/app/App.tsx` - Added /graph and /graph/view routes
- `src/i18n/config.ts` - Added graph namespace
- `tests/features/graph/graph-store.test.ts` - 9 store tests
- `tests/features/graph/build-status.test.ts` - 6 hook tests
- `tests/features/graph/upload.test.tsx` - 8 component tests

## Decisions Made
- File objects stored in local component state rather than Zustand store since File objects are not serializable for localStorage persist
- useBuildStatus wraps usePollingQuery at 2000ms interval with completed/failed as terminal states
- statusToStep mapping function exported from BuildProgress for reuse in the view page (Plan 02)
- Used pnpm (not npm) as detected from pnpm-lock.yaml in project

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] i18n config required graph namespace registration**
- **Found during:** Task 1 (routing scaffold)
- **Issue:** Graph translation files would not be loaded without updating i18n config
- **Fix:** Added graph imports and namespace to src/i18n/config.ts
- **Files modified:** src/i18n/config.ts
- **Verification:** Components render Polish text from graph namespace
- **Committed in:** 064ac45 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential for i18n to work. No scope creep.

## Issues Encountered
- npm install failed due to project using pnpm (detected from pnpm-lock.yaml) -- switched to pnpm add

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Graph upload pipeline complete, ready for Plan 02 (graph visualization with reagraph)
- useGraphStore provides projectId/taskId/graphId for view page
- useBuildStatus ready to drive BuildProgress stepper on view page
- Entity colors and types ready for node rendering

---
*Phase: 04-graph-construction*
*Completed: 2026-03-21*
