# Phase 4: Graph Construction - Research

**Researched:** 2026-03-21
**Domain:** File upload, graph build pipeline, interactive graph visualization
**Confidence:** HIGH

## Summary

Phase 4 implements the first pipeline stage end-to-end: users upload seed material files, describe their prediction goal, trigger graph construction, and view the resulting knowledge graph interactively. The existing codebase provides a solid foundation -- a typed API client (`src/api/graph.ts`) with 10 endpoints, Zod schemas for all responses, a `usePollingQuery` hook for build status tracking, and shared UI components (ErrorAlert, LoadingSkeleton, LoadingSpinner).

The main technical decisions for this phase are: (1) react-dropzone for drag-and-drop file upload, (2) Reagraph for WebGL-based graph visualization, (3) a simple markdown textarea (not a rich editor library) for prediction description, and (4) a Zustand store for graph/pipeline state management. The existing API client already handles the full graph construction flow: `generateOntology` (POST FormData with files) -> `buildGraph` (POST project_id) -> `getTask` (poll status) -> `getGraphData` (fetch nodes/edges).

**Primary recommendation:** Build three route-level components (`/graph/upload`, `/graph/build`, `/graph/view`) connected by a Zustand pipeline store that tracks project_id, task_id, and graph_id across the flow. Use react-dropzone for file upload, Reagraph's `GraphCanvas` for visualization, and the existing `usePollingQuery` hook for build status polling.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Drag-and-drop zone: large area with icon + "Przeciagnij pliki lub kliknij" -- Dropbox-style
- Batch upload: multiple files at once, list with preview of uploaded files
- Prediction goal input: rich editor with markdown formatting support
- File validation with clear error messages for unsupported formats
- Etapowy mini-stepper showing progress: 'Analiza plikow' -> 'Ekstrakcja encji' -> 'Budowa relacji' -> 'Gotowe'
- After upload + "Buduj graf" click, user transitions automatically to the graph view page
- Build progress displayed on the graph page while construction runs
- Full-screen graph taking all available space, with a slide-out detail panel on the right (triggered by node click)
- Node interaction: hover = tooltip with basic info, click = full side panel with entity details
- Filtering: entity type checkboxes (osoby, organizacje, miejsca, wydarzenia) + search field highlighting matching nodes
- Node coloring by entity type -- each type has a distinct color with a legend at the bottom
- Zoom, pan, and fit-to-screen controls
- Upload files + write prediction description -> click "Buduj graf" button to start (not auto-start)
- On build error: inline error on graph page with "Sprobuj ponownie" retry button
- Forward only: after building graph, user moves to next stage -- changing files means a new project
- Stepper sub-steps update: upload -> building -> done

### Claude's Discretion
- Graph visualization library choice (Reagraph vs alternatives)
- Rich editor library for prediction description (tiptap, lexical, or simple markdown textarea)
- Exact file format support list (PDF, DOCX, TXT, etc.)
- Graph layout algorithm (force-directed, hierarchical, etc.)
- Entity type color palette
- Side panel content and layout for node details
- Error handling approach for build failures

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| GRPH-01 | User can upload seed material files via drag-and-drop or file picker | react-dropzone library; existing `graphApi.generateOntology(FormData)` endpoint; file validation patterns |
| GRPH-02 | User can describe prediction goal in natural language text input | Simple textarea with markdown preview; stored as `simulation_requirement` in project schema |
| GRPH-03 | User can see graph construction progress with status messages | Existing `usePollingQuery` hook + `graphApi.getTask(taskId)` for polling; TaskSchema has status/progress/error fields |
| GRPH-04 | User can view interactive knowledge graph visualization (zoom, pan, filter by entity type) | Reagraph `GraphCanvas` component with forceDirected2d layout; node filtering via `actives` prop; zoom/pan built-in |
| GRPH-05 | User can click graph nodes to inspect entity details | Reagraph `onNodeClick` handler; shadcn `Sheet` component for slide-out detail panel |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| reagraph | ^4.30.8 | WebGL graph visualization | Purpose-built for React network graphs; declarative API (`GraphCanvas` with nodes/edges props); built-in force-directed layout, zoom, pan, node click/hover events; WebGL handles 500+ nodes without lag |
| react-dropzone | ^15.0.0 | Drag-and-drop file upload | 10M+ weekly downloads; hook-based API (`useDropzone`); file type validation built-in; accessibility compliant; zero-dependency |
| react-markdown | (existing or textarea) | Prediction description preview | Lightweight markdown rendering for preview; alternatively, use plain `<textarea>` with no preview |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @tanstack/react-query | ^5.91 (installed) | Build status polling | Already installed; use `usePollingQuery` hook for task status |
| zustand | ^5.0 (installed) | Pipeline state store | Already installed; new `useGraphStore` for project_id, task_id, graph_id |
| react-hook-form | ^7.71 (installed) | Upload form validation | Already installed; validate prediction description + file selection |
| zod | ^3.24 (installed) | Schema validation | Already installed; existing graph schemas in `src/api/schemas/graph.ts` |
| lucide-react | ^0.577 (installed) | Icons | Already installed; Upload, FileText, Search, Filter icons |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Reagraph | react-force-graph-2d (v1.29) | More mature community but Canvas-based not WebGL; less React-native API; no built-in theme support |
| Reagraph | @react-sigma/core (v5.0) | Sigma.js wrapper; better for very large graphs (10K+) but heavier setup; overkill for MiroFish graph sizes |
| react-dropzone | Native HTML5 drag-drop | More work for accessibility, file validation, multi-file; react-dropzone is ~50 lines to integrate |
| Simple textarea | @tiptap/react (v3.20) | Full rich editor but 200KB+ bundle; prediction description is a single text field, not worth the weight |
| Simple textarea | @mdxeditor/editor (v3.52) | Full MDX editor; extreme overkill for a single description field |

**Discretion decision: Use a simple `<textarea>` with optional markdown preview** rather than a full rich editor. The prediction description is a single free-text field. A `<textarea>` with placeholder text and a small "Markdown supported" hint is sufficient. Adding tiptap or lexical would add 150-200KB bundle for minimal UX benefit. If markdown preview is desired, render with `react-markdown` below the textarea.

**Installation:**
```bash
npm install reagraph react-dropzone
```

## Architecture Patterns

### Recommended Project Structure
```
src/features/graph/
  components/
    UploadDropzone.tsx         # Drag-and-drop file zone
    FileList.tsx               # Preview of uploaded files
    PredictionInput.tsx        # Textarea for prediction goal
    UploadForm.tsx             # Combines dropzone + input + submit
    BuildProgress.tsx          # Mini-stepper (4 build steps)
    GraphViewer.tsx            # Reagraph GraphCanvas wrapper
    GraphToolbar.tsx           # Filter checkboxes, search, zoom controls
    GraphLegend.tsx            # Entity type color legend
    NodeDetailPanel.tsx        # Slide-out sheet for node details
    NodeTooltip.tsx            # Hover tooltip for basic node info
  hooks/
    useGraphStore.ts           # Zustand store: projectId, taskId, graphId, files, step
    useBuildStatus.ts          # usePollingQuery wrapper for task polling
    useGraphData.ts            # TanStack Query for fetching graph data
    useGraphFilters.ts         # Filter/search state and filtered node/edge computation
  pages/
    GraphUploadPage.tsx        # Upload + description form page
    GraphViewPage.tsx          # Full-screen graph visualization page
  lib/
    graph-colors.ts            # Entity type -> color mapping
    graph-transforms.ts        # Transform API nodes/edges to Reagraph format
  index.ts                     # Feature barrel export

src/locales/pl/graph.json      # Polish translations for graph feature
src/locales/en/graph.json      # English translations for graph feature
```

### Pattern 1: Graph Pipeline Store (Zustand)
**What:** Centralized store tracking the upload-build-view flow state
**When to use:** Tracking which step the user is on, carrying IDs across pages

```typescript
// src/features/graph/hooks/useGraphStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type GraphStep = 'upload' | 'building' | 'done'

interface GraphState {
  step: GraphStep
  projectId: string | null
  taskId: string | null
  graphId: string | null
  files: File[]
  predictionGoal: string
  setStep: (step: GraphStep) => void
  setProjectId: (id: string) => void
  setTaskId: (id: string) => void
  setGraphId: (id: string) => void
  setFiles: (files: File[]) => void
  setPredictionGoal: (goal: string) => void
  reset: () => void
}

export const useGraphStore = create<GraphState>()(
  persist(
    (set) => ({
      step: 'upload',
      projectId: null,
      taskId: null,
      graphId: null,
      files: [],
      predictionGoal: '',
      setStep: (step) => set({ step }),
      setProjectId: (id) => set({ projectId: id }),
      setTaskId: (id) => set({ taskId: id }),
      setGraphId: (id) => set({ graphId: id }),
      setFiles: (files) => set({ files }),
      setPredictionGoal: (goal) => set({ predictionGoal: goal }),
      reset: () => set({
        step: 'upload', projectId: null, taskId: null,
        graphId: null, files: [], predictionGoal: '',
      }),
    }),
    {
      name: 'mirofish-graph',
      partialize: (state) => ({
        step: state.step,
        projectId: state.projectId,
        taskId: state.taskId,
        graphId: state.graphId,
        predictionGoal: state.predictionGoal,
        // Do NOT persist File objects -- they are not serializable
      }),
    }
  )
)
```

### Pattern 2: API Data -> Reagraph Transformation
**What:** Transform backend GraphNode/GraphEdge shapes to Reagraph's expected format
**When to use:** After fetching graph data, before passing to GraphCanvas

```typescript
// src/features/graph/lib/graph-transforms.ts
import type { GraphNode as ReagraphNode, GraphEdge as ReagraphEdge } from 'reagraph'

// Backend schema (from src/api/schemas/graph.ts):
// GraphNodeSchema: { id, name, type? }
// GraphEdgeSchema: { source, target, relation? }

const ENTITY_COLORS: Record<string, string> = {
  person: '#3b82f6',       // blue
  organization: '#8b5cf6', // violet
  location: '#22c55e',     // green
  event: '#f59e0b',        // amber
  default: '#6b7280',      // gray
}

export function toReagraphNodes(
  apiNodes: Array<{ id: string; name: string; type?: string }>
): ReagraphNode[] {
  return apiNodes.map((node) => ({
    id: node.id,
    label: node.name,
    fill: ENTITY_COLORS[node.type ?? 'default'] ?? ENTITY_COLORS.default,
    data: { type: node.type, name: node.name },
  }))
}

export function toReagraphEdges(
  apiEdges: Array<{ source: string; target: string; relation?: string }>
): ReagraphEdge[] {
  return apiEdges.map((edge, i) => ({
    id: `${edge.source}-${edge.target}-${i}`,
    source: edge.source,
    target: edge.target,
    label: edge.relation,
  }))
}
```

### Pattern 3: Polling Build Status with Existing Hook
**What:** Reuse `usePollingQuery` for graph build progress
**When to use:** After user clicks "Buduj graf" and waits for completion

```typescript
// src/features/graph/hooks/useBuildStatus.ts
import { usePollingQuery } from '@/hooks/usePolling'
import { graphApi } from '@/api/graph'

export function useBuildStatus(taskId: string | null) {
  return usePollingQuery(
    ['graph', 'task', taskId],
    () => graphApi.getTask(taskId!),
    {
      enabled: !!taskId,
      interval: 2000,
      isComplete: (data) =>
        data.data.status === 'completed' || data.data.status === 'failed',
    }
  )
}
```

### Pattern 4: Full-Screen Graph with Slide-Out Panel
**What:** GraphCanvas takes full viewport with a Sheet overlay for node details
**When to use:** The main graph view page

```typescript
// Conceptual layout structure
<div className="relative h-[calc(100vh-var(--header-height))]">
  <GraphToolbar />        {/* Absolute positioned top-left */}
  <GraphCanvas            {/* Full container */}
    nodes={filteredNodes}
    edges={filteredEdges}
    layoutType="forceDirected2d"
    onNodeClick={handleNodeClick}
    onNodePointerOver={handleNodeHover}
    onNodePointerOut={handleNodeLeave}
    selections={selectedNodeId ? [selectedNodeId] : []}
    theme={graphTheme}
  />
  <GraphLegend />         {/* Absolute positioned bottom-center */}
  <Sheet open={!!selectedNode} onOpenChange={handleClosePanel}>
    <SheetContent side="right">
      <NodeDetailPanel node={selectedNode} />
    </SheetContent>
  </Sheet>
</div>
```

### Anti-Patterns to Avoid
- **Persisting File objects in Zustand:** File objects are not serializable. Only persist IDs and metadata, not the actual files.
- **Rendering GraphCanvas conditionally in the same container:** Mount GraphCanvas once and update its data props. Unmounting/remounting resets WebGL context (expensive).
- **Polling from component useEffect:** Always use `usePollingQuery` / TanStack Query. Never `setInterval` in components.
- **Passing all nodes to GraphCanvas when filtering:** Use the `actives` prop or filter the data array before passing. Do NOT hide nodes with CSS.
- **Building a custom graph renderer:** Reagraph handles force-directed layout, zoom, pan, and node interactions. Do not hand-roll SVG/Canvas graph rendering.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drag-and-drop file upload | Custom drag event handlers | react-dropzone `useDropzone` hook | File type validation, accessibility, multi-file, edge cases (drag leave, nested drops) |
| Graph layout algorithms | Custom force-directed simulation | Reagraph built-in `forceDirected2d` layout | d3-force-3d integration, collision avoidance, stabilization -- hundreds of edge cases |
| Graph zoom/pan | Custom wheel/pointer handlers on canvas | Reagraph built-in camera controls | Pinch-to-zoom, smooth interpolation, bounds clamping |
| Build status polling | Custom setInterval with cleanup | `usePollingQuery` (already exists at `src/hooks/usePolling.ts`) | Auto-cleanup, structural sharing, background tab pause |
| Slide-out panel | Custom absolute-positioned div | shadcn `Sheet` component (already installed) | Accessibility (focus trap, escape key), animation, overlay |
| Node tooltips | Custom positioned div | shadcn `Tooltip` or Reagraph's built-in tooltip support | Positioning logic, portal rendering, edge-of-screen handling |

**Key insight:** This phase combines multiple complex UI patterns (file upload, polling, graph visualization, slide-out panels). Each one has well-tested library solutions. Building custom versions of any of these would consume the entire phase budget on one feature.

## Common Pitfalls

### Pitfall 1: Reagraph WebGL Context Loss
**What goes wrong:** Conditionally rendering `<GraphCanvas>` (e.g., `{showGraph && <GraphCanvas ... />}`) causes WebGL context creation/destruction on every toggle. This is slow (100-500ms) and can cause "too many WebGL contexts" browser errors.
**Why it happens:** WebGL contexts are a limited browser resource (typically 8-16 max).
**How to avoid:** Mount GraphCanvas once and control visibility with CSS (`display: none` or `opacity: 0`) when not needed, or keep it always mounted on the graph view page.
**Warning signs:** Blank graph after navigation, console warnings about WebGL context.

### Pitfall 2: File Upload FormData Construction
**What goes wrong:** Sending files to `graphApi.generateOntology(FormData)` with incorrect field names or missing the prediction description. The backend expects specific FormData field names.
**Why it happens:** Backend FormData field names are not documented in schemas -- they are implicit in the Flask route handler.
**How to avoid:** Check the existing `generateOntology` call signature. It accepts `FormData` directly. Construct FormData with `formData.append('file', file)` for each file, plus `formData.append('simulation_requirement', description)`. Test against the real backend early.
**Warning signs:** 400 errors from the backend on upload.

### Pitfall 3: Graph Data Shape Mismatch
**What goes wrong:** Backend returns nodes with `{ id, name, type }` but Reagraph expects `{ id, label }`. Edges have `{ source, target, relation }` but Reagraph needs `{ id, source, target, label }`.
**Why it happens:** Different libraries use different property names for the same concepts.
**How to avoid:** Create a dedicated transform layer (`graph-transforms.ts`) that maps between API shapes and Reagraph shapes. Never pass API data directly to GraphCanvas.
**Warning signs:** Nodes render without labels, edges throw "missing id" errors.

### Pitfall 4: Build Status State Desync
**What goes wrong:** User navigates away from graph page during build, comes back, and the UI shows stale state or restarts polling incorrectly.
**Why it happens:** Polling is tied to component lifecycle, not pipeline state.
**How to avoid:** Persist `taskId` and `step` in Zustand store. On mount, check if `step === 'building'` and `taskId` exists, then resume polling. The `usePollingQuery` hook handles this naturally with TanStack Query's cache.
**Warning signs:** Build progress resets to 0% after navigation.

### Pitfall 5: Large Graph Performance
**What goes wrong:** Graphs with 200+ nodes cause janky interactions (slow hover, delayed pan).
**Why it happens:** Force-directed layout simulation runs continuously; node labels are expensive to render at scale.
**How to avoid:** Use Reagraph's `labelType="auto"` to hide labels when zoomed out. Set `sizingType="none"` to avoid expensive size calculations. Use `animated={false}` for initial render if graph is large.
**Warning signs:** FPS drops below 30 when interacting with the graph.

## Code Examples

### File Upload with react-dropzone
```typescript
// Source: react-dropzone official docs
import { useDropzone } from 'react-dropzone'
import { useTranslation } from 'react-i18next'
import { Upload } from 'lucide-react'

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
}

function UploadDropzone({ onFilesAdded }: { onFilesAdded: (files: File[]) => void }) {
  const { t } = useTranslation('graph')
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED_TYPES,
    multiple: true,
    onDrop: onFilesAdded,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center cursor-pointer transition-colors',
        isDragActive ? 'border-accent bg-accent/5' : 'border-muted-foreground/25 hover:border-accent/50'
      )}
    >
      <input {...getInputProps()} />
      <Upload className="mb-4 size-10 text-muted-foreground" />
      <p className="text-[15px] font-semibold">{t('dropzone.title')}</p>
      <p className="mt-1 text-[13px] text-muted-foreground">{t('dropzone.subtitle')}</p>
    </div>
  )
}
```

### Reagraph GraphCanvas with Interactions
```typescript
// Source: Reagraph official docs + API reference
import { GraphCanvas, type GraphNode, type GraphEdge } from 'reagraph'
import { useState, useCallback } from 'react'

interface GraphViewerProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeSelect: (node: GraphNode | null) => void
}

function GraphViewer({ nodes, edges, onNodeSelect }: GraphViewerProps) {
  const [selections, setSelections] = useState<string[]>([])

  const handleNodeClick = useCallback((node: { id: string }) => {
    setSelections([node.id])
    const fullNode = nodes.find((n) => n.id === node.id)
    onNodeSelect(fullNode ?? null)
  }, [nodes, onNodeSelect])

  return (
    <GraphCanvas
      nodes={nodes}
      edges={edges}
      layoutType="forceDirected2d"
      selections={selections}
      onNodeClick={handleNodeClick}
      onNodePointerOver={(node) => {
        // Tooltip handled via Reagraph's built-in or custom overlay
      }}
      animated
      cameraMode="pan"
    />
  )
}
```

### Build Progress Mini-Stepper
```typescript
// Mini-stepper showing 4 build steps
const BUILD_STEPS = [
  { key: 'analyzing', label: 'Analiza plikow' },
  { key: 'extracting', label: 'Ekstrakcja encji' },
  { key: 'building', label: 'Budowa relacji' },
  { key: 'done', label: 'Gotowe' },
] as const

function BuildProgress({ taskStatus }: { taskStatus: string }) {
  const currentStep = mapStatusToStep(taskStatus) // Map API status to step index

  return (
    <div className="flex items-center gap-2">
      {BUILD_STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center gap-2">
          <div className={cn(
            'flex size-8 items-center justify-center rounded-full text-[13px] font-semibold',
            i < currentStep && 'bg-success text-success-foreground',
            i === currentStep && 'bg-accent text-accent-foreground animate-pulse',
            i > currentStep && 'bg-muted text-muted-foreground',
          )}>
            {i < currentStep ? <Check className="size-4" /> : i + 1}
          </div>
          <span className={cn(
            'text-[13px]',
            i <= currentStep ? 'font-semibold' : 'text-muted-foreground'
          )}>
            {step.label}
          </span>
          {i < BUILD_STEPS.length - 1 && (
            <Separator className="w-6" />
          )}
        </div>
      ))}
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| D3.js force simulation (imperative) | Reagraph `GraphCanvas` (declarative React) | 2023+ | No manual DOM manipulation; React-friendly props-based API |
| Custom file input + drag handlers | react-dropzone hooks | Stable since 2020 | Accessibility, validation, edge cases handled |
| Rich text editors for simple input | Textarea + markdown hint | Always valid | 150-200KB bundle savings; adequate for single-field input |
| Manual polling with setInterval | TanStack Query refetchInterval | 2022+ | Auto-cleanup, deduplication, background tab pause |

## Open Questions

1. **Backend FormData field names for file upload**
   - What we know: `graphApi.generateOntology(FormData)` sends POST to `/graph/ontology/generate`
   - What's unclear: Exact field names the backend expects (e.g., `file`, `files`, `documents`)
   - Recommendation: Test with a single file upload against running backend first; inspect the existing API client call

2. **Task status values from backend**
   - What we know: `TaskSchema` has `status: z.string()` and `progress: z.number().optional()`
   - What's unclear: Exact string values for status (e.g., `pending`, `processing`, `completed`, `failed`) and what progress percentage maps to which build step
   - Recommendation: The 4-step mini-stepper may need to be approximate; map status string to closest step

3. **Graph size from real backend**
   - What we know: GraphRAG produces entity-relationship graphs from uploaded documents
   - What's unclear: Typical node/edge counts for real MiroFish projects
   - Recommendation: Reagraph handles 500+ nodes well; if real graphs exceed 1000 nodes, add label hiding on zoom-out

4. **Node type taxonomy**
   - What we know: User wants filtering by osoby, organizacje, miejsca, wydarzenia (persons, orgs, locations, events)
   - What's unclear: Whether backend `GraphNodeSchema.type` field uses these exact Polish categories or different English terms
   - Recommendation: Build type mapping layer; UI shows Polish labels regardless of backend values

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.x + @testing-library/react 16.x |
| Config file | `vitest.config.ts` (exists) |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --coverage` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| GRPH-01 | File upload via drag-and-drop, file validation | unit | `npx vitest run tests/features/graph/upload.test.tsx -t "upload"` | Wave 0 |
| GRPH-02 | Prediction goal text input, form validation | unit | `npx vitest run tests/features/graph/upload-form.test.tsx -t "prediction"` | Wave 0 |
| GRPH-03 | Build status polling, mini-stepper progress | unit | `npx vitest run tests/features/graph/build-status.test.ts -t "build"` | Wave 0 |
| GRPH-04 | Graph data transform, filter by entity type | unit | `npx vitest run tests/features/graph/graph-transforms.test.ts -t "transform"` | Wave 0 |
| GRPH-05 | Node click -> detail panel opens with entity data | unit | `npx vitest run tests/features/graph/node-detail.test.tsx -t "node"` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/features/graph/ --reporter=verbose`
- **Per wave merge:** `npx vitest run --coverage`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/features/graph/upload.test.tsx` -- covers GRPH-01 (dropzone, file validation)
- [ ] `tests/features/graph/upload-form.test.tsx` -- covers GRPH-02 (form submission, validation)
- [ ] `tests/features/graph/build-status.test.ts` -- covers GRPH-03 (polling, status mapping)
- [ ] `tests/features/graph/graph-transforms.test.ts` -- covers GRPH-04 (API->Reagraph data transform, filtering)
- [ ] `tests/features/graph/node-detail.test.tsx` -- covers GRPH-05 (panel open/close, data display)
- [ ] `tests/features/graph/graph-store.test.ts` -- covers store state transitions
- Note: Reagraph's GraphCanvas uses WebGL which is not available in jsdom. Graph rendering tests should test data transforms and state, not visual output.

## Sources

### Primary (HIGH confidence)
- [Reagraph official site](https://reagraph.dev/) - API reference, layout types, basics
- [Reagraph GitHub](https://github.com/reaviz/reagraph) - Source, issues, examples
- [react-dropzone official docs](https://react-dropzone.js.org/) - Hook API, file validation
- Existing codebase: `src/api/graph.ts`, `src/api/schemas/graph.ts`, `src/hooks/usePolling.ts`

### Secondary (MEDIUM confidence)
- [Reagraph npm](https://www.npmjs.com/package/reagraph) - Version 4.30.8 confirmed
- [react-dropzone npm](https://www.npmjs.com/package/react-dropzone) - Version 15.0.0 confirmed
- STACK.md research recommendations for Reagraph

### Tertiary (LOW confidence)
- Exact backend FormData field names (need live testing)
- Backend task status string enum values (need live testing)
- Typical graph sizes from MiroFish GraphRAG (need real data)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Reagraph and react-dropzone are well-documented with clear APIs; all supporting libs already installed
- Architecture: HIGH - Follows established project patterns (feature folders, Zustand stores, usePollingQuery)
- Pitfalls: MEDIUM - WebGL context and data shape issues are well-known; backend-specific pitfalls need live testing

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable libraries, no fast-moving concerns)
