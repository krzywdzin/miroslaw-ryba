---
phase: 09-polish-and-differentiation
plan: 01
subsystem: ui
tags: [dark-mode, tailwind-v4, css-custom-properties, theme-toggle, reagraph]

# Dependency graph
requires:
  - phase: 02-design-system
    provides: shadcn/ui components, CSS custom properties, globals.css
  - phase: 04-graph
    provides: GraphViewer component with reagraph
provides:
  - Dark mode CSS custom property overrides in globals.css
  - useTheme hook for 3-state theme management
  - ThemeSwitcher dropdown component in header
  - FOUC prevention inline script in index.html
  - Reagraph dark/light theme integration
affects: [09-02-PLAN, all-pages]

# Tech tracking
tech-stack:
  added: []
  patterns: [css-custom-variant-dark, theme-hook-with-localstorage, fouc-prevention-script]

key-files:
  created:
    - src/hooks/useTheme.ts
    - src/hooks/useTheme.test.ts
    - src/components/layout/ThemeSwitcher.tsx
    - src/components/layout/ThemeSwitcher.test.tsx
  modified:
    - src/styles/globals.css
    - index.html
    - src/components/layout/Header.tsx
    - src/features/graph/components/GraphViewer.tsx
    - src/features/settings/components/ZepSection.tsx
    - src/features/simulation/components/SimulationProgressBar.tsx
    - src/locales/pl/common.json
    - src/locales/en/common.json

key-decisions:
  - "Used reagraph built-in darkTheme as base with custom edge/label color overrides"
  - "localStorage mock pattern for jsdom test environment (defineProperty approach)"

patterns-established:
  - "Theme hook pattern: useTheme returns { theme, setTheme, resolvedTheme } with localStorage persistence"
  - "FOUC prevention: inline script in index.html head reads localStorage before React mounts"

requirements-completed: [UIUX-04]

# Metrics
duration: 5min
completed: 2026-03-23
---

# Phase 9 Plan 01: Dark Mode Summary

**3-state dark mode toggle (System/Light/Dark) with CSS custom property overrides, FOUC prevention, reagraph theme integration, and hardcoded color audit**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-23T21:03:07Z
- **Completed:** 2026-03-23T21:08:30Z
- **Tasks:** 2
- **Files modified:** 12

## Accomplishments
- Dark mode CSS infrastructure with @custom-variant and .dark CSS custom property overrides
- useTheme hook with 3-state toggle, localStorage persistence, and OS preference detection
- ThemeSwitcher dropdown in header with Sun/Moon/Monitor icons and i18n labels
- FOUC prevention inline script in index.html applying dark class before React mounts
- All hardcoded bg-white replaced with bg-background across the entire codebase
- Reagraph graph visualization adapts edge/label/background colors to dark mode
- 254 total tests passing, TypeScript compiles clean

## Task Commits

Each task was committed atomically:

1. **Task 1: Dark mode CSS infrastructure and useTheme hook (TDD)** - `ecbb019` (test: RED), `b788085` (feat: GREEN)
2. **Task 2: ThemeSwitcher, Header integration, hardcoded color fixes, reagraph, i18n** - `d68d7da` (feat)

## Files Created/Modified
- `src/styles/globals.css` - Added @custom-variant dark and .dark CSS custom property block
- `index.html` - FOUC prevention inline script in head
- `src/hooks/useTheme.ts` - Theme state management hook (system/light/dark)
- `src/hooks/useTheme.test.ts` - 11 tests for theme hook behavior
- `src/components/layout/ThemeSwitcher.tsx` - 3-state theme dropdown following LanguageSwitcher pattern
- `src/components/layout/ThemeSwitcher.test.tsx` - 3 tests for theme switcher component
- `src/components/layout/Header.tsx` - Added ThemeSwitcher, replaced bg-white with bg-background
- `src/features/graph/components/GraphViewer.tsx` - Reagraph dark/light theme with custom colors
- `src/features/settings/components/ZepSection.tsx` - Replaced bg-white with bg-background
- `src/features/simulation/components/SimulationProgressBar.tsx` - Replaced bg-white with bg-background
- `src/locales/pl/common.json` - Added theme i18n keys (Motyw, Systemowy, Jasny, Ciemny)
- `src/locales/en/common.json` - Added theme i18n keys (Theme, System, Light, Dark)

## Decisions Made
- Used reagraph built-in darkTheme as base with custom edge/label color overrides rather than building theme from scratch
- Used defineProperty localStorage mock pattern for jsdom test environment where native localStorage methods are not available

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- jsdom localStorage.clear() and localStorage.removeItem() not functional in vitest test environment; resolved by using Object.defineProperty to install a manual localStorage mock with vi.fn() methods

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Dark mode fully functional across all pages via CSS custom properties
- Ready for Plan 02 (keyboard shortcuts and quality pass)
- Print CSS already forces light theme (verified in globals.css @media print block)

---
*Phase: 09-polish-and-differentiation*
*Completed: 2026-03-23*
