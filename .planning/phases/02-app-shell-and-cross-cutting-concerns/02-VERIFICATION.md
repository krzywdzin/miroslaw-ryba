---
phase: 02-app-shell-and-cross-cutting-concerns
verified: 2026-03-21T04:12:00Z
status: gaps_found
score: 4/5 must-haves verified
gaps:
  - truth: "Below-1024px screens see a minimum width message"
    status: partial
    reason: "MinScreenMessage component exists and is substantive, but is not imported or rendered anywhere in the app -- it is an orphaned component"
    artifacts:
      - path: "src/components/shared/MinScreenMessage.tsx"
        issue: "ORPHANED -- not imported in AppShell.tsx or any other component"
    missing:
      - "Import and render MinScreenMessage in src/components/layout/AppShell.tsx (before or alongside the main layout div)"
---

# Phase 2: App Shell and Cross-Cutting Concerns Verification Report

**Phase Goal:** Users see a complete application shell with Polish/English i18n, 5-stage pipeline stepper, and consistent loading/error patterns that all subsequent features plug into
**Verified:** 2026-03-21T04:12:00Z
**Status:** gaps_found
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User sees a Polish-language app shell with header, stepper sidebar showing 5 pipeline stages, and content area | VERIFIED | AppShell.tsx renders Header, Sidebar, Outlet, Footer. Sidebar contains Stepper with 5 stages using `useTranslation('navigation')`. i18n default is `lng: 'pl'`. Build passes. |
| 2 | User can switch between Polish and English via a language toggle in the header, and all visible UI text updates immediately | VERIFIED | LanguageSwitcher.tsx calls `i18n.changeLanguage(lang.code)` via DropdownMenu. Header includes `<LanguageSwitcher />`. All components use `t()` from react-i18next (verified in Header, Sidebar, Footer, Dashboard, Stepper, BackendStatus, ErrorAlert, MinScreenMessage). Test "LanguageSwitcher changes language" passes. |
| 3 | Polish plural forms render correctly (e.g., "1 agent", "2 agenty", "5 agentow") | VERIFIED | `tests/i18n/plurals.test.ts` contains 17 test cases covering one/few/many/other for both simulation and agent nouns. All 54 tests pass including these plural tests. Translation files contain all 4 Polish plural forms (`_one`, `_few`, `_many`, `_other`). |
| 4 | All async operations show appropriate loading states (skeletons/spinners) and failures show Polish/English error messages with retry buttons | VERIFIED | LoadingSkeleton.tsx (card/list/text variants), LoadingSpinner.tsx (sm/md sizes), ErrorAlert.tsx (destructive alert with onRetry button using `t('common:retry')`), error-handler.ts (auto-retry 2x, toast.error with i18n messages, persistent toast with retry label). SystemStatus.tsx uses Skeleton for loading state. All error handler tests pass (6 tests). |
| 5 | Chinese backend error messages are intercepted and displayed as Polish/English equivalents | VERIFIED | error-handler.ts calls `mapChineseError(error.message, locale)` where locale is `i18n.language`. Tests verify Chinese error mapping to both Polish and English. error-handler.test.ts passes all 6 tests. |

**Score:** 5/5 truths verified (automated checks)

**However:** 1 artifact is orphaned (MinScreenMessage), which partially undermines UIUX-03 (responsive layout with min 1024px).

### Required Artifacts

**Plan 01 Artifacts:**

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/i18n/config.ts` | i18next initialization with Polish default, English fallback | VERIFIED | 47 lines, `lng: 'pl'`, `fallbackLng: 'en'`, 4 namespaces, LanguageDetector, static imports |
| `src/styles/globals.css` | Tailwind v4 CSS-first theme with blue accent, Geist font | VERIFIED | 76 lines, `@import "tailwindcss"`, `hsl(217 91% 60%)` blue accent, `"Geist Variable"` font |
| `src/locales/pl/common.json` | Polish translations for shared UI strings | VERIFIED | 26 keys, proper Unicode diacritics, 4 plural forms for simulation and agent |
| `src/lib/utils.ts` | cn() utility for Tailwind class merging | VERIFIED | Exports `cn()` using clsx + twMerge |
| `components.json` | shadcn/ui configuration for Tailwind v4 mode | VERIFIED | rsc: false, Tailwind v4 CSS-first (empty config path), proper aliases |

**Plan 02 Artifacts:**

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/components/layout/AppShell.tsx` | Layout route: header + sidebar + outlet + footer | VERIFIED | 36 lines, renders Header, Sidebar, SidebarMobile, Outlet, Footer, Toaster |
| `src/components/layout/Header.tsx` | Header with logo, breadcrumb, language switcher, config link, backend status | VERIFIED | 104 lines, all elements present, uses i18n |
| `src/components/layout/Sidebar.tsx` | Desktop fixed sidebar with 5-stage stepper | VERIFIED | 17 lines, `w-[var(--sidebar-width)]`, `hidden lg:flex`, renders Stepper |
| `src/components/layout/Stepper.tsx` | 5-stage pipeline stepper with status indicators | VERIFIED | 44 lines, pure display, 5 stages with i18n labels, status via props |
| `src/features/dashboard/DashboardPage.tsx` | Dashboard landing page with hero, status, empty state, CTA | VERIFIED | 39 lines, `max-w-[640px]`, hero heading, SystemStatus, EmptyState, Button CTA |
| `src/app/App.tsx` | React Router with createBrowserRouter, layout route | VERIFIED | 21 lines, createBrowserRouter, AppShell as layout element, dashboard/settings routes |

**Plan 03 Artifacts:**

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/lib/error-handler.ts` | Auto-retry error handler with toast notifications | VERIFIED | 59 lines, exports `handleApiError`, `resetRetryCounters`. Uses mapChineseError, toast.error, i18n.t |
| `src/components/shared/LoadingSkeleton.tsx` | Reusable skeleton loading component | VERIFIED | 40 lines, card/list/text variants, uses shadcn Skeleton |
| `src/components/shared/LoadingSpinner.tsx` | Inline spinner for buttons and actions | VERIFIED | 42 lines, sm/md sizes, SVG with animate-spin |
| `src/components/shared/ErrorAlert.tsx` | Inline error alert with retry button | VERIFIED | 29 lines, destructive Alert, optional onRetry button with `t('common:retry')` |
| `src/components/shared/MinScreenMessage.tsx` | Message shown below 1024px viewport width | ORPHANED | 28 lines, substantive implementation with CSS media query at 1024px, but NOT imported or rendered in AppShell or any other component |

### Key Link Verification

**Plan 01 Key Links:**

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/i18n/config.ts` | `src/locales/pl/*.json` | static imports of translation JSON files | WIRED | Lines 5-8: `import plCommon from '@/locales/pl/common.json'` etc. |
| `src/styles/globals.css` | Tailwind v4 | `@import tailwindcss` and `@theme` directive | WIRED | Line 1: `@import "tailwindcss"`, Line 36: `@theme inline` |

**Plan 02 Key Links:**

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/App.tsx` | `src/components/layout/AppShell.tsx` | React Router layout route element | WIRED | Line 10: `element: <AppShell />` |
| `src/components/layout/AppShell.tsx` | react-router Outlet | Outlet component renders child routes | WIRED | Line 22: `<Outlet />` |
| `src/components/layout/Header.tsx` | `src/components/layout/LanguageSwitcher.tsx` | component composition | WIRED | Line 86: `<LanguageSwitcher />` |
| `src/components/layout/LanguageSwitcher.tsx` | `i18next.changeLanguage` | onClick handler | WIRED | Line 31: `onClick={() => i18n.changeLanguage(lang.code)}` |
| `src/components/layout/Stepper.tsx` | `src/locales/*/navigation.json` | `useTranslation('navigation')` | WIRED | Line 25: `const { t } = useTranslation('navigation')` |

**Plan 03 Key Links:**

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/lib/error-handler.ts` | `src/api/errors.ts` | mapChineseError function call | WIRED | Line 3: `import { mapChineseError } from '@/api/errors'`, Line 21: `mapChineseError(error.message, locale)` |
| `src/lib/error-handler.ts` | sonner | toast.error() for notifications | WIRED | Line 1: `import { toast } from 'sonner'`, Lines 31, 43: `toast.error(...)` |
| `src/lib/error-handler.ts` | `src/i18n/config.ts` | i18n.language for current locale | WIRED | Line 2: `import i18n from '@/i18n/config'`, Line 15: `i18n.language`, Lines 23, 31, 47: `i18n.t(...)` |
| `tests/i18n/plurals.test.ts` | `src/i18n/config.ts` | i18next t() with count parameter | WIRED | Line 2: `import i18n from '@/i18n/config'`, Line 28: `i18n.t('common:simulation', { count })` |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| I18N-01 | 02-01 | All UI strings externalized via i18n framework | SATISFIED | react-i18next used in all components, 4 namespaces, `t()` calls everywhere |
| I18N-02 | 02-01 | Polish language as default with complete translations | SATISFIED | `lng: 'pl'` in config, all 4 Polish translation files with proper diacritics |
| I18N-03 | 02-02 | English language available via language switcher in header | SATISFIED | LanguageSwitcher in Header, English translations for all 4 namespaces |
| I18N-04 | 02-03 | Polish plural forms handled correctly (4 plural forms) | SATISFIED | 17 test cases in plurals.test.ts covering one/few/many/other, all passing |
| UIUX-01 | 02-01 | Minimalist, clean design with consistent component library | SATISFIED | 11 shadcn/ui components, Tailwind v4 CSS theme, Geist font, blue accent |
| UIUX-02 | 02-02 | 5-stage pipeline displayed as linear stepper/wizard navigation | SATISFIED | Stepper.tsx renders 5 StepperItems with icons and i18n labels in sidebar |
| UIUX-03 | 02-02 | Responsive layout -- desktop-first, graceful degradation to tablet (min 1024px) | PARTIAL | Sidebar uses `hidden lg:flex`, SidebarMobile uses Sheet drawer. MinScreenMessage exists but is ORPHANED (not rendered in AppShell) |
| UIUX-05 | 02-03 | Consistent loading states (skeletons, spinners, progress bars) | SATISFIED | LoadingSkeleton (3 variants), LoadingSpinner (2 sizes), SystemStatus uses Skeleton for loading |
| UIUX-06 | 02-03 | Clear error messages with retry buttons for common failures | SATISFIED | error-handler.ts auto-retries 2x then persistent toast with retry button. ErrorAlert with onRetry prop. |
| UIUX-08 | 02-03 | Chinese backend error messages intercepted and mapped to Polish/English | SATISFIED | error-handler.ts calls mapChineseError with i18n.language as locale. 6 error handler tests pass. |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| src/components/shared/MinScreenMessage.tsx | - | ORPHANED component (not imported anywhere) | Warning | Users below 1024px will not see the min-screen gate message |

No TODO/FIXME/PLACEHOLDER comments found. No empty implementations found. No console.log-only handlers found.

### Human Verification Required

### 1. Visual Layout Rendering

**Test:** Open the app in a browser at `/`, verify the header, sidebar with 5 stages, dashboard content, and footer all render correctly with proper spacing and Geist font.
**Expected:** Polish-language app shell with 56px header (logo, breadcrumb, language switcher, settings icon, green/red status dot), 280px sidebar with 5 locked pipeline stages, centered dashboard content, and 40px footer.
**Why human:** Visual layout, spacing, and font rendering cannot be verified programmatically.

### 2. Language Switching Live Test

**Test:** Click the Globe icon in the header, select "English", verify all visible text changes to English. Switch back to "Polski".
**Expected:** All UI text updates immediately -- header, sidebar stage names, dashboard heading/subheading, footer AGPL note, and status labels.
**Why human:** Requires real browser interaction and visual confirmation of complete text update.

### 3. Mobile Drawer Behavior

**Test:** Resize browser below 1280px (lg breakpoint). Verify sidebar hides and hamburger menu appears. Click hamburger, verify Sheet drawer slides from left with stepper.
**Expected:** Smooth Sheet animation, stepper stages visible in drawer, drawer closes on navigation.
**Why human:** Responsive behavior and animation require visual verification.

### 4. Backend Status Indicator

**Test:** With backend running, verify green dot in header. Stop backend, wait 30s, verify dot turns red.
**Expected:** 8px dot changes from green (bg-success) to red (bg-destructive) based on backend connectivity.
**Why human:** Requires running backend service and timing verification.

### Gaps Summary

One gap found: **MinScreenMessage is orphaned**. The component `src/components/shared/MinScreenMessage.tsx` is fully implemented with proper CSS media query at 1024px and i18n translations, but it is never imported or rendered in AppShell.tsx or anywhere else in the application. This means users on screens below 1024px will not see the minimum width warning message, partially undermining UIUX-03.

The fix is straightforward: add `import { MinScreenMessage } from '@/components/shared/MinScreenMessage'` and render `<MinScreenMessage />` inside AppShell.tsx.

All other truths, artifacts, key links, and requirements are verified. The build passes cleanly, all 54 tests pass (including 17 plural form tests and 6 error handler tests).

---

_Verified: 2026-03-21T04:12:00Z_
_Verifier: Claude (gsd-verifier)_
