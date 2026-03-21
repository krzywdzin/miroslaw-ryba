---
phase: 02-app-shell-and-cross-cutting-concerns
plan: 02
subsystem: ui
tags: [react-router, layout, stepper, i18n, sidebar, header, dashboard]

requires:
  - phase: 02-01
    provides: shadcn components, i18n config, CSS variables, Geist font
  - phase: 01-02
    provides: API client, Zod schemas, TanStack Query setup
provides:
  - App shell layout (header, sidebar, footer) wrapping all routes
  - React Router with layout route pattern
  - 5-stage pipeline stepper (pure display component)
  - Language switcher toggling Polish/English
  - Backend status indicator via polling
  - Dashboard landing page with system status and empty state
  - Settings and 404 placeholder pages
affects: [03-graph-construction, 04-environment, all-pipeline-phases]

tech-stack:
  added: ["@testing-library/user-event"]
  patterns: [layout-route-pattern, stepper-pure-display, useBackendStatus-polling]

key-files:
  created:
    - src/components/layout/AppShell.tsx
    - src/components/layout/Header.tsx
    - src/components/layout/Sidebar.tsx
    - src/components/layout/SidebarMobile.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/Stepper.tsx
    - src/components/layout/StepperItem.tsx
    - src/components/layout/LanguageSwitcher.tsx
    - src/components/layout/BackendStatus.tsx
    - src/features/dashboard/DashboardPage.tsx
    - src/features/dashboard/components/SystemStatus.tsx
    - src/features/dashboard/components/EmptyState.tsx
    - src/features/settings/SettingsPage.tsx
    - src/features/errors/NotFoundPage.tsx
    - src/hooks/useBackendStatus.ts
    - tests/components/layout.test.tsx
  modified:
    - src/app/App.tsx
    - src/app/providers.tsx
    - src/locales/pl/common.json
    - src/locales/en/common.json
    - src/locales/pl/errors.json
    - src/locales/en/errors.json

key-decisions:
  - "Stepper is pure display component with no internal state -- status passed via props"
  - "Sidebar uses lg:flex (1280px) breakpoint, mobile uses Sheet drawer"
  - "Backend status polling every 30s via TanStack Query on /graph_bp/projects"
  - "TooltipProvider wraps entire app via providers.tsx"

patterns-established:
  - "Layout route pattern: AppShell wraps all pages via React Router Outlet"
  - "Feature folder pattern: src/features/{name}/components/ for sub-components"
  - "Hook extraction pattern: reusable hooks in src/hooks/ (useBackendStatus)"

requirements-completed: [UIUX-02, UIUX-03, I18N-03]

duration: 4min
completed: 2026-03-21
---

# Phase 2 Plan 2: App Shell and Layout Summary

**Navigable app shell with React Router layout route, header (logo/breadcrumb/language-switcher/backend-status), 5-stage pipeline stepper sidebar, dashboard with system status, and Polish/English language switching**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-21T03:02:41Z
- **Completed:** 2026-03-21T03:06:39Z
- **Tasks:** 2
- **Files modified:** 22

## Accomplishments

- Complete app shell layout with header, fixed sidebar, footer, and mobile drawer
- React Router with createBrowserRouter, layout route, dashboard/settings/404 pages
- 5-stage pipeline stepper (all locked for Phase 2) with i18n stage names
- Language switcher toggling all UI text between Polish and English
- Dashboard page with hero, system status card, empty simulations state, quick-start CTA
- Backend connectivity status indicator with 30s polling
- 5 layout smoke tests passing (stepper stages, dashboard hero, language switching)

## Task Commits

Each task was committed atomically:

1. **Task 1: App shell layout, router, header, sidebar, stepper, and footer** - `245dbba` (feat)
2. **Task 2: Dashboard page with hero, system status, empty state, and CTA** - `c6a154a` (feat)

## Files Created/Modified

- `src/components/layout/AppShell.tsx` - Layout route: header + sidebar + outlet + footer
- `src/components/layout/Header.tsx` - Header with logo, breadcrumb, language switcher, settings, backend status
- `src/components/layout/Sidebar.tsx` - Desktop fixed 280px sidebar with stepper
- `src/components/layout/SidebarMobile.tsx` - Mobile Sheet drawer with stepper
- `src/components/layout/Stepper.tsx` - 5-stage pipeline stepper (pure display)
- `src/components/layout/StepperItem.tsx` - Individual step with collapsible sub-steps
- `src/components/layout/LanguageSwitcher.tsx` - DropdownMenu for PL/EN switching
- `src/components/layout/BackendStatus.tsx` - 8px status dot with tooltip
- `src/components/layout/Footer.tsx` - Version, GitHub link, AGPL note
- `src/features/dashboard/DashboardPage.tsx` - Dashboard with hero, status, empty state, CTA
- `src/features/dashboard/components/SystemStatus.tsx` - Backend connection status card
- `src/features/dashboard/components/EmptyState.tsx` - Reusable empty state with icon
- `src/features/settings/SettingsPage.tsx` - Settings placeholder
- `src/features/errors/NotFoundPage.tsx` - 404 page with home link
- `src/hooks/useBackendStatus.ts` - TanStack Query hook polling backend
- `src/app/App.tsx` - React Router with createBrowserRouter
- `src/app/providers.tsx` - Added TooltipProvider wrapper
- `tests/components/layout.test.tsx` - 5 smoke tests for layout components

## Decisions Made

- Stepper is pure display component -- no internal state, status passed via props (per RESEARCH pitfall 4)
- Sidebar uses `hidden lg:flex` (1280px breakpoint) for desktop, Sheet drawer for mobile
- Backend status polls `/graph_bp/projects` every 30s as lightweight health check
- TooltipProvider added at app root level in providers.tsx for all tooltip usage
- Added `@testing-library/user-event` for interactive test scenarios

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed @testing-library/user-event**
- **Found during:** Task 2 (layout tests)
- **Issue:** user-event package needed for language switcher click tests but not in devDependencies
- **Fix:** Ran `pnpm add -D @testing-library/user-event`
- **Files modified:** package.json, pnpm-lock.yaml
- **Verification:** Tests pass with user interaction
- **Committed in:** c6a154a (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Missing test dependency, essential for test task. No scope creep.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- App shell complete, all pipeline features can plug into layout route as child routes
- Stepper accepts stage status overrides via props for future phases
- Dashboard ready for real simulation data when available
- EmptyState component reusable across features

---
*Phase: 02-app-shell-and-cross-cutting-concerns*
*Completed: 2026-03-21*
