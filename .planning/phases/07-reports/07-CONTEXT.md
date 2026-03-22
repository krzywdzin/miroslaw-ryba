# Phase 7: Reports - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can view generated prediction reports with rich markdown formatting, export them as PDF or Markdown, and browse a history of past simulations with their report status. This is pipeline stage 4.

</domain>

<decisions>
## Implementation Decisions

### Report display
- Article layout with sidebar navigation: full-page rendered markdown on the left, sticky table of contents (outline) on the right
- Sidebar shows section list from report outline — clicking a section scrolls to it
- Scroll spy: sidebar highlights the currently visible section as user scrolls
- Markdown rendered via react-markdown + remark-gfm plugin — supports tables, checklists, links
- Styling via Tailwind Typography plugin (`prose` classes)
- Toolbar at top with export actions

### Export
- PDF: browser print dialog via `window.print()` with `@media print` CSS — no additional libraries
- Markdown: download as .md file — Blob from `markdown_content` + download link
- Both actions as buttons in the toolbar above the report

### Simulation history
- Separate page at `/history` — link in sidebar navigation
- Table layout with columns: topic, status (badge), date, agent count, report link
- Sortable by date (newest first by default)
- "Otwórz" link in report column navigates to report view (if report exists)
- Simulations without reports show disabled/empty state in report column
- Consistent with EntityTable pattern from Phase 5

### Report generation
- Auto-triggered: when user clicks "Przejdź do raportu" from simulation page, check via `report.check` — if no report, auto-call `report.generate`
- Section-based progress display: list of report sections with checkmarks (✓ done, ● in progress, ○ pending)
- Progress bar with percentage at top
- Polling via `usePollingQuery` for `report.getProgress` endpoint
- After generation complete, auto-transition to report view

### Claude's Discretion
- Exact prose typography (font sizes, line heights, margins within the article)
- Print CSS specifics (page breaks, header/footer hiding)
- Section navigation smooth scroll behavior
- Scroll spy intersection observer thresholds
- Empty state design for history page
- Error handling during report generation (timeout, failure)
- Toolbar button styles and placement
- Responsive behavior — sidebar may collapse on narrower screens
- How report check/generate flow handles edge cases (already generating, failed previous attempt)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Report API
- `src/api/report.ts` — Full typed API: generate, get, list, download, getProgress, getSections, check, delete, chat
- `src/api/schemas/report.ts` — Zod schemas: ReportSchema (report_id, simulation_id, markdown_content, outline, status), ReportProgressSchema (status, progress, current_section, completed_sections), ReportSectionsSchema, ReportCheckSchema (has_report, report_status), ReportListResponseSchema

### Simulation API (for history)
- `src/api/simulation.ts` — `simulation.list()` for browsing past simulations
- `src/api/schemas/simulation.ts` — SimulationStateSchema, SimulationListResponseSchema

### Existing Patterns
- `src/hooks/usePolling.ts` — usePollingQuery hook for generation progress polling
- `src/features/simulation/hooks/useSimulationStore.ts` — Zustand persist store pattern
- `src/features/environment/components/EntityTable.tsx` — Table pattern for history
- `src/components/shared/` — LoadingSkeleton, ErrorAlert, Spinner

### Design System
- `.planning/phases/02-app-shell-and-cross-cutting-concerns/02-UI-SPEC.md` — Design tokens

### Requirements
- `.planning/REQUIREMENTS.md` — REPT-01..04 requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/api/report.ts` — All report API methods already typed
- `src/hooks/usePolling.ts` — usePollingQuery for generation progress
- `src/components/ui/table.tsx` — shadcn Table component (installed)
- `src/components/ui/badge.tsx` — Status badges
- `src/components/ui/progress.tsx` — Progress bar
- `src/components/ui/scroll-area.tsx` — ScrollArea for report content
- `src/features/environment/components/EntityTable.tsx` — Table with sort pattern

### Established Patterns
- Feature-based directory: create `src/features/reports/`
- i18n: add "reports" namespace
- TanStack Query for data fetching with polling
- Zustand with persist for pipeline state

### Integration Points
- Simulation page "Przejdź do raportu" button → navigate to /report/:id
- `src/app/App.tsx` — Add /report/:id and /history routes
- Pipeline stepper needs active state for reports stage
- Simulation store provides simulation_id for report API calls

</code_context>

<specifics>
## Specific Ideas

- Article + sidebar pattern gives a documentation-quality reading experience — important for long prediction reports
- Scroll spy makes large reports navigable without losing position
- Section-based generation progress makes the wait feel productive — user sees the report being built piece by piece
- Auto-trigger from simulation avoids an extra manual step in the pipeline flow

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 07-reports*
*Context gathered: 2026-03-22*
