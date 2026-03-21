# Phase 2: App Shell and Cross-Cutting Concerns - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Users see a complete application shell with Polish/English i18n, 5-stage pipeline stepper, and consistent loading/error patterns that all subsequent features plug into. No pipeline features yet — just the frame.

</domain>

<decisions>
## Implementation Decisions

### Layout and Navigation
- Combined navigation: top bar with mini-stepper (horizontal pipeline progress) + left sidebar with detailed step information
- Sidebar: fixed on desktop, collapsible/drawer on tablet (<1024px)
- Stepper shows sub-steps within each stage (expandable: e.g., upload → building → done)
- Navigation: users can freely go back to completed stages, cannot skip ahead to uncompleted ones
- Content area width varies by stage: some full-width (simulation), some centered max-width (forms)
- Lucide icons throughout navigation and UI
- Subtle fade/slide animations for stage transitions

### Header
- Expanded header: logo/name + breadcrumb showing current stage + language switcher + config button + backend status indicator
- Backend status: green/red dot (connected/disconnected) — simple, not verbose
- Config accessed via separate /settings page (not modal/drawer)

### Home / Dashboard
- Dashboard view before pipeline starts: system status, recent simulations (if any), quick-start button
- Not straight to pipeline — give user overview first

### Footer
- Minimal footer: version number + GitHub link + AGPL-3.0 note

### Visual Style
- Light mode default (dark mode deferred to Phase 9)
- Accent color: blue — professional, tech feel (Linear-inspired)
- Border radius: rounded (8-12px) — friendly, approachable
- Typography: Geist font family
- Density: spacious — lots of whitespace, Notion-inspired breathing room
- Shadows: subtle — adds depth without heaviness
- Visual inspiration: Notion (spacious, friendly, clean) with Linear's professionalism

### Loading and Error States
- Loading: skeleton screens for main content, spinners for action buttons and form submissions
- Errors: toast notifications for global/network errors, inline alerts for form validation
- Network retry: auto-retry 2x on failure, then show manual "Spróbuj ponownie" button
- Empty states: simple icon/illustration + descriptive text explaining what to do

### Language and Translation
- Tone: friendly, direct, using "Ty" form ("Załaduj materiał źródłowy" not "Proszę załadować...")
- Pipeline stage names in Polish: Budowa grafu, Środowisko, Symulacja, Raport, Dialog
- Technical terms: mixed naturally as Poles actually speak — "klucz API", "model LLM", "graf wiedzy"
- Polish 4 plural forms handled via ICU MessageFormat in react-i18next
- Chinese backend error messages intercepted (error mapping layer from Phase 1) and displayed in PL/EN

### Claude's Discretion
- Translation file structure (JSON per namespace vs single file per language)
- Exact Tailwind CSS v4 configuration for design tokens
- shadcn/ui component selection and customization
- React Router route structure
- Skeleton screen shapes and animation timing
- Toast notification positioning and auto-dismiss timing
- Exact Geist font weights to include

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Stack and Components
- `.planning/research/STACK.md` — shadcn/ui + Tailwind CSS v4 + react-i18next + Zustand + React Router 7
- `.planning/research/SUMMARY.md` — Architecture overview: pipeline state machine, i18n with ICU MessageFormat

### Existing Code
- `src/app/App.tsx` — Current placeholder to be replaced with app shell
- `src/app/providers.tsx` — TanStack Query provider (wrap new providers around this)
- `src/api/errors.ts` — Chinese error mapping layer already built
- `src/hooks/usePolling.ts` — Polling hook for real-time updates

### Design Decisions
- `.planning/PROJECT.md` — Minimalist design, Polish default, AGPL-3.0
- `.planning/REQUIREMENTS.md` — I18N-01..04, UIUX-01..03, UIUX-05, UIUX-06, UIUX-08

### Pitfalls
- `.planning/research/PITFALLS.md` — Pitfall #3 (Polish i18n not simple string replacement), Pitfall #5 (Chinese errors leaking)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/app/providers.tsx` — QueryClientProvider wrapper, extend with i18n provider and router
- `src/api/errors.ts` — mapChineseError function + error mapping dictionary already built
- `src/hooks/usePolling.ts` — Polling hook ready for Phase 6 simulation monitoring

### Established Patterns
- Feature-based directory structure: src/features/ for pipeline stages
- pnpm + Vite 8 + React 19 + TypeScript
- ESLint 9 flat config + Prettier
- Vitest + React Testing Library for tests

### Integration Points
- `src/app/App.tsx` — replace placeholder with router + app shell layout
- `src/app/providers.tsx` — add I18nextProvider wrapping existing QueryClientProvider
- `src/app/main.tsx` — entry point, providers already wired

</code_context>

<specifics>
## Specific Ideas

- Notion-like spacious feel with Linear's professional blue accent
- Pipeline stages in Polish: Budowa grafu, Środowisko, Symulacja, Raport, Dialog
- Friendly "Ty" form in all UI text — casual but professional
- Sub-steps in stepper expand on click to show progress within a stage
- Dashboard as landing page showing system status before entering pipeline
- Backend status as simple green/red dot in header — not verbose

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-app-shell-and-cross-cutting-concerns*
*Context gathered: 2026-03-21*
