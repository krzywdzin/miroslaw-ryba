---
phase: 09-polish-and-differentiation
plan: 02
subsystem: ui
tags: [keyboard-shortcuts, react-hotkeys-hook, accessibility, i18n]

requires:
  - phase: 02-ui-foundation
    provides: shadcn components, i18n setup, AppShell layout
  - phase: 08-interactive-dialogue
    provides: ChatInput component for data-chat-input attribute

provides:
  - Global keyboard shortcuts for pipeline navigation (1-5)
  - Chat input focus shortcut (/)
  - Panel switching events ([ ])
  - Keyboard shortcuts help modal (?)
  - dialog.tsx shadcn component

affects: []

tech-stack:
  added: [react-hotkeys-hook 5.2.4]
  patterns: [useHotkeys with enableOnFormTags false, CustomEvent for panel switching]

key-files:
  created:
    - src/hooks/useGlobalShortcuts.ts
    - src/hooks/useGlobalShortcuts.test.ts
    - src/components/shared/ShortcutsHelpModal.tsx
    - src/components/shared/ShortcutsHelpModal.test.tsx
    - src/components/ui/dialog.tsx
  modified:
    - src/components/layout/AppShell.tsx
    - src/features/chat/components/ChatInput.tsx
    - src/locales/pl/common.json
    - src/locales/en/common.json
    - package.json

key-decisions:
  - "Shared HOTKEY_OPTIONS constant for enableOnFormTags: false across all bindings"
  - "shift+/ used for help modal (? key mapped via shift+/)"
  - "CustomEvent pattern for panel-prev/panel-next to decouple from specific tab implementations"

patterns-established:
  - "useHotkeys with enableOnFormTags: false for global shortcuts that ignore form inputs"
  - "data-chat-input attribute selector for cross-component focus targeting"

requirements-completed: [UIUX-07]

duration: 4min
completed: 2026-03-23
---

# Phase 9 Plan 02: Keyboard Shortcuts Summary

**Global keyboard shortcuts with react-hotkeys-hook for pipeline navigation (1-5), chat focus (/), panel switching ([ ]), and help modal (?)**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-23T21:03:10Z
- **Completed:** 2026-03-23T21:07:00Z
- **Tasks:** 2
- **Files modified:** 10

## Accomplishments

- useGlobalShortcuts hook registers all keyboard shortcuts with automatic input-element scoping
- ShortcutsHelpModal shows localized shortcut descriptions in PL and EN
- Shortcuts wired into AppShell for app-wide availability
- ChatInput textarea tagged with data-chat-input for / shortcut focus

## Task Commits

Each task was committed atomically:

1. **Task 1 (RED): Failing tests for shortcuts** - `066bd73` (test)
2. **Task 1 (GREEN): Hook, modal, dialog, i18n** - `2aeef58` (feat)
3. **Task 2: Wire into AppShell + data-chat-input** - `49a0b5c` (feat)

_Note: TDD task had RED and GREEN commits_

## Files Created/Modified

- `src/hooks/useGlobalShortcuts.ts` - Global keyboard shortcut registrations using react-hotkeys-hook
- `src/hooks/useGlobalShortcuts.test.ts` - 12 tests covering navigation, help modal, panel events
- `src/components/shared/ShortcutsHelpModal.tsx` - Dialog showing 4 shortcut entries with kbd elements
- `src/components/shared/ShortcutsHelpModal.test.tsx` - 4 tests for modal rendering
- `src/components/ui/dialog.tsx` - shadcn Dialog component (Radix-based)
- `src/components/layout/AppShell.tsx` - Added useGlobalShortcuts call and ShortcutsHelpModal render
- `src/features/chat/components/ChatInput.tsx` - Added data-chat-input attribute to textarea
- `src/locales/pl/common.json` - Added shortcuts i18n strings (Polish)
- `src/locales/en/common.json` - Added shortcuts i18n strings (English)
- `package.json` - Added react-hotkeys-hook dependency

## Decisions Made

- Used `shift+/` for help modal binding (react-hotkeys-hook v5 handles shift modifier)
- Created shared `HOTKEY_OPTIONS` constant to avoid repeating `enableOnFormTags: false`
- Used `CustomEvent` pattern for panel-prev/panel-next to decouple shortcuts from specific tab implementations
- Added `DialogDescription` with `sr-only` class for Radix accessibility requirement

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Created missing dialog.tsx shadcn component**
- **Found during:** Task 1 (ShortcutsHelpModal needs Dialog)
- **Issue:** dialog.tsx not in src/components/ui/ but @radix-ui/react-dialog was installed as alert-dialog dependency
- **Fix:** Created dialog.tsx following shadcn patterns from alert-dialog.tsx
- **Files modified:** src/components/ui/dialog.tsx
- **Verification:** TypeScript compiles, modal renders correctly
- **Committed in:** 2aeef58 (Task 1 GREEN commit)

**2. [Rule 1 - Bug] Fixed duplicate text in ShortcutsHelpModal test**
- **Found during:** Task 1 (GREEN phase test run)
- **Issue:** "Keyboard Shortcuts" appeared twice (DialogTitle + sr-only DialogDescription), getByText found multiple matches
- **Fix:** Changed test to use getByRole('heading') for title assertion
- **Files modified:** src/components/shared/ShortcutsHelpModal.test.tsx
- **Verification:** All 16 tests pass
- **Committed in:** 2aeef58 (Task 1 GREEN commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both fixes necessary for correctness. No scope creep.

## Issues Encountered

None beyond the auto-fixed deviations.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Keyboard shortcuts active app-wide
- Help modal accessible via ? key
- Ready for Phase 9 Plan 03 (quality pass) or Phase 10

## Self-Check: PASSED

- All 5 created files verified on disk
- All 3 task commits verified in git log (066bd73, 2aeef58, 49a0b5c)
- 251 tests pass, TypeScript compiles clean

---
*Phase: 09-polish-and-differentiation*
*Completed: 2026-03-23*
