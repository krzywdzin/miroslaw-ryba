# Phase 3: Configuration Panel - Research

**Researched:** 2026-03-21
**Domain:** Form-heavy settings UI, config persistence, service connection testing, Docker management
**Confidence:** HIGH

## Summary

Phase 3 replaces the placeholder `SettingsPage.tsx` with a full configuration panel. The phase covers five distinct sections: API Keys, Model Selection, Simulation Parameters, Zep Cloud, and Docker Management. Each section has different complexity -- API Keys and Model Selection are standard forms, Simulation Parameters is a constrained numeric form, Zep Cloud adds connection testing with rich status display, and Docker is effectively a mini-dashboard with container management, log viewing, and resource monitoring.

The core technology stack is already established: React Hook Form + Zod for form validation, Zustand with persist middleware for localStorage state, and shadcn/ui for components. The key architectural challenge is that the MiroFish backend reads configuration from environment variables (`.env` file), NOT from the frontend. The frontend config panel stores settings in localStorage and passes them as request headers or body parameters when making API calls. Connection testing (LLM, Zep) is done directly from the frontend against external services. Docker management requires a backend proxy since browsers cannot access the Docker socket directly.

**Primary recommendation:** Build the config panel as a scrollable single-page with five sections. Use Zustand persist middleware for auto-save to localStorage. For Docker management, add a lightweight Express endpoint on the Vite dev server or a small Node.js proxy that forwards Docker API calls -- browsers cannot reach the Docker socket directly.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Scrollable single-page layout with all sections visible (like macOS Preferences)
- Section order: API Keys -> Model Selection -> Simulation Parameters -> Zep Cloud -> Docker
- Each section has a Lucide icon + heading
- Anchor-link navigation to jump between sections (optional sidebar TOC or sticky nav)
- Auto-save: changes persist automatically after edit (debounced, to localStorage)
- Live validation: errors appear immediately after leaving a field (on blur)
- No explicit "Save" button -- changes are immediate
- API keys and passwords displayed as plain text (local app, no security concern)
- Success feedback: subtle green toast or inline checkmark on successful auto-save
- Connection Testing -- API/LLM: inline "Testuj" button, full model test (short LLM generation request), inline result display, loading spinner
- Connection Testing -- Zep Cloud: expanded UX with memory count, cloud URL, account info; specific error messages
- Docker Status: container list with status, logs panel, resource usage (CPU/memory), polling every 10s, compose up/down, per-container controls, log viewer with auto-scroll

### Claude's Discretion
- Exact debounce timing for auto-save
- shadcn/ui components needed beyond Phase 2 set
- Docker API integration approach (exec docker commands vs Docker API)
- Log viewer implementation (virtual scroll vs simple textarea)
- Simulation parameter ranges and defaults
- Config storage format in localStorage

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CONF-01 | User can enter and validate OpenAI-compatible API keys and base URLs | React Hook Form + Zod validation, `Input` component for key/URL fields, on-blur validation pattern |
| CONF-02 | User can select LLM model from presets (qwen-plus, GPT-4) or enter custom model name | shadcn `Select` with preset options + custom text input fallback, stored in Zustand config store |
| CONF-03 | User can configure simulation parameters (agent count, interaction rounds, platform weights) | Numeric inputs with Zod min/max validation, `Switch` for platform toggles, slider or number input |
| CONF-04 | User can configure Zep Cloud settings (API key, cloud URL, connection test) | Input fields + connection test button calling Zep REST API `/api/v2/sessions` or health endpoint |
| CONF-05 | User can view Docker container status and perform basic management | Docker socket proxy required; polling with `usePollingQuery` hook at 10s interval |
| CONF-06 | Configuration persists across sessions | Zustand `persist` middleware with `localStorage` backend, auto-save on every change |
| CONF-07 | User can test API connection before saving configuration | Direct `fetch` to OpenAI-compatible `/v1/models` or `/v1/chat/completions` endpoint from browser |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Already in package.json |
|---------|---------|---------|------------------------|
| react-hook-form | 7.71.2 | Form state management | No -- needs install |
| @hookform/resolvers | 5.2.2 | Zod resolver bridge | No -- needs install |
| zod | 3.24.x | Schema validation | Yes (note: v3, imported from `zod/v4`) |
| zustand | 5.0.x | Config state store with persist | Yes |
| lucide-react | 0.577.0 | Section icons | Yes |
| @tanstack/react-query | 5.91.x | Connection test mutations, Docker polling | Yes |
| sonner | 2.0.x | Toast notifications for auto-save feedback | Yes |

### New shadcn/ui Components Needed
| Component | Purpose | Install Command |
|-----------|---------|----------------|
| input | Text fields for API keys, URLs, model names | `npx shadcn@latest add input` |
| select | Model preset dropdown | `npx shadcn@latest add select` |
| switch | Platform toggles (Twitter/Reddit), boolean options | `npx shadcn@latest add switch` |
| scroll-area | Log viewer, scrollable config page | `npx shadcn@latest add scroll-area` |
| label | Form field labels | `npx shadcn@latest add label` |
| form | RHF + shadcn form integration primitives | `npx shadcn@latest add form` |
| slider | Agent count, round count parameters | `npx shadcn@latest add slider` |
| tabs | Docker section tabs (containers/logs/resources) | `npx shadcn@latest add tabs` |
| card | Section containers | `npx shadcn@latest add card` |
| progress | Resource usage bars (CPU/memory) | `npx shadcn@latest add progress` |

### Already Available (from Phase 2)
| Component | Usage in Phase 3 |
|-----------|-----------------|
| button | Test buttons, Docker controls |
| badge | Container status indicators |
| alert | Validation errors, connection status |
| tooltip | Icon button labels |
| skeleton | Loading states for Docker status |
| separator | Section dividers |

### Installation
```bash
# Form management (not yet installed)
npm install react-hook-form @hookform/resolvers

# shadcn/ui components
npx shadcn@latest add input select switch scroll-area label form slider tabs card progress
```

## Architecture Patterns

### Recommended Project Structure
```
src/features/settings/
  SettingsPage.tsx              # Main scrollable page (replaces placeholder)
  components/
    SectionNav.tsx              # Sticky section navigation (anchor links)
    ApiKeysSection.tsx          # CONF-01: API key + base URL inputs
    ModelSection.tsx            # CONF-02: Model preset select + custom input
    SimulationSection.tsx       # CONF-03: Agent count, rounds, platform toggles
    ZepSection.tsx              # CONF-04: Zep API key, URL, connection test
    DockerSection.tsx           # CONF-05: Docker dashboard container
    docker/
      ContainerList.tsx         # Container table with status badges
      ContainerLogs.tsx         # Log viewer textarea
      ContainerResources.tsx    # CPU/memory progress bars
      ComposeControls.tsx       # docker compose up/down buttons
  hooks/
    useConfigStore.ts           # Zustand store with persist middleware
    useConnectionTest.ts        # TanStack Query mutation for LLM/Zep tests
    useDockerStatus.ts          # Docker polling hook (10s interval)
  schemas/
    config.schema.ts            # Zod schemas for all config sections
  types/
    config.types.ts             # TypeScript types (inferred from Zod schemas)
```

### Pattern 1: Zustand Config Store with Persist
**What:** Single Zustand store for all configuration, auto-persisted to localStorage via persist middleware.
**When:** All config state management.

```typescript
// src/features/settings/hooks/useConfigStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ConfigState {
  // API Keys (CONF-01)
  llmApiKey: string
  llmBaseUrl: string
  // Model (CONF-02)
  llmModel: string
  boostLlmApiKey: string
  boostLlmBaseUrl: string
  boostLlmModel: string
  // Simulation (CONF-03)
  agentCount: number
  maxRounds: number
  enableTwitter: boolean
  enableReddit: boolean
  // Zep (CONF-04)
  zepApiKey: string
  zepCloudUrl: string
  // Docker (CONF-05 -- runtime only, not persisted)
  // Actions
  setConfig: (partial: Partial<ConfigState>) => void
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
      llmApiKey: '',
      llmBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      llmModel: 'qwen-plus',
      boostLlmApiKey: '',
      boostLlmBaseUrl: '',
      boostLlmModel: '',
      agentCount: 10,
      maxRounds: 5,
      enableTwitter: true,
      enableReddit: true,
      zepApiKey: '',
      zepCloudUrl: 'https://api.getzep.com',
      setConfig: (partial) => set(partial),
    }),
    {
      name: 'mirofish-config',
      partialize: (state) => {
        // Exclude functions from persistence
        const { setConfig, ...rest } = state
        return rest
      },
    }
  )
)
```

### Pattern 2: Auto-Save with Debounced React Hook Form
**What:** React Hook Form watches all fields and debounces writes to Zustand store (which auto-persists).
**When:** Every config field change.

```typescript
// Auto-save pattern inside a section component
const form = useForm<ApiKeysFormValues>({
  resolver: zodResolver(apiKeysSchema),
  defaultValues: {
    llmApiKey: configStore.llmApiKey,
    llmBaseUrl: configStore.llmBaseUrl,
  },
  mode: 'onBlur', // Validate on blur per user decision
})

// Watch all fields and debounce save
useEffect(() => {
  const subscription = form.watch(
    debounce((values) => {
      if (form.formState.isValid) {
        configStore.setConfig(values)
        toast.success(t('settings:saved'), { duration: 1500 })
      }
    }, 500) // 500ms debounce -- Claude's discretion
  )
  return () => subscription.unsubscribe()
}, [form.watch])
```

### Pattern 3: Connection Test as TanStack Query Mutation
**What:** Connection tests use `useMutation` for proper loading/error/success states.
**When:** "Testuj" button clicks for LLM and Zep.

```typescript
// LLM connection test -- calls external API directly from browser
const llmTest = useMutation({
  mutationFn: async () => {
    const response = await fetch(`${llmBaseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${llmApiKey}`,
      },
      body: JSON.stringify({
        model: llmModel,
        messages: [{ role: 'user', content: 'Say "ok"' }],
        max_tokens: 5,
      }),
    })
    if (!response.ok) throw new Error(await response.text())
    return response.json()
  },
})

// In JSX:
// <Button onClick={() => llmTest.mutate()} disabled={llmTest.isPending}>
//   {llmTest.isPending ? <LoadingSpinner size="sm" /> : 'Testuj'}
// </Button>
// {llmTest.isSuccess && <CheckCircle className="text-green-500" />}
// {llmTest.isError && <XCircle className="text-red-500" />}
```

### Pattern 4: Docker Proxy Architecture
**What:** A lightweight proxy endpoint that forwards Docker API calls. Browsers cannot access the Docker Unix socket directly.
**When:** All Docker management operations.

**Recommended approach: Vite dev server middleware or small Express server.**

The Docker Engine API uses a Unix socket (`/var/run/docker.sock`). Browsers have no access to Unix sockets. Two viable approaches:

1. **Vite server plugin** (development): Add a Vite plugin that proxies `/docker-api/*` to the Docker socket. Simple but dev-only.
2. **Dedicated proxy service** (production): A small Node.js or Python service in Docker Compose that exposes Docker API over HTTP. Use `tecnativa/docker-socket-proxy` or a custom 50-line Express proxy.

For this project (single-user local tool), option 1 is sufficient for dev, and for production the nginx config can proxy to a Docker socket proxy container.

Key Docker API endpoints needed:
```
GET  /containers/json           → list containers (name, status, state)
GET  /containers/{id}/stats     → CPU/memory stats (stream: false for snapshot)
GET  /containers/{id}/logs      → container logs (stdout=true, tail=100)
POST /containers/{id}/start     → start container
POST /containers/{id}/stop      → stop container
POST /containers/{id}/restart   → restart container
```

For docker compose up/down, exec `docker compose` commands via the proxy.

### Anti-Patterns to Avoid
- **Separate localStorage calls per section:** Use a single Zustand store with persist -- one localStorage key, atomic writes, no race conditions.
- **Controlled inputs for every field:** React Hook Form uses uncontrolled inputs for performance. Do not fight this by adding `useState` per field.
- **Polling Docker when not visible:** Stop Docker polling when user navigates away from settings page or Docker section is collapsed.
- **Direct Docker socket access from browser:** Impossible. Always proxy through a backend service.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form state management | Manual useState per field | React Hook Form | 20+ fields across 5 sections; manual state is unmaintainable |
| Form validation | Custom validation functions | Zod schemas + @hookform/resolvers | Type inference, composable schemas, consistent error messages |
| Debounce | Custom setTimeout wrapper | `lodash-es/debounce` or a small utility | Edge cases with cleanup, rapid changes, unmount |
| Config persistence | Raw localStorage get/set | Zustand persist middleware | Handles serialization, hydration, migration, partialize |
| Loading/error states for tests | Manual isPending/isError state | useMutation from TanStack Query | Handles all states, deduplication, error recovery |
| Docker container status polling | setInterval + fetch | usePollingQuery hook (already exists) | Auto-cleanup, deduplication, background tab handling |

**Key insight:** This phase is 95% standard form patterns. The only novel piece is Docker management, which needs a proxy layer.

## Common Pitfalls

### Pitfall 1: CORS Blocking LLM Connection Tests
**What goes wrong:** Browser sends test request to external LLM API (e.g., Alibaba DashScope), gets CORS error.
**Why it happens:** External APIs may not include `Access-Control-Allow-Origin` headers for browser requests.
**How to avoid:** Route LLM test calls through the Vite proxy: add a proxy rule for the LLM base URL, or create a small backend endpoint that forwards the test request. Alternatively, use the MiroFish backend itself as a proxy for test calls.
**Warning signs:** Test button works in development (same-origin) but fails with external URLs.

### Pitfall 2: Zustand Persist Hydration Flash
**What goes wrong:** On page load, Zustand store initializes with defaults before localStorage hydration completes. Form shows empty fields briefly, then flashes to saved values.
**Why it happens:** Zustand persist hydration is asynchronous by default.
**How to avoid:** Use `onRehydrateStorage` callback to track hydration state. Show skeleton loading until hydration completes. Or use `skipHydration: false` (default) and ensure form `defaultValues` read from the already-hydrated store.
**Warning signs:** Fields flash from empty to filled on page load.

### Pitfall 3: React Hook Form defaultValues Stale After Store Update
**What goes wrong:** Form `defaultValues` are captured once on mount. If the Zustand store updates externally, the form does not reflect changes.
**Why it happens:** `defaultValues` in useForm is a one-time initialization.
**How to avoid:** Use `form.reset()` with new values when store changes, or use `values` prop (RHF v7.43+) which syncs form with external state.
**Warning signs:** Changing language or resetting config does not update form fields.

### Pitfall 4: Docker Stats Endpoint Returns Streaming Data
**What goes wrong:** Docker `/containers/{id}/stats` returns a stream by default, hanging the fetch request.
**Why it happens:** Docker API defaults to `stream=true` for stats.
**How to avoid:** Always pass `?stream=false` query parameter to get a single JSON snapshot instead of an infinite stream.
**Warning signs:** Docker stats request never completes, browser tab freezes.

### Pitfall 5: Debounce Not Cleaning Up on Unmount
**What goes wrong:** Debounced save fires after component unmounts, causing React warnings or stale writes.
**Why it happens:** `lodash.debounce` or `setTimeout` does not know about React lifecycle.
**How to avoid:** Cancel debounced function in useEffect cleanup: `return () => debouncedSave.cancel()`.
**Warning signs:** Console warnings about state updates on unmounted components.

### Pitfall 6: Zod v3 vs v4 Import Path
**What goes wrong:** Code imports from `zod` instead of `zod/v4`, or vice versa, causing schema incompatibilities.
**Why it happens:** Project uses `zod@^3.24.0` in package.json but existing code imports from `zod/v4`. The `zod/v4` path is a subpath export available in Zod 3.24+ that provides the v4 API surface.
**How to avoid:** Follow existing project convention: always import from `zod/v4`. Check existing files like `src/api/client.ts` for the pattern.
**Warning signs:** Type errors or runtime errors with Zod schemas.

## Code Examples

### Config Zod Schema
```typescript
// src/features/settings/schemas/config.schema.ts
import { z } from 'zod/v4'

export const apiKeysSchema = z.object({
  llmApiKey: z.string().min(1, 'Klucz API jest wymagany'),
  llmBaseUrl: z.url('Nieprawidlowy URL'),
})

export const modelSchema = z.object({
  llmModel: z.string().min(1, 'Model jest wymagany'),
  boostLlmApiKey: z.string().optional(),
  boostLlmBaseUrl: z.union([z.url(), z.literal('')]).optional(),
  boostLlmModel: z.string().optional(),
})

export const simulationSchema = z.object({
  agentCount: z.number().int().min(2).max(50),
  maxRounds: z.number().int().min(1).max(20),
  enableTwitter: z.boolean(),
  enableReddit: z.boolean(),
}).refine(
  (data) => data.enableTwitter || data.enableReddit,
  { message: 'Wybierz co najmniej jedna platforme' }
)

export const zepSchema = z.object({
  zepApiKey: z.string().optional(),
  zepCloudUrl: z.union([z.url(), z.literal('')]).optional(),
})

export type ApiKeysFormValues = z.infer<typeof apiKeysSchema>
export type ModelFormValues = z.infer<typeof modelSchema>
export type SimulationFormValues = z.infer<typeof simulationSchema>
export type ZepFormValues = z.infer<typeof zepSchema>
```

### Section Component Pattern
```typescript
// Example: ApiKeysSection.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Key } from 'lucide-react'
import { apiKeysSchema, type ApiKeysFormValues } from '../schemas/config.schema'
import { useConfigStore } from '../hooks/useConfigStore'

export function ApiKeysSection() {
  const { t } = useTranslation('settings')
  const config = useConfigStore()

  const form = useForm<ApiKeysFormValues>({
    resolver: zodResolver(apiKeysSchema),
    defaultValues: {
      llmApiKey: config.llmApiKey,
      llmBaseUrl: config.llmBaseUrl,
    },
    mode: 'onBlur',
  })

  // Auto-save on valid change (debounced)
  // ... pattern from Architecture Patterns above

  return (
    <section id="api-keys" className="space-y-4">
      <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-[22px] font-semibold">{t('apiKeys')}</h2>
      </div>
      {/* Form fields here */}
    </section>
  )
}
```

### Docker Container Status Type
```typescript
// Docker API response shape for container list
interface DockerContainer {
  Id: string
  Names: string[]
  Image: string
  State: 'running' | 'exited' | 'paused' | 'restarting' | 'dead'
  Status: string  // e.g. "Up 2 hours", "Exited (0) 3 minutes ago"
}

// Docker stats snapshot (stream=false)
interface DockerStats {
  cpu_stats: { cpu_usage: { total_usage: number } }
  precpu_stats: { cpu_usage: { total_usage: number } }
  memory_stats: { usage: number; limit: number }
}
```

### Lucide Icons Per Section
```typescript
import { Key, Bot, Sliders, Cloud, Container } from 'lucide-react'

const SECTION_ICONS = {
  apiKeys: Key,
  model: Bot,
  simulation: Sliders,
  zep: Cloud,
  docker: Container,  // or Server
} as const
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Separate localStorage calls | Zustand persist middleware | Zustand 4+ (2023) | Single atomic store, no manual serialization |
| Formik controlled forms | React Hook Form uncontrolled | RHF v7 (2021) | 3-5x fewer re-renders on complex forms |
| Custom debounce utils | lodash-es/debounce or useDeferredValue | Ongoing | Proper cleanup, TypeScript types |
| Direct Docker API from browser | Docker socket proxy | Always required | Browsers cannot access Unix sockets |

## Open Questions

1. **CORS for LLM connection testing**
   - What we know: OpenAI API allows browser CORS. DashScope (Alibaba) likely does NOT.
   - What's unclear: Whether all OpenAI-compatible APIs support browser CORS.
   - Recommendation: Route test calls through the Vite proxy by dynamically setting proxy target. Fallback: create a `/api/test-connection` endpoint on a small Express middleware.

2. **Docker compose up/down execution**
   - What we know: Docker Engine API has container start/stop/restart but NOT `docker compose up/down` -- those are CLI commands.
   - What's unclear: Whether to exec shell commands or use the Docker API to recreate containers.
   - Recommendation: For compose up/down, the proxy should exec `docker compose -f <path> up -d` and `docker compose -f <path> down` as shell commands. Individual container start/stop/restart can use the Docker Engine API directly.

3. **Zep Cloud connection test -- what to call**
   - What we know: Zep Cloud has REST API at `api.getzep.com`. The TypeScript SDK exists but is heavy.
   - What's unclear: Exact endpoint for health check and memory count.
   - Recommendation: Use direct `fetch` to Zep REST API. Try `GET /api/v2/sessions` with API key header. If CORS blocks, route through backend proxy.

4. **Backend config passthrough**
   - What we know: MiroFish backend reads config from `.env` environment variables. The OpenAPI spec has no config endpoints.
   - What's unclear: Whether the backend accepts per-request config overrides (e.g., API key in request headers).
   - Recommendation: For v1, store config in localStorage and use it for frontend features (connection testing, display). The backend uses its own `.env`. Document this limitation clearly. If backend accepts config per-request, integrate in a later phase.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.x |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONF-01 | API key + base URL validation | unit | `npx vitest run tests/features/settings/config-schema.test.ts -t "apiKeys"` | No -- Wave 0 |
| CONF-02 | Model preset select + custom input | unit | `npx vitest run tests/features/settings/config-schema.test.ts -t "model"` | No -- Wave 0 |
| CONF-03 | Simulation params validation (ranges, platform toggle) | unit | `npx vitest run tests/features/settings/config-schema.test.ts -t "simulation"` | No -- Wave 0 |
| CONF-04 | Zep config validation + connection test | unit + integration | `npx vitest run tests/features/settings/zep-test.test.ts` | No -- Wave 0 |
| CONF-05 | Docker container list + controls | unit | `npx vitest run tests/features/settings/docker-status.test.ts` | No -- Wave 0 |
| CONF-06 | Config persists across sessions (localStorage) | unit | `npx vitest run tests/features/settings/config-store.test.ts` | No -- Wave 0 |
| CONF-07 | LLM API connection test | integration | `npx vitest run tests/features/settings/llm-test.test.ts` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/features/settings/`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/features/settings/config-schema.test.ts` -- Zod schema validation tests for all sections (CONF-01, CONF-02, CONF-03, CONF-04)
- [ ] `tests/features/settings/config-store.test.ts` -- Zustand persist store tests (CONF-06)
- [ ] `tests/features/settings/llm-test.test.ts` -- LLM connection test mocked mutation (CONF-07)
- [ ] `tests/features/settings/zep-test.test.ts` -- Zep connection test mocked mutation (CONF-04)
- [ ] `tests/features/settings/docker-status.test.ts` -- Docker polling + container data parsing (CONF-05)
- [ ] React Hook Form + @hookform/resolvers packages need installation

## Sources

### Primary (HIGH confidence)
- Existing codebase analysis: `src/api/client.ts`, `src/hooks/usePolling.ts`, `src/lib/error-handler.ts`, `src/i18n/config.ts`, `src/features/settings/SettingsPage.tsx`
- `openapi/mirofish-api.yaml` -- confirmed no config endpoints in backend API
- `package.json` -- verified installed dependencies and versions
- [shadcn/ui Forms documentation](https://ui.shadcn.com/docs/forms/react-hook-form) -- React Hook Form integration patterns
- [Zustand persist middleware docs](https://zustand.docs.pmnd.rs/reference/integrations/persisting-store-data) -- localStorage persistence API

### Secondary (MEDIUM confidence)
- [Docker Engine API docs](https://docs.docker.com/reference/api/engine/) -- container endpoints, stats API
- [React Hook Form + Zod resolver](https://github.com/react-hook-form/resolvers) -- zodResolver supports both Zod v3 and v4 automatically
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference/chat/create) -- chat completions endpoint shape for connection testing
- [Zep TypeScript SDK](https://github.com/getzep/zep-js) -- REST API structure for connection testing

### Tertiary (LOW confidence)
- Docker compose up/down via API -- no official Docker Engine API for compose operations; must shell-exec
- Zep Cloud memory count endpoint -- exact endpoint for memory statistics needs validation against live Zep API
- DashScope CORS policy -- not confirmed whether Alibaba's OpenAI-compatible API allows browser-origin requests

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified, already partially installed, well-documented integration patterns
- Architecture: HIGH -- patterns follow established codebase conventions (Zustand, TanStack Query hooks, feature-based structure)
- Pitfalls: HIGH -- CORS and Docker socket are well-known browser limitations; Zustand hydration is documented
- Docker section: MEDIUM -- proxy architecture is standard but implementation approach (Vite plugin vs separate service) needs validation during implementation

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable domain, established libraries)
