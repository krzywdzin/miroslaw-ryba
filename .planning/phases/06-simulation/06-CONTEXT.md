# Phase 6: Simulation - Context

**Gathered:** 2026-03-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can run and monitor the dual-platform simulation in real time — starting it, watching agent activity on Twitter-like and Reddit-like feeds side by side, tracking progress via round counter and stats, and reviewing key events on a timeline. This is pipeline stage 3.

</domain>

<decisions>
## Implementation Decisions

### Dual-platform layout
- Split screen: vertical divider, Twitter feed on left, Reddit feed on right
- Three-column layout overall: Twitter | Reddit | Timeline
- Progress/control bar sticky at the top above all three columns
- Lightweight platform styling — platform icon, @name vs u/name convention, but no full UI mimicry
- Consistent with minimalist design system (shadcn/ui)

### Post rendering
- Twitter panel: flat chronological feed of posts/replies
- Reddit panel: threaded/nested comments under posts (indented replies)
- Each post shows: agent name + Lucide icon (by type, same as Phase 5 cards), round number badge (e.g. "R3"), action type label (post/komentarz/retweet/debata), timestamp
- Compact cards: 1-2 lines of content visible, longer posts truncated with "więcej..." expand
- Both panels scroll independently

### Real-time feed behavior
- New posts auto-append at the top with subtle entrance animation
- If user scrolled down: "↑ X nowych postów" indicator at top of feed (click to scroll up)
- Polling via existing usePollingQuery hook
- Feed remains browsable after simulation completes — no auto-redirect

### Progress and controls
- Sticky top bar with:
  - Round counter: "Runda X/Y" with progress bar
  - Activity counters: posts, comments, debates (real-time updates)
  - Active agent count
  - Elapsed time since simulation start
  - Stop button ("Zatrzymaj")
- After completion: bar changes to "Zakończono" with final stats + "Przejdź do raportu" button
- Feed stays accessible for review after completion

### Event timeline
- Third column (narrow, right side): vertical list grouped by round
- Each round shows key events: debates, stance changes, post count summaries
- Newest rounds at top
- Clicking a round filters both feeds to show only posts from that round
- Clicking a specific event (e.g., debate) highlights related posts in feeds
- Clear visual markers per event type (icons: debate, stance change, post batch)

### Claude's Discretion
- Exact column width ratios (Twitter/Reddit/Timeline)
- Polling interval (likely 2-3s based on Phase 4 pattern)
- Entrance animation style for new posts
- Timeline event type categorization and icons
- How "highlight related posts" works visually (border, background, scroll-to)
- Empty state before simulation starts
- Error handling during simulation (network drop, backend failure)
- Responsive behavior — timeline may collapse to drawer on narrower screens

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Simulation API
- `src/api/simulation.ts` — Full typed API: start, stop, getRunStatus, getActions, getTimeline, getPosts, getComments, getAgentStats
- `src/api/schemas/simulation.ts` — Zod schemas: RunStatusSchema (runner_status, current_round, total_rounds, progress_percent), ActionSchema (agent_id, action_type, content, round_num, platform, timestamp), TimelineResponseSchema, ActionsResponseSchema

### Existing Patterns
- `src/hooks/usePolling.ts` — usePollingQuery hook with auto-stop on completion
- `src/features/graph/hooks/useBuildStatus.ts` — Build status polling pattern (model for simulation polling)
- `src/features/environment/components/AgentProfileCard.tsx` — Agent icon pattern by type
- `src/components/shared/` — LoadingSkeleton, ErrorAlert, Spinner

### Design System
- `.planning/phases/02-app-shell-and-cross-cutting-concerns/02-UI-SPEC.md` — Design tokens, typography, colors

### Requirements
- `.planning/REQUIREMENTS.md` — SIMU-01..04 requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/hooks/usePolling.ts` — usePollingQuery with isComplete callback and configurable interval
- `src/api/simulation.ts` — All simulation API methods already typed and ready
- `src/features/environment/hooks/useEnvironmentStore.ts` — Zustand store pattern (model for simulation store)
- `src/features/graph/hooks/useBuildStatus.ts` — Polling status hook (model for run status)
- `src/components/ui/badge.tsx` — Badge component for round numbers and action types
- `src/components/ui/scroll-area.tsx` — ScrollArea for independent panel scrolling

### Established Patterns
- Feature-based directory: create `src/features/simulation/`
- i18n: add "simulation" namespace to `src/locales/{pl,en}/`
- TanStack Query for data fetching with polling
- Zustand with persist for pipeline state
- React Hook Form not needed (no forms in this phase)

### Integration Points
- Environment page "Uruchom symulację" button triggers simulation start → navigate to /simulation
- `src/app/App.tsx` — Add /simulation route
- Pipeline stepper needs active state for simulation stage
- Environment store provides simulation_id for API calls
- Graph store provides project_id

</code_context>

<specifics>
## Specific Ideas

- Three-column layout (Twitter | Reddit | Timeline) gives a "command center" feel — user sees everything happening at once
- Round-based timeline filtering lets users reconstruct "what happened in round N" easily
- Compact post cards keep information density high — important since both platforms generate content simultaneously
- Post metadata (agent icon, round badge, action type, timestamp) gives full context at a glance without expanding

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 06-simulation*
*Context gathered: 2026-03-21*
