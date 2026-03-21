# Phase 3: Configuration Panel - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can fully configure MiroFish system settings (API keys, models, simulation parameters, Zep Cloud, Docker) without editing config files. This replaces the SettingsPage placeholder from Phase 2 with a complete configuration experience.

</domain>

<decisions>
## Implementation Decisions

### Section Organization
- Scrollable single-page layout with all sections visible (like macOS Preferences)
- Section order: API Keys → Model Selection → Simulation Parameters → Zep Cloud → Docker
- Each section has a Lucide icon + heading
- Anchor-link navigation to jump between sections (optional sidebar TOC or sticky nav)

### Save and Validation
- Auto-save: changes persist automatically after edit (debounced, to localStorage)
- Live validation: errors appear immediately after leaving a field (on blur)
- No explicit "Save" button — changes are immediate
- API keys and passwords displayed as plain text (local app, no security concern)
- Success feedback: subtle green toast or inline checkmark on successful auto-save

### Connection Testing — API/LLM
- Inline "Testuj" button next to API key field
- Full model test: sends a short LLM generation request with the selected model
- Result displayed inline: green checkmark + "Połączono" / red X + error message
- Loading state: spinner on the button during test

### Connection Testing — Zep Cloud
- Expanded UX beyond simple ping: show connection status, memory count, cloud URL
- Inline "Testuj połączenie" button
- On success: display Zep account info (memory count, plan info if available)
- On failure: specific error message (invalid key, unreachable, timeout)

### Docker Status
- Rozbudowany view: container list with status (running/stopped/error), logs panel, resource usage (CPU/memory)
- Polling every 10s for auto-refresh of container status
- Full compose control: "Uruchom backend" / "Zatrzymaj backend" buttons for docker compose up/down
- Per-container controls: start/stop/restart individual containers
- Log viewer: last N lines of container logs, auto-scroll, filter by container
- Resource usage: simple CPU/memory bars per container

### Claude's Discretion
- Exact debounce timing for auto-save
- shadcn/ui components needed beyond Phase 2 set (input, select, switch, tabs, card, scroll-area)
- Docker API integration approach (exec docker commands vs Docker API)
- Log viewer implementation (virtual scroll vs simple textarea)
- Simulation parameter ranges and defaults
- Config storage format in localStorage

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Existing Code
- `src/features/settings/SettingsPage.tsx` — Placeholder to be replaced with full config panel
- `src/api/client.ts` — API client base (config values will be passed here)
- `src/api/errors.ts` — Error mapping (error messages for failed connections)
- `src/lib/error-handler.ts` — Toast error handler (use for connection test failures)
- `src/i18n/config.ts` — i18n setup (add "settings" namespace for config translations)
- `src/hooks/usePolling.ts` — Polling hook (reuse for Docker status polling)

### Stack Decisions
- `.planning/research/STACK.md` — React Hook Form + Zod for forms, Zustand for client state
- `.planning/research/SUMMARY.md` — Config stored in localStorage, passed to backend per-request
- `.planning/research/ARCHITECTURE.md` — Backend API surface, config endpoints (if any)

### Design
- `.planning/phases/02-app-shell-and-cross-cutting-concerns/02-UI-SPEC.md` — Design tokens, component registry
- `.planning/REQUIREMENTS.md` — CONF-01..07 requirements for this phase

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/hooks/usePolling.ts` — Polling hook with TanStack Query, reusable for Docker status polling
- `src/lib/error-handler.ts` — Error handler with toast + auto-retry, use for connection test failures
- `src/components/shared/LoadingSpinner.tsx` — Spinner for connection test buttons
- `src/components/shared/ErrorAlert.tsx` — Inline error alerts for validation
- `src/components/ui/button.tsx`, `alert.tsx`, `badge.tsx`, `tooltip.tsx` — shadcn components available
- `src/locales/{pl,en}/errors.json` — Error translation namespace exists

### Established Patterns
- Feature-based structure: `src/features/settings/` directory already exists
- i18n with namespaces: add "settings" namespace for config UI translations
- React Hook Form + Zod planned for form validation (from STACK.md)
- Auto-save pattern: debounced localStorage writes

### Integration Points
- `src/app/App.tsx` — `/settings` route already exists, points to SettingsPage
- `src/api/client.ts` — API client needs to read config (API key, base URL) from localStorage/Zustand store
- Docker commands: exec via backend proxy or direct Docker API

</code_context>

<specifics>
## Specific Ideas

- macOS Preferences feel: all sections scrollable on one page, clean section dividers
- Docker section is the most complex: logs, resources, compose control — almost a mini-dashboard
- Zep Cloud test should show richer info than just "connected" — memory count, account details
- LLM test should actually call the model, not just ping an endpoint
- No passwords/keys masking — this is a local tool, visibility is more convenient

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 03-configuration-panel*
*Context gathered: 2026-03-21*
