---
phase: 02-app-shell-and-cross-cutting-concerns
plan: 01
subsystem: ui
tags: [tailwindcss, shadcn-ui, i18next, geist-font, react-i18next, design-tokens]

# Dependency graph
requires:
  - phase: 01-infrastructure-and-api-foundation
    provides: "Vite + React project scaffold, TypeScript config, package.json"
provides:
  - "shadcn/ui component library (11 components) configured for Tailwind v4"
  - "Tailwind CSS v4 theme with blue accent and Geist font"
  - "i18next with Polish default, English fallback, 4 namespaces"
  - "cn() utility for Tailwind class merging"
  - "Design tokens (colors, spacing, layout dimensions)"
affects: [02-02, 02-03, all-ui-phases]

# Tech tracking
tech-stack:
  added: [tailwindcss@4, "@tailwindcss/vite", shadcn-ui, i18next, react-i18next, i18next-browser-languagedetector, lucide-react, sonner, "@fontsource-variable/geist", class-variance-authority, "@radix-ui/*", clsx, tailwind-merge, react-router]
  patterns: [css-first-tailwind-v4, shadcn-component-pattern, i18n-static-imports, css-variable-theming]

key-files:
  created:
    - src/styles/globals.css
    - src/lib/utils.ts
    - components.json
    - src/i18n/config.ts
    - src/i18n/index.ts
    - src/locales/pl/common.json
    - src/locales/pl/navigation.json
    - src/locales/pl/dashboard.json
    - src/locales/pl/errors.json
    - src/locales/en/common.json
    - src/locales/en/navigation.json
    - src/locales/en/dashboard.json
    - src/locales/en/errors.json
    - src/components/ui/button.tsx
    - src/components/ui/skeleton.tsx
    - src/components/ui/badge.tsx
    - src/components/ui/separator.tsx
    - src/components/ui/tooltip.tsx
    - src/components/ui/breadcrumb.tsx
    - src/components/ui/collapsible.tsx
    - src/components/ui/sheet.tsx
    - src/components/ui/dropdown-menu.tsx
    - src/components/ui/alert.tsx
    - src/components/ui/sonner.tsx
  modified:
    - vite.config.ts
    - package.json
    - pnpm-lock.yaml
    - src/app/main.tsx
    - tsconfig.app.json

key-decisions:
  - "Manually created shadcn components instead of using CLI (pnpm dlx permission error)"
  - "Added resolveJsonModule and baseUrl to tsconfig.app.json for JSON translation imports"
  - "Static imports for all translation files (no lazy loading -- small app)"

patterns-established:
  - "CSS-first Tailwind v4: no tailwind.config.js, all theme via @theme inline in globals.css"
  - "shadcn component pattern: data-slot attributes, cn() utility, CVA variants"
  - "i18n pattern: static imports, 4 namespaces, Polish 4-form plurals"

requirements-completed: [I18N-01, I18N-02, UIUX-01]

# Metrics
duration: 13min
completed: 2026-03-21
---

# Phase 2 Plan 1: Design System and i18n Foundation Summary

**shadcn/ui with 11 components on Tailwind CSS v4, i18next with Polish/English across 4 namespaces, Geist Variable font, blue accent theme**

## Performance

- **Duration:** 13 min
- **Started:** 2026-03-21T02:46:08Z
- **Completed:** 2026-03-21T02:59:47Z
- **Tasks:** 2
- **Files modified:** 30

## Accomplishments
- Tailwind CSS v4 configured with CSS-first theming (no JS config), blue accent (hsl 217 91% 60%), and Geist Variable font
- shadcn/ui initialized with 11 components: button, skeleton, badge, separator, tooltip, breadcrumb, collapsible, sheet, dropdown-menu, alert, sonner
- i18next configured with Polish default, English fallback, browser language detection, 4 namespaces with proper Unicode diacritics and Polish 4-form plurals
- React Router, Lucide icons, and Sonner toast library installed for subsequent plans

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies, init shadcn/ui, and configure Tailwind v4 theme** - `b7e0626` (feat)
2. **Task 2: Configure i18n with Polish/English translations** - `1f079c0` (feat)

## Files Created/Modified
- `vite.config.ts` - Added @tailwindcss/vite plugin
- `components.json` - shadcn/ui configuration for Tailwind v4 mode
- `src/styles/globals.css` - Tailwind v4 CSS theme with blue accent, Geist font, design tokens
- `src/lib/utils.ts` - cn() utility for Tailwind class merging
- `src/components/ui/*.tsx` - 11 shadcn/ui components (button, skeleton, badge, separator, tooltip, breadcrumb, collapsible, sheet, dropdown-menu, alert, sonner)
- `src/i18n/config.ts` - i18next initialization with Polish default, English fallback, 4 namespaces
- `src/i18n/index.ts` - Re-export for clean imports
- `src/locales/pl/*.json` - Polish translations (4 namespaces) with proper diacritics
- `src/locales/en/*.json` - English translations (4 namespaces)
- `src/app/main.tsx` - Added globals.css and i18n imports
- `tsconfig.app.json` - Added resolveJsonModule and baseUrl

## Decisions Made
- Manually created shadcn/ui components instead of using the shadcn CLI, due to pnpm dlx permission errors in the sandbox environment. Components are identical to the official shadcn/ui registry output.
- Added `resolveJsonModule: true` and `baseUrl: "."` to tsconfig.app.json to enable TypeScript resolution of JSON translation files via `@/` path alias.
- Used static imports for all translation JSON files rather than lazy loading, since the app is small and all translations are needed upfront.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] shadcn CLI pnpm dlx permission error**
- **Found during:** Task 1 (shadcn component installation)
- **Issue:** `pnpm dlx shadcn@latest` failed with EACCES permission denied for cache directory; npx also hung indefinitely
- **Fix:** Installed shadcn as devDependency, then manually wrote all 11 component files matching the official shadcn/ui registry source
- **Files modified:** All src/components/ui/*.tsx files
- **Verification:** pnpm build passes cleanly
- **Committed in:** b7e0626 (Task 1 commit)

**2. [Rule 3 - Blocking] Missing resolveJsonModule in tsconfig**
- **Found during:** Task 2 (i18n config with JSON imports)
- **Issue:** TypeScript needed resolveJsonModule and baseUrl to resolve `@/locales/*.json` imports
- **Fix:** Added `resolveJsonModule: true` and `baseUrl: "."` to tsconfig.app.json
- **Files modified:** tsconfig.app.json
- **Verification:** pnpm build passes cleanly
- **Committed in:** 1f079c0 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both auto-fixes necessary for task completion. No scope creep.

## Issues Encountered
- pnpm dlx cache directory permission denied in sandbox -- resolved by manually creating components
- npx shadcn hung indefinitely -- same resolution as above

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Design system ready: shadcn components importable from @/components/ui/*
- i18n ready: t() function available via react-i18next hooks
- Tailwind v4 theme ready: CSS variables and @theme inline configured
- React Router installed for Plan 02 (app shell layout)
- Lucide icons and Sonner toasts available for Plan 02 and 03

---
*Phase: 02-app-shell-and-cross-cutting-concerns*
*Completed: 2026-03-21*
