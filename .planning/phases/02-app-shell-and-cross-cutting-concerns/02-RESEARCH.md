# Phase 2: App Shell and Cross-Cutting Concerns - Research

**Researched:** 2026-03-21
**Domain:** App shell layout, i18n framework, design system, loading/error patterns
**Confidence:** HIGH

## Summary

Phase 2 builds the application frame that all subsequent features plug into: a layout shell with header, sidebar stepper, content area, and footer; a complete i18n system with Polish/English support including ICU MessageFormat for Polish plurals; design system tokens via shadcn/ui + Tailwind CSS v4; and cross-cutting loading/error patterns. No pipeline features are implemented -- just the frame, navigation, and dashboard landing page.

The critical technical challenges are: (1) setting up shadcn/ui with Tailwind CSS v4's CSS-first configuration (no tailwind.config.js), (2) configuring i18next with the ICU plugin for Polish's 4 plural forms, (3) building a responsive layout with fixed sidebar on desktop and drawer on tablet, and (4) establishing the React Router v7 route structure that the pipeline stages will plug into.

**Primary recommendation:** Initialize shadcn/ui first (it scaffolds Tailwind v4 CSS variables and globals.css), then layer i18n and routing on top. Build the layout shell as a React Router layout route with `<Outlet />` for child content. Use i18next's native plural suffix system (`_one`, `_few`, `_many`, `_other`) rather than the ICU plugin -- it is simpler and i18next v25 supports Polish plurals natively via `Intl.PluralRules`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Combined navigation: top bar with mini-stepper (horizontal pipeline progress) + left sidebar with detailed step information
- Sidebar: fixed on desktop, collapsible/drawer on tablet (<1024px)
- Stepper shows sub-steps within each stage (expandable: e.g., upload -> building -> done)
- Navigation: users can freely go back to completed stages, cannot skip ahead to uncompleted ones
- Content area width varies by stage: some full-width (simulation), some centered max-width (forms)
- Lucide icons throughout navigation and UI
- Subtle fade/slide animations for stage transitions
- Expanded header: logo/name + breadcrumb showing current stage + language switcher + config button + backend status indicator
- Backend status: green/red dot (connected/disconnected) -- simple, not verbose
- Config accessed via separate /settings page (not modal/drawer)
- Dashboard view before pipeline starts: system status, recent simulations (if any), quick-start button
- Minimal footer: version number + GitHub link + AGPL-3.0 note
- Light mode default (dark mode deferred to Phase 9)
- Accent color: blue -- professional, tech feel (Linear-inspired)
- Border radius: rounded (8-12px) -- friendly, approachable
- Typography: Geist font family
- Density: spacious -- lots of whitespace, Notion-inspired breathing room
- Loading: skeleton screens for main content, spinners for action buttons
- Errors: toast notifications for global/network errors, inline alerts for form validation
- Network retry: auto-retry 2x on failure, then show manual retry button
- Tone: friendly, direct, using "Ty" form
- Pipeline stage names in Polish: Budowa grafu, Srodowisko, Symulacja, Raport, Dialog
- Polish 4 plural forms handled via ICU MessageFormat in react-i18next
- Chinese backend error messages intercepted via error mapping layer from Phase 1

### Claude's Discretion
- Translation file structure (JSON per namespace vs single file per language)
- Exact Tailwind CSS v4 configuration for design tokens
- shadcn/ui component selection and customization
- React Router route structure
- Skeleton screen shapes and animation timing
- Toast notification positioning and auto-dismiss timing
- Exact Geist font weights to include

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| I18N-01 | All UI strings externalized via i18n framework (react-i18next) | i18next v25 + react-i18next v16.5 setup with namespace-based JSON files, `useTranslation` hook |
| I18N-02 | Polish language as default with complete translations | `lng: 'pl'` default, Polish translation files with proper Unicode diacritics |
| I18N-03 | English language available via language switcher in header | Language switcher dropdown in header, `i18next.changeLanguage()`, localStorage persistence |
| I18N-04 | Polish plural forms handled correctly (4 plural forms via ICU MessageFormat) | i18next native plural suffixes `_one/_few/_many/_other` with `Intl.PluralRules` (no ICU plugin needed) |
| UIUX-01 | Minimalist, clean design with consistent component library (shadcn/ui) | shadcn/ui init with Tailwind v4, 11 components listed in UI-SPEC, Geist font, blue accent theme |
| UIUX-02 | 5-stage pipeline displayed as linear stepper/wizard navigation | Sidebar stepper with Collapsible sub-steps, status badges (completed/current/locked), accent left border |
| UIUX-03 | Responsive layout -- desktop-first, graceful degradation to tablet (min 1024px) | Fixed 280px sidebar desktop, 64px icon-rail tablet, Sheet drawer on hamburger, min-width message below 1024px |
| UIUX-05 | Consistent loading states (skeletons, spinners) for all async operations | Skeleton component for content, spinner for buttons, pulse animation, loading patterns documented |
| UIUX-06 | Clear error messages with retry buttons for common failures | Sonner toast (bottom-right, max 3), auto-retry 2x, persistent toast after exhaustion, inline Alert for forms |
| UIUX-08 | Chinese backend error messages intercepted and mapped to Polish/English | `mapChineseError()` from `src/api/errors.ts` (Phase 1), integration with i18n current language |
</phase_requirements>

## Standard Stack

### Core (Phase 2 additions to existing project)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-router | ^7.13.1 | Client-side routing with layout routes | SPA routing with nested `<Outlet />` for app shell layout; library mode (no framework mode needed) |
| react-i18next | ^16.5.8 | React bindings for i18n | 2.1M weekly downloads, namespace support, `useTranslation` hook, Suspense integration |
| i18next | ^25.9.0 | i18n core engine | Native `Intl.PluralRules` support for Polish 4 plural forms, fallback chains, language detection |
| i18next-browser-languagedetector | ^8.2.1 | Auto-detect browser language | Detects navigator language, falls back to localStorage for user preference persistence |
| tailwindcss | ^4.2.2 | Utility-first CSS (CSS-first config) | v4 uses `@theme` directive in CSS, no tailwind.config.js, 5x faster builds |
| @tailwindcss/vite | ^4.2.2 | Vite plugin for Tailwind v4 | Required Vite integration for Tailwind v4 (replaces PostCSS plugin) |
| lucide-react | ^0.577.0 | Icon library | Tree-shakeable SVG icons, consistent with shadcn/ui ecosystem |
| sonner | ^2.0.7 | Toast notifications | shadcn/ui's recommended toast solution, rich API, stacking, positioning |
| @fontsource-variable/geist | ^5.2.8 | Geist font (variable weight) | Self-hosted, no external CDN, variable font for weights 400+600 |

### shadcn/ui Components (not npm dependencies -- copied into project)

| Component | Radix Primitive | Purpose |
|-----------|----------------|---------|
| button | N/A | CTAs, retry buttons, quick-start |
| skeleton | N/A | Loading placeholders |
| badge | N/A | Backend status, step status indicators |
| separator | N/A | Visual dividers |
| tooltip | @radix-ui/react-tooltip | Icon-only button labels |
| breadcrumb | N/A | Header navigation path |
| collapsible | @radix-ui/react-collapsible | Sidebar sub-step expansion |
| sheet | @radix-ui/react-dialog | Tablet sidebar drawer |
| dropdown-menu | @radix-ui/react-dropdown-menu | Language switcher |
| alert | N/A | Inline error/warning messages |
| sonner | sonner | Toast notifications (wraps sonner lib) |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| i18next native plurals | i18next-icu plugin | ICU plugin adds 15KB+ (intl-messageformat), but i18next v25 handles Polish plurals natively via `Intl.PluralRules` with `_one/_few/_many/_other` suffixes. Use native -- simpler, smaller. |
| Sonner | react-hot-toast | Sonner has better stacking, rich types, built-in shadcn integration |
| createBrowserRouter | BrowserRouter + Routes | Data router pattern enables future loaders/actions; consistent with v7 best practices |

**Installation:**
```bash
# Routing
pnpm add react-router

# i18n
pnpm add react-i18next i18next i18next-browser-languagedetector

# Styling (Tailwind v4 Vite plugin)
pnpm add -D tailwindcss @tailwindcss/vite

# Icons
pnpm add lucide-react

# Font
pnpm add @fontsource-variable/geist

# shadcn/ui init (interactive -- sets up globals.css, components.json, cn util)
pnpm dlx shadcn@latest init

# shadcn/ui components (after init)
pnpm dlx shadcn@latest add button skeleton badge separator tooltip breadcrumb collapsible sheet dropdown-menu alert sonner
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  app/
    App.tsx               # RouterProvider with createBrowserRouter
    main.tsx              # Entry point (existing)
    providers.tsx          # Extended: I18nextProvider + RouterProvider
  components/
    layout/
      AppShell.tsx         # Layout route: header + sidebar + outlet + footer
      Header.tsx           # Logo, breadcrumb, lang switcher, config, status dot
      Sidebar.tsx          # Desktop fixed sidebar with stepper
      SidebarMobile.tsx    # Tablet Sheet drawer variant
      Footer.tsx           # Version, GitHub, AGPL note
      Stepper.tsx          # 5-stage pipeline stepper with sub-steps
      StepperItem.tsx      # Single step row: icon + label + status
    ui/                    # shadcn/ui components (auto-generated)
      button.tsx
      skeleton.tsx
      ...
  features/
    dashboard/
      DashboardPage.tsx    # Landing page: hero, status, quick-start
      components/
        SystemStatus.tsx   # Backend connection indicator card
        EmptyState.tsx     # No simulations yet
    settings/
      SettingsPage.tsx     # Placeholder for Phase 3 config
  hooks/
    useBackendStatus.ts    # TanStack Query polling for backend health
  i18n/
    config.ts              # i18next initialization
    index.ts               # Re-export for clean imports
  lib/
    utils.ts               # cn() utility (shadcn generates this)
  locales/
    pl/
      common.json          # Shared: buttons, labels, status words
      navigation.json      # Sidebar steps, breadcrumbs, header
      dashboard.json       # Dashboard page copy
      errors.json          # Error messages, Chinese error mappings
    en/
      common.json
      navigation.json
      dashboard.json
      errors.json
  styles/
    globals.css            # Tailwind v4 @import, @theme, CSS variables
```

### Pattern 1: Layout Route with Outlet
**What:** React Router layout route wraps all pages in the app shell (header + sidebar + content + footer).
**When to use:** Every route in the application shares the same chrome.
**Example:**
```typescript
// src/app/App.tsx
import { createBrowserRouter, RouterProvider } from 'react-router'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/features/dashboard/DashboardPage'
import { NotFoundPage } from '@/features/errors/NotFoundPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'settings', element: <SettingsPage /> },
      // Future pipeline stages plug in here:
      // { path: 'pipeline/:stageId', element: <PipelineStagePage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
```

### Pattern 2: AppShell Layout Component
**What:** The layout route component renders header, sidebar, footer, and an `<Outlet />` for page content.
**When to use:** Single shared layout for the entire app.
**Example:**
```typescript
// src/components/layout/AppShell.tsx
import { Outlet } from 'react-router'

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar className="hidden lg:block w-[280px] shrink-0" />
        <SidebarMobile className="lg:hidden" />
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  )
}
```

### Pattern 3: i18next Initialization
**What:** Configure i18next with language detection, Polish default, namespace-based JSON loading.
**When to use:** Once at app startup, before rendering.
**Example:**
```typescript
// src/i18n/config.ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

// Import translation files directly (small app, no lazy loading needed)
import plCommon from '@/locales/pl/common.json'
import plNavigation from '@/locales/pl/navigation.json'
import plDashboard from '@/locales/pl/dashboard.json'
import plErrors from '@/locales/pl/errors.json'
import enCommon from '@/locales/en/common.json'
import enNavigation from '@/locales/en/navigation.json'
import enDashboard from '@/locales/en/dashboard.json'
import enErrors from '@/locales/en/errors.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pl: {
        common: plCommon,
        navigation: plNavigation,
        dashboard: plDashboard,
        errors: plErrors,
      },
      en: {
        common: enCommon,
        navigation: enNavigation,
        dashboard: enDashboard,
        errors: enErrors,
      },
    },
    lng: 'pl', // Default language
    fallbackLng: 'en',
    defaultNS: 'common',
    ns: ['common', 'navigation', 'dashboard', 'errors'],
    interpolation: {
      escapeValue: false, // React already escapes
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
```

### Pattern 4: Polish Plural Forms (Native i18next)
**What:** Use i18next's built-in plural suffix system with `Intl.PluralRules` for Polish.
**When to use:** Any translatable string with a count variable.
**Example:**
```json
// src/locales/pl/common.json
{
  "simulation_one": "{{count}} symulacja",
  "simulation_few": "{{count}} symulacje",
  "simulation_many": "{{count}} symulacji",
  "simulation_other": "{{count}} symulacji"
}
```
```typescript
// Usage in component
const { t } = useTranslation('common')
t('simulation', { count: 1 })   // "1 symulacja"    (one: ends in 1, not 11)
t('simulation', { count: 3 })   // "3 symulacje"    (few: ends in 2-4, not 12-14)
t('simulation', { count: 5 })   // "5 symulacji"    (many: everything else)
t('simulation', { count: 22 })  // "22 symulacje"   (few: ends in 2, not 12)
```

### Pattern 5: Tailwind CSS v4 Theme Configuration
**What:** CSS-first configuration with `@theme inline` directive for design tokens.
**When to use:** Global styles file, defines all colors, radii, spacing.
**Example:**
```css
/* src/styles/globals.css */
@import "tailwindcss";
@import "@fontsource-variable/geist";

/* shadcn/ui CSS variables -- customized for project theme */
:root {
  --radius: 0.5rem;
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 4%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 4%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 4%);
  --primary: hsl(217 91% 60%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(240 5% 96%);
  --secondary-foreground: hsl(240 6% 10%);
  --muted: hsl(240 5% 96%);
  --muted-foreground: hsl(240 4% 46%);
  --accent: hsl(217 91% 60%);
  --accent-foreground: hsl(0 0% 100%);
  --destructive: hsl(0 84% 60%);
  --destructive-foreground: hsl(0 0% 100%);
  --border: hsl(240 6% 90%);
  --input: hsl(240 6% 90%);
  --ring: hsl(217 91% 60%);

  /* Semantic colors (not in shadcn default) */
  --success: hsl(142 71% 45%);
  --success-foreground: hsl(0 0% 100%);
  --warning: hsl(38 92% 50%);
  --warning-foreground: hsl(0 0% 100%);

  /* Layout */
  --header-height: 56px;
  --footer-height: 40px;
  --sidebar-width: 280px;
  --sidebar-width-collapsed: 64px;
  --content-max-width: 960px;
}

@theme inline {
  --font-sans: "Geist Variable", ui-sans-serif, system-ui, sans-serif;
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius));
  --radius-lg: calc(var(--radius) + 4px);
  --radius-xl: calc(var(--radius) + 8px);
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground font-sans;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}
```

### Pattern 6: Sonner Toast Provider Integration
**What:** Wrap Sonner's Toaster at the root level for global toast access.
**When to use:** App-wide error/success notifications.
**Example:**
```typescript
// In providers.tsx or AppShell.tsx
import { Toaster } from '@/components/ui/sonner'

// Add at the end of the component tree:
<Toaster
  position="bottom-right"
  toastOptions={{
    duration: 5000,
  }}
  visibleToasts={3}
  richColors
/>
```
```typescript
// Usage anywhere in the app:
import { toast } from 'sonner'

toast.error(t('errors:networkError'))
toast.success(t('common:saved'))
```

### Pattern 7: Backend Status Polling
**What:** TanStack Query hook that polls a health endpoint to show connected/disconnected status.
**When to use:** Header status dot indicator.
**Example:**
```typescript
// src/hooks/useBackendStatus.ts
import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

export function useBackendStatus() {
  return useQuery({
    queryKey: ['backend-status'],
    queryFn: () => apiClient.get('/api/health'),
    refetchInterval: 30_000, // Check every 30s
    retry: 1,
    select: () => true, // If it succeeds, backend is connected
  })
}
```

### Anti-Patterns to Avoid
- **Hardcoded text strings:** Every user-visible string must go through `t()`. No exceptions. This includes error messages, button labels, aria-labels, and alt text.
- **Nested i18n keys beyond 2 levels:** Keep translation keys flat within each namespace. `common:retry` not `common:buttons:actions:retry`.
- **Using `tailwind.config.js` with Tailwind v4:** v4 uses CSS-first config via `@theme` directive. No JS config file. shadcn/ui init handles this automatically.
- **Building custom toast system:** Use Sonner via shadcn/ui. It handles stacking, dismissal, positioning, and accessibility.
- **Mixing px and rem inconsistently:** Use rem for typography and spacing, px only for fixed layout dimensions (header height, sidebar width).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toast notifications | Custom toast overlay with portal | Sonner (via shadcn/ui) | Stacking, auto-dismiss, rich types, accessibility, animations |
| Language detection | Custom navigator.language parsing | i18next-browser-languagedetector | Handles edge cases, regional variants, caching to localStorage |
| Sidebar drawer (mobile) | Custom overlay with click-outside | shadcn Sheet component | Radix Dialog primitive handles focus trap, backdrop, animation, a11y |
| Collapsible stepper | Custom height-transition div | shadcn Collapsible | Radix handles ARIA, keyboard nav, smooth height transition |
| Icon system | Custom SVG sprite sheet | lucide-react | Tree-shakeable, consistent sizing, TypeScript types |
| CSS class merging | Manual className concatenation | `cn()` utility (shadcn) | Handles Tailwind class conflicts via tailwind-merge + clsx |
| Breadcrumb | Custom link chain | shadcn Breadcrumb | Handles separators, current page ARIA, responsive truncation |
| Font loading | Manual @font-face declarations | @fontsource-variable/geist | Self-hosted, variable weight, preload optimized |

**Key insight:** shadcn/ui provides all the interactive primitives needed for the app shell. Every collapsible, dropdown, sheet, and tooltip is accessibility-compliant via Radix UI. Building these from scratch would take weeks and miss edge cases.

## Common Pitfalls

### Pitfall 1: Polish Strings Breaking Layout
**What goes wrong:** UI designed with English placeholder text overflows when Polish translations are applied (20-30% longer).
**Why it happens:** Polish words are longer. "Settings" (8 chars) -> "Ustawienia" (10 chars). "Start prediction" -> "Rozpocznij predykcje" (20 chars).
**How to avoid:** Design with Polish text from day one. Set `min-width` on sidebar items, use `truncate` with `title` attribute as fallback, test every component with both languages.
**Warning signs:** `overflow: hidden` used to hide broken text, or horizontal scrollbars appearing.

### Pitfall 2: Missing Language Switcher Persistence
**What goes wrong:** User switches to English, navigates to another page, and language reverts to Polish.
**Why it happens:** Language change not persisted to localStorage, or i18next detector re-runs on navigation and picks up browser language.
**How to avoid:** Configure `i18next-browser-languagedetector` with `order: ['localStorage', 'navigator']` and `caches: ['localStorage']`. When user explicitly switches language, i18next automatically caches to localStorage.
**Warning signs:** Language flickers on route changes.

### Pitfall 3: shadcn/ui Init Overwrites Existing Files
**What goes wrong:** Running `npx shadcn@latest init` in an existing project may overwrite `tailwind.config.js`, `globals.css`, or create conflicting `components.json`.
**Why it happens:** The CLI assumes a fresh project.
**How to avoid:** Run init carefully, review each file it proposes. Since this project has NO existing CSS files and NO tailwind.config.js yet, the init is safe. But verify it creates the Tailwind v4 variant (CSS-first, no JS config).
**Warning signs:** A `tailwind.config.js` appears after init -- this means v3 mode was selected.

### Pitfall 4: Sidebar Stepper State Not Derived from Pipeline State
**What goes wrong:** Sidebar stepper tracks its own state (which step is active/completed) independently from the pipeline state machine, causing desync.
**Why it happens:** Building the stepper UI before the pipeline state machine exists (Phase 2 builds the shell, pipeline logic comes later).
**How to avoid:** Design the stepper to accept props: `stages: Array<{ id, status: 'completed' | 'current' | 'locked' }>`. In Phase 2, use static mock data. In later phases, derive from pipeline state machine. The stepper itself should be a pure display component.
**Warning signs:** Stepper has its own `useState` for active step.

### Pitfall 5: Vite Alias Not Working in Tests
**What goes wrong:** `@/` path alias works in Vite dev server but fails in Vitest because the test config does not share the alias.
**Why it happens:** `vite.config.ts` has the alias but `vitest.config.ts` is a separate file.
**How to avoid:** The existing `vitest.config.ts` already has `resolve: { alias: { '@': '/src' } }`. Verify this still works after adding Tailwind v4 plugin to `vite.config.ts`. Both configs must stay in sync.
**Warning signs:** `Cannot find module '@/components/...'` errors in test output.

### Pitfall 6: Tailwind v4 Vite Plugin vs PostCSS
**What goes wrong:** Using the PostCSS plugin (`@tailwindcss/postcss`) instead of the Vite plugin (`@tailwindcss/vite`) causes slower builds and potential conflicts.
**Why it happens:** Many tutorials still show PostCSS setup. Tailwind v4 docs recommend the Vite plugin for Vite projects.
**How to avoid:** Use `@tailwindcss/vite` in `vite.config.ts` plugins array. Do NOT add postcss.config.js or @tailwindcss/postcss.
**Warning signs:** Both postcss.config.js and `@tailwindcss/vite` present in the project.

## Code Examples

### Translation File with Polish Plurals
```json
// src/locales/pl/common.json
{
  "appTitle": "Miroslaw Ryba",
  "retry": "Sprobuj ponownie",
  "loading": "Ladowanie...",
  "connected": "Polaczony",
  "disconnected": "Rozlaczony",
  "settings": "Ustawienia",
  "language": "Jezyk",
  "simulation_one": "{{count}} symulacja",
  "simulation_few": "{{count}} symulacje",
  "simulation_many": "{{count}} symulacji",
  "simulation_other": "{{count}} symulacji"
}
```

Note: The JSON file above uses ASCII-safe representations. Actual files MUST use proper Polish diacritics: "Sprobuj" -> "Sprobuj ponownie" -> "Sprobuj ponownie" with proper Unicode. All diacritics: a-ogonek, c-acute, e-ogonek, l-stroke, n-acute, o-acute, s-acute, z-acute, z-dot.

### Language Switcher Component
```typescript
// src/components/layout/LanguageSwitcher.tsx
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Globe } from 'lucide-react'

const languages = [
  { code: 'pl', label: 'Polski' },
  { code: 'en', label: 'English' },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={i18n.language === lang.code ? 'bg-accent' : ''}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Backend Status Dot
```typescript
// src/components/layout/BackendStatus.tsx
import { useBackendStatus } from '@/hooks/useBackendStatus'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useTranslation } from 'react-i18next'

export function BackendStatus() {
  const { t } = useTranslation('common')
  const { data: isConnected, isLoading } = useBackendStatus()

  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={`h-2 w-2 rounded-full ${
            isLoading
              ? 'animate-pulse bg-muted-foreground'
              : isConnected
                ? 'bg-success'
                : 'bg-destructive'
          }`}
        />
      </TooltipTrigger>
      <TooltipContent>
        {isConnected ? t('connected') : t('disconnected')}
      </TooltipContent>
    </Tooltip>
  )
}
```

### Auto-Retry Error Handling Pattern
```typescript
// src/lib/error-handler.ts
import { toast } from 'sonner'
import i18n from '@/i18n/config'
import { mapChineseError } from '@/api/errors'

let retryCount = 0
const MAX_RETRIES = 2

export async function handleApiError(error: unknown, retryFn?: () => Promise<void>) {
  const locale = i18n.language as 'pl' | 'en'

  // Map Chinese backend errors
  const message = error instanceof Error
    ? mapChineseError(error.message, locale)
    : i18n.t('errors:unknown')

  if (retryCount < MAX_RETRIES && retryFn) {
    retryCount++
    toast.error(i18n.t('errors:networkRetrying'), { duration: 3000 })
    await retryFn()
    return
  }

  // Exhausted retries -- show persistent toast with manual retry
  retryCount = 0
  toast.error(message, {
    duration: Infinity, // Persistent
    action: retryFn
      ? { label: i18n.t('common:retry'), onClick: () => retryFn() }
      : undefined,
  })
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js (JS) | @theme directive in CSS | Tailwind v4 (Jan 2025) | No JS config file; all tokens in globals.css |
| PostCSS plugin for Tailwind | @tailwindcss/vite plugin | Tailwind v4 | Faster builds, native Vite integration |
| i18next custom plural rules | Intl.PluralRules (native) | i18next v23+ | Polish plurals work automatically with `_one/_few/_many/_other` suffixes |
| react-router-dom separate pkg | react-router single package | React Router v7 | Import everything from `react-router` (not `react-router-dom`) |
| BrowserRouter + Routes JSX | createBrowserRouter + RouterProvider | React Router v6.4+ | Data router pattern, loaders, error boundaries |

**Deprecated/outdated:**
- `react-router-dom` package: Merged into `react-router` in v7. Import from `react-router` directly.
- `tailwind.config.js`: Replaced by CSS-first config in Tailwind v4. shadcn/ui v4 mode does not generate this file.
- `i18next-icu` plugin for Polish plurals: Unnecessary since i18next v23+. Native `Intl.PluralRules` handles Polish correctly. Only use ICU plugin if you need complex nested ICU MessageFormat syntax beyond plurals.
- `reactI18nextModule` import: Old API. Use `initReactI18next` import from `react-i18next`.

## Open Questions

1. **shadcn/ui components.json `cssVariables` setting with Tailwind v4**
   - What we know: Tailwind v4 mode uses CSS variables by default. The `components.json` structure may differ from v3.
   - What's unclear: Exact `components.json` generated by `shadcn init` in Tailwind v4 mode.
   - Recommendation: Run `shadcn init` interactively and verify it selects Tailwind v4 mode (CSS-first). Check that no `tailwind.config.js` is created.

2. **Geist font rendering with Polish diacritics**
   - What we know: Geist is a modern font with good Unicode support.
   - What's unclear: Whether all Polish diacritics render correctly in all weights.
   - Recommendation: Test early with a simple page containing all Polish special characters: ą, ć, ę, ł, ń, ó, ś, ź, ż (and uppercase variants).

3. **React Router v7 import paths**
   - What we know: v7 consolidates `react-router-dom` into `react-router`.
   - What's unclear: Whether `createBrowserRouter` is imported from `react-router` or still needs `react-router-dom`.
   - Recommendation: Import from `react-router`. If types are missing, check if `react-router-dom` is still needed as a peer dependency at v7.13.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.x + React Testing Library |
| Config file | `vitest.config.ts` (exists) |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| I18N-01 | All UI strings use t() function, no hardcoded text | unit | `pnpm vitest run tests/i18n/externalization.test.ts -t "no hardcoded strings"` | No -- Wave 0 |
| I18N-02 | Polish translations load as default language | unit | `pnpm vitest run tests/i18n/config.test.ts -t "default language"` | No -- Wave 0 |
| I18N-03 | Language switcher changes all visible text | integration | `pnpm vitest run tests/i18n/switching.test.ts` | No -- Wave 0 |
| I18N-04 | Polish plural forms resolve correctly for all 4 categories | unit | `pnpm vitest run tests/i18n/plurals.test.ts` | No -- Wave 0 |
| UIUX-01 | shadcn components render without errors | smoke | `pnpm vitest run tests/components/smoke.test.ts` | No -- Wave 0 |
| UIUX-02 | Stepper renders 5 stages with correct status props | unit | `pnpm vitest run tests/components/stepper.test.ts` | No -- Wave 0 |
| UIUX-03 | Sidebar collapses to drawer below 1280px | integration | `pnpm vitest run tests/layout/responsive.test.ts` | No -- Wave 0 |
| UIUX-05 | Skeleton components render during loading state | unit | `pnpm vitest run tests/components/loading.test.ts` | No -- Wave 0 |
| UIUX-06 | Error toast appears on API failure with retry button | integration | `pnpm vitest run tests/errors/toast.test.ts` | No -- Wave 0 |
| UIUX-08 | Chinese error mapped to current locale string | unit | `pnpm vitest run tests/api/errors.test.ts -t "Chinese mapping"` | Yes (partial) |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/i18n/config.test.ts` -- covers I18N-01, I18N-02
- [ ] `tests/i18n/plurals.test.ts` -- covers I18N-04 (Polish plural rules)
- [ ] `tests/i18n/switching.test.ts` -- covers I18N-03
- [ ] `tests/components/stepper.test.ts` -- covers UIUX-02
- [ ] `tests/layout/responsive.test.ts` -- covers UIUX-03
- [ ] `tests/components/loading.test.ts` -- covers UIUX-05
- [ ] `tests/errors/toast.test.ts` -- covers UIUX-06
- [ ] i18n test utilities (mock i18n provider wrapper for React Testing Library)

## Sources

### Primary (HIGH confidence)
- [i18next plurals documentation](https://www.i18next.com/translation-function/plurals) -- native plural suffix system, `count` variable requirement
- [react-i18next ICU format guide](https://react.i18next.com/misc/using-with-icu-format) -- ICU plugin setup (determined not needed for Polish)
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) -- CSS-first config, @theme directive
- [shadcn/ui Sonner docs](https://ui.shadcn.com/docs/components/radix/sonner) -- toast setup and provider
- [React Router v7 SPA mode](https://reactrouter.com/how-to/spa) -- library mode setup
- npm registry (all package versions verified 2026-03-21)

### Secondary (MEDIUM confidence)
- [DeepWiki shadcn CSS variables](https://deepwiki.com/shadcn-ui/ui/4.6-css-variable-and-theme-management) -- @theme inline pattern
- [Shadcnblocks Tailwind 4 theming](https://www.shadcnblocks.com/blog/tailwind4-shadcn-themeing/) -- migration patterns
- [React Router v7 nested routes guide](https://dev.to/kevinccbsg/react-router-data-mode-part-2-nested-routes-and-outlets-1oa8) -- layout route patterns

### Tertiary (LOW confidence)
- Polish plural rule specifics from CLDR -- verified against Intl.PluralRules spec but not tested with i18next v25 directly

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified at current npm versions, well-documented patterns
- Architecture: HIGH -- layout route + outlet pattern is standard React Router; i18n namespace approach is documented
- Pitfalls: HIGH -- Polish string length and plural forms are well-documented challenges; Tailwind v4 migration is recent but documented

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable libraries, 30-day validity)
