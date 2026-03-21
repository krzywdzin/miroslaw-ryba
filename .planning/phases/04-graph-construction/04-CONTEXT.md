# Phase 4: Graph Construction - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can upload seed material and build a knowledge graph, completing pipeline stage 1 end-to-end. This is the first real pipeline feature — upload files, describe prediction goal, build graph, view interactive visualization.

</domain>

<decisions>
## Implementation Decisions

### Upload and Form
- Drag-and-drop zone: large area with icon + "Przeciągnij pliki lub kliknij" — Dropbox-style
- Batch upload: multiple files at once, list with preview of uploaded files
- Prediction goal input: rich editor with markdown formatting support
- File validation with clear error messages for unsupported formats

### Build Status
- Etapowy mini-stepper showing progress: 'Analiza plików' → 'Ekstrakcja encji' → 'Budowa relacji' → 'Gotowe'
- After upload + "Buduj graf" click, user transitions automatically to the graph view page
- Build progress displayed on the graph page while construction runs

### Graph Visualization
- Full-screen graph taking all available space, with a slide-out detail panel on the right (triggered by node click)
- Node interaction: hover = tooltip with basic info, click = full side panel with entity details
- Filtering: entity type checkboxes (osoby, organizacje, miejsca, wydarzenia) + search field highlighting matching nodes
- Node coloring by entity type — each type has a distinct color with a legend at the bottom
- Zoom, pan, and fit-to-screen controls

### User Flow
- Upload files + write prediction description → click "Buduj graf" button to start (not auto-start)
- On build error: inline error on graph page with "Spróbuj ponownie" retry button (Claude's discretion)
- Forward only: after building graph, user moves to next stage — changing files means a new project
- Stepper sub-steps update: upload → building → done

### Claude's Discretion
- Graph visualization library choice (Reagraph vs alternatives — MEDIUM confidence from research)
- Rich editor library for prediction description (tiptap, lexical, or simple markdown textarea)
- Exact file format support list (PDF, DOCX, TXT, etc.)
- Graph layout algorithm (force-directed, hierarchical, etc.)
- Entity type color palette
- Side panel content and layout for node details
- Error handling approach for build failures

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing API
- `src/api/graph.ts` — 10 typed graph API methods (getProject, listProjects, createProject, generateOntology, buildGraph, getGraphData, getBuildStatus, etc.)
- `src/api/schemas/graph.ts` — Zod schemas for all graph API responses
- `src/api/client.ts` — Base API client with error mapping

### Existing Patterns
- `src/hooks/usePolling.ts` — Polling hook for build status updates
- `src/components/shared/LoadingSkeleton.tsx` — Loading skeleton patterns
- `src/components/shared/ErrorAlert.tsx` — Inline error alerts with retry
- `src/lib/error-handler.ts` — Toast error handler with auto-retry
- `src/features/settings/hooks/useConfigStore.ts` — Zustand store pattern (reference for graph state)

### Research
- `.planning/research/ARCHITECTURE.md` — Backend API: graph blueprint endpoints, file upload
- `.planning/research/STACK.md` — Reagraph for graph visualization (MEDIUM confidence)
- `.planning/research/PITFALLS.md` — Pitfall on graph visualization scalability
- `.planning/REQUIREMENTS.md` — GRPH-01..05 requirements

### Design System
- `.planning/phases/02-app-shell-and-cross-cutting-concerns/02-UI-SPEC.md` — Design tokens, component registry

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/api/graph.ts` — Full typed API client for graph endpoints, ready to use
- `src/hooks/usePolling.ts` — Polling hook with TanStack Query for build status
- `src/components/shared/LoadingSkeleton.tsx` — Skeleton loading (card/list/text variants)
- `src/components/shared/LoadingSpinner.tsx` — Spinner for buttons
- `src/components/shared/ErrorAlert.tsx` — Inline error with retry button
- `src/components/ui/` — 21 shadcn components available
- `src/features/settings/hooks/useConfigStore.ts` — Zustand persist pattern to follow

### Established Patterns
- Feature-based: create `src/features/graph/` directory
- i18n: add "graph" namespace to `src/locales/{pl,en}/graph.json`
- Forms: React Hook Form + Zod (installed in Phase 3)
- State: Zustand stores with persist middleware

### Integration Points
- Pipeline stepper in sidebar needs to update sub-steps (upload/building/done)
- `src/app/App.tsx` — Add /graph route
- Config store — Read API key/model settings for backend calls

</code_context>

<specifics>
## Specific Ideas

- Full-screen graph with slide-out panel feels immersive — like a map application
- Mini-stepper for build progress gives granular feedback without overwhelming
- Rich editor for prediction description allows structured input
- Forward-only flow keeps things simple — no complex state management for re-uploads
- Entity type colors with legend make the graph immediately readable

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 04-graph-construction*
*Context gathered: 2026-03-21*
