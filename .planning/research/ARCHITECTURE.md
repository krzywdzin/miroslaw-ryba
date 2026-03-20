# Architecture Patterns

**Domain:** Multi-agent prediction engine frontend (connecting to existing Python backend)
**Researched:** 2026-03-20

## Recommended Architecture

The frontend is a **pipeline-driven dashboard** -- not a typical CRUD app, not a freeform SPA. MiroFish has a strict 5-stage sequential workflow where each stage depends on the previous stage's output. This dictates everything about the architecture.

### High-Level Structure

```
                          Miroslaw Ryba Frontend
  ┌─────────────────────────────────────────────────────────────┐
  │                                                             │
  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
  │  │ Pipeline  │  │ Config   │  │  Shared  │  │  i18n    │   │
  │  │ Stages   │  │ Panel    │  │  Layout  │  │  Layer   │   │
  │  │ (5 views)│  │ (modal)  │  │          │  │          │   │
  │  └────┬─────┘  └────┬─────┘  └──────────┘  └──────────┘   │
  │       │              │                                      │
  │  ┌────┴──────────────┴──────────────────────────────────┐   │
  │  │              State Management Layer                  │   │
  │  │  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │   │
  │  │  │ Pipeline │  │  Config  │  │ Polling/Realtime  │  │   │
  │  │  │  State   │  │  Store   │  │    Manager        │  │   │
  │  │  │ Machine  │  │          │  │                   │  │   │
  │  │  └──────────┘  └──────────┘  └───────────────────┘  │   │
  │  └──────────────────────┬───────────────────────────────┘   │
  │                         │                                   │
  │  ┌──────────────────────┴───────────────────────────────┐   │
  │  │              API Client Layer                        │   │
  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │   │
  │  │  │ graph    │  │simulation│  │  report   │           │   │
  │  │  │ .ts      │  │ .ts      │  │  .ts      │           │   │
  │  │  └──────────┘  └──────────┘  └──────────┘           │   │
  │  └──────────────────────┬───────────────────────────────┘   │
  │                         │ HTTP (REST)                       │
  └─────────────────────────┼───────────────────────────────────┘
                            │
                            ▼
              MiroFish Python Backend (port 5001)
              ┌─────────────────────────────────┐
              │  Flask + Blueprints              │
              │  /api/project/*                  │
              │  /api/graph/*                    │
              │  /api/simulation/*               │
              │  /api/report/*                   │
              │  /api/ipc/*                      │
              └──────────┬──────────────────────┘
                         │
              ┌──────────┴──────────────────────┐
              │  External Services               │
              │  - LLM API (OpenAI-compatible)   │
              │  - Zep Cloud (memory/graph)       │
              │  - OASIS subprocess (simulation) │
              └─────────────────────────────────┘
```

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| **Pipeline Stages** (5 views) | One view per MiroFish stage; render stage-specific UI, trigger backend actions, display real-time progress | State Management, API Client |
| **Pipeline State Machine** | Tracks which stage is active, what stages are unlocked, enforces sequential flow, holds IDs (project_id, simulation_id, report_id) | All Pipeline Stage views |
| **Config Panel** | Modal/drawer for API keys, model selection, Zep settings, simulation parameters, Docker config | Config Store, persists to localStorage |
| **Polling Manager** | Centralized polling logic -- starts/stops polling per stage, deduplicates requests, handles backoff on errors | API Client, Pipeline State |
| **API Client Layer** | Typed HTTP functions mirroring backend blueprints; all backend communication goes through here | Backend REST API |
| **i18n Layer** | Translation strings for PL (default) + EN; language switcher in header | All UI components |
| **Shared Layout** | App shell with sidebar navigation (stepper), header (language toggle, settings), and content area | All views |
| **Graph Visualization** | D3.js-based knowledge graph renderer (shared component used in Stage 1 and potentially Stage 5) | Pipeline Stages 1, 5 |
| **Chat Interface** | Reusable conversational UI for Stage 5 (report chat + agent interviews) | Report API, IPC API |
| **History View** | Browse past simulations, load previous results | Simulation API |

## Data Flow

### Pipeline State Machine (Core Concept)

The most important architectural decision: **model the 5-stage pipeline as an explicit finite state machine.** This is not a suggestion -- it is the natural fit for MiroFish's sequential workflow and prevents an entire class of bugs.

```
States:
  IDLE ──────────────────────────────────────────────────────────┐
    │                                                            │
    ▼                                                            │
  GRAPH_UPLOADING ──► GRAPH_BUILDING ──► GRAPH_READY             │
                          (polling)           │                   │
                                              ▼                   │
                                        ENV_CONFIGURING           │
                                              │                   │
                                              ▼                   │
                                        ENV_PREPARING ──► ENV_READY
                                          (polling)          │
                                                             ▼
                                                       SIM_RUNNING
                                                         (polling)
                                                             │
                                                             ▼
                                                       SIM_COMPLETED
                                                             │
                                                             ▼
                                                       REPORT_GENERATING
                                                         (polling)
                                                             │
                                                             ▼
                                                       REPORT_READY
                                                             │
                                                             ▼
                                                       INTERACTION
```

Each state transition carries context:
- `GRAPH_READY` carries `project_id` and `graph_id`
- `ENV_READY` carries `simulation_id`
- `SIM_COMPLETED` carries simulation results metadata
- `REPORT_READY` carries `report_id`

**Why a state machine and not ad-hoc state:**
1. The backend itself uses a state file (`state.json`) per entity -- the frontend should mirror this
2. Prevents impossible states (e.g., starting simulation before environment is ready)
3. Makes polling lifecycle obvious -- poll only in `*_BUILDING`, `*_PREPARING`, `*_RUNNING`, `*_GENERATING` states
4. Navigation is derived from state, not the other way around

### Data Flow Per Stage

**Stage 1: Graph Construction**
```
User uploads documents + enters requirements
  → POST /api/project/create (files + requirements)
  → Returns project_id
  → Frontend enters GRAPH_BUILDING state, starts polling
  → GET /api/graph/data (polls until graph ready)
  → D3.js renders knowledge graph
  → State transitions to GRAPH_READY with project_id, graph_id
```

**Stage 2: Environment Setup**
```
User configures simulation parameters
  → POST /api/simulation/create (graph_id, requirements)
  → Returns simulation_id
  → POST /api/simulation/prepare (simulation_id)
  → Frontend enters ENV_PREPARING state, starts polling
  → GET /api/simulation/prepare/status (polls every ~1s)
  → Displays agent profiles as they are generated
  → State transitions to ENV_READY with simulation_id
```

**Stage 3: Dual-Platform Simulation**
```
User clicks Start
  → POST /api/simulation/start (simulation_id)
  → Frontend enters SIM_RUNNING state, starts polling
  → GET /api/simulation/status (polls every ~1s)
  → GET /api/simulation/profiles/realtime (agent activity)
  → GET /api/simulation/config/realtime (simulation config)
  → Displays: round progress, agent counts, action timeline
  → User can POST /api/simulation/stop to halt early
  → State transitions to SIM_COMPLETED
```

**Stage 4: Report Generation**
```
User triggers report
  → POST /api/report/generate (simulation_id)
  → Returns report_id
  → Frontend enters REPORT_GENERATING state, starts polling
  → GET /api/report/logs (overall progress)
  → GET /api/report/agent-log (ReportAgent reasoning trace)
  → Displays incremental report sections as they complete
  → State transitions to REPORT_READY with report_id
```

**Stage 5: Deep Interaction**
```
Two parallel interaction modes:

Chat with ReportAgent:
  User types message
    → POST /api/report/chat (report_id, message)
    → Returns AI response
    → Rendered in chat UI

Agent Interviews:
  User poses question to simulated agents
    → POST /api/ipc/batch-interview (simulation_id, queries)
    → Returns agent responses
    → Rendered in interview panel
```

### Configuration Data Flow

```
Config Panel (modal/drawer)
  │
  ├── API Keys: LLM key, LLM base URL, model name,
  │             boost LLM key/URL/model, Zep API key
  │
  ├── Simulation Params: agent count, round count,
  │                      platforms (Twitter/Reddit/both)
  │
  └── Infrastructure: Docker config, backend URL
  │
  ▼
  localStorage (persisted client-side)
  │
  ▼
  Sent as headers or request body to backend
  (backend reads config from request or its own .env)
```

**Important note:** The original MiroFish backend reads config from environment variables (`.env` file). The frontend config panel may need to either:
1. Pass config per-request (if backend supports it), or
2. Expose a backend endpoint to update `.env` dynamically (if backend supports it), or
3. Simply document that users must configure the backend `.env` separately

This needs validation during implementation. The config panel should at minimum store user preferences client-side and display what the backend is currently configured with.

## Component Architecture (Detailed)

### Directory Structure

```
src/
├── app/
│   ├── App.tsx                    # Root component
│   ├── router.tsx                 # Route definitions
│   └── providers.tsx              # Context providers wrapper
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx           # Sidebar + header + content
│   │   ├── PipelineStepper.tsx    # Vertical stepper in sidebar
│   │   ├── Header.tsx             # Language toggle, settings button
│   │   └── StatusBar.tsx          # Connection status, active polling
│   │
│   ├── pipeline/
│   │   ├── Stage1GraphBuild.tsx   # Document upload + graph viewer
│   │   ├── Stage2EnvSetup.tsx     # Environment configuration form
│   │   ├── Stage3Simulation.tsx   # Simulation monitor + timeline
│   │   ├── Stage4Report.tsx       # Report generation + display
│   │   ├── Stage5Interaction.tsx  # Chat + agent interview
│   │   └── HistoryView.tsx        # Past simulation browser
│   │
│   ├── config/
│   │   ├── ConfigPanel.tsx        # Settings modal/drawer container
│   │   ├── LLMConfig.tsx          # API key, model, base URL inputs
│   │   ├── ZepConfig.tsx          # Zep Cloud settings
│   │   ├── SimulationConfig.tsx   # Agent count, rounds, platforms
│   │   └── InfraConfig.tsx        # Docker, backend URL
│   │
│   ├── visualization/
│   │   ├── GraphViewer.tsx        # D3.js knowledge graph
│   │   ├── SimulationTimeline.tsx # Action timeline during sim
│   │   └── AgentProfileCard.tsx   # Individual agent display
│   │
│   └── chat/
│       ├── ChatInterface.tsx      # Reusable chat UI
│       ├── ChatMessage.tsx        # Single message bubble
│       └── InterviewPanel.tsx     # Agent interview specific UI
│
├── state/
│   ├── pipeline-machine.ts        # State machine definition
│   ├── config-store.ts            # Zustand store for config
│   └── polling.ts                 # Polling hook/manager
│
├── api/
│   ├── client.ts                  # Axios instance, interceptors
│   ├── graph.ts                   # /api/project/*, /api/graph/*
│   ├── simulation.ts              # /api/simulation/*
│   ├── report.ts                  # /api/report/*
│   └── ipc.ts                     # /api/ipc/*
│
├── i18n/
│   ├── config.ts                  # i18next setup
│   ├── pl.json                    # Polish translations
│   └── en.json                    # English translations
│
├── hooks/
│   ├── usePipeline.ts             # Pipeline state machine hook
│   ├── usePolling.ts              # Generic polling hook
│   └── useConfig.ts               # Config access hook
│
└── types/
    ├── api.ts                     # Backend response types
    ├── pipeline.ts                # Pipeline state types
    └── config.ts                  # Configuration types
```

### Key Component Interactions

```
AppShell
  ├── Header
  │     ├── LanguageToggle ──► i18n.changeLanguage()
  │     └── SettingsButton ──► opens ConfigPanel
  │
  ├── Sidebar
  │     └── PipelineStepper
  │           ├── Reads: pipeline state machine current state
  │           ├── Shows: which stages complete/active/locked
  │           └── Click: navigate to unlocked stages only
  │
  └── Content (routed)
        └── Stage[1-5] component
              ├── Reads: pipeline state for this stage
              ├── Triggers: API calls via api/ layer
              ├── Activates: polling via usePolling hook
              └── Transitions: pipeline state on completion
```

## Patterns to Follow

### Pattern 1: Polling with TanStack Query

All real-time updates in MiroFish use HTTP polling (not WebSocket). Use TanStack Query's `refetchInterval` for clean polling that auto-stops.

**What:** Wrap each polling endpoint in a TanStack Query with conditional refetch interval.
**When:** Any stage that shows progress (graph building, env prep, simulation, report gen).

```typescript
// hooks/useSimulationStatus.ts
function useSimulationStatus(simulationId: string | null) {
  return useQuery({
    queryKey: ['simulation', 'status', simulationId],
    queryFn: () => api.simulation.getRunStatus(simulationId!),
    enabled: !!simulationId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Stop polling when complete or failed
      if (status === 'completed' || status === 'failed') return false;
      return 1000; // Poll every second while running
    },
  });
}
```

**Why this over raw setInterval:** Automatic cache management, deduplication, error retry, cleanup on unmount, and the data is available to any component that subscribes.

### Pattern 2: Pipeline Guard Routes

**What:** Route guards that prevent navigation to stages whose prerequisites are not met.
**When:** All pipeline routes.

```typescript
// Derive allowed routes from state machine
function PipelineRoute({ stage, children }) {
  const { isStageUnlocked } = usePipeline();

  if (!isStageUnlocked(stage)) {
    return <Navigate to={firstUnlockedStage()} />;
  }

  return children;
}
```

**Why:** Prevents users from bookmarking or manually navigating to Stage 4 without completing Stages 1-3. The state machine is the single source of truth.

### Pattern 3: Optimistic Config with Validation

**What:** Config panel saves to localStorage immediately but validates against backend on save.
**When:** Config panel interactions.

```typescript
// Config is stored locally, validated on demand
const configStore = create<ConfigState>((set) => ({
  llmApiKey: '',
  llmBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  llmModel: 'qwen-plus',
  // ...
  setConfig: (partial) => set(partial),
  // Persist to localStorage via middleware
}));
```

### Pattern 4: Typed API Client Mirroring Backend Blueprints

**What:** One API module per backend blueprint, with TypeScript types matching response shapes.
**When:** All backend communication.

```typescript
// api/simulation.ts -- mirrors backend/app/routes/simulation.py
export const simulation = {
  create: (graphId: string, requirements: string) =>
    client.post<{ simulation_id: string }>('/api/simulation/create', {
      graph_id: graphId, requirements
    }),

  prepare: (simulationId: string) =>
    client.post('/api/simulation/prepare', {
      simulation_id: simulationId
    }),

  getStatus: (simulationId: string) =>
    client.get<SimulationStatus>(`/api/simulation/status`, {
      params: { simulation_id: simulationId }
    }),
  // ... mirrors all backend endpoints
};
```

## Anti-Patterns to Avoid

### Anti-Pattern 1: WebSocket Assumption
**What:** Assuming real-time features need WebSocket.
**Why bad:** MiroFish backend uses file-based state + HTTP polling. No WebSocket server exists. Adding one means modifying the backend (out of scope).
**Instead:** Use HTTP polling with TanStack Query. The backend already supports this pattern with status endpoints for every long-running operation.

### Anti-Pattern 2: Global State Soup
**What:** Putting all state (pipeline progress, config, UI state, API cache) in one global store.
**Why bad:** Different state has different lifecycles. API cache needs invalidation logic. Pipeline state needs persistence. UI state is ephemeral. Mixing them creates coupling nightmares.
**Instead:** Three state layers:
  - **Server state:** TanStack Query (API responses, polling data)
  - **Pipeline state:** State machine (stage progression, entity IDs)
  - **Client state:** Zustand (config, UI preferences, language)

### Anti-Pattern 3: Polling in Components
**What:** Each component managing its own `setInterval` for polling.
**Why bad:** Memory leaks, duplicate requests, no coordination between polls, no cleanup on navigation.
**Instead:** All polling through TanStack Query hooks. Polling starts/stops based on pipeline state, not component mount/unmount.

### Anti-Pattern 4: Freeform Navigation
**What:** Letting users freely navigate between all stages via router.
**Why bad:** Stage 3 is meaningless without Stage 2's `simulation_id`. Stage 4 crashes without Stage 3's simulation data.
**Instead:** Pipeline state machine controls which routes are accessible. Stepper shows locked stages as disabled.

### Anti-Pattern 5: Monolithic Stage Components
**What:** One massive component per stage that handles UI, state, API calls, and polling.
**Why bad:** Stage 3 (simulation) alone has timeline rendering, agent cards, progress bars, action logs, dual-platform tabs, and stop functionality. That is 500+ lines easily.
**Instead:** Each stage view is a thin orchestrator that composes smaller focused components. Data fetching lives in hooks, not components.

## Communication with Backend

### REST API Contract

All communication is REST over HTTP. The backend runs Flask on port 5001 with CORS enabled.

**Request format:** JSON body for POST, query params for GET.
**Response format:** JSON with status codes.
**Authentication:** None (backend assumes local/trusted access).

**Backend Blueprint Mapping:**

| Frontend Module | Backend Blueprint | Endpoint Prefix |
|----------------|-------------------|-----------------|
| `api/graph.ts` | `project_bp` + `graph_bp` | `/api/project/*`, `/api/graph/*` |
| `api/simulation.ts` | `simulation_bp` | `/api/simulation/*` |
| `api/report.ts` | `report_bp` | `/api/report/*` |
| `api/ipc.ts` | `ipc_bp` | `/api/ipc/*` |

### Key Endpoints (Complete)

**Graph/Project:**
```
POST   /api/project/create       → { project_id }
POST   /api/project/upload       → { success }
GET    /api/graph/data           → { nodes, edges, metadata }
```

**Simulation:**
```
POST   /api/simulation/create    → { simulation_id }
POST   /api/simulation/prepare   → { status }
GET    /api/simulation/prepare/status → { status, progress }
POST   /api/simulation/start     → { status }
POST   /api/simulation/stop      → { status }
GET    /api/simulation/status    → { status, round, agents, actions }
GET    /api/simulation/profiles/realtime → { profiles[] }
GET    /api/simulation/config/realtime   → { config }
GET    /api/simulation/history   → { simulations[] }
```

**Report:**
```
POST   /api/report/generate      → { report_id }
POST   /api/report/chat          → { response }
POST   /api/report/interview     → { responses[] }
GET    /api/report/logs          → { progress, sections[] }
GET    /api/report/agent-log     → { reasoning_trace[] }
```

**IPC (Inter-Process Communication during live simulation):**
```
POST   /api/ipc/batch-interview  → { agent_responses[] }
POST   /api/ipc/agent-chat       → { response }
```

### Error Handling Strategy

The backend is a research project -- expect rough edges:
- Network errors: show retry button, don't silently fail
- 500 errors: display error message from response, suggest checking backend logs
- Polling failures: exponential backoff (1s -> 2s -> 4s -> 8s, cap at 30s)
- Backend unreachable: prominent connection status indicator in header

## Scalability Considerations

| Concern | This Project (single user) | If Multi-User Later |
|---------|---------------------------|---------------------|
| Polling load | Negligible -- one user, 1req/s | Need WebSocket or SSE |
| State persistence | localStorage sufficient | Need server-side sessions |
| Config storage | localStorage | Need user accounts + DB |
| Concurrent simulations | One at a time (backend limitation) | Need job queue |
| File uploads | Direct to backend | Need upload service |

This is explicitly a single-user tool. Do not over-engineer for multi-tenancy.

## Suggested Build Order

Based on component dependencies, the frontend should be built in this order:

### Layer 1: Foundation (must exist first)
- Project scaffolding (Vite, TypeScript, linting)
- API client layer (`api/client.ts` + all endpoint modules)
- i18n setup with PL + EN string files
- App shell / layout (`AppShell`, `Header`, `PipelineStepper`)

**Rationale:** Everything depends on the API client, i18n, and layout. Build these first, validate backend connectivity immediately.

### Layer 2: Pipeline Core
- Pipeline state machine definition
- Route guards based on state machine
- Stage 1 (Graph Construction) -- simplest stage, validates the full pipeline pattern

**Rationale:** Stage 1 is the entry point and the simplest stage (upload + poll + display). Building it first validates the entire pipeline architecture pattern before committing to all 5 stages.

### Layer 3: Simulation Pipeline
- Stage 2 (Environment Setup) -- form + polling
- Stage 3 (Simulation) -- most complex stage, requires timeline visualization
- D3.js graph/timeline visualization components

**Rationale:** Stages 2 and 3 are the core product. Stage 3 is the most complex with real-time updates, dual-platform display, and action timeline. Get this right before the remaining stages.

### Layer 4: Analysis & Interaction
- Stage 4 (Report Generation) -- polling + markdown rendering
- Stage 5 (Deep Interaction) -- chat UI + agent interviews
- Chat interface component

**Rationale:** These stages consume what Stages 1-3 produce. They are simpler in terms of backend interaction but need polished UI (markdown rendering, chat bubbles).

### Layer 5: Configuration & Polish
- Config panel (all settings sections)
- History view (past simulations)
- Error handling refinement
- Responsive design pass
- Accessibility pass

**Rationale:** Config panel is important but not on the critical path of the pipeline flow. History is a secondary feature. Polish comes last.

### Dependency Graph

```
Layer 1: Foundation
  └── Layer 2: Pipeline Core (depends on API client, layout, i18n)
        └── Layer 3: Simulation Pipeline (depends on state machine, Stage 1 pattern)
              └── Layer 4: Analysis & Interaction (depends on Stages 1-3 data)
                    └── Layer 5: Config & Polish (independent but last priority)
```

## Sources

- [MiroFish GitHub Repository](https://github.com/666ghj/MiroFish) -- PRIMARY source for backend API structure (HIGH confidence)
- [DeepWiki MiroFish Analysis](https://deepwiki.com/666ghj/MiroFish) -- Detailed architecture breakdown (HIGH confidence)
- [MiroFish README-EN](https://github.com/666ghj/MiroFish/blob/main/README-EN.md) -- Official English documentation (HIGH confidence)
- [React State Management 2025](https://www.developerway.com/posts/react-state-management-2025) -- State layering patterns (MEDIUM confidence)
- [LaunchDarkly React Architecture 2025](https://launchdarkly.com/docs/blog/react-architecture-2025) -- Component architecture patterns (MEDIUM confidence)
- [State Machines in React](https://medium.com/@ignatovich.dm/state-machines-in-react-advanced-state-management-beyond-redux-33ea20e59b62) -- State machine pattern rationale (MEDIUM confidence)
