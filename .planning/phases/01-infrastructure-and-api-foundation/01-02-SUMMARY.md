---
phase: 01-infrastructure-and-api-foundation
plan: 02
subsystem: api
tags: [zod, tanstack-query, fetch, openapi, polling, error-mapping]

# Dependency graph
requires:
  - phase: 01-infrastructure-and-api-foundation
    provides: Project scaffold with Vite proxy, TanStack Query provider, Zod dependency
provides:
  - Typed API client with Zod validation for all 3 backend blueprints
  - Chinese-to-Polish/English error message mapping
  - usePollingQuery hook for real-time status updates
  - OpenAPI 3.1 spec documenting the MiroFish backend API
affects: [03-project-creation-graph, 04-simulation-setup, 05-simulation-execution, 06-report-generation, 07-interview-system, 08-settings-and-configuration]

# Tech tracking
tech-stack:
  added: [zod/v4 schemas, openapi 3.1 spec]
  patterns: [apiRequest generic fetch wrapper, Zod schema validation on response, z.infer for type derivation, buildQuery helper for URL params]

key-files:
  created:
    - src/api/client.ts
    - src/api/errors.ts
    - src/api/schemas/common.ts
    - src/api/schemas/graph.ts
    - src/api/schemas/simulation.ts
    - src/api/schemas/report.ts
    - src/api/graph.ts
    - src/api/simulation.ts
    - src/api/report.ts
    - src/types/api.ts
    - src/hooks/usePolling.ts
    - openapi/mirofish-api.yaml
    - tests/api/errors.test.ts
    - tests/api/schemas.test.ts
    - tests/hooks/usePolling.test.ts
  modified: []

key-decisions:
  - "Import zod from 'zod/v4' (not 'zod') for Zod v4 API"
  - "API client uses relative /api base URL through Vite proxy"
  - "FormData uploads auto-remove Content-Type header to let browser set boundary"
  - "Types inferred from Zod schemas via z.infer -- no duplicate type definitions"

patterns-established:
  - "apiRequest<T>(path, options): Generic fetch wrapper with optional Zod schema validation"
  - "Schema-first API: define Zod schema -> infer TypeScript type -> pass schema to apiRequest"
  - "buildQuery(params): Helper to construct URLSearchParams from optional param objects"
  - "usePollingQuery: TanStack Query hook with refetchInterval controlled by isComplete callback"

requirements-completed: [INFR-03, INFR-04]

# Metrics
duration: 4min
completed: 2026-03-20
---

# Phase 1 Plan 2: API Client Layer Summary

**Typed fetch client with Zod v4 validation for 58 MiroFish backend endpoints, Chinese error mapping, and polling hook**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-20T21:11:31Z
- **Completed:** 2026-03-20T21:15:46Z
- **Tasks:** 3
- **Files modified:** 15

## Accomplishments
- Complete typed API client covering all 58 MiroFish backend endpoints across graph, simulation, and report blueprints
- Zod v4 runtime validation schemas for all critical response shapes
- Chinese error message interception with Polish/English localized mapping (7 entries)
- Polling hook with TanStack Query for real-time task/simulation status updates
- OpenAPI 3.1 spec documenting the discovered backend API surface
- 20 unit tests passing (error mapping, schema validation, polling behavior)

## Task Commits

Each task was committed atomically:

1. **Task 1: API client base, error mapping, and Zod schemas** - `a527043` (feat)
2. **Task 2: Typed API modules for graph, simulation, and report** - `43efa3d` (feat)
3. **Task 3: Polling hook + unit tests (TDD RED)** - `a6fe462` (test)
4. **Task 3: Polling hook + unit tests (TDD GREEN)** - `59d6ca4` (feat)

## Files Created/Modified
- `src/api/client.ts` - Base fetch wrapper with error interception and Zod validation
- `src/api/errors.ts` - ApiError class and Chinese-to-Polish/English error mapping
- `src/api/schemas/common.ts` - apiResponse/apiListResponse/apiMessageResponse factories
- `src/api/schemas/graph.ts` - Zod schemas for graph_bp (Project, Task, GraphData, etc.)
- `src/api/schemas/simulation.ts` - Zod schemas for simulation_bp (SimulationState, Entity, Profile, etc.)
- `src/api/schemas/report.ts` - Zod schemas for report_bp (Report, ChatResponse, Progress, etc.)
- `src/api/graph.ts` - 10 typed methods for all graph_bp endpoints
- `src/api/simulation.ts` - 30 typed methods for all simulation_bp endpoints
- `src/api/report.ts` - 18 typed methods for all report_bp endpoints
- `src/types/api.ts` - TypeScript types inferred from Zod schemas via z.infer
- `src/hooks/usePolling.ts` - usePollingQuery hook with auto-stop on completion
- `openapi/mirofish-api.yaml` - OpenAPI 3.1 spec for MiroFish backend
- `tests/api/errors.test.ts` - Error mapping tests (5 cases)
- `tests/api/schemas.test.ts` - Schema validation tests (9 cases)
- `tests/hooks/usePolling.test.ts` - Polling hook tests (3 cases)

## Decisions Made
- Used `zod/v4` import path (project has zod@3.24+ which supports this)
- API client uses relative `/api` base URL, relying on Vite proxy to forward to backend
- FormData uploads automatically remove Content-Type header so browser sets multipart boundary
- All TypeScript types derived from Zod schemas via `z.infer` -- single source of truth
- Blob downloads (config, scripts, reports) use raw fetch instead of apiRequest to handle non-JSON responses

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All API modules ready for feature phases 3-8
- Polling hook available for task monitoring, simulation status, report generation
- Error mapping provides user-friendly messages in Polish by default
- Phase 2 (Layout/Navigation) can proceed independently

---
*Phase: 01-infrastructure-and-api-foundation*
*Completed: 2026-03-20*
