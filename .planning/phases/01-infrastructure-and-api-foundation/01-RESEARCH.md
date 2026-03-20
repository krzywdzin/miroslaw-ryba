# Phase 1: Infrastructure and API Foundation - Research

**Researched:** 2026-03-20
**Domain:** Project scaffolding, Docker orchestration, API client architecture, real-time polling
**Confidence:** HIGH

## Summary

Phase 1 establishes the entire development foundation: a running MiroFish backend in Docker, a Vite + React + TypeScript project scaffold with pnpm, and a typed API client layer with Zod-validated response schemas covering all backend blueprints. This phase is purely infrastructure -- no UI features, just the plumbing that every subsequent phase builds on.

The MiroFish backend exposes 3 Flask blueprints (`graph_bp`, `simulation_bp`, `report_bp`) under `/api/graph/*`, `/api/simulation/*`, and `/api/report/*` prefixes. There are approximately 50+ REST endpoints across these blueprints. The original Docker setup exposes ports 3000 (Vue frontend) and 5001 (Flask backend). Our Docker Compose configuration needs only the backend on port 5001 (configurable), with Vite's dev server proxy forwarding `/api` requests to the backend container.

The critical insight for this phase: the backend has NO `project_bp` or `ipc_bp` as separate blueprints. Project management routes and IPC/interview routes are part of `graph_bp` and `simulation_bp` respectively. The ARCHITECTURE.md reference to 5 blueprints was based on the original Vue service module split, not the actual Flask registration. The API client should still be organized by domain (graph, simulation, report) to mirror the actual blueprints.

**Primary recommendation:** Get the backend running in Docker first, then scaffold the frontend with pnpm, then build the typed API client layer with Zod schemas verified against live API responses. Do not proceed to any UI work until the API client can successfully call every endpoint category.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- MiroFish repo added as git submodule (version-locked, easy to update)
- Docker Compose configuration in our repo for one-command backend startup
- Additional manual setup documentation for developers who prefer source deployment
- User has API keys (LLM) and Zep Cloud account ready -- no need to guide through signup
- Primary API discovery method: analyze original Vue frontend source code (graph.js, simulation.js, report.js service modules)
- Generate OpenAPI spec from discovered endpoints as documentation artifact
- Zod schemas in frontend source code as runtime-validated type contracts
- Both artifacts maintained: OpenAPI for docs, Zod for code
- Error mapping layer in API client intercepts known Chinese error strings and maps to Polish/English equivalents
- Feature-based directory structure: src/features/graph/, src/features/simulation/, etc.
- Package manager: pnpm (strict dependencies, fast, disk-efficient)
- Linting: ESLint + Prettier (standard, auto-fix)
- Testing: full stack -- Vitest + React Testing Library (unit/integration) + Playwright (E2E)
- Stack: Vite 8 + React 19 + TypeScript 5.7
- Backend runs in Docker, frontend runs locally with Vite dev server
- Vite proxy config: /api/* -> backend container (zero CORS issues)
- Ports: Claude selects available/unused ports to avoid conflicts with user's running services
- Hot reload for frontend via Vite; backend container restarts on config changes

### Claude's Discretion
- Exact port numbers (scan for available ports)
- Docker Compose service naming conventions
- ESLint/Prettier rule configuration details
- Vitest configuration specifics
- Git submodule update strategy (manual vs automated)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFR-01 | Backend deployment setup (Docker Compose for MiroFish backend) | Docker Compose config pattern, git submodule setup, port configuration, .env template, health check endpoint `/health` |
| INFR-02 | Frontend build pipeline (Vite 8 + React 19 + TypeScript) | pnpm project scaffold, Vite 8 config with proxy, ESLint 9 flat config, Prettier, Vitest setup |
| INFR-03 | API client with typed contracts (Zod schemas for all backend endpoints) | Complete endpoint inventory (50+ endpoints across 3 blueprints), Zod v4 schema patterns, error mapping layer |
| INFR-04 | WebSocket/polling architecture for real-time simulation updates | HTTP polling via TanStack Query refetchInterval (no WebSocket -- backend has no WS server), adaptive polling patterns |
</phase_requirements>

## Standard Stack

### Core (Phase 1 specific)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| pnpm | 10.32.1 | Package manager | Strict deps, fast, disk-efficient; user decision |
| Vite | 8.0.1 | Build tool + dev server | Rolldown Rust bundler, proxy config for backend |
| @vitejs/plugin-react | 6.0.1 | React plugin for Vite | Dropped Babel, uses Oxc transformer |
| React | 19.2.4 | UI framework | Stable, largest ecosystem |
| React DOM | 19.2.4 | React DOM renderer | Peer dependency |
| TypeScript | 5.9.3 | Type safety | Latest stable (5.9.3, not 5.7 -- npm verified) |
| Zod | 4.3.6 | Schema validation + types | Runtime API validation, 57% smaller than v3 |
| @tanstack/react-query | 5.91.3 | Server state + polling | refetchInterval for polling, structural sharing |
| Zustand | 5.0.12 | Client state | Config store, pipeline state |

### Dev Tooling

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| ESLint | 9.x | Linting | Flat config format, typescript-eslint |
| Prettier | 3.x | Formatting | Opinionated, prettier-plugin-tailwindcss |
| Vitest | 4.1.0 | Unit/integration tests | Native Vite integration |
| @testing-library/react | latest | Component testing | DOM testing utilities |
| Playwright | 1.x | E2E testing | Cross-browser, later phases |
| @tanstack/react-query-devtools | 5.91.x | Query debugging | Dev-only cache inspection |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| pnpm | npm/yarn | pnpm is user decision; strict by default, prevents phantom deps |
| Zod v4 | Zod v3 | v4 is 57% smaller, new API (z.email() not z.string().email()); v3 still works but v4 is current |
| TanStack Query polling | raw setInterval | TQ gives cache, dedup, error retry, cleanup; setInterval leaks |
| ky/axios | native fetch | fetch is sufficient for this project; avoid extra deps |

**Installation:**
```bash
# Initialize project
pnpm create vite@latest miroslaw-ryba -- --template react-ts

# Core dependencies
pnpm add @tanstack/react-query@^5.91 zustand@^5.0 zod@^4.3

# Dev dependencies
pnpm add -D eslint@^9 @eslint/js typescript-eslint eslint-plugin-react-hooks
pnpm add -D prettier
pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom
pnpm add -D @tanstack/react-query-devtools@^5.91
```

**Version verification (2026-03-20):**
| Package | npm version | Verified |
|---------|-------------|----------|
| vite | 8.0.1 | Yes |
| react | 19.2.4 | Yes |
| typescript | 5.9.3 | Yes |
| zod | 4.3.6 | Yes |
| @tanstack/react-query | 5.91.3 | Yes |
| zustand | 5.0.12 | Yes |
| vitest | 4.1.0 | Yes |
| pnpm | 10.32.1 | Yes |

**Note:** TypeScript latest is 5.9.3, not 5.7 as specified in CONTEXT.md. Use ^5.7 as minimum but install latest.

## Architecture Patterns

### Recommended Project Structure (Phase 1 deliverable)
```
miroslaw-ryba/
├── backend/                    # Git submodule -> 666ghj/MiroFish
│   └── (MiroFish source)
├── docker-compose.yml          # Backend Docker orchestration
├── docker-compose.override.yml # Local dev overrides (optional)
├── .env.example                # Backend env template
├── .gitmodules                 # Submodule config
├── package.json                # Root scripts (convenience)
├── pnpm-workspace.yaml         # If using workspace
├── src/
│   ├── app/
│   │   ├── App.tsx             # Root component (blank page for Phase 1)
│   │   ├── main.tsx            # Entry point
│   │   └── providers.tsx       # QueryClientProvider wrapper
│   │
│   ├── api/
│   │   ├── client.ts           # Fetch wrapper, base config, error interceptor
│   │   ├── errors.ts           # Error mapping layer (Chinese -> PL/EN)
│   │   ├── schemas/
│   │   │   ├── graph.ts        # Zod schemas for graph/project endpoints
│   │   │   ├── simulation.ts   # Zod schemas for simulation endpoints
│   │   │   └── report.ts       # Zod schemas for report endpoints
│   │   ├── graph.ts            # Typed API functions for graph_bp
│   │   ├── simulation.ts       # Typed API functions for simulation_bp
│   │   └── report.ts           # Typed API functions for report_bp
│   │
│   ├── hooks/
│   │   └── usePolling.ts       # Generic polling hook with TanStack Query
│   │
│   └── types/
│       └── api.ts              # Inferred types from Zod schemas
│
├── openapi/
│   └── mirofish-api.yaml       # Generated OpenAPI spec (documentation)
│
├── vite.config.ts              # Vite config with proxy
├── tsconfig.json
├── eslint.config.mjs           # ESLint 9 flat config
├── .prettierrc                 # Prettier config
├── vitest.config.ts            # Vitest config
└── tests/
    ├── api/                    # API client integration tests
    └── setup.ts                # Test setup
```

### Pattern 1: Docker Compose for Backend-Only
**What:** Docker Compose runs only the MiroFish backend (not the Vue frontend). Our Vite dev server runs locally and proxies API calls.
**When to use:** Always during development.
**Example:**
```yaml
# docker-compose.yml
services:
  mirofish-backend:
    image: ghcr.io/666ghj/MiroFish:latest
    container_name: mirofish-backend
    env_file: .env
    ports:
      - "${BACKEND_PORT:-5001}:5001"
    volumes:
      - ./data/uploads:/app/backend/uploads
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
      interval: 10s
      timeout: 5s
      retries: 3
    # Override entrypoint to run backend only (not Vue frontend)
    command: ["python", "backend/run.py"]
```

**Important:** The official Docker image runs BOTH frontend and backend (`npm run dev`). We need to override the entrypoint/command to run only the Python backend. If `command: ["python", "backend/run.py"]` does not work inside the container's working directory, we may need to use `command: ["sh", "-c", "cd /app && python backend/run.py"]` or build a custom Dockerfile. This must be validated against the actual container.

### Pattern 2: Vite Proxy Configuration
**What:** Vite dev server proxies `/api` requests to the Docker backend.
**When to use:** Development mode.
**Example:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Will be dynamically selected
    proxy: {
      '/api': {
        target: `http://localhost:${process.env.BACKEND_PORT || 5001}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
```

### Pattern 3: Typed API Client with Zod Validation
**What:** Each API module mirrors a Flask blueprint. Response data is validated through Zod schemas at runtime.
**When to use:** All backend communication.
**Example:**
```typescript
// api/schemas/graph.ts
import { z } from 'zod/v4';

// Base response wrapper (all MiroFish responses follow this)
const apiResponse = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
  });

// Project schemas
export const ProjectSchema = z.object({
  project_id: z.string(),
  project_name: z.string().optional(),
  simulation_requirement: z.string().optional(),
});

export const ProjectListSchema = apiResponse(
  z.object({
    count: z.number(),
    // Use z.array() for lists
  })
);

// Graph data schemas
export const GraphDataSchema = z.object({
  nodes: z.array(z.object({
    id: z.string(),
    name: z.string(),
    type: z.string().optional(),
  })),
  edges: z.array(z.object({
    source: z.string(),
    target: z.string(),
    relation: z.string().optional(),
  })),
});
```

```typescript
// api/client.ts
import { mapChineseError } from './errors';

const BASE_URL = '/api';

async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  schema?: z.ZodType<T>,
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      mapChineseError(error.message || response.statusText),
      response.status,
    );
  }

  const json = await response.json();

  // Validate with Zod if schema provided
  if (schema) {
    return schema.parse(json);
  }
  return json as T;
}
```

```typescript
// api/graph.ts -- mirrors backend graph_bp
export const graphApi = {
  // Project management (part of graph_bp)
  getProject: (projectId: string) =>
    apiRequest(`/graph/project/${projectId}`, {}, ProjectResponseSchema),

  listProjects: (limit = 50) =>
    apiRequest(`/graph/project/list?limit=${limit}`, {}, ProjectListSchema),

  createProject: (files: FormData) =>
    apiRequest('/graph/ontology/generate', {
      method: 'POST',
      body: files,
      headers: {}, // Let browser set multipart boundary
    }, OntologyResponseSchema),

  buildGraph: (projectId: string) =>
    apiRequest('/graph/build', {
      method: 'POST',
      body: JSON.stringify({ project_id: projectId }),
    }, BuildResponseSchema),

  getGraphData: (graphId: string) =>
    apiRequest(`/graph/data/${graphId}`, {}, GraphDataSchema),

  getTask: (taskId: string) =>
    apiRequest(`/graph/task/${taskId}`, {}, TaskResponseSchema),
};
```

### Pattern 4: Polling with TanStack Query
**What:** HTTP polling for real-time updates using TanStack Query's refetchInterval.
**When to use:** All long-running operations (graph building, simulation prep, simulation run, report generation).
**Example:**
```typescript
// hooks/usePolling.ts
import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export function usePollingQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options: {
    isComplete: (data: T) => boolean;
    interval?: number;
    enabled?: boolean;
  },
) {
  return useQuery({
    queryKey,
    queryFn,
    enabled: options.enabled ?? true,
    refetchInterval: (query) => {
      if (!query.state.data) return options.interval ?? 1000;
      if (options.isComplete(query.state.data)) return false;
      return options.interval ?? 1000;
    },
    // Structural sharing prevents re-renders when data hasn't changed
    structuralSharing: true,
    // Pause polling when tab is hidden
    refetchIntervalInBackground: false,
  });
}
```

### Pattern 5: Error Mapping Layer
**What:** Intercept Chinese error messages from the backend and map to user-friendly Polish/English messages.
**When to use:** All API error handling.
**Example:**
```typescript
// api/errors.ts
const CHINESE_ERROR_MAP: Record<string, { pl: string; en: string }> = {
  // These must be discovered from live backend testing
  // Placeholder patterns based on common Flask/Python errors
  'Internal Server Error': { pl: 'Blad wewnetrzny serwera', en: 'Internal server error' },
  // Add discovered Chinese strings during API testing phase
};

export function mapChineseError(message: string): string {
  const locale = 'pl'; // Will come from i18n config later
  for (const [pattern, translations] of Object.entries(CHINESE_ERROR_MAP)) {
    if (message.includes(pattern)) {
      return translations[locale] || translations.en;
    }
  }
  // Return original if no mapping found
  return message;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly rawMessage?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Anti-Patterns to Avoid

- **Using axios:** Native fetch is sufficient. Axios adds a dependency for features we don't need. The original Vue frontend uses axios, but we should not copy that choice.
- **Mocking the entire API for development:** Run the real backend in Docker. Only mock for unit tests of rendering logic.
- **Hardcoding port numbers:** Use environment variables. The user specifically wants auto-detection of available ports.
- **Running the full MiroFish Docker image as-is:** The official image runs both frontend (port 3000) and backend (port 5001). We only need the backend. Override the entrypoint.
- **Skipping Zod validation in API client:** Without runtime validation, TypeScript types give false confidence. The backend is a research project -- response shapes may change.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP polling lifecycle | Custom setInterval + cleanup | TanStack Query refetchInterval | Handles unmount cleanup, tab visibility, error retry, dedup |
| API response caching | In-memory cache map | TanStack Query cache | Stale-while-revalidate, cache invalidation, devtools |
| Schema validation | Manual type assertions | Zod v4 schemas | Runtime safety, type inference, composable schemas |
| Port availability check | Manual lsof parsing | `detect-port` npm package or `net.createServer` | Cross-platform, handles edge cases |
| Form data for file upload | Manual FormData construction | Standard FormData API | Browser-native, handles multipart boundaries |

**Key insight:** Phase 1 is infrastructure -- every component should use battle-tested libraries rather than custom solutions. Custom code in this phase becomes technical debt for all subsequent phases.

## Common Pitfalls

### Pitfall 1: Docker Image Runs Both Frontend and Backend
**What goes wrong:** The official MiroFish Docker image (`ghcr.io/666ghj/MiroFish:latest`) entry point is `npm run dev`, which starts BOTH the Vue frontend on port 3000 and the Flask backend on port 5001. If you run it as-is, you have a port conflict with our Vite dev server, and the Vue frontend is wasted resources.
**Why it happens:** MiroFish is designed as a monorepo with a single Docker deployment.
**How to avoid:** Override the Docker command to run only `python backend/run.py`. Test this works in the container's environment. If the container lacks the right working directory or Python path, create a minimal custom Dockerfile that extends the base image.
**Warning signs:** Port 3000 already in use errors; two frontend servers running.

### Pitfall 2: macOS AirPlay Receiver on Port 5001
**What goes wrong:** macOS 12+ enables AirPlay Receiver by default, which binds to port 5001. Docker cannot bind the backend port.
**Why it happens:** Apple changed default service ports.
**How to avoid:** Use configurable ports via `BACKEND_PORT` env var. Document the AirPlay workaround in setup docs. Default to a non-conflicting port (e.g., 5050).
**Warning signs:** "Address already in use" on first Docker Compose up.

### Pitfall 3: Zod v4 API Changes from v3
**What goes wrong:** Using Zod v3 patterns with v4. Key changes: string validators moved to top-level (`z.email()` not `z.string().email()`), `z.record()` requires two args, error access is `.issues` not `.errors`.
**Why it happens:** Most tutorials and LLM training data reference Zod v3.
**How to avoid:** Import from `zod/v4` explicitly. Reference the [official migration guide](https://zod.dev/v4/changelog). Use `z.object()` patterns which are unchanged.
**Warning signs:** TypeScript errors on `z.string().email()`, runtime errors on `z.record(schema)`.

### Pitfall 4: Git Submodule Initialization Forgotten
**What goes wrong:** Developers clone the repo but forget `git submodule update --init --recursive`. The `backend/` directory is empty. Docker Compose fails.
**Why it happens:** Git submodules are not fetched by default on clone.
**How to avoid:** Add a setup script that checks and initializes submodules. Document in README prominently. Consider a `postinstall` script in package.json.
**Warning signs:** Empty `backend/` directory; Docker build fails.

### Pitfall 5: Flask Blueprint Prefix Mismatch
**What goes wrong:** Building API client paths like `/api/project/create` when the actual endpoint is `/api/graph/ontology/generate`. The Flask `__init__.py` registers only 3 blueprints: `graph_bp` at `/api/graph`, `simulation_bp` at `/api/simulation`, `report_bp` at `/api/report`.
**Why it happens:** The ARCHITECTURE.md and original Vue services suggest 5 separate domains (project, graph, simulation, report, ipc), but the Flask registration merges project routes into graph_bp and interview/IPC routes into simulation_bp.
**How to avoid:** Use the actual Flask route definitions verified from source code. The endpoint inventory in this research document is authoritative.
**Warning signs:** 404 errors when calling endpoints with wrong prefixes.

### Pitfall 6: FormData Content-Type Header Override
**What goes wrong:** Setting `Content-Type: application/json` on file upload requests (POST `/api/graph/ontology/generate` which accepts `FormData` with files).
**Why it happens:** The API client sets JSON content-type as default for all requests.
**How to avoid:** When sending FormData, explicitly delete the Content-Type header and let the browser set it with the correct multipart boundary.
**Warning signs:** 400 errors on file upload; backend can't parse the request.

## Complete Backend API Inventory

**Confidence:** HIGH -- verified from Flask source code on GitHub (2026-03-20)

### graph_bp (prefix: `/api/graph`)

| Method | Path | Purpose | Request | Response Key Fields |
|--------|------|---------|---------|---------------------|
| GET | `/project/<project_id>` | Get project | path param | `{success, data: project}` |
| GET | `/project/list` | List projects | `?limit=50` | `{success, data: [], count}` |
| DELETE | `/project/<project_id>` | Delete project | path param | `{success, message}` |
| POST | `/project/<project_id>/reset` | Reset project | path param | `{success, data: project}` |
| POST | `/ontology/generate` | Create project + extract ontology | FormData: files, simulation_requirement, project_name | `{success, data: {project_id, ontology}}` |
| POST | `/build` | Build knowledge graph | `{project_id}` | `{success, data: {project_id, task_id}}` |
| GET | `/task/<task_id>` | Get task status | path param | `{success, data: task}` |
| GET | `/tasks` | List all tasks | none | `{success, data: [], count}` |
| GET | `/data/<graph_id>` | Get graph data | path param | `{success, data: graph_data}` |
| DELETE | `/delete/<graph_id>` | Delete graph | path param | `{success, message}` |

### simulation_bp (prefix: `/api/simulation`)

| Method | Path | Purpose | Request | Response Key Fields |
|--------|------|---------|---------|---------------------|
| GET | `/entities/<graph_id>` | Get entities from graph | `?entity_types=X,Y&enrich=true` | `{success, data: {filtered_count, entities, entity_types}}` |
| GET | `/entities/<graph_id>/<uuid>` | Get single entity | path params | `{success, data: entity}` |
| GET | `/entities/<graph_id>/by-type/<type>` | Entities by type | path + `?enrich=true` | `{success, data: {entity_type, count, entities}}` |
| POST | `/create` | Create simulation | `{project_id, graph_id?, enable_twitter?, enable_reddit?}` | `{success, data: simulation_state}` |
| POST | `/prepare` | Start preparation | `{simulation_id, entity_types[], use_llm_for_profiles?, parallel_profile_count?, force_regenerate?}` | `{success, data: {simulation_id, task_id, status}}` |
| POST | `/prepare/status` | Preparation progress | `{task_id?, simulation_id?}` | `{success, data: {task_id, status, progress, prepare_info}}` |
| GET | `/<simulation_id>` | Get simulation state | path param | `{success, data: simulation}` |
| GET | `/list` | List simulations | `?project_id=X` | `{success, data: [], count}` |
| GET | `/history` | Enriched history | `?limit=20` | `{success, data: [], count}` |
| GET | `/<sim_id>/profiles` | Agent profiles | `?platform=reddit|twitter` | `{success, data: {platform, count, profiles[]}}` |
| GET | `/<sim_id>/profiles/realtime` | Real-time profiles | `?platform=X` | `{success, data: {is_generating, profiles[]}}` |
| GET | `/<sim_id>/config/realtime` | Real-time config | path param | `{success, data: {file_exists, is_generating, generation_stage, config}}` |
| GET | `/<sim_id>/config` | Full config | path param | `{success, data: config}` |
| GET | `/<sim_id>/config/download` | Download config file | path param | File attachment |
| GET | `/script/<name>/download` | Download runner script | path param | File attachment |
| POST | `/generate-profiles` | Generate profiles | `{graph_id, entity_types[]?, use_llm?, platform?}` | `{success, data: {platform, count, profiles[]}}` |
| POST | `/start` | Start simulation | `{simulation_id, platform?, max_rounds?, enable_graph_memory_update?, force?}` | `{success, data: {runner_status, process_pid}}` |
| POST | `/stop` | Stop simulation | `{simulation_id}` | `{success, data: {runner_status, completed_at}}` |
| GET | `/<sim_id>/run-status` | Execution status | path param | `{success, data: {runner_status, current_round, total_rounds, progress_percent}}` |
| GET | `/<sim_id>/run-status/detail` | Detailed status | `?platform=X` | `{success, data: {runner_status, all_actions[]}}` |
| GET | `/<sim_id>/actions` | Action history | `?limit&offset&platform&agent_id&round_num` | `{success, data: {count, actions[]}}` |
| GET | `/<sim_id>/timeline` | Timeline by round | `?start_round&end_round` | `{success, data: {rounds_count, timeline[]}}` |
| GET | `/<sim_id>/agent-stats` | Agent statistics | path param | `{success, data: {agents_count, stats[]}}` |
| GET | `/<sim_id>/posts` | SQLite posts | `?platform&limit&offset` | `{success, data: {platform, total, count, posts[]}}` |
| GET | `/<sim_id>/comments` | Reddit comments | `?post_id&limit&offset` | `{success, data: {count, comments[]}}` |
| POST | `/interview` | Interview single agent | `{simulation_id, agent_id, prompt, platform?, timeout?}` | `{success, data: {agent_id, prompt, result}}` |
| POST | `/interview/batch` | Batch interviews | `{simulation_id, interviews[], platform?, timeout?}` | `{success, data: {interviews_count, result}}` |
| POST | `/interview/all` | Interview all agents | `{simulation_id, prompt, platform?, timeout?}` | `{success, data: {interviews_count, result}}` |
| POST | `/interview/history` | Get interview records | `{simulation_id, platform?, agent_id?, limit?}` | `{success, data: {count, history[]}}` |
| POST | `/env-status` | Check env liveness | `{simulation_id}` | `{success, data: {env_alive, twitter_available, reddit_available}}` |
| POST | `/close-env` | Close env | `{simulation_id, timeout?}` | `{success, data: {message, result}}` |

### report_bp (prefix: `/api/report`)

| Method | Path | Purpose | Request | Response Key Fields |
|--------|------|---------|---------|---------------------|
| POST | `/generate` | Generate report | `{simulation_id, force_regenerate?}` | `{success, data: {simulation_id, report_id, task_id, status}}` |
| POST | `/generate/status` | Generation progress | `{task_id?, simulation_id?}` | `{success, data: {task_id, status, progress}}` |
| GET | `/<report_id>` | Get report | path param | `{success, data: {report_id, markdown_content, outline}}` |
| GET | `/by-simulation/<sim_id>` | Report by simulation | path param | `{success, data: report, has_report}` |
| GET | `/list` | List reports | `?simulation_id&limit=50` | `{success, data: [], count}` |
| GET | `/<report_id>/download` | Download report MD | path param | File attachment |
| DELETE | `/<report_id>` | Delete report | path param | `{success, message}` |
| POST | `/chat` | Chat with ReportAgent | `{simulation_id, message, chat_history?}` | `{success, data: {response, tool_calls, sources}}` |
| GET | `/<report_id>/progress` | Report progress | path param | `{success, data: {status, progress, current_section, completed_sections}}` |
| GET | `/<report_id>/sections` | Report sections | path param | `{success, data: {sections[], total_sections, is_complete}}` |
| GET | `/<report_id>/section/<idx>` | Single section | path params | `{success, data: {filename, section_index, content}}` |
| GET | `/check/<sim_id>` | Check report exists | path param | `{success, data: {has_report, report_status, interview_unlocked}}` |
| GET | `/<report_id>/agent-log` | Agent reasoning log | `?from_line=0` | `{success, data: {logs[], total_lines, has_more}}` |
| GET | `/<report_id>/agent-log/stream` | Stream agent log | path param | `{success, data: {logs[], count}}` |
| GET | `/<report_id>/console-log` | Console log | `?from_line=0` | `{success, data: {logs[], total_lines, has_more}}` |
| GET | `/<report_id>/console-log/stream` | Stream console log | path param | `{success, data: {logs[], count}}` |
| POST | `/tools/search` | Search graph tool | `{graph_id, query, limit?}` | `{success, data}` |
| POST | `/tools/statistics` | Graph statistics | `{graph_id}` | `{success, data}` |

### Root endpoint

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Health check -- returns service status |

## Code Examples

### Docker Compose with Backend-Only Configuration
```yaml
# docker-compose.yml
# Source: Derived from MiroFish docker-compose.yml + research
services:
  mirofish-backend:
    image: ghcr.io/666ghj/MiroFish:latest
    container_name: mirofish-backend
    env_file: .env
    ports:
      - "${BACKEND_PORT:-5050}:5001"
    volumes:
      - ./data/uploads:/app/backend/uploads
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5001/health"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 30s
    # Run only the Flask backend, not the Vue frontend
    command: ["python", "backend/run.py"]
```

### .env.example Template
```bash
# MiroFish Backend Configuration
# Copy to .env and fill in your values

# LLM Configuration (required)
LLM_API_KEY=your_api_key_here
LLM_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
LLM_MODEL_NAME=qwen-plus

# Zep Cloud Configuration (required for graph memory)
ZEP_API_KEY=your_zep_api_key_here

# Optional: Boost LLM (for faster processing)
LLM_BOOST_API_KEY=your_api_key_here
LLM_BOOST_BASE_URL=your_base_url_here
LLM_BOOST_MODEL_NAME=your_model_name_here

# Port Configuration (change if defaults conflict)
BACKEND_PORT=5050
VITE_PORT=5173
```

### ESLint 9 Flat Config
```javascript
// eslint.config.mjs
// Source: ESLint 9 flat config docs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['dist/', 'node_modules/', 'backend/'],
  },
);
```

### Port Auto-Detection Script
```typescript
// scripts/find-port.ts
import net from 'node:net';

export async function findAvailablePort(preferred: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(preferred, () => {
      const { port } = server.address() as net.AddressInfo;
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      // Port in use, try next
      const server2 = net.createServer();
      server2.listen(0, () => {
        const { port } = server2.address() as net.AddressInfo;
        server2.close(() => resolve(port));
      });
      server2.on('error', reject);
    });
  });
}
```

### Git Submodule Setup
```bash
# Add MiroFish as submodule
git submodule add https://github.com/666ghj/MiroFish.git backend

# Lock to a specific commit/tag for reproducibility
cd backend && git checkout <specific-tag-or-commit> && cd ..
git add backend
git commit -m "chore: pin MiroFish backend to version X"
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Zod v3 `z.string().email()` | Zod v4 `z.email()` | 2025 | String validators are now top-level |
| Zod v3 `z.record(valueSchema)` | Zod v4 `z.record(keySchema, valueSchema)` | 2025 | Must provide both key and value schemas |
| ESLint `.eslintrc.json` | ESLint 9 `eslint.config.mjs` flat config | 2024 | Flat config is the only format in ESLint 9 |
| Vite 5/6 esbuild bundler | Vite 8 Rolldown (Rust) bundler | 2025 | 10-30x faster production builds |
| `@vitejs/plugin-react` with Babel | v6 with Oxc (no Babel) | 2025 | Smaller install, faster transforms |
| TypeScript 5.7 | TypeScript 5.9.3 | 2026 | Latest stable; 5.7 specified in context but 5.9.3 available |
| Vite `http-proxy` | Vite 8 `http-proxy-3` | 2025 | Updated proxy library; API mostly compatible |

**Deprecated/outdated:**
- Axios for HTTP: Use native fetch (browser-native, no dependency, sufficient for REST)
- Zod v3 string methods: Still work but deprecated; use v4 top-level validators
- ESLint legacy config: Not supported in ESLint 9; must use flat config

## Open Questions

1. **Docker image entrypoint override**
   - What we know: The official image uses `npm run dev` which starts both frontend and backend
   - What's unclear: Whether `command: ["python", "backend/run.py"]` works inside the container (correct working dir, Python path, dependencies)
   - Recommendation: Test this immediately. If it fails, create a minimal Dockerfile extending the base image with a backend-only entrypoint.

2. **Backend .env injection into Docker**
   - What we know: Backend reads from environment variables; Docker Compose supports `env_file`
   - What's unclear: Whether all env vars are forwarded correctly, especially nested quotes or special characters in API keys
   - Recommendation: Test with real API keys during setup.

3. **Chinese error message catalog**
   - What we know: Backend error messages are in Chinese; we need a mapping layer
   - What's unclear: The full catalog of Chinese error strings (must be discovered empirically)
   - Recommendation: Start with an empty mapping layer. Add entries as they are discovered during development. Priority during Phase 1 is having the layer in place, not having it complete.

4. **File upload multipart handling**
   - What we know: POST `/api/graph/ontology/generate` accepts FormData with files
   - What's unclear: Max file size, accepted formats, simultaneous file count limits
   - Recommendation: Test with the live backend during API client development. Document discovered limits.

5. **Note on `prepare/status` using POST**
   - What we know: `POST /api/simulation/prepare/status` uses POST (not GET) for a status check
   - What's unclear: Whether this was intentional (request body contains task_id/simulation_id) or an API design quirk
   - Recommendation: Match the backend exactly. The API client must use POST for this endpoint.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 |
| Config file | `vitest.config.ts` -- Wave 0 deliverable |
| Quick run command | `pnpm vitest run --reporter=verbose` |
| Full suite command | `pnpm vitest run --coverage` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| INFR-01 | Docker Compose starts backend, health check passes | integration/smoke | `docker compose up -d && curl http://localhost:5050/health` | No -- Wave 0 |
| INFR-02 | Vite project builds without errors | smoke | `pnpm build` | No -- Wave 0 |
| INFR-02 | ESLint passes on all source files | lint | `pnpm lint` | No -- Wave 0 |
| INFR-02 | TypeScript compiles without errors | typecheck | `pnpm tsc --noEmit` | No -- Wave 0 |
| INFR-03 | API client graph module calls succeed against live backend | integration | `pnpm vitest run tests/api/graph.test.ts -x` | No -- Wave 0 |
| INFR-03 | API client simulation module calls succeed | integration | `pnpm vitest run tests/api/simulation.test.ts -x` | No -- Wave 0 |
| INFR-03 | API client report module calls succeed | integration | `pnpm vitest run tests/api/report.test.ts -x` | No -- Wave 0 |
| INFR-03 | Zod schemas validate real backend responses | unit | `pnpm vitest run tests/api/schemas.test.ts -x` | No -- Wave 0 |
| INFR-03 | Error mapping layer catches Chinese errors | unit | `pnpm vitest run tests/api/errors.test.ts -x` | No -- Wave 0 |
| INFR-04 | Polling hook starts/stops based on completion | unit | `pnpm vitest run tests/hooks/usePolling.test.ts -x` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm vitest run --reporter=verbose`
- **Per wave merge:** `pnpm vitest run --coverage && pnpm lint && pnpm tsc --noEmit`
- **Phase gate:** Full suite green + Docker health check passes + API client smoke test

### Wave 0 Gaps
- [ ] `vitest.config.ts` -- Vitest configuration with jsdom environment
- [ ] `tests/setup.ts` -- Test setup with testing-library matchers
- [ ] `tests/api/graph.test.ts` -- Graph API client integration tests
- [ ] `tests/api/simulation.test.ts` -- Simulation API client integration tests
- [ ] `tests/api/report.test.ts` -- Report API client integration tests
- [ ] `tests/api/schemas.test.ts` -- Zod schema validation unit tests
- [ ] `tests/api/errors.test.ts` -- Error mapping layer unit tests
- [ ] `tests/hooks/usePolling.test.ts` -- Polling hook unit tests
- [ ] Framework install: `pnpm add -D vitest @testing-library/react @testing-library/jest-dom jsdom`

## Sources

### Primary (HIGH confidence)
- [MiroFish GitHub - backend/app/__init__.py](https://github.com/666ghj/MiroFish/blob/main/backend/app/__init__.py) -- Flask blueprint registration (3 blueprints: graph, simulation, report)
- [MiroFish GitHub - backend/app/api/graph.py](https://github.com/666ghj/MiroFish/blob/main/backend/app/api/graph.py) -- Graph blueprint routes (10 endpoints)
- [MiroFish GitHub - backend/app/api/simulation.py](https://github.com/666ghj/MiroFish/blob/main/backend/app/api/simulation.py) -- Simulation blueprint routes (30+ endpoints including interviews)
- [MiroFish GitHub - backend/app/api/report.py](https://github.com/666ghj/MiroFish/blob/main/backend/app/api/report.py) -- Report blueprint routes (18 endpoints)
- [MiroFish GitHub - docker-compose.yml](https://github.com/666ghj/MiroFish/blob/main/docker-compose.yml) -- Official Docker config
- [MiroFish GitHub - .env.example](https://github.com/666ghj/MiroFish/blob/main/.env.example) -- Environment variable template
- [MiroFish GitHub - backend/run.py](https://github.com/666ghj/MiroFish/blob/main/backend/run.py) -- Flask startup (port 5001, host 0.0.0.0)
- npm registry -- All package version verification (2026-03-20)

### Secondary (MEDIUM confidence)
- [Vite Server Options](https://vite.dev/config/server-options) -- Proxy configuration docs
- [Zod v4 Migration Guide](https://zod.dev/v4/changelog) -- v3 to v4 breaking changes
- [ESLint 9 Flat Config](https://eslint.org/docs/latest/use/configure/) -- Config format changes

### Tertiary (LOW confidence)
- Docker image entrypoint override behavior -- needs live testing validation
- Chinese error message catalog -- must be empirically discovered

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all versions verified against npm registry
- Architecture: HIGH -- endpoint inventory verified from Flask source code
- Pitfalls: HIGH -- specific to this project's Docker/Flask integration
- API inventory: HIGH -- extracted directly from backend source files
- Docker override strategy: MEDIUM -- entrypoint override needs live testing

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable infrastructure, 30-day validity)
