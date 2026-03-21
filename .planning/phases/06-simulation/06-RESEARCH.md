# Phase 6: Simulation - Research

**Researched:** 2026-03-21
**Domain:** Real-time simulation monitoring UI (polling, multi-panel layout, event timeline)
**Confidence:** HIGH

## Summary

Phase 6 builds the simulation monitoring view -- a three-column "command center" where users watch dual-platform agent activity unfold in real time. The technical challenge is coordinating multiple polling queries (run status, actions feed, timeline events) against an already-typed simulation API, rendering platform-specific post formats (flat Twitter feed vs. threaded Reddit comments), and maintaining a responsive, scrollable layout with sticky controls.

All API endpoints and Zod schemas already exist in `src/api/simulation.ts` and `src/api/schemas/simulation.ts`. The `usePollingQuery` hook is proven in Phase 4 (graph build status). The primary work is UI composition: building the three-column layout, post card components (Twitter flat vs. Reddit threaded), progress bar with controls, event timeline, and wiring multiple polling hooks to the simulation API.

**Primary recommendation:** Build a Zustand simulation store (mirroring the environment/graph store pattern), create 3-4 custom hooks wrapping `usePollingQuery` for status/actions/timeline, and compose the view from independent scrollable panels using the existing shadcn ScrollArea component.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Split screen: vertical divider, Twitter feed on left, Reddit feed on right
- Three-column layout overall: Twitter | Reddit | Timeline
- Progress/control bar sticky at the top above all three columns
- Lightweight platform styling -- platform icon, @name vs u/name convention, but no full UI mimicry
- Consistent with minimalist design system (shadcn/ui)
- Twitter panel: flat chronological feed of posts/replies
- Reddit panel: threaded/nested comments under posts (indented replies)
- Each post shows: agent name + Lucide icon (by type, same as Phase 5 cards), round number badge (e.g. "R3"), action type label (post/komentarz/retweet/debata), timestamp
- Compact cards: 1-2 lines of content visible, longer posts truncated with "wiecej..." expand
- Both panels scroll independently
- New posts auto-append at the top with subtle entrance animation
- If user scrolled down: "^ X nowych postow" indicator at top of feed (click to scroll up)
- Polling via existing usePollingQuery hook
- Feed remains browsable after simulation completes -- no auto-redirect
- Sticky top bar with: Round counter "Runda X/Y" with progress bar, Activity counters (posts, comments, debates), Active agent count, Elapsed time, Stop button ("Zatrzymaj")
- After completion: bar changes to "Zakonczone" with final stats + "Przejdz do raportu" button
- Third column (narrow, right side): vertical list grouped by round
- Each round shows key events: debates, stance changes, post count summaries
- Newest rounds at top
- Clicking a round filters both feeds to show only posts from that round
- Clicking a specific event highlights related posts in feeds
- Clear visual markers per event type (icons: debate, stance change, post batch)

### Claude's Discretion
- Exact column width ratios (Twitter/Reddit/Timeline)
- Polling interval (likely 2-3s based on Phase 4 pattern)
- Entrance animation style for new posts
- Timeline event type categorization and icons
- How "highlight related posts" works visually (border, background, scroll-to)
- Empty state before simulation starts
- Error handling during simulation (network drop, backend failure)
- Responsive behavior -- timeline may collapse to drawer on narrower screens

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| SIMU-01 | User can start and monitor simulation with real-time progress (agent counts, interaction counts, timeline) | `simulationApi.start()`, `getRunStatus()` with `usePollingQuery`, `getAgentStats()` -- all typed and ready. Progress bar via `RunStatusSchema.progress_percent`. |
| SIMU-02 | User can view dual-platform split view (Twitter-like + Reddit-like) showing parallel simulations | Three-column layout with `ScrollArea` per panel. `getActions()` with `platform` filter param separates feeds. Flat vs threaded rendering per platform. |
| SIMU-03 | User can see agent activity posts, comments, and debates in real-time via polling | `getActions()` returns actions with `action_type`, `content`, `round_num`, `platform`. `getPosts()` and `getComments()` for detailed content. Multiple `usePollingQuery` instances with offset-based incremental fetching. |
| SIMU-04 | User can view action timeline showing key events during simulation | `getTimeline()` endpoint returns rounds with events. Timeline column with round grouping, event type icons, click-to-filter functionality. |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | ^19.0.0 | UI framework | Project standard |
| @tanstack/react-query | ^5.91.0 | Data fetching + polling | Already used for all API calls |
| zustand | ^5.0.0 | Client state (simulation store) | Project pattern for pipeline stores |
| react-router | ^7.13.1 | Route for /simulation | Project router |
| lucide-react | ^0.577.0 | Icons (platform, event types) | Project icon library |
| react-i18next | ^16.5.8 | Polish/English translations | Project i18n |
| zod | ^3.24.0 (v4 API) | Schema validation | All schemas already defined |

### Supporting (Already Installed)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-scroll-area | ^1.2.10 | Independent panel scrolling | Twitter/Reddit/Timeline columns |
| @radix-ui/react-progress | ^1.1.8 | Round progress bar | Sticky top bar |
| shadcn Badge | installed | Round badges, action types | Post metadata |
| shadcn Card | installed | Post cards | Twitter/Reddit posts |
| shadcn Separator | installed | Column dividers | Between panels |

### No New Dependencies Required

All UI components and data fetching infrastructure are already installed. No new packages needed.

## Architecture Patterns

### Recommended Project Structure
```
src/features/simulation/
  index.ts                        # barrel export
  pages/
    SimulationPage.tsx             # main page with 3-column layout
  components/
    SimulationProgressBar.tsx      # sticky top bar (round, stats, controls)
    TwitterFeed.tsx                # left column -- flat post feed
    RedditFeed.tsx                 # middle column -- threaded post feed
    PostCard.tsx                   # shared compact post card (action_type variants)
    RedditThread.tsx               # nested comment rendering
    EventTimeline.tsx              # right column -- round-grouped events
    TimelineRoundGroup.tsx         # single round in timeline
    NewPostsIndicator.tsx          # "X nowych postow" floating banner
    CompletionBar.tsx              # post-simulation summary bar
  hooks/
    useSimulationStore.ts          # Zustand store (simulationId, status, filters)
    useRunStatus.ts                # polls getRunStatus (status, round, progress)
    useSimulationActions.ts        # polls getActions (posts, comments, debates)
    useSimulationTimeline.ts       # polls getTimeline (round events)
    useElapsedTime.ts              # elapsed time counter (setInterval)
    useScrollAnchor.ts             # detects user scroll position for new-post indicator
```

### Pattern 1: Multiple Polling Hooks (Command Center Pattern)
**What:** Run 2-3 independent `usePollingQuery` instances concurrently, each fetching different data slices.
**When to use:** When a page needs real-time data from multiple endpoints.
**Example:**
```typescript
// hooks/useRunStatus.ts -- follows useBuildStatus pattern exactly
import { simulationApi } from '@/api/simulation'
import { usePollingQuery } from '@/hooks/usePolling'

export function useRunStatus(simulationId: string | null) {
  return usePollingQuery(
    ['simulation', 'run-status', simulationId] as const,
    () => simulationApi.getRunStatus(simulationId!),
    {
      enabled: !!simulationId,
      interval: 2000,
      isComplete: (data) => {
        const status = data.data?.runner_status
        return status === 'completed' || status === 'failed' || status === 'stopped'
      },
    },
  )
}
```

### Pattern 2: Zustand Simulation Store (Pipeline Stage Pattern)
**What:** Zustand store with persist middleware for simulation state, matching existing graph/environment stores.
**When to use:** Track simulation lifecycle state across component tree.
**Example:**
```typescript
// hooks/useSimulationStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SimulationStep = 'idle' | 'running' | 'completed' | 'failed' | 'stopped'

export interface SimulationState {
  step: SimulationStep
  simulationId: string | null
  activeRoundFilter: number | null
  highlightedEventId: string | null
  setStep: (step: SimulationStep) => void
  setSimulationId: (id: string | null) => void
  setActiveRoundFilter: (round: number | null) => void
  setHighlightedEventId: (id: string | null) => void
  reset: () => void
}
```

### Pattern 3: Incremental Action Fetching
**What:** Poll actions with offset to avoid refetching entire dataset each poll cycle.
**When to use:** When the action list grows throughout simulation.
**Example:**
```typescript
// hooks/useSimulationActions.ts
export function useSimulationActions(simulationId: string | null, platform?: string) {
  const lastCountRef = useRef(0)

  return usePollingQuery(
    ['simulation', 'actions', simulationId, platform] as const,
    () => simulationApi.getActions(simulationId!, { platform, limit: 50 }),
    {
      enabled: !!simulationId,
      interval: 2500,
      isComplete: () => false, // never auto-stop; tied to run status
    },
  )
}
```

Note: `isComplete` for actions should NOT auto-stop -- it should remain active until the run status hook detects completion. The `usePollingQuery` `enabled` prop can be toggled based on run status.

### Pattern 4: Scroll Anchor Detection
**What:** Track whether user has scrolled away from top, show "new posts" indicator.
**When to use:** Auto-scrolling feeds where user may be reading older content.
**Example:**
```typescript
// hooks/useScrollAnchor.ts
export function useScrollAnchor(scrollRef: React.RefObject<HTMLDivElement>) {
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handler = () => setIsAtTop(el.scrollTop < 50)
    el.addEventListener('scroll', handler, { passive: true })
    return () => el.removeEventListener('scroll', handler)
  }, [scrollRef])

  const scrollToTop = useCallback(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }, [scrollRef])

  return { isAtTop, scrollToTop }
}
```

### Pattern 5: Reddit Threaded Comments
**What:** Recursive component rendering nested comments with indentation.
**When to use:** Reddit panel threaded view.
**Example:**
```typescript
// Flat action list -> tree structure transformation
interface ThreadNode {
  action: Action
  replies: ThreadNode[]
}

function buildThreadTree(actions: Action[]): ThreadNode[] {
  // Group by parent_id, root posts have no parent
  // Return tree structure for recursive rendering
}

// RedditThread renders with ml-4 (16px) indent per nesting level
function RedditThread({ node, depth = 0 }: { node: ThreadNode; depth?: number }) {
  return (
    <div style={{ marginLeft: depth * 16 }}>
      <PostCard action={node.action} />
      {node.replies.map(reply => (
        <RedditThread key={reply.action.agent_id + reply.action.timestamp} node={reply} depth={depth + 1} />
      ))}
    </div>
  )
}
```

### Anti-Patterns to Avoid
- **Single monolithic polling query:** Do NOT try to fetch all data (status + actions + timeline) in one query. Use separate hooks for independent refresh and caching.
- **Storing all actions in Zustand:** Actions data belongs in TanStack Query cache, not Zustand. Zustand is for UI state (filters, highlights), not server data.
- **Refetching entire action list:** Use offset/pagination params to avoid downloading all actions every 2 seconds.
- **Blocking UI on poll failure:** A single failed poll should not crash the view. Show stale data with a subtle error indicator.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Independent scrolling panels | Custom overflow CSS | `ScrollArea` from shadcn/Radix | Handles cross-browser scrollbar styling, touch scrolling |
| Progress bar | Custom div with width% | `Progress` from shadcn/Radix | Accessible, animated, consistent with design system |
| Polling logic | setInterval + useState | `usePollingQuery` (existing) | Already handles auto-stop, background tab behavior, query cache |
| Elapsed timer display | Manual date math | Simple `useEffect` with `setInterval` + `Date.now()` delta | Actually fine to hand-roll; this is trivial |
| Post truncation | Custom text slicing | CSS `line-clamp-2` with Tailwind | Handles edge cases (word boundaries, RTL) |

**Key insight:** The simulation API and polling infrastructure are already built. This phase is pure UI composition -- the risk is in layout complexity, not data fetching.

## Common Pitfalls

### Pitfall 1: Polling Overlap Causing Stale Reads
**What goes wrong:** Multiple polling queries fire at similar intervals, creating race conditions where a status update arrives before the matching actions.
**Why it happens:** `usePollingQuery` instances run independently.
**How to avoid:** Stagger intervals slightly (status: 2000ms, actions: 2500ms, timeline: 3000ms). Accept that brief inconsistencies (e.g., round counter shows R4 but latest actions are still R3) are normal and self-correct on next poll.
**Warning signs:** UI flickers between states, progress bar jumps backward.

### Pitfall 2: Unbounded Action List Growth
**What goes wrong:** As simulation progresses, the actions array grows to hundreds/thousands of items. Re-rendering the entire list on each poll kills performance.
**Why it happens:** Naive approach refetches and re-renders all actions.
**How to avoid:** Use `limit` param on `getActions()`. Keep only the latest N actions in the visible feed (e.g., 100). Use React.memo on PostCard. Consider `key` stability for minimizing re-renders.
**Warning signs:** Increasing lag as simulation progresses, browser tab becomes unresponsive.

### Pitfall 3: Scroll Position Reset on New Data
**What goes wrong:** User scrolls down to read older posts, new poll data arrives, component re-renders and scroll jumps to top.
**Why it happens:** New items prepended to list cause layout shift.
**How to avoid:** Use the `useScrollAnchor` pattern. Only auto-scroll to top when user is already at top. When user is scrolled down, show the "new posts" indicator instead. Use `structuralSharing: true` in TanStack Query to minimize reference changes.
**Warning signs:** Scroll position jumps unexpectedly, user cannot read older posts.

### Pitfall 4: Missing Route Guard
**What goes wrong:** User navigates directly to /simulation without a running simulation.
**Why it happens:** No guard checking simulationId or simulation status.
**How to avoid:** Add route guard (same pattern as environment page). If no active simulation, redirect to /environment. Check both environment store for simulationId and optionally run-status for actual backend state.
**Warning signs:** Blank page, API errors with null simulationId.

### Pitfall 5: Memory Leak from Polling After Unmount
**What goes wrong:** User navigates away from /simulation but polling continues.
**Why it happens:** TanStack Query continues polling if not properly cleaned up.
**How to avoid:** `usePollingQuery` already handles this -- TanStack Query stops polling when component unmounts and query has no observers. Verify that `refetchIntervalInBackground: false` is set (it is in the existing hook).
**Warning signs:** Network tab shows continued requests after navigation.

### Pitfall 6: Thread Depth Explosion in Reddit Panel
**What goes wrong:** Deeply nested Reddit threads create absurdly indented posts that are unreadable.
**Why it happens:** No max-depth limit on recursive rendering.
**How to avoid:** Cap visual indentation at 4-5 levels. Beyond that, flatten visually but keep thread relationship via subtle indicators.
**Warning signs:** Post content squeezed to a few characters wide.

## Code Examples

### Three-Column Layout
```typescript
// SimulationPage.tsx -- core layout structure
<div className="flex h-[calc(100vh-56px)] flex-col">
  {/* Sticky progress bar */}
  <SimulationProgressBar status={runStatus} onStop={handleStop} />

  {/* Three-column content */}
  <div className="flex flex-1 overflow-hidden">
    {/* Twitter feed -- left */}
    <div className="flex-1 border-r">
      <ScrollArea className="h-full">
        <TwitterFeed actions={twitterActions} roundFilter={roundFilter} />
      </ScrollArea>
    </div>

    {/* Reddit feed -- middle */}
    <div className="flex-1 border-r">
      <ScrollArea className="h-full">
        <RedditFeed actions={redditActions} roundFilter={roundFilter} />
      </ScrollArea>
    </div>

    {/* Timeline -- right (narrower) */}
    <div className="w-72 shrink-0">
      <ScrollArea className="h-full">
        <EventTimeline
          timeline={timeline}
          onRoundClick={setRoundFilter}
          onEventClick={setHighlightedEvent}
        />
      </ScrollArea>
    </div>
  </div>
</div>
```

### Compact Post Card
```typescript
// PostCard.tsx
import { Bird, MessageCircle, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  twitter: Bird,
  reddit: MessageCircle,
}

interface PostCardProps {
  action: Action
  highlighted?: boolean
}

export const PostCard = memo(function PostCard({ action, highlighted }: PostCardProps) {
  const [expanded, setExpanded] = useState(false)
  const Icon = PLATFORM_ICONS[action.platform ?? ''] ?? User

  return (
    <div
      className={cn(
        'border-b p-3 transition-colors',
        highlighted && 'bg-accent/50 ring-1 ring-accent'
      )}
    >
      <div className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="font-medium">
          {action.platform === 'twitter' ? '@' : 'u/'}{action.agent_id}
        </span>
        <Badge variant="outline" className="text-xs">R{action.round_num}</Badge>
        <Badge variant="secondary" className="text-xs">{action.action_type}</Badge>
        {action.timestamp && (
          <span className="ml-auto text-xs text-muted-foreground">{action.timestamp}</span>
        )}
      </div>
      {action.content && (
        <p className={cn('mt-1 text-sm', !expanded && 'line-clamp-2')}>
          {action.content}
        </p>
      )}
      {action.content && action.content.length > 140 && !expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="text-xs text-primary hover:underline"
        >
          wiecej...
        </button>
      )}
    </div>
  )
})
```

### Elapsed Time Hook
```typescript
// hooks/useElapsedTime.ts
export function useElapsedTime(startTime: number | null, isRunning: boolean) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime || !isRunning) return
    const tick = () => setElapsed(Math.floor((Date.now() - startTime) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startTime, isRunning])

  return elapsed
}
```

### Entrance Animation (CSS)
```css
/* Subtle slide-in for new posts */
@keyframes slide-in {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.post-enter {
  animation: slide-in 200ms ease-out;
}
```
Can also use Tailwind's `animate-in slide-in-from-top-2` utility if the project has tailwindcss-animate installed (check -- shadcn typically includes it).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| WebSocket for real-time | HTTP polling via TanStack Query | Project decision (Phase 1) | Backend has no WebSocket support; polling is simpler |
| Custom fetch + useState | usePollingQuery wrapper | Phase 4 | Consistent polling with auto-stop |
| Redux for all state | Zustand (persist) + TanStack Query (server) | Project standard | Clear separation: Zustand = UI state, TanStack = server cache |

## Recommendations (Claude's Discretion Items)

| Item | Recommendation | Rationale |
|------|----------------|-----------|
| Column width ratios | `flex-1 / flex-1 / w-72` (equal Twitter+Reddit, fixed 288px timeline) | Timeline is summary-only, needs less width. Equal feeds are balanced. |
| Polling interval | 2500ms for actions, 2000ms for run status, 3000ms for timeline | Staggered to avoid simultaneous requests. Status needs fastest update. |
| Entrance animation | `animate-in slide-in-from-top-2 duration-200` (tailwindcss-animate) | Matches shadcn animation patterns; subtle, not distracting |
| Highlight style | `bg-accent/50 ring-1 ring-accent` with smooth scroll-into-view | Visible but not overwhelming; ring provides clear boundary |
| Empty state | Centered spinner with "Laczenie z symulacja..." text | Simulation is already started from environment page; brief loading state |
| Error handling | Toast on poll failure, stale data remains visible, auto-retry via TanStack Query | TanStack Query retries 3x by default; toast only after all retries fail |
| Responsive (< 1280px) | Timeline collapses to a Sheet (slide-in drawer) with toggle button | Preserves both feeds at full width on narrower screens |
| Timeline event icons | `Swords` (debate), `ArrowUpDown` (stance change), `FileText` (post batch) from Lucide | Clear, distinct, available in lucide-react |

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3 + @testing-library/react 16 |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run --reporter=verbose` |
| Full suite command | `npx vitest run --reporter=verbose` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| SIMU-01 | Progress bar shows round/total, stop button works | unit | `npx vitest run tests/features/simulation/progress-bar.test.tsx -t "progress" --reporter=verbose` | Wave 0 |
| SIMU-01 | Run status hook polls and detects completion | unit | `npx vitest run tests/features/simulation/run-status.test.ts --reporter=verbose` | Wave 0 |
| SIMU-02 | Three-column layout renders Twitter left, Reddit right, Timeline right | unit | `npx vitest run tests/features/simulation/layout.test.tsx --reporter=verbose` | Wave 0 |
| SIMU-03 | PostCard renders agent name, round badge, action type, truncated content | unit | `npx vitest run tests/features/simulation/post-card.test.tsx --reporter=verbose` | Wave 0 |
| SIMU-03 | Actions hook polls and returns platform-filtered data | unit | `npx vitest run tests/features/simulation/actions-hook.test.ts --reporter=verbose` | Wave 0 |
| SIMU-04 | Timeline groups events by round, click filters feeds | unit | `npx vitest run tests/features/simulation/timeline.test.tsx --reporter=verbose` | Wave 0 |
| SIMU-04 | Simulation store manages round filter and highlighted event | unit | `npx vitest run tests/features/simulation/simulation-store.test.ts --reporter=verbose` | Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/features/simulation/ --reporter=verbose`
- **Per wave merge:** `npx vitest run --reporter=verbose`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/features/simulation/progress-bar.test.tsx` -- covers SIMU-01 progress display
- [ ] `tests/features/simulation/run-status.test.ts` -- covers SIMU-01 polling hook
- [ ] `tests/features/simulation/layout.test.tsx` -- covers SIMU-02 three-column layout
- [ ] `tests/features/simulation/post-card.test.tsx` -- covers SIMU-03 post rendering
- [ ] `tests/features/simulation/actions-hook.test.ts` -- covers SIMU-03 polling
- [ ] `tests/features/simulation/timeline.test.tsx` -- covers SIMU-04 timeline
- [ ] `tests/features/simulation/simulation-store.test.ts` -- covers SIMU-04 store state

## Open Questions

1. **Timeline event schema detail**
   - What we know: `TimelineResponseSchema` returns `z.array(z.unknown())` for timeline items
   - What's unclear: Exact shape of individual timeline events (fields for event_type, related_agent_ids, etc.)
   - Recommendation: When implementing, fetch a sample from the backend during development and refine the schema. Start with a loose schema and tighten as real data reveals the structure.

2. **Thread parent-child relationships in Reddit actions**
   - What we know: `ActionSchema` has `agent_id`, `action_type`, `content`, but no explicit `parent_id` or `reply_to` field
   - What's unclear: How replies are linked to parent posts in the API response
   - Recommendation: Check `getPosts()` and `getComments()` responses for parent references. If absent, render Reddit as grouped-by-round flat list with visual nesting by action_type (post -> comment -> reply) rather than true tree threading.

3. **Agent name resolution**
   - What we know: Actions contain `agent_id` (UUID), but display needs agent name
   - What's unclear: Whether actions include agent name or if a separate lookup is needed
   - Recommendation: Fetch profiles once via `getProfiles()` and build a `Map<agent_id, name>` for display. Cache with `staleTime: Infinity` since profiles don't change during simulation.

## Sources

### Primary (HIGH confidence)
- `src/api/simulation.ts` -- Full simulation API with all endpoints verified
- `src/api/schemas/simulation.ts` -- Zod schemas for RunStatus, Action, Timeline
- `src/hooks/usePolling.ts` -- usePollingQuery implementation verified
- `src/features/graph/hooks/useBuildStatus.ts` -- Proven polling pattern
- `src/features/environment/hooks/useEnvironmentStore.ts` -- Zustand store pattern
- `src/features/environment/components/AgentProfileCard.tsx` -- Agent icon/card pattern
- `src/features/environment/pages/EnvironmentPage.tsx` -- Launch flow and navigation to /simulation

### Secondary (MEDIUM confidence)
- `src/app/App.tsx` -- Router structure verified, /simulation route not yet added
- `vitest.config.ts` -- Test configuration verified
- `tests/features/environment/parameter-form.test.tsx` -- Test pattern reference (mocking, RTL usage)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries already installed and used in prior phases
- Architecture: HIGH -- patterns directly follow established Phase 4/5 conventions
- Pitfalls: HIGH -- based on concrete codebase analysis (scroll behavior, polling, thread depth)
- Timeline event schema: LOW -- `z.unknown()` in schema means exact shape unknown until runtime

**Research date:** 2026-03-21
**Valid until:** 2026-04-21 (stable -- all dependencies are project-internal)
