# Phase 8: Interactive Dialogue - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can have conversations with the ReportAgent about prediction reports and with individual simulated agents from the simulation. Chat renders markdown responses, shows agent context (personality, memory, stance), and supports agent switching. This is pipeline stage 5.

</domain>

<decisions>
## Implementation Decisions

### Chat layout
- Split screen: chat messages on the left, agent profile panel on the right
- Chat messages in bubble style: user messages aligned right (accent color), agent messages aligned left (gray/muted)
- Markdown rendered inside bubbles via react-markdown + remark-gfm (already installed from Phase 7)
- Text input field at bottom with send button

### Agent selection
- Dropdown/select at the top of the chat page: "Rozmowa z: [▼ ReportAgent]"
- ReportAgent is the default selection
- Below separator: list of simulated agents with names from profiles
- Switching agent clears the chat history — each conversation is independent
- Agent profiles loaded from `simulationApi.getProfiles()`

### Conversation flow
- No streaming — API returns full response (not SSE/WebSocket)
- Typing indicator ("...") shown while waiting for response, then full answer appears at once
- Chat history maintained in local state (not persisted)
- For ReportAgent: uses `reportApi.chat()` with `chat_history` param
- For simulated agents: uses `simulationApi.interview()` with `agent_id` param
- Sources displayed below agent response if API returns `sources` array — "Na podstawie:" section with source list
- Tool calls from API displayed as collapsible section if present

### Agent context panel (right side)
- For simulated agents: shows personality, stance, platform (Twitter/Reddit icon), and memory state
- Personality: text from ProfileSchema.personality
- Stance: text from ProfileSchema.stance
- Platform: badge with platform icon
- Memory: agent's memory state from Zep (may need additional API call or display from cached profile data)
- For ReportAgent: simplified profile — fixed description "Asystent raportu predykcji. Odpowiada na pytania o wyniki symulacji i analizę.", special icon, no personality/stance/memory sections

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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Chat API (ReportAgent)
- `src/api/report.ts` — `reportApi.chat(params)` with simulation_id, message, chat_history
- `src/api/schemas/report.ts` — ChatResponseSchema: response (string), tool_calls (optional), sources (optional)

### Interview API (Simulated Agents)
- `src/api/simulation.ts` — `simulationApi.interview(params)` with simulation_id, agent_id, prompt, platform, timeout
- `src/api/simulation.ts` — `simulationApi.interviewHistory(params)` for past interviews
- `src/api/simulation.ts` — `simulationApi.getProfiles(simId)` for agent list
- `src/api/schemas/simulation.ts` — InterviewResponseSchema, ProfileSchema (agent_id, name, personality, stance, platform)

### Existing Patterns
- `src/features/reports/components/ReportArticle.tsx` — react-markdown + remark-gfm rendering pattern (reuse for chat bubbles)
- `src/features/environment/components/AgentProfileCard.tsx` — Agent profile display pattern with Lucide icons
- `src/components/ui/select.tsx` — shadcn Select for agent dropdown
- `src/components/shared/` — LoadingSkeleton, ErrorAlert

### Design System
- `.planning/phases/02-app-shell-and-cross-cutting-concerns/02-UI-SPEC.md` — Design tokens

### Requirements
- `.planning/REQUIREMENTS.md` — CHAT-01..04 requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/api/report.ts` — Chat API already typed
- `src/api/simulation.ts` — Interview API already typed
- react-markdown + remark-gfm already installed (Phase 7)
- `src/components/ui/select.tsx` — Agent dropdown
- `src/components/ui/scroll-area.tsx` — Chat message scroll area
- `src/components/ui/badge.tsx` — Platform badges

### Established Patterns
- Feature-based directory: create `src/features/chat/`
- i18n: add "chat" namespace
- TanStack Query for profile fetching
- useMutation for sending messages (not useQuery — chat is write-then-read)

### Integration Points
- `src/app/App.tsx` — Add /chat route (or /chat/:simulationId)
- Pipeline stepper needs active state for dialogue stage
- Simulation store provides simulation_id
- Report check determines if ReportAgent is available

</code_context>

<specifics>
## Specific Ideas

- Split screen with profile gives context about who you're talking to — crucial for understanding agent perspective
- Bubble style makes conversation flow intuitive — familiar from messaging apps
- Dropdown at top keeps agent switching accessible without cluttering the chat
- Sources section adds transparency — users see what data backs the agent's response
- ReportAgent simplified profile avoids confusion — it's clearly a system tool, not a simulated person

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 08-interactive-dialogue*
*Context gathered: 2026-03-23*
