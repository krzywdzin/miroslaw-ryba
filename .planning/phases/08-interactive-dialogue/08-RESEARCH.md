# Phase 8: Interactive Dialogue - Research

**Researched:** 2026-03-23
**Domain:** Chat UI with split-panel layout, markdown rendering, agent selection
**Confidence:** HIGH

## Summary

Phase 8 implements a chat interface where users converse with the ReportAgent (about prediction reports) or individual simulated agents. The architecture is straightforward: a split-screen layout with chat bubbles on the left and an agent context panel on the right. No streaming is needed -- the API returns complete responses. All required libraries (react-markdown, remark-gfm, shadcn Select, ScrollArea) are already installed.

The core challenge is managing chat state (message history, selected agent, loading states) and wiring two distinct API endpoints (`reportApi.chat()` for ReportAgent, `simulationApi.interview()` for simulated agents) behind a unified chat interface. The existing codebase patterns (useMutation for write operations, TanStack Query for data fetching, feature-based directories, i18n namespaces) map directly to this feature.

**Primary recommendation:** Build a `useChatSession` hook that wraps `useMutation` for sending messages and manages local message history. Use the existing `Select` + `SelectSeparator` components for agent switching, and reuse the `react-markdown` + `remark-gfm` pattern from `ReportArticle.tsx` for rendering responses inside chat bubbles.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Split screen: chat messages on the left, agent profile panel on the right
- Chat messages in bubble style: user messages aligned right (accent color), agent messages aligned left (gray/muted)
- Markdown rendered inside bubbles via react-markdown + remark-gfm (already installed from Phase 7)
- Text input field at bottom with send button
- Dropdown/select at the top of the chat page: "Rozmowa z: [ReportAgent]"
- ReportAgent is the default selection
- Below separator: list of simulated agents with names from profiles
- Switching agent clears the chat history -- each conversation is independent
- Agent profiles loaded from `simulationApi.getProfiles()`
- No streaming -- API returns full response (not SSE/WebSocket)
- Typing indicator ("...") shown while waiting for response, then full answer appears at once
- Chat history maintained in local state (not persisted)
- For ReportAgent: uses `reportApi.chat()` with `chat_history` param
- For simulated agents: uses `simulationApi.interview()` with `agent_id` param
- Sources displayed below agent response if API returns `sources` array -- "Na podstawie:" section with source list
- Tool calls from API displayed as collapsible section if present
- For simulated agents: shows personality, stance, platform (Twitter/Reddit icon), and memory state
- For ReportAgent: simplified profile -- fixed description, special icon, no personality/stance/memory sections

### Claude's Discretion
- Bubble styling details (border radius, padding, max-width)
- Typing indicator animation style
- How to handle long responses (scrolling behavior)
- Error handling for failed API calls during chat
- Empty state before first message
- Whether to show timestamps on messages
- Profile panel responsive behavior on narrow screens
- How memory state is fetched and displayed (may need runtime API discovery)
- Source display formatting
- Input field multiline/single-line behavior

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| CHAT-01 | User can have streaming chat conversation with ReportAgent about the prediction | `reportApi.chat()` already typed with ChatResponseSchema; use useMutation pattern from useReportGeneration.ts; "streaming" requirement adjusted to full-response per CONTEXT.md decision |
| CHAT-02 | User can select and chat with any simulated agent in the world | `simulationApi.interview()` and `simulationApi.getProfiles()` already typed; Select component with SelectSeparator for grouped dropdown |
| CHAT-03 | Chat displays agent personality/memory context alongside conversation | ProfileSchema has agent_id, name, personality, stance, platform; right-side panel reuses AgentProfileCard pattern |
| CHAT-04 | Chat renders markdown in responses with proper formatting | react-markdown + remark-gfm already installed; ReportArticle.tsx provides exact rendering pattern to reuse |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-markdown | 10.1.0 | Markdown rendering in chat bubbles | Already installed, used in Phase 7 ReportArticle |
| remark-gfm | 4.0.1 | GFM tables/strikethrough support | Already installed, paired with react-markdown |
| @tanstack/react-query | 5.91.0 | Profile fetching, query caching | Already used throughout project |
| zustand | 5.0.0 | NOT needed -- chat state is local to component | Chat history not persisted per CONTEXT.md |
| @radix-ui/react-select | 2.2.6 | Agent dropdown | Already installed as shadcn Select |
| @radix-ui/react-scroll-area | 1.2.10 | Chat message scroll | Already installed as shadcn ScrollArea |
| @radix-ui/react-collapsible | 1.1.12 | Tool calls collapsible section | Already installed as shadcn Collapsible |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | 0.577.0 | Icons (Send, Bot, User, Bird, MessageCircle) | Agent icons, send button, platform badges |
| react-i18next | 16.5.8 | Chat namespace translations | All UI strings |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Local useState for chat | Zustand store | Overkill -- history not persisted, cleared on agent switch |
| Custom scroll | ScrollArea | ScrollArea already available, handles overflow properly |
| Textarea for input | Input | Textarea allows multiline; either works, textarea is better UX for chat |

**Installation:**
```bash
# No new packages needed -- all dependencies already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/features/chat/
├── index.ts                  # Public exports: ChatPage
├── pages/
│   └── ChatPage.tsx          # Route component with simulationId param
├── components/
│   ├── ChatLayout.tsx        # Split-panel container (left: chat, right: profile)
│   ├── AgentSelector.tsx     # Select dropdown with ReportAgent + simulated agents
│   ├── MessageList.tsx       # ScrollArea with chat bubbles
│   ├── ChatBubble.tsx        # Single message bubble (user vs agent styling)
│   ├── ChatInput.tsx         # Text input + send button at bottom
│   ├── AgentContextPanel.tsx # Right panel: profile info for selected agent
│   ├── TypingIndicator.tsx   # Animated dots while waiting for response
│   ├── SourcesList.tsx       # "Na podstawie:" section below agent response
│   └── ToolCallsSection.tsx  # Collapsible tool calls display
└── hooks/
    └── useChatSession.ts     # Chat state + send mutation logic
```

### Pattern 1: useChatSession Hook
**What:** Custom hook managing message array, selected agent, and send mutation
**When to use:** Single hook consumed by ChatPage, encapsulates all chat logic
**Example:**
```typescript
// Source: Project patterns (useReportGeneration.ts + useMutation)
interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  sources?: unknown[]
  toolCalls?: unknown[]
  timestamp: number
}

type AgentTarget =
  | { type: 'report' }
  | { type: 'simulated'; agentId: string; platform?: string }

function useChatSession(simulationId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [target, setTarget] = useState<AgentTarget>({ type: 'report' })

  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      if (target.type === 'report') {
        return reportApi.chat({
          simulation_id: simulationId,
          message,
          chat_history: messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.content,
          })),
        })
      } else {
        return simulationApi.interview({
          simulation_id: simulationId,
          agent_id: target.agentId,
          prompt: message,
          platform: target.platform,
        })
      }
    },
    onSuccess: (data) => {
      // Extract response string from either API shape
      // Append agent message to messages array
    },
  })

  const switchAgent = (newTarget: AgentTarget) => {
    setTarget(newTarget)
    setMessages([]) // Clear history on agent switch
  }

  return { messages, target, sendMutation, switchAgent, isLoading: sendMutation.isPending }
}
```

### Pattern 2: Unified Response Extraction
**What:** Both APIs return different shapes -- normalize to common ChatMessage format
**When to use:** In useChatSession onSuccess handler
**Example:**
```typescript
// ChatResponseSchema: { data: { response: string, tool_calls?: unknown[], sources?: unknown[] } }
// InterviewResponseSchema: { data: { agent_id: string, prompt: string, result: unknown } }

function extractResponse(data: unknown, target: AgentTarget): Partial<ChatMessage> {
  if (target.type === 'report') {
    const chatData = (data as { data: { response: string; tool_calls?: unknown[]; sources?: unknown[] } }).data
    return {
      content: chatData.response,
      sources: chatData.sources,
      toolCalls: chatData.tool_calls,
    }
  } else {
    const interviewData = (data as { data: { result: unknown } }).data
    // result is unknown -- likely a string or { response: string }
    const content = typeof interviewData.result === 'string'
      ? interviewData.result
      : JSON.stringify(interviewData.result)
    return { content }
  }
}
```

### Pattern 3: Chat Bubble Markdown (reuse ReportArticle pattern)
**What:** Render markdown inside chat bubbles with constrained prose styling
**When to use:** Agent messages with markdown content
**Example:**
```typescript
// Source: src/features/reports/components/ReportArticle.tsx
<div className={cn(
  'max-w-[80%] rounded-2xl px-4 py-3',
  isUser
    ? 'ml-auto bg-primary text-primary-foreground'
    : 'mr-auto bg-muted'
)}>
  {isUser ? (
    <p className="text-sm">{message.content}</p>
  ) : (
    <div className="prose prose-sm prose-slate max-w-none">
      <Markdown remarkPlugins={[remarkGfm]}>
        {message.content}
      </Markdown>
    </div>
  )}
</div>
```

### Pattern 4: Agent Selector with Groups
**What:** Select dropdown separating ReportAgent from simulated agents
**When to use:** Top of chat page
**Example:**
```typescript
// Source: src/components/ui/select.tsx (shadcn Select with SelectSeparator)
<Select value={selectedAgentId} onValueChange={handleAgentChange}>
  <SelectTrigger>
    <SelectValue placeholder={t('chat.selectAgent')} />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>{t('chat.systemAgents')}</SelectLabel>
      <SelectItem value="report-agent">{t('chat.reportAgent')}</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>{t('chat.simulatedAgents')}</SelectLabel>
      {profiles.map(p => (
        <SelectItem key={p.agent_id} value={p.agent_id}>{p.name}</SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
</Select>
```

### Anti-Patterns to Avoid
- **Using useQuery for sending messages:** Chat sends are mutations (side effects), not queries. Use useMutation.
- **Persisting chat history in Zustand:** CONTEXT.md explicitly says local state, not persisted. useState is sufficient.
- **Building custom scrolling:** Use the existing ScrollArea component. Add a ref to scroll to bottom on new messages.
- **Separate pages for ReportAgent vs simulated agents:** Single ChatPage with agent selector dropdown keeps UX unified.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown rendering | Custom parser | react-markdown + remark-gfm | Already installed, handles edge cases |
| Select dropdown | Custom dropdown | shadcn Select with groups | Accessible, styled, supports separators |
| Scroll container | div with overflow | ScrollArea (Radix) | Handles keyboard nav, custom scrollbar styling |
| Collapsible sections | Custom toggle | shadcn Collapsible | Accessible, animated, already installed |
| Loading dots animation | Custom JS timer | CSS animation with keyframes | Simpler, no re-renders |

**Key insight:** Every UI primitive needed for this phase is already installed. No new dependencies required.

## Common Pitfalls

### Pitfall 1: Scroll to Bottom on New Message
**What goes wrong:** Chat doesn't auto-scroll when new messages arrive, user has to manually scroll
**Why it happens:** ScrollArea viewport ref not properly targeted
**How to avoid:** Use a ref on a div at the bottom of the message list, call `scrollIntoView({ behavior: 'smooth' })` after message array updates via useEffect
**Warning signs:** Messages appear below the fold during conversation

### Pitfall 2: Race Condition on Agent Switch
**What goes wrong:** Response from previous agent arrives after switching, appears in wrong conversation
**Why it happens:** useMutation doesn't auto-cancel on state change
**How to avoid:** Check current target in onSuccess before appending message, or reset mutation state when switching agents
**Warning signs:** Messages from wrong agent appearing in conversation

### Pitfall 3: Chat History Format Mismatch
**What goes wrong:** ReportAgent API expects `chat_history` in specific format (role/content pairs), sending wrong shape causes errors
**Why it happens:** Internal message format differs from API format
**How to avoid:** Transform messages to API format in mutationFn, not in state. Keep internal format rich (with id, timestamp, sources) and serialize only what the API needs
**Warning signs:** 400/422 errors from backend on second message

### Pitfall 4: Interview Response Shape Unknown
**What goes wrong:** `InterviewResponseSchema` has `result: z.unknown()` -- runtime type varies
**Why it happens:** Backend may return string, object, or nested structure
**How to avoid:** Handle result defensively: check if string, if object with `response` key, fallback to JSON.stringify. Log actual shape during development to refine handling
**Warning signs:** "[object Object]" appearing in chat bubbles

### Pitfall 5: Empty Profile List
**What goes wrong:** If simulation has no profiles yet, simulated agent list is empty, only ReportAgent available
**Why it happens:** Profile generation happens in Phase 5, but user might navigate to chat before profiles exist
**How to avoid:** Disable simulated agents section in dropdown when profiles query returns empty array; show helpful message
**Warning signs:** Empty dropdown group, confusing UX

## Code Examples

### Auto-Scroll on New Messages
```typescript
// Scroll ref pattern used across the project
const scrollEndRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages.length])

// In JSX, inside ScrollArea:
<ScrollArea className="flex-1">
  <div className="flex flex-col gap-3 p-4">
    {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
    <div ref={scrollEndRef} />
  </div>
</ScrollArea>
```

### Typing Indicator with CSS Animation
```typescript
// Pure CSS approach -- no state/timer needed
function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 rounded-2xl bg-muted mr-auto max-w-[80px]">
      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0ms]" />
      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:150ms]" />
      <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:300ms]" />
    </div>
  )
}
```

### Error Handling in Chat
```typescript
// Inline error message within the chat flow
const sendMutation = useMutation({
  // ...mutationFn
  onError: (error) => {
    const errorMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'agent',
      content: '', // Empty -- rendered as error, not markdown
      timestamp: Date.now(),
    }
    setMessages(prev => [...prev, errorMessage])
    // Show toast via sonner for the actual error
    toast.error(t('chat.sendError'))
  },
})
```

### i18n Namespace Structure
```json
// src/locales/pl/chat.json
{
  "title": "Rozmowa",
  "selectAgent": "Rozmowa z:",
  "systemAgents": "Asystent",
  "reportAgent": "ReportAgent",
  "simulatedAgents": "Agenci symulacji",
  "inputPlaceholder": "Napisz wiadomosc...",
  "send": "Wyslij",
  "sendError": "Nie udalo sie wyslac wiadomosci",
  "emptyState": "Rozpocznij rozmowe z wybranym agentem",
  "emptyStateHint": "Zadaj pytanie o raport predykcji lub porozmawiaj z agentem symulacji",
  "sources": "Na podstawie:",
  "toolCalls": "Wywolania narzedzi",
  "reportAgentDescription": "Asystent raportu predykcji. Odpowiada na pytania o wyniki symulacji i analize.",
  "personality": "Osobowosc",
  "stance": "Stanowisko",
  "platform": "Platforma",
  "memory": "Pamiec"
}
```

### Route Integration
```typescript
// src/app/App.tsx -- add chat route
import { ChatPage } from '@/features/chat'

// In router children:
{ path: 'chat/:simulationId', element: <ChatPage /> }
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| WebSocket/SSE for chat | Full response via POST | CONTEXT.md decision | Simpler implementation, no streaming infra needed |
| Persistent chat history | Local state only | CONTEXT.md decision | No Zustand store needed, useState is sufficient |
| Separate chat pages per agent type | Unified page with dropdown | CONTEXT.md decision | Single component tree, agent-agnostic chat UI |

## Open Questions

1. **InterviewResponseSchema `result` type**
   - What we know: Defined as `z.unknown()` -- the actual runtime shape is unspecified
   - What's unclear: Whether result is a plain string, `{ response: string }`, or something else
   - Recommendation: Implement defensive extraction (check string first, then object.response, fallback to JSON.stringify). Can be refined once actual API response is observed.

2. **Memory state display for simulated agents**
   - What we know: CONTEXT.md mentions showing "memory state from Zep" in the agent panel
   - What's unclear: Whether this data is included in `ProfileSchema` (it's not -- only agent_id, name, personality, stance, platform) or requires a separate API call
   - Recommendation: Display what ProfileSchema provides (personality, stance, platform). Add a placeholder/note for memory if no API endpoint is readily available. Memory display can be a stretch goal within this phase.

3. **Chat timeout for interview requests**
   - What we know: `simulationApi.interview()` accepts an optional `timeout` parameter
   - What's unclear: What appropriate timeout value is for agent interviews (LLM response can be slow)
   - Recommendation: Use a generous timeout (60s or omit to use backend default). Show typing indicator during the wait.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3.x + @testing-library/react 16.x |
| Config file | `vitest.config.ts` |
| Quick run command | `npx vitest run tests/features/chat/ --reporter=verbose` |
| Full suite command | `npx vitest run` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CHAT-01 | Send message to ReportAgent, receive response, display in bubbles | unit | `npx vitest run tests/features/chat/chat-session.test.ts -x` | No -- Wave 0 |
| CHAT-02 | Select simulated agent from dropdown, send message via interview API | unit | `npx vitest run tests/features/chat/agent-selector.test.tsx -x` | No -- Wave 0 |
| CHAT-03 | Agent context panel shows personality/stance/platform for selected agent | unit | `npx vitest run tests/features/chat/agent-panel.test.tsx -x` | No -- Wave 0 |
| CHAT-04 | Markdown rendered in agent response bubbles | unit | `npx vitest run tests/features/chat/chat-bubble.test.tsx -x` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run tests/features/chat/ --reporter=verbose`
- **Per wave merge:** `npx vitest run`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `tests/features/chat/chat-session.test.ts` -- covers CHAT-01 (useChatSession hook: send, receive, history)
- [ ] `tests/features/chat/agent-selector.test.tsx` -- covers CHAT-02 (agent dropdown rendering, switch clears history)
- [ ] `tests/features/chat/agent-panel.test.tsx` -- covers CHAT-03 (profile display for simulated vs ReportAgent)
- [ ] `tests/features/chat/chat-bubble.test.tsx` -- covers CHAT-04 (markdown rendering, user vs agent styling)

## Sources

### Primary (HIGH confidence)
- `src/api/report.ts` -- reportApi.chat() signature and ChatResponseSchema
- `src/api/simulation.ts` -- simulationApi.interview() and getProfiles() signatures
- `src/api/schemas/report.ts` -- ChatResponseSchema shape (response, tool_calls, sources)
- `src/api/schemas/simulation.ts` -- InterviewResponseSchema and ProfileSchema shapes
- `src/features/reports/components/ReportArticle.tsx` -- react-markdown + remark-gfm rendering pattern
- `src/features/environment/components/AgentProfileCard.tsx` -- Agent profile display pattern
- `src/components/ui/select.tsx` -- shadcn Select with groups and separator
- `src/components/ui/scroll-area.tsx` -- ScrollArea component
- `src/features/reports/hooks/useReportGeneration.ts` -- useMutation pattern in project
- `package.json` -- All required dependencies already installed

### Secondary (MEDIUM confidence)
- `.planning/phases/08-interactive-dialogue/08-CONTEXT.md` -- User decisions and architectural constraints

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already installed and used in prior phases
- Architecture: HIGH - Follows established feature-based patterns, APIs already typed
- Pitfalls: MEDIUM - InterviewResponse shape is unknown at schema level, memory data availability uncertain

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (stable -- no external dependencies to change)
