# Roadmap: Miroslaw Ryba

## Overview

Miroslaw Ryba replaces MiroFish's Chinese Vue frontend with a clean, Polish-language React SPA. The roadmap follows the natural structure of the project: infrastructure and cross-cutting concerns first (Phases 1-3), then the 5-stage MiroFish pipeline in order (Phases 4-8), then polish and release (Phases 9-10). Each pipeline phase delivers one complete, verifiable stage end-to-end against the real backend. Total: 50 v1 requirements across 10 phases.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Infrastructure and API Foundation** - Project scaffold, backend deployment, typed API client with Zod contracts (completed 2026-03-20)
- [x] **Phase 2: App Shell and Cross-Cutting Concerns** - i18n framework, stepper layout, loading/error patterns, responsive design (completed 2026-03-21)
- [ ] **Phase 3: Configuration Panel** - API keys, model selection, simulation parameters, Zep Cloud, Docker status
- [ ] **Phase 4: Graph Construction** - Pipeline stage 1: seed upload, graph building progress, knowledge graph visualization
- [ ] **Phase 5: Environment Setup** - Pipeline stage 2: entities, relationships, agent profiles, parameter adjustment
- [ ] **Phase 6: Simulation** - Pipeline stage 3: real-time monitoring, dual-platform view, agent activity, timeline
- [ ] **Phase 7: Reports** - Pipeline stage 4: markdown report display, PDF/Markdown export, simulation history
- [ ] **Phase 8: Interactive Dialogue** - Pipeline stage 5: ReportAgent chat, agent interviews, streaming markdown
- [ ] **Phase 9: Polish and Differentiation** - Dark mode, keyboard shortcuts, production quality pass
- [ ] **Phase 10: Documentation and Release** - Bilingual docs (PL + EN), contributing guide, AGPL-3.0 compliance, open-source release

## Phase Details

### Phase 1: Infrastructure and API Foundation
**Goal**: Development environment is operational with a running MiroFish backend, project scaffold, and typed API client ready for feature development
**Depends on**: Nothing (first phase)
**Requirements**: INFR-01, INFR-02, INFR-03, INFR-04
**Success Criteria** (what must be TRUE):
  1. MiroFish backend runs in Docker and responds to API requests from the frontend dev server
  2. Vite + React + TypeScript project builds and serves a blank page connected to the backend
  3. Typed API client modules exist for all backend blueprints with Zod-validated response schemas
  4. WebSocket/polling infrastructure is in place for real-time simulation updates
**Plans**: 2 plans

Plans:
- [ ] 01-01-PLAN.md — Git submodule, Docker Compose, Vite+React+TS scaffold, ESLint/Prettier/Vitest setup
- [ ] 01-02-PLAN.md — Typed API client with Zod schemas, error mapping, polling hook, OpenAPI spec

### Phase 2: App Shell and Cross-Cutting Concerns
**Goal**: Users see a complete application shell with Polish/English i18n, 5-stage pipeline stepper, and consistent loading/error patterns that all subsequent features plug into
**Depends on**: Phase 1
**Requirements**: I18N-01, I18N-02, I18N-03, I18N-04, UIUX-01, UIUX-02, UIUX-03, UIUX-05, UIUX-06, UIUX-08
**Success Criteria** (what must be TRUE):
  1. User sees a Polish-language app shell with header, stepper sidebar showing 5 pipeline stages, and content area
  2. User can switch between Polish and English via a language toggle in the header, and all visible UI text updates immediately
  3. Polish plural forms render correctly (e.g., "1 agent", "2 agenty", "5 agentow")
  4. All async operations show appropriate loading states (skeletons/spinners) and failures show Polish/English error messages with retry buttons
  5. Chinese backend error messages are intercepted and displayed as Polish/English equivalents
**Plans**: 3 plans

Plans:
- [ ] 02-01-PLAN.md — Design system (shadcn/ui + Tailwind v4 + Geist font) and i18n framework (react-i18next PL/EN)
- [ ] 02-02-PLAN.md — App shell layout (header, sidebar stepper, footer, router) and dashboard page
- [ ] 02-03-PLAN.md — Loading/error patterns (skeleton, spinner, auto-retry toast, Chinese error mapping) and Polish plural tests

### Phase 3: Configuration Panel
**Goal**: Users can fully configure MiroFish system settings (API keys, models, simulation parameters, Zep Cloud, Docker) without editing config files
**Depends on**: Phase 2
**Requirements**: CONF-01, CONF-02, CONF-03, CONF-04, CONF-05, CONF-06, CONF-07
**Success Criteria** (what must be TRUE):
  1. User can enter an OpenAI-compatible API key and base URL, test the connection, and see success/failure feedback before saving
  2. User can select a model from presets (qwen-plus, GPT-4) or type a custom model name
  3. User can adjust simulation parameters (agent count, interaction rounds, platform weights) and see current values
  4. User can configure Zep Cloud settings and test the connection
  5. User can view Docker container status and start/stop/restart containers
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Graph Construction
**Goal**: Users can upload seed material and build a knowledge graph, completing pipeline stage 1 end-to-end
**Depends on**: Phase 3
**Requirements**: GRPH-01, GRPH-02, GRPH-03, GRPH-04, GRPH-05
**Success Criteria** (what must be TRUE):
  1. User can upload seed material files via drag-and-drop or file picker and describe a prediction goal in natural language
  2. User can see graph construction progress with status messages as the backend processes the input
  3. User can view the resulting knowledge graph as an interactive visualization (zoom, pan, filter by entity type)
  4. User can click graph nodes to inspect entity details (name, type, relationships)
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

### Phase 5: Environment Setup
**Goal**: Users can review extracted entities, agent profiles, and simulation parameters before launching simulation, completing pipeline stage 2
**Depends on**: Phase 4
**Requirements**: ENVR-01, ENVR-02, ENVR-03, ENVR-04
**Success Criteria** (what must be TRUE):
  1. User can view extracted entities and relationships from the constructed graph
  2. User can view generated character profiles with personality traits, memory state, and stance
  3. User can review and adjust simulation parameters before running the simulation
  4. User can see agent profile cards with personality, memory, and opinion timeline
**Plans**: TBD

Plans:
- [ ] 05-01: TBD

### Phase 6: Simulation
**Goal**: Users can run and monitor the dual-platform simulation in real time, completing pipeline stage 3
**Depends on**: Phase 5
**Requirements**: SIMU-01, SIMU-02, SIMU-03, SIMU-04
**Success Criteria** (what must be TRUE):
  1. User can start a simulation and see real-time progress (agent counts, interaction counts, timeline)
  2. User can view a dual-platform split view showing Twitter-like and Reddit-like simulations running in parallel
  3. User can see agent posts, comments, and debates appearing in real time via polling
  4. User can view an action timeline showing key events during the simulation
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

### Phase 7: Reports
**Goal**: Users can view, export, and browse prediction reports, completing pipeline stage 4
**Depends on**: Phase 6
**Requirements**: REPT-01, REPT-02, REPT-03, REPT-04
**Success Criteria** (what must be TRUE):
  1. User can view a generated prediction report with rich markdown formatting (tables, charts, sections)
  2. User can export the report as PDF or Markdown file
  3. User can view a list of past simulations with status, date, and topic
**Plans**: TBD

Plans:
- [ ] 07-01: TBD

### Phase 8: Interactive Dialogue
**Goal**: Users can have streaming conversations with the ReportAgent and simulated agents, completing pipeline stage 5
**Depends on**: Phase 7
**Requirements**: CHAT-01, CHAT-02, CHAT-03, CHAT-04
**Success Criteria** (what must be TRUE):
  1. User can have a streaming chat conversation with the ReportAgent about the prediction report
  2. User can select any simulated agent and chat with them individually
  3. Chat displays agent personality and memory context alongside the conversation
  4. Chat renders markdown in responses with proper formatting
**Plans**: TBD

Plans:
- [ ] 08-01: TBD

### Phase 9: Polish and Differentiation
**Goal**: Application reaches production quality with dark mode, keyboard shortcuts, and refinement of all existing features
**Depends on**: Phase 8
**Requirements**: UIUX-04, UIUX-07
**Success Criteria** (what must be TRUE):
  1. User can toggle dark mode manually or have it follow OS preference, and the entire UI renders correctly in both themes
  2. User can use keyboard shortcuts for common actions (chat focus, simulation start/stop, panel switching)
  3. All pipeline stages handle edge cases gracefully (empty states, timeouts, partial data)
**Plans**: TBD

Plans:
- [ ] 09-01: TBD

### Phase 10: Documentation and Release
**Goal**: Project is ready for open-source release on GitHub with complete bilingual documentation
**Depends on**: Phase 9
**Requirements**: DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05, DOCS-06
**Success Criteria** (what must be TRUE):
  1. English README exists with project overview, features, and screenshots
  2. Polish README (README.pl.md) exists with complete translation of the English version
  3. Installation guide covers both Docker and source deployment with step-by-step instructions
  4. Configuration guide documents API key setup, model selection, and Zep Cloud configuration
  5. AGPL-3.0 license file is present and CONTRIBUTING.md guide exists for open-source contributors

**Plans**: TBD

Plans:
- [ ] 10-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9 -> 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Infrastructure and API Foundation | 2/2 | Complete    | 2026-03-20 |
| 2. App Shell and Cross-Cutting Concerns | 2/3 | Complete    | 2026-03-21 |
| 3. Configuration Panel | 0/? | Not started | - |
| 4. Graph Construction | 0/? | Not started | - |
| 5. Environment Setup | 0/? | Not started | - |
| 6. Simulation | 0/? | Not started | - |
| 7. Reports | 0/? | Not started | - |
| 8. Interactive Dialogue | 0/? | Not started | - |
| 9. Polish and Differentiation | 0/? | Not started | - |
| 10. Documentation and Release | 0/? | Not started | - |
