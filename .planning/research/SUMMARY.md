# Project Research Summary

**Project:** Miroslaw Ryba (Polish frontend for MiroFish)
**Domain:** AI multi-agent prediction engine dashboard (SPA connecting to Python backend)
**Researched:** 2026-03-20
**Confidence:** HIGH

## Executive Summary

Miroslaw Ryba is a greenfield React SPA that replaces MiroFish's Chinese Vue frontend. The application is a pipeline-driven dashboard -- not a CRUD app -- with a strict 5-stage sequential workflow: Graph Construction, Environment Setup, Dual-Platform Simulation, Report Generation, and Interactive Dialogue. Each stage depends on the previous stage's output. The recommended stack is Vite 8 + React 19 + TypeScript, with Zustand for client state, TanStack Query for server state/polling, shadcn/ui for components, and react-i18next for Polish/English i18n. This stack is mature, well-documented, and every library has first-class React 19 support. No SSR is needed; the backend is a separate Python Flask server.

The single most important architectural decision is modeling the 5-stage pipeline as an explicit finite state machine. The backend itself uses state files per entity, and the frontend must mirror this sequential flow. All real-time updates use HTTP polling (not WebSocket) -- the backend has no WebSocket server. TanStack Query's `refetchInterval` with structural sharing handles polling cleanly without causing React re-render cascades. The config panel stores settings in localStorage and passes them to the backend per-request.

The highest risk is building against incorrect API assumptions. No OpenAPI spec exists; the Flask backend has ~28+ endpoints across 5 blueprints, with Chinese error messages, undocumented edge cases, and subprocess-based simulation that can crash or hang. Mitigation requires running the real backend from day one, capturing all API calls via HAR files, and building a typed API client layer before any UI work. Secondary risks include Polish i18n complexity (4 plural forms, 20-30% longer strings) and polling performance during simulation with hundreds of agents.

## Key Findings

### Recommended Stack

The stack optimizes for a single-user dashboard SPA that connects to an unmodified Python backend. Every choice prioritizes simplicity, small bundle size, and React ecosystem maturity over cutting-edge alternatives.

**Core technologies:**
- **Vite 8** (build tool) -- Rolldown-based Rust bundler, 10-30x faster builds; no SSR overhead unlike Next.js
- **React 19 + TypeScript 5.7** (framework) -- largest ecosystem, all libraries have first-class support
- **React Router 7** (routing) -- library/SPA mode; ~10 routes, no need for TanStack Router complexity
- **Zustand 5** (client state) -- 3KB, zero boilerplate, centralized store fits dashboard patterns
- **TanStack Query 5** (server state) -- automatic caching, polling, retry; eliminates manual loading/error state
- **shadcn/ui + Tailwind CSS 4** (components/styling) -- unstyled Radix primitives, minimalist by default
- **react-i18next + i18next** (i18n) -- handles Polish plural forms natively, namespace-based lazy loading
- **React Hook Form + Zod 4** (forms/validation) -- minimal re-renders for complex config panel forms
- **Recharts 3** (charts) -- declarative SVG charts for simulation metrics
- **Reagraph 4** (graph visualization) -- WebGL-based, React-native graph rendering for GraphRAG output (MEDIUM confidence; fallback to react-force-graph-2d if insufficient)
- **Native WebSocket hook** (real-time) -- custom ~50-line hook; backend uses plain WebSocket, not Socket.IO

### Expected Features

**Must have (table stakes):**
- Seed material upload with drag-and-drop
- Graph construction status with progress indicators
- Environment setup display (entities, relationships, agent profiles)
- Simulation progress monitoring (agent counts, rounds, timeline)
- Report display with rich markdown rendering
- Interactive chat with ReportAgent (streaming, markdown)
- Chat with simulated agents (agent selection, personality context)
- Configuration panel (API keys, model selection)
- i18n -- Polish default + English toggle
- Error handling with clear messages and retry buttons
- Loading states for all async operations

**Should have (differentiators):**
- Knowledge graph visualization (interactive 2D graph with zoom/pan)
- Dual-platform split view (Twitter + Reddit side-by-side)
- Agent profile cards (personality, memory, stance evolution)
- Report export (PDF/Markdown)
- Simulation parameter tuning UI
- Simulation history browser
- Dark mode

**Defer (v2+):**
- Keyboard shortcuts
- Docker config panel (use CLI)
- Zep Cloud config panel (use env vars initially)

**Anti-features (explicitly do not build):**
- Drag-and-drop workflow builder (backend has fixed pipeline)
- Multi-user collaboration (single-user tool)
- Custom agent personality editor (backend generates these)
- User authentication (self-hosted, no auth needed)
- Plugin/extension system

### Architecture Approach

The frontend is a pipeline-driven dashboard with a finite state machine at its core. The state machine tracks 10+ states from IDLE through INTERACTION, carrying context (project_id, simulation_id, report_id) at each transition. Navigation is derived from state -- users cannot skip stages. Three separate state layers prevent coupling: TanStack Query for server state, the pipeline state machine for stage progression, and Zustand for client preferences. All backend communication goes through a typed API client layer that mirrors the Flask blueprints.

**Major components:**
1. **Pipeline State Machine** -- enforces sequential 5-stage flow, carries entity IDs, controls route access
2. **Pipeline Stage Views (5)** -- one view per MiroFish stage, thin orchestrators composing smaller components
3. **API Client Layer** -- typed modules mirroring backend blueprints (graph, simulation, report, ipc)
4. **Polling Manager** -- TanStack Query hooks with conditional refetchInterval, structural sharing
5. **Config Panel** -- modal/drawer for all settings, persists to localStorage, validates against backend
6. **Chat Interface** -- reusable component for ReportAgent chat and agent interviews
7. **Graph Visualization** -- Reagraph-based knowledge graph renderer
8. **i18n Layer** -- ICU MessageFormat for Polish pluralization, namespace-based lazy loading
9. **Shared Layout** -- app shell with stepper sidebar, header, content area

### Critical Pitfalls

1. **Assuming API behavior from Vue source code** -- No OpenAPI spec exists. Run the backend, capture HAR files, build typed contracts before any UI work. This gates everything.
2. **Polling performance death spiral** -- 3 endpoints polled every second during simulation causes re-render cascades. Use TanStack Query structural sharing, memoize aggressively, virtualize agent lists, pause polling on hidden tabs.
3. **Polish i18n treated as simple string replacement** -- Polish has 4 plural forms and 20-30% longer strings. Use ICU MessageFormat from day one, design with 30% text expansion headroom, test with Polish strings immediately.
4. **Building without a running backend** -- The backend has a strict 5-stage workflow with file system dependencies and state machine constraints. Mocking all this is harder than running it. Backend must be running on day one.
5. **Chinese error messages leaking to users** -- Build an error mapping layer in the API client. Intercept and translate known Chinese error strings to Polish/English.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 0: Backend Setup and API Discovery
**Rationale:** Pitfalls 1 and 4 are the highest-risk items and must be addressed before any frontend code. Every subsequent phase depends on accurate API knowledge.
**Delivers:** Running MiroFish backend in Docker, HAR captures of all API calls, typed API contracts, development environment documentation.
**Addresses:** Development prerequisites, API key setup (Alibaba Bailian free tier for qwen-plus).
**Avoids:** Pitfall 1 (stale API assumptions), Pitfall 4 (building without backend), Pitfall 10 (port conflicts).

### Phase 1: Project Foundation
**Rationale:** i18n architecture, state management patterns, and API client shape must be established before any feature work. Polish i18n is especially hard to retrofit.
**Delivers:** Vite + React + TypeScript scaffold, i18n with ICU MessageFormat (Polish + English), API client layer with error mapping, app shell with stepper sidebar, pipeline state machine, AGPL-3.0 compliance setup.
**Addresses:** i18n framework, error handling foundation, AGPL compliance, responsive layout shell.
**Avoids:** Pitfall 3 (i18n as string replacement), Pitfall 6 (AGPL gaps), Pitfall 8 (Chinese errors).

### Phase 2: Core Pipeline (Stages 1-2)
**Rationale:** Stage 1 (Graph Construction) is the simplest stage and validates the entire pipeline pattern (upload, poll, display results). Stage 2 (Environment Setup) adds form handling and agent profile display. Together they prove the architecture works end-to-end.
**Delivers:** File upload with drag-and-drop, graph construction polling, environment setup form, agent profile display, config panel (API keys + model selection -- required for anything to work).
**Addresses:** Seed material upload, graph construction status, environment setup display, configuration panel.
**Avoids:** Pitfall 11 (forgotten file upload), Pitfall 7 (config state explosion).

### Phase 3: Simulation and Monitoring (Stage 3)
**Rationale:** This is the most complex stage with real-time polling, dual-platform display, and agent activity timeline. It needs dedicated focus and is where polling performance matters most.
**Delivers:** Simulation start/stop, progress monitoring, agent activity display, basic simulation timeline. Dual-platform split view as a stretch goal.
**Addresses:** Simulation progress monitoring, simulation parameter tuning.
**Avoids:** Pitfall 2 (polling performance), Pitfall 9 (subprocess lifecycle blind spots).

### Phase 4: Report and Interaction (Stages 4-5)
**Rationale:** These stages consume what Stages 1-3 produce. Report display needs markdown rendering; the chat interfaces need streaming support. A reusable chat component serves both ReportAgent chat and agent interviews.
**Delivers:** Report generation with progress, markdown report display, ReportAgent chat, agent interview panel.
**Addresses:** Report display, chat with ReportAgent, chat with simulated agents.
**Avoids:** Pitfall 12 (forgetting IPC/agent interview feature).

### Phase 5: Visualization and Differentiators
**Rationale:** Knowledge graph visualization and advanced features differentiate this from the original Chinese UI but are not on the critical path. Reagraph integration may need experimentation.
**Delivers:** Interactive knowledge graph visualization, agent profile cards, report export (PDF/Markdown), simulation history, dark mode.
**Addresses:** Knowledge graph visualization, agent profile cards, report export, simulation history, dark mode.

### Phase 6: Polish and Release
**Rationale:** Production quality pass, documentation, and open-source release preparation.
**Delivers:** Comprehensive error handling refinement, accessibility audit, performance optimization (virtualized lists, lazy loading), bilingual documentation (PL + EN), Docker Compose integration for frontend service.
**Addresses:** Production-grade quality, bilingual documentation, Docker deployment.

### Phase Ordering Rationale

- **Phase 0 before everything:** API discovery is the single highest-risk activity. All other phases build on accurate API knowledge.
- **Phase 1 before features:** i18n and state management patterns are cross-cutting. Retrofitting ICU MessageFormat or changing state architecture later is expensive.
- **Phases 2-4 follow the pipeline order:** Building features in the same 5-stage order as the backend workflow ensures each stage is tested end-to-end before the next begins.
- **Phase 5 after core pipeline:** Visualization and differentiators are valuable but optional. The core pipeline (Phases 2-4) delivers a complete, usable product.
- **Phase 6 last:** Polish and documentation come after features are stable.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 0:** Needs hands-on API discovery -- no documentation exists. Run every endpoint, document every response shape.
- **Phase 3:** Simulation polling performance and dual-platform display are complex. May need research into virtualization strategies and adaptive polling.
- **Phase 5:** Reagraph is MEDIUM confidence. May need to evaluate alternatives (react-force-graph-2d, @react-sigma/core) against actual GraphRAG output.

Phases with standard patterns (skip research-phase):
- **Phase 1:** Project scaffolding, i18n setup, and state management are well-documented patterns.
- **Phase 2:** File upload, forms, and config panels are standard React patterns.
- **Phase 4:** Markdown rendering and chat interfaces are well-documented.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | All libraries verified at current npm versions; mature ecosystem with extensive documentation |
| Features | HIGH | Feature list derived from MiroFish README, source code analysis, and multiple secondary sources |
| Architecture | HIGH | Architecture derived from actual backend source code analysis (DeepWiki, GitHub); state machine pattern matches backend's own state management |
| Pitfalls | HIGH | Pitfalls sourced from backend code analysis, domain-specific guides, and known React integration challenges |

**Overall confidence:** HIGH

### Gaps to Address

- **Backend API response shapes:** No OpenAPI spec. Exact response types must be captured from a running backend during Phase 0. This is a known gap with a clear mitigation plan.
- **Config panel backend integration:** Unclear whether the backend accepts config per-request or only reads from .env. Needs validation during Phase 0 API discovery. May require documenting that users configure backend .env separately.
- **Reagraph scalability:** MEDIUM confidence on Reagraph handling MiroFish's GraphRAG output. Need to test with real graph data (node/edge counts, metadata) during Phase 5. Fallback options identified.
- **Polish translation quality:** Research covers technical i18n setup but actual translation quality requires a native Polish speaker review. Plan for this during Phase 6 documentation work.
- **WebSocket vs polling:** STACK.md mentions a custom WebSocket hook, but ARCHITECTURE.md clarifies the backend uses HTTP polling, not WebSocket. The backend may have some WebSocket support for specific features -- validate during Phase 0. Default to polling.

## Sources

### Primary (HIGH confidence)
- [MiroFish GitHub Repository](https://github.com/666ghj/MiroFish) -- backend API structure, Docker setup, project architecture
- [DeepWiki MiroFish Analysis](https://deepwiki.com/666ghj/MiroFish) -- detailed architecture breakdown, endpoint documentation
- [MiroFish README-EN](https://github.com/666ghj/MiroFish/blob/main/README-EN.md) -- official English documentation
- npm registry (react, vite, zustand, tanstack-query, etc.) -- version verification, 2026-03-20

### Secondary (MEDIUM confidence)
- [Vite 8 announcement](https://vite.dev/blog/announcing-vite8) -- build tool capabilities
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4) -- CSS-first config, performance
- [Reagraph](https://reagraph.dev/) -- graph visualization capabilities
- [Phrase i18n guide](https://phrase.com/blog/posts/internationalization-beyond-code-a-developers-guide-to-real-world-language-challenges/) -- Polish pluralization complexity
- [Frontend Migration Guide](https://frontendmastery.com/posts/frontend-migration-guide/) -- rewrite pitfalls
- [API Contracts Survival Guide](https://evilmartians.com/chronicles/api-contracts-and-everything-i-wish-i-knew-a-frontend-survival-guide) -- API integration patterns

### Tertiary (LOW confidence)
- [Reagraph community size](https://github.com/reaviz/reagraph) -- smaller community than Cytoscape.js; needs validation against real data
- State management comparison articles -- opinions vary, but Zustand + TanStack Query consensus is strong

---
*Research completed: 2026-03-20*
*Ready for roadmap: yes*
