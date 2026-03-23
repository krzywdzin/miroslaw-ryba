# Phase 9: Polish and Differentiation - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Application reaches production quality with dark mode, keyboard shortcuts, and systematic refinement of all existing features — edge cases, empty states, timeouts, partial data handling across all pipeline stages.

</domain>

<decisions>
## Implementation Decisions

### Dark mode
- 3-state toggle: System (auto OS) / Jasny (light) / Ciemny (dark)
- Default: System — follows OS `prefers-color-scheme`
- User override persisted in localStorage
- Toggle location: header, next to language switcher — Sun/Moon icon with dropdown
- Implementation via Tailwind CSS `dark:` variant with `class` strategy (add `dark` class to `<html>`)
- All existing components must render correctly in dark mode — systematic review

### Keyboard shortcuts
- Navigation: keys 1-5 switch between pipeline stages (1=Graph, 2=Environment, 3=Simulation, 4=Report, 5=Chat)
- Chat focus: `/` focuses the chat input field (Slack-style)
- Panel switching: `[` and `]` switch between panels on current page
- Help: `?` opens modal with all shortcuts listed
- Scope: shortcuts disabled when focus is inside input/textarea elements — prevents conflicts with typing
- No modifier keys needed (no Ctrl/Cmd) — simple single-key shortcuts

### Quality pass — edge cases
- Systematic review of every page in the pipeline
- Per-page checklist: empty states, error handling, loading states, timeout handling, partial data
- Pages to review: Dashboard, Graph Upload, Graph View, Environment, Simulation, Report, Chat, History, Settings
- Fix any missing empty states, improve error messages, add timeout handling where needed
- Ensure all loading skeletons match actual content layout

### Claude's Discretion
- Dark mode color palette specifics (exact dark background, card colors, border colors)
- Shortcut key combinations if conflicts arise
- Help modal design and layout
- Which edge cases need attention (based on code audit)
- Animation/transition behavior when switching themes
- How to handle dark mode in print CSS (always light for PDF export)
- Order and priority of quality fixes

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `.planning/phases/02-app-shell-and-cross-cutting-concerns/02-UI-SPEC.md` — Design tokens, color palette (needs dark variants)
- `src/styles/globals.css` — CSS custom properties for theming
- `tailwind.config.ts` or `src/styles/` — Tailwind configuration for dark mode strategy

### Existing Components (dark mode audit)
- `src/components/layout/Header.tsx` — Header where toggle goes
- `src/components/layout/LanguageSwitcher.tsx` — Pattern for header toggle (similar component)
- `src/components/ui/` — All shadcn components (already support dark mode via CSS variables)
- `src/features/*/` — All feature components need dark mode review

### Requirements
- `.planning/REQUIREMENTS.md` — UIUX-04 (dark mode), UIUX-07 (keyboard shortcuts)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- shadcn/ui components already support dark mode via CSS custom properties — need to set dark values in globals.css
- `src/components/layout/LanguageSwitcher.tsx` — pattern for header dropdown toggle
- `src/components/ui/dropdown-menu.tsx` — shadcn DropdownMenu for theme picker
- react-i18next already set up — keyboard shortcut labels can be i18n'd

### Established Patterns
- CSS custom properties in globals.css for theming
- localStorage for persistence (used by config store, simulation store)
- Feature-based directory structure

### Integration Points
- `src/components/layout/Header.tsx` — add theme toggle
- `src/app/providers.tsx` — may need ThemeProvider
- `src/styles/globals.css` — dark mode CSS variables
- Every feature page — keyboard event listeners
- `src/app/App.tsx` — global keyboard shortcut handler

</code_context>

<specifics>
## Specific Ideas

- 3-state toggle avoids forcing users to choose — System auto-detects, manual override when needed
- Single-key shortcuts (no modifiers) feel snappier for power users but must be disabled in text fields
- `?` for help is a well-known convention (GitHub, Gmail, Slack)
- Systematic quality pass ensures no rough edges before documentation phase

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 09-polish-and-differentiation*
*Context gathered: 2026-03-23*
