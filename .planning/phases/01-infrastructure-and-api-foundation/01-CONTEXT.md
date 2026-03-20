# Phase 1: Infrastructure and API Foundation - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Development environment is operational with a running MiroFish backend, project scaffold, and typed API client ready for feature development. This phase delivers the foundation that all subsequent phases build on — no UI features, just infrastructure.

</domain>

<decisions>
## Implementation Decisions

### Backend Deployment
- MiroFish repo added as git submodule (version-locked, easy to update)
- Docker Compose configuration in our repo for one-command backend startup
- Additional manual setup documentation for developers who prefer source deployment
- User has API keys (LLM) and Zep Cloud account ready — no need to guide through signup

### API Discovery
- Primary method: analyze original Vue frontend source code (graph.js, simulation.js, report.js service modules)
- Generate OpenAPI spec from discovered endpoints as documentation artifact
- Zod schemas in frontend source code as runtime-validated type contracts
- Both artifacts maintained: OpenAPI for docs, Zod for code
- Error mapping layer in API client intercepts known Chinese error strings and maps to Polish/English equivalents

### Project Scaffold
- Feature-based directory structure: src/features/graph/, src/features/simulation/, etc.
- Package manager: pnpm (strict dependencies, fast, disk-efficient)
- Linting: ESLint + Prettier (standard, auto-fix)
- Testing: full stack — Vitest + React Testing Library (unit/integration) + Playwright (E2E)
- Stack: Vite 8 + React 19 + TypeScript 5.7

### Dev Environment
- Backend runs in Docker, frontend runs locally with Vite dev server
- Vite proxy config: /api/* → backend container (zero CORS issues)
- Ports: Claude selects available/unused ports to avoid conflicts with user's running services
- Hot reload for frontend via Vite; backend container restarts on config changes

### Claude's Discretion
- Exact port numbers (scan for available ports)
- Docker Compose service naming conventions
- ESLint/Prettier rule configuration details
- Vitest configuration specifics
- Git submodule update strategy (manual vs automated)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### MiroFish Backend
- `https://github.com/666ghj/MiroFish` — Original MiroFish repo (to be added as submodule)
- `.planning/research/ARCHITECTURE.md` — Backend API surface: 5 Flask blueprints, ~15 REST endpoints, port 5001, polling-based updates
- `.planning/research/STACK.md` — Recommended frontend stack with versions and rationale

### API Contracts
- `.planning/research/PITFALLS.md` — Pitfall #1 (API assumptions), #4 (building without backend), #5 (Chinese error messages)
- `.planning/research/SUMMARY.md` — Executive summary including API discovery strategy and architecture overview

### Project Configuration
- `.planning/PROJECT.md` — Project context, constraints (AGPL-3.0, backend compatibility, Polish default)
- `.planning/REQUIREMENTS.md` — INFR-01..04 requirements for this phase
- `.planning/config.json` — Workflow preferences (quality model profile, fine granularity, parallel execution)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, empty repository

### Established Patterns
- None yet — this phase establishes the foundational patterns

### Integration Points
- MiroFish Flask backend on configurable port (default 5001)
- 5 Flask blueprints: project, graph, simulation, report, ipc
- Original Vue frontend service modules (graph.js, simulation.js, report.js) serve as API reference

</code_context>

<specifics>
## Specific Ideas

- User wants ports that don't conflict with existing services — scan and select available ports
- Docker Compose should support both dev and production configurations
- Git submodule approach chosen for clean separation — MiroFish backend stays unmodified
- User has all external credentials ready (LLM API keys + Zep Cloud) — setup docs should reference but not walk through signup

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-infrastructure-and-api-foundation*
*Context gathered: 2026-03-20*
