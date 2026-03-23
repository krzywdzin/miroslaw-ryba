# Phase 9: Polish and Differentiation - Research

**Researched:** 2026-03-23
**Domain:** Dark mode theming, keyboard shortcuts, edge case hardening
**Confidence:** HIGH

## Summary

Phase 9 adds dark mode (UIUX-04), keyboard shortcuts (UIUX-07), and a systematic quality pass across all existing pages. The project uses Tailwind CSS v4 with CSS-first configuration, shadcn/ui components (which already support dark mode via CSS custom properties), and a mature component library. The dark mode implementation is straightforward: add a `@custom-variant` declaration, define dark CSS custom property values, and toggle the `dark` class on `<html>`. Keyboard shortcuts use `react-hotkeys-hook` (v5.2.4) for single-key bindings with input-element awareness. The quality pass is a systematic page-by-page audit for empty states, error handling, loading states, and timeout handling.

The architecture is well-suited for this phase. All shadcn/ui components already consume CSS custom properties (`--background`, `--foreground`, `--card`, etc.), so adding dark values in globals.css propagates automatically. No individual component re-theming needed for shadcn primitives. Custom feature components need audit for hardcoded colors (e.g., `bg-white` in Header.tsx).

**Primary recommendation:** Use Tailwind v4's `@custom-variant dark` with class strategy, `react-hotkeys-hook` for shortcuts, and a systematic per-page quality checklist.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- 3-state toggle: System (auto OS) / Jasny (light) / Ciemny (dark)
- Default: System -- follows OS `prefers-color-scheme`
- User override persisted in localStorage
- Toggle location: header, next to language switcher -- Sun/Moon icon with dropdown
- Implementation via Tailwind CSS `dark:` variant with `class` strategy (add `dark` class to `<html>`)
- All existing components must render correctly in dark mode -- systematic review
- Navigation: keys 1-5 switch between pipeline stages (1=Graph, 2=Environment, 3=Simulation, 4=Report, 5=Chat)
- Chat focus: `/` focuses the chat input field (Slack-style)
- Panel switching: `[` and `]` switch between panels on current page
- Help: `?` opens modal with all shortcuts listed
- Scope: shortcuts disabled when focus is inside input/textarea elements -- prevents conflicts with typing
- No modifier keys needed (no Ctrl/Cmd) -- simple single-key shortcuts
- Systematic review of every page in the pipeline
- Per-page checklist: empty states, error handling, loading states, timeout handling, partial data
- Pages to review: Dashboard, Graph Upload, Graph View, Environment, Simulation, Report, Chat, History, Settings

### Claude's Discretion
- Dark mode color palette specifics (exact dark background, card colors, border colors)
- Shortcut key combinations if conflicts arise
- Help modal design and layout
- Which edge cases need attention (based on code audit)
- Animation/transition behavior when switching themes
- How to handle dark mode in print CSS (always light for PDF export)
- Order and priority of quality fixes

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UIUX-04 | Dark mode with OS preference detection and manual toggle | Tailwind v4 `@custom-variant dark`, CSS custom properties in globals.css, ThemeSwitcher component, localStorage persistence |
| UIUX-07 | Keyboard shortcuts for common actions (chat focus, simulation start/stop, panel switching) | react-hotkeys-hook v5.2.4 with `useHotkeys` hook, global shortcut handler, input-element scoping |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.2.2 (installed) | Dark mode via `@custom-variant` + CSS custom properties | Already in project, native dark mode support |
| react-hotkeys-hook | 5.2.4 | Keyboard shortcut bindings | De facto React shortcut library, 4.5k+ GitHub stars, supports scoping and single keys |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.577.0 (installed) | Sun/Moon icons for theme toggle | Already in project |
| @radix-ui/react-dialog | 1.1.15 (installed) | Help modal for keyboard shortcuts | Already in project |
| @radix-ui/react-dropdown-menu | 2.1.16 (installed) | Theme switcher dropdown | Already in project |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-hotkeys-hook | Custom `useEffect` + `keydown` | Hand-rolling misses edge cases: input scoping, key combos, memory leaks, SSR safety |
| react-hotkeys-hook | @tanstack/react-hotkeys (v0.5.1) | Too young (v0.5), API still evolving -- react-hotkeys-hook is battle-tested |

**Installation:**
```bash
pnpm add react-hotkeys-hook
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── layout/
│       ├── ThemeSwitcher.tsx       # 3-state dropdown (System/Light/Dark)
│       └── Header.tsx              # Add ThemeSwitcher next to LanguageSwitcher
├── hooks/
│   ├── useTheme.ts                 # Theme state: read/write localStorage, apply class
│   └── useGlobalShortcuts.ts       # Global keyboard shortcut registrations
├── components/shared/
│   └── ShortcutsHelpModal.tsx      # ? key help overlay
├── styles/
│   └── globals.css                 # Add .dark CSS custom properties + @custom-variant
└── locales/
    ├── pl/common.json              # Add theme/shortcut labels
    └── en/common.json              # Add theme/shortcut labels
```

### Pattern 1: Tailwind v4 Dark Mode with CSS Custom Properties

**What:** Define dark theme values using `.dark` selector that overrides CSS custom properties.
**When to use:** Always -- this is how the entire dark mode system works.

```css
/* globals.css */
@import "tailwindcss";
@import "@fontsource-variable/geist";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:where(.dark, .dark *));

:root {
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
  --success: hsl(142 71% 45%);
  --success-foreground: hsl(0 0% 100%);
  --warning: hsl(38 92% 50%);
  --warning-foreground: hsl(0 0% 100%);
  /* ... layout vars unchanged ... */
}

.dark {
  --background: hsl(240 10% 4%);
  --foreground: hsl(0 0% 98%);
  --card: hsl(240 6% 10%);
  --card-foreground: hsl(0 0% 98%);
  --popover: hsl(240 6% 10%);
  --popover-foreground: hsl(0 0% 98%);
  --primary: hsl(217 91% 60%);
  --primary-foreground: hsl(0 0% 100%);
  --secondary: hsl(240 4% 16%);
  --secondary-foreground: hsl(0 0% 98%);
  --muted: hsl(240 4% 16%);
  --muted-foreground: hsl(240 5% 65%);
  --accent: hsl(217 91% 60%);
  --accent-foreground: hsl(0 0% 100%);
  --destructive: hsl(0 62% 50%);
  --destructive-foreground: hsl(0 0% 98%);
  --border: hsl(240 4% 20%);
  --input: hsl(240 4% 20%);
  --ring: hsl(217 91% 60%);
  --success: hsl(142 71% 45%);
  --success-foreground: hsl(0 0% 100%);
  --warning: hsl(38 92% 50%);
  --warning-foreground: hsl(0 0% 100%);
}
```

Source: [Tailwind CSS v4 Dark Mode docs](https://tailwindcss.com/docs/dark-mode)

### Pattern 2: Theme Provider Hook

**What:** Custom hook managing 3-state theme with localStorage persistence and OS detection.
**When to use:** Single source of truth for theme state across the app.

```typescript
// src/hooks/useTheme.ts
import { useEffect, useState, useCallback } from 'react'

type Theme = 'system' | 'light' | 'dark'

const STORAGE_KEY = 'theme'

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme
  document.documentElement.classList.toggle('dark', resolved === 'dark')
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    return stored ?? 'system'
  })

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next)
    if (next === 'system') {
      localStorage.removeItem(STORAGE_KEY)
    } else {
      localStorage.setItem(STORAGE_KEY, next)
    }
    applyTheme(next)
  }, [])

  // Apply on mount and listen for OS changes
  useEffect(() => {
    applyTheme(theme)
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') applyTheme('system')
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [theme])

  return { theme, setTheme, resolvedTheme: theme === 'system' ? getSystemTheme() : theme }
}
```

### Pattern 3: Keyboard Shortcuts with react-hotkeys-hook

**What:** Global shortcuts using `useHotkeys` with automatic input element scoping.
**When to use:** App-level shortcuts that work everywhere except text inputs.

```typescript
// src/hooks/useGlobalShortcuts.ts
import { useHotkeys } from 'react-hotkeys-hook'
import { useNavigate } from 'react-router'

export function useGlobalShortcuts() {
  const navigate = useNavigate()

  // Pipeline stage navigation: 1-5
  useHotkeys('1', () => navigate('/graph'), { enableOnFormTags: false })
  useHotkeys('2', () => navigate('/environment'), { enableOnFormTags: false })
  useHotkeys('3', () => navigate('/simulation'), { enableOnFormTags: false })
  useHotkeys('4', () => navigate('/history'), { enableOnFormTags: false })
  useHotkeys('5', () => navigate('/chat'), { enableOnFormTags: false })

  // Chat focus
  useHotkeys('/', (e) => {
    e.preventDefault()
    const input = document.querySelector<HTMLTextAreaElement>('[data-chat-input]')
    input?.focus()
  }, { enableOnFormTags: false })

  // Help modal
  useHotkeys('shift+/', () => {
    // ? is shift+/ -- open help modal
    // dispatch state change or use a ref
  }, { enableOnFormTags: false })
}
```

Note: `?` key is actually `shift+/` on US keyboards. `react-hotkeys-hook` handles this with the `?` key binding directly -- verify during implementation.

### Pattern 4: FOUC Prevention Script

**What:** Inline script in index.html to apply dark class before React hydrates.
**When to use:** Always -- prevents flash of light theme on dark mode pages.

```html
<!-- index.html, inside <head> -->
<script>
  (function() {
    var t = localStorage.getItem('theme');
    var dark = t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) document.documentElement.classList.add('dark');
  })();
</script>
```

### Anti-Patterns to Avoid
- **Hardcoded colors in className:** Never use `bg-white`, `text-black`, `bg-gray-100` etc. Always use semantic tokens: `bg-background`, `text-foreground`, `bg-card`. The Header.tsx currently has `bg-white` which must change to `bg-background`.
- **Tailwind v3 darkMode config:** Do NOT add a `tailwind.config.ts` with `darkMode: 'class'`. Tailwind v4 uses `@custom-variant` in CSS.
- **Separate dark CSS file:** Do NOT create a second CSS file. Dark values go in the same globals.css under `.dark {}`.
- **Individual component dark: classes:** Do NOT add `dark:bg-gray-800` to every component. The CSS custom properties approach means components automatically adapt.
- **Shortcuts without input guard:** Never bind single keys globally without disabling in form elements -- typing "1" in a text field would navigate away.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Keyboard shortcut binding | Custom keydown listeners with cleanup | react-hotkeys-hook `useHotkeys` | Handles scoping, cleanup, SSR, modifiers, key combos, enableOnFormTags |
| OS theme detection | Custom matchMedia listener | useTheme hook wrapping matchMedia | Edge cases: listener cleanup, initial state, system preference changes mid-session |
| Dark mode color variables | Manual color mapping per component | CSS custom properties in .dark {} | One place to change, automatic propagation to all shadcn components |
| FOUC prevention | React useEffect | Inline `<script>` in index.html head | React mounts too late, user sees flash |

**Key insight:** The CSS custom properties architecture means dark mode is a CSS-only change for shadcn components. The React layer only manages the toggle state and class application.

## Common Pitfalls

### Pitfall 1: Flash of Unstyled Content (FOUC)
**What goes wrong:** Page loads with light theme, then flashes to dark after React mounts.
**Why it happens:** React `useEffect` runs after paint. If theme is "dark" in localStorage, the class isn't applied until after first render.
**How to avoid:** Add inline `<script>` to `<head>` in index.html that reads localStorage and applies `.dark` class synchronously before any CSS is parsed.
**Warning signs:** Visible flash when refreshing a dark-themed page.

### Pitfall 2: Hardcoded Colors in Custom Components
**What goes wrong:** Dark mode works for shadcn components but custom feature components still show light backgrounds/colors.
**Why it happens:** Feature components use literal values like `bg-white`, `text-gray-900`, `border-gray-200` instead of semantic tokens.
**How to avoid:** Audit ALL custom components for hardcoded color classes. Replace with `bg-background`, `text-foreground`, `bg-card`, `text-card-foreground`, `border-border`, etc.
**Warning signs:** Header.tsx already uses `bg-white` -- this is confirmed to need fixing.

### Pitfall 3: Reagraph (3D Graph) Dark Mode
**What goes wrong:** The knowledge graph visualization uses reagraph which renders in a WebGL canvas. CSS custom properties don't reach canvas elements.
**Why it happens:** reagraph has its own theme/color props, separate from CSS.
**How to avoid:** Pass dark-appropriate colors to reagraph's `theme` prop based on resolved theme. Check reagraph docs for dark mode support.
**Warning signs:** Graph page looks correct in light mode but has white/bright elements on dark background.

### Pitfall 4: Print CSS Override
**What goes wrong:** PDF export prints with dark background, making it unreadable.
**Why it happens:** Print CSS doesn't account for dark mode.
**How to avoid:** The existing print CSS already forces `background: white !important; color: black !important;` on body. Verify this still works by ensuring print media query takes precedence over `.dark` class.
**Warning signs:** Dark-themed PDF export.

### Pitfall 5: Keyboard Shortcuts Firing in Text Inputs
**What goes wrong:** Pressing "1" in a text field navigates to the Graph page instead of typing "1".
**Why it happens:** Global keyboard listeners capture events from all elements.
**How to avoid:** Use `enableOnFormTags: false` (default in react-hotkeys-hook) or check `e.target.tagName` for INPUT/TEXTAREA/SELECT elements.
**Warning signs:** Any text input where single-character shortcuts trigger navigation.

### Pitfall 6: Missing i18n for New UI Elements
**What goes wrong:** Theme toggle and shortcut labels show raw keys or English only.
**Why it happens:** New components added without corresponding translation entries.
**How to avoid:** Add all new strings to both pl/ and en/ common.json before implementing components.
**Warning signs:** Raw string keys visible in the UI.

## Code Examples

### ThemeSwitcher Component (follows LanguageSwitcher pattern)

```tsx
// src/components/layout/ThemeSwitcher.tsx
import { useTranslation } from 'react-i18next'
import { Sun, Moon, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { useTheme } from '@/hooks/useTheme'

const themes = [
  { value: 'system', icon: Monitor, labelKey: 'theme.system' },
  { value: 'light', icon: Sun, labelKey: 'theme.light' },
  { value: 'dark', icon: Moon, labelKey: 'theme.dark' },
] as const

export function ThemeSwitcher() {
  const { t } = useTranslation('common')
  const { theme, setTheme, resolvedTheme } = useTheme()

  const ActiveIcon = resolvedTheme === 'dark' ? Moon : Sun

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('theme.label')}>
          <ActiveIcon className="size-[18px]" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {themes.map((t_item) => (
          <DropdownMenuItem
            key={t_item.value}
            onClick={() => setTheme(t_item.value)}
            className={cn(
              theme === t_item.value && 'bg-accent text-accent-foreground',
            )}
          >
            <t_item.icon className="mr-2 size-4" />
            {t(t_item.labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

### Keyboard Shortcuts Help Modal

```tsx
// src/components/shared/ShortcutsHelpModal.tsx
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog' // Uses existing shadcn dialog

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShortcutsHelpModal({ open, onOpenChange }: Props) {
  const { t } = useTranslation('common')

  const shortcuts = [
    { keys: '1-5', description: t('shortcuts.navigate') },
    { keys: '/', description: t('shortcuts.chatFocus') },
    { keys: '[ ]', description: t('shortcuts.panelSwitch') },
    { keys: '?', description: t('shortcuts.help') },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('shortcuts.title')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {shortcuts.map((s) => (
            <div key={s.keys} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.description}</span>
              <kbd className="rounded bg-muted px-2 py-1 font-mono text-xs">
                {s.keys}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Tailwind v3 `darkMode: 'class'` in config | Tailwind v4 `@custom-variant dark` in CSS | Tailwind v4 (2025) | No config file needed, CSS-first |
| Individual `dark:` classes per element | CSS custom properties + `.dark` override | Tailwind v4 + shadcn convention | Single source of truth for dark colors |
| Custom keydown handlers | react-hotkeys-hook v5 | 2024-2025 | Scoping, cleanup, SSR handled automatically |

**Deprecated/outdated:**
- `tailwind.config.js` `darkMode: 'class'` -- replaced by `@custom-variant` in Tailwind v4
- `next-themes` -- Next.js specific, not applicable to Vite + React Router projects

## Open Questions

1. **Reagraph dark mode support**
   - What we know: reagraph renders in WebGL canvas, CSS custom properties don't apply
   - What's unclear: exact API for passing dark theme colors to reagraph
   - Recommendation: Check reagraph props during implementation; likely needs `theme` prop or explicit node/edge color overrides based on resolved theme

2. **`?` key binding in react-hotkeys-hook**
   - What we know: `?` requires Shift on US keyboard layouts
   - What's unclear: Whether react-hotkeys-hook handles `?` directly or needs `shift+/`
   - Recommendation: Test `useHotkeys('?', ...)` first; fall back to `shift+/` if needed

3. **Panel switching scope**
   - What we know: `[` and `]` switch between panels on current page
   - What's unclear: Which pages have multiple panels (tabs?) to switch between
   - Recommendation: Audit during implementation -- pages with tabs (Environment, possibly Report) are candidates

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.x + @testing-library/react 16.x |
| Config file | vitest.config.ts |
| Quick run command | `pnpm test` |
| Full suite command | `pnpm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UIUX-04 | Theme toggle persists preference to localStorage | unit | `pnpm exec vitest run src/hooks/useTheme.test.ts -t "persist"` | No -- Wave 0 |
| UIUX-04 | Dark class applied to document.documentElement | unit | `pnpm exec vitest run src/hooks/useTheme.test.ts -t "dark class"` | No -- Wave 0 |
| UIUX-04 | System theme follows OS preference | unit | `pnpm exec vitest run src/hooks/useTheme.test.ts -t "system"` | No -- Wave 0 |
| UIUX-04 | ThemeSwitcher renders 3 options | unit | `pnpm exec vitest run src/components/layout/ThemeSwitcher.test.tsx` | No -- Wave 0 |
| UIUX-07 | Number keys navigate to pipeline stages | unit | `pnpm exec vitest run src/hooks/useGlobalShortcuts.test.ts -t "navigate"` | No -- Wave 0 |
| UIUX-07 | Shortcuts disabled inside input/textarea | unit | `pnpm exec vitest run src/hooks/useGlobalShortcuts.test.ts -t "input"` | No -- Wave 0 |
| UIUX-07 | ? key opens help modal | unit | `pnpm exec vitest run src/hooks/useGlobalShortcuts.test.ts -t "help"` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test`
- **Per wave merge:** `pnpm test && pnpm typecheck`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/hooks/useTheme.test.ts` -- covers UIUX-04 theme logic
- [ ] `src/hooks/useGlobalShortcuts.test.ts` -- covers UIUX-07 shortcut bindings
- [ ] `src/components/layout/ThemeSwitcher.test.tsx` -- covers UIUX-04 UI component
- [ ] Framework install: `pnpm add react-hotkeys-hook` -- new dependency

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Dark Mode docs](https://tailwindcss.com/docs/dark-mode) -- `@custom-variant` syntax, class strategy, FOUC prevention script
- Project source code -- globals.css, Header.tsx, LanguageSwitcher.tsx, AppShell.tsx, package.json, vite.config.ts

### Secondary (MEDIUM confidence)
- [react-hotkeys-hook npm](https://www.npmjs.com/package/react-hotkeys-hook) -- v5.2.4, API surface
- [react-hotkeys-hook docs](https://react-hotkeys-hook.vercel.app/) -- useHotkeys API, enableOnFormTags option

### Tertiary (LOW confidence)
- Reagraph dark mode support -- needs verification during implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- Tailwind v4 dark mode is well-documented, react-hotkeys-hook is mature
- Architecture: HIGH -- CSS custom properties + class strategy is the standard shadcn/Tailwind pattern
- Pitfalls: HIGH -- FOUC, hardcoded colors, input scoping are well-known issues with documented solutions

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (stable domain, no fast-moving dependencies)
