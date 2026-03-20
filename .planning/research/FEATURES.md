# Feature Landscape

**Domain:** AI multi-agent prediction engine frontend (MiroFish)
**Researched:** 2026-03-20

## Table Stakes

Features users expect. Missing = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Seed material upload** | Entry point for the entire prediction workflow — users must be able to upload documents (reports, news, novels) and describe their prediction goal in natural language | Medium | File upload with drag-and-drop, text input for prediction description. Must handle multiple file types. This is step 1 of MiroFish workflow. |
| **Graph construction status** | Users need to see that GraphRAG is processing their input — extracting entities, relationships, building the knowledge graph. Without visibility, users think the system is broken | Medium | Progress indicators, status messages. Backend uses GraphRAG for knowledge extraction. Long-running operation needs clear feedback. |
| **Environment setup display** | After graph construction, users must see extracted entities, relationships, generated characters, and simulation parameters before simulation runs | High | Display entity/relationship data, character profiles with personalities/memories, and simulation config. This is where users verify the system understood their input correctly. |
| **Simulation progress monitoring** | Dual-platform simulation (Twitter-like + Reddit-like) is the core feature. Users must see it running — agent counts, interaction counts, timeline progress | High | Real-time updates via polling or SSE. Dual-platform view showing parallel simulations. Must convey "things are happening" without overwhelming. |
| **Report display with rich formatting** | ReportAgent generates structured prediction reports. Must render markdown with charts, tables, analysis sections. This is the primary output | Medium | Markdown rendering with syntax highlighting, tables, potentially embedded visualizations. The report IS the product output. |
| **Interactive chat with ReportAgent** | Core MiroFish differentiator — users ask follow-up questions about the prediction, request deeper analysis. Without this, it's just a static report generator | High | Streaming chat interface, markdown rendering in responses, conversation history. Must maintain context of the simulation. |
| **Chat with simulated agents** | Users can talk to any agent in the simulated world. This "God's-eye view" interaction is a signature MiroFish feature | High | Agent selection, chat interface per agent, agent personality/memory context displayed. Multiple concurrent conversations possible. |
| **Configuration panel — API keys** | Users need to enter OpenAI-compatible API keys, base URLs, model names without touching config files. Table stakes for any self-hosted AI tool | Medium | Secure input fields, key validation/testing, persistent storage. Support for OpenAI SDK format endpoints. |
| **Configuration panel — model selection** | Users must select which LLM to use (qwen-plus recommended, any OpenAI-compatible). Different users have different model access | Low | Dropdown/input for model name, API base URL configuration. Preset options for common models (qwen-plus, GPT-4, etc.). |
| **i18n — Polish and English** | Core project requirement. Polish as default, English as toggle. Without this, the entire project rationale collapses | Medium | All UI strings externalized from day one. Language switcher in header/settings. RTL not needed (both languages are LTR). |
| **Responsive layout** | Users access from various screen sizes. Desktop-first but must not break on tablets | Low | CSS Grid/Flexbox responsive design. Not mobile-native, but graceful degradation below 1024px. |
| **Error handling and feedback** | AI operations fail frequently (API limits, timeouts, malformed responses). Users must see clear error messages, not blank screens | Medium | Toast notifications, inline errors, retry buttons. Specific error messages for common failures (invalid API key, model unavailable, timeout). |
| **Loading states for all async operations** | Every MiroFish operation is async and potentially long-running. Skeleton screens, spinners, progress bars are mandatory | Low | Consistent loading patterns across all 5 core features. Distinguish between "loading" and "processing" states. |

## Differentiators

Features that set this frontend apart from the original Chinese UI and from generic AI dashboards. Not expected, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Knowledge graph visualization** | Interactive 2D graph showing entities and relationships extracted by GraphRAG. The original UI likely has basic display — a proper interactive graph with zoom, pan, filtering would be a genuine upgrade | High | Use a graph rendering library (e.g., D3.js, Cytoscape.js, or React Flow). Nodes = entities, edges = relationships. Color-code by entity type. Click to inspect. |
| **Dual-platform split view** | Side-by-side view of Twitter-like and Reddit-like simulation platforms. See agent activity on both simultaneously with cross-platform interaction highlighting | High | Split-panel layout showing parallel simulations. Synchronized scrolling optional. Agent posts, comments, debates visible in real-time. |
| **Agent profile cards** | Rich cards showing each simulated agent's personality, memory, stance evolution, and interaction history. Makes the simulation tangible and inspectable | Medium | Card component with avatar, personality traits, memory state, opinion timeline. Clickable to open full profile or start conversation. |
| **Report export (PDF/Markdown)** | Download prediction reports for sharing outside the application. Export as formatted PDF or raw markdown | Medium | Client-side PDF generation from rendered report. Markdown export is trivial (raw source). PDF needs a library like html2pdf or jsPDF. |
| **Simulation parameter tuning** | UI controls for adjusting simulation parameters (agent count, interaction rounds, platform weights) before running. Advanced users want this control | Medium | Form with sliders, number inputs, presets. Validation against backend constraints. "Advanced settings" collapsible section. |
| **Configuration panel — Zep Cloud** | Zep Cloud settings for agent memory persistence. Niche but important for power users who want cross-simulation memory continuity | Low | API key input, cloud URL, connection test button. Most users will use defaults. |
| **Configuration panel — Docker** | Docker deployment settings visible in the UI. Status of containers, restart controls | Medium | Docker status display, basic container management. Useful for self-hosted deployments. May require additional backend endpoints. |
| **Dark mode** | Clean, minimalist design benefits from a dark theme option. Reduces eye strain during long simulation monitoring sessions | Low | CSS custom properties for theming. Toggle in settings. Respect OS preference by default. |
| **Simulation history** | List of past simulations with their reports, parameters, and status. Users want to compare predictions over time | Medium | List view of past runs, with status (running/complete/failed), date, topic. Click to load report. Requires backend support for persistence. |
| **Keyboard shortcuts** | Power users running multiple simulations benefit from keyboard navigation. Chat input focus, simulation start/stop, panel switching | Low | Hotkey map for common actions. Discoverable via ? shortcut or settings panel. |

## Anti-Features

Features to explicitly NOT build. These add complexity without value or actively harm the product.

| Anti-Feature | Why Avoid | What to Do Instead |
|--------------|-----------|-------------------|
| **Drag-and-drop workflow builder** | MiroFish has a fixed 5-step pipeline. A visual workflow builder implies customizable pipelines which the backend does not support. Adds massive complexity for zero value | Present the 5 steps as a clear linear flow (stepper/wizard pattern). Users follow the pipeline, they don't redesign it. |
| **Real-time collaborative editing** | This is a single-user prediction tool. Multi-user collaboration adds WebSocket complexity, conflict resolution, and auth layers that are completely unnecessary | Single-user sessions. If sharing is needed later, share via exported reports. |
| **Custom agent personality editor** | The backend generates agent personalities from seed material via LLM. A custom editor implies the frontend controls personality generation, which it does not | Display generated personalities as read-only cards. Trust the backend's character generation. |
| **Built-in code editor/IDE** | Some AI tools include code editors for prompt engineering or config editing. MiroFish is not a developer tool — it is a prediction tool for domain experts | Use well-designed form inputs for all configuration. Natural language input for prediction requirements. |
| **Analytics dashboard with charts** | Tempting to add usage analytics, prediction accuracy tracking, historical trend charts. But MiroFish generates one-off predictions — there is no persistent dataset to analyze | Focus on the report itself as the analytical output. If users want analytics, they export the report and use their own tools. |
| **Mobile-first responsive design** | The original scope explicitly excludes mobile native. The simulation monitoring and graph visualization features require desktop-class screen real estate | Desktop-first responsive. Ensure nothing breaks on tablet. Accept that phone screens cannot meaningfully display dual-platform simulation views. |
| **User authentication system** | Self-hosted tool. Adding auth (login, registration, password reset, roles) is massive scope creep for a single-user prediction engine | No auth. The tool runs locally or on a private server. API keys in the config panel are the only "credentials." |
| **Plugin/extension system** | Extensibility sounds good but the backend has a fixed architecture. A plugin system in the frontend with nothing to plug into is theater | Build a clean, maintainable codebase. If extensibility is needed, it comes from forking (it is AGPL-3.0 open source). |
| **Notification system (email/push)** | Simulations can take time, but push notifications require a service worker, notification permissions, and potentially an email service. Overkill for a local tool | Use in-browser notifications (simple alert/toast) when simulation completes. User keeps the tab open. |

## Feature Dependencies

```
Seed Material Upload
  --> Graph Construction (requires uploaded material)
    --> Knowledge Graph Visualization (requires constructed graph)
    --> Environment Setup Display (requires extracted entities)
      --> Simulation Parameter Tuning (requires environment to be set up)
        --> Dual-Platform Simulation (requires environment + parameters)
          --> Simulation Progress Monitoring (requires running simulation)
          --> Agent Profile Cards (requires generated agents)
            --> Chat with Simulated Agents (requires agent profiles)
          --> Report Generation (requires completed simulation)
            --> Report Display (requires generated report)
            --> Report Export (requires displayed report)
            --> Chat with ReportAgent (requires generated report context)

Configuration Panel (independent — needed before any workflow)
  --> API Key Setup (must work before anything else)
  --> Model Selection (depends on valid API key)
  --> Zep Cloud Config (independent)
  --> Docker Config (independent)

i18n (cross-cutting — applies to everything)
Dark Mode (cross-cutting — applies to everything)
```

## MVP Recommendation

### Phase 1: Configuration + Core Pipeline (must ship first)

Prioritize:
1. **Configuration panel** (API keys, model selection) — nothing works without this
2. **Seed material upload + prediction input** — workflow entry point
3. **Graph construction status** — visibility into processing
4. **Environment setup display** — verify extraction results
5. **Simulation progress monitoring** — basic status (not dual-platform split view yet)
6. **Report display with markdown** — the primary output
7. **i18n framework** (Polish + English) — core project requirement
8. **Error handling + loading states** — production quality baseline

### Phase 2: Interactive Features

9. **Chat with ReportAgent** — streaming chat, markdown rendering
10. **Chat with simulated agents** — agent selection + chat
11. **Agent profile cards** — make agents inspectable

### Phase 3: Differentiators

12. **Knowledge graph visualization** — interactive entity/relationship graph
13. **Dual-platform split view** — side-by-side simulation monitoring
14. **Simulation parameter tuning** — advanced controls
15. **Report export** (PDF/Markdown)
16. **Simulation history**

### Defer Indefinitely

- Dark mode (nice-to-have, ship if time permits)
- Keyboard shortcuts (power user feature, low priority)
- Docker config panel (most users use CLI for Docker)
- Zep Cloud config (niche, can be env vars initially)

**Rationale:** Phase 1 gets users from "installed" to "got a prediction report." Phase 2 makes the prediction interactive (MiroFish's signature feature). Phase 3 adds polish and differentiation over the original Chinese UI.

## Sources

- [MiroFish GitHub README](https://github.com/666ghj/MiroFish/blob/main/README-EN.md)
- [MiroFish overview — DEV Community](https://dev.to/arshtechpro/mirofish-the-open-source-ai-engine-that-builds-digital-worlds-to-predict-the-future-ki8)
- [MiroFish Medium article on swarm intelligence](https://agentnativedev.medium.com/mirofish-swarm-intelligence-with-1m-agents-that-can-predict-everything-114296323663)
- [Neo4j Knowledge Graph Builder frontend architecture](https://neo4j.com/blog/developer/frontend-architecture-and-integration/)
- [GraphRAG Visualization Guide — Microsoft](https://microsoft.github.io/graphrag/visualization_guide/)
- [GraphRAG Local UI — GitHub](https://github.com/severian42/GraphRAG-Local-UI)
- [Chrome best practices for rendering LLM responses](https://developer.chrome.com/docs/ai/render-llm-responses)
- [assistant-ui — React library for AI chat](https://github.com/assistant-ui/assistant-ui)
- [AI Dashboard Design Guide — Eleken](https://www.eleken.co/blog-posts/ai-dashboard-design)
- [UX Best Practices for AI/ML Dashboards — The Finch Design](https://thefinch.design/ux-best-practices-ai-ml-data-visualization-dashboards/)
- [Predictive Analytics Dashboard Guide — Accio Analytics](https://accioanalytics.io/insights/ultimate-guide-to-customizable-predictive-analytics-dashboards/)
- [AI Agent Observability Tools 2026 — AIM Research](https://research.aimultiple.com/agentic-monitoring/)
