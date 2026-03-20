# Requirements: Miroslaw Ryba

**Defined:** 2026-03-20
**Core Value:** Users can interact with the full MiroFish prediction pipeline in a clean, Polish-language interface with complete system configurability.

## v1 Requirements

### Configuration

- [ ] **CONF-01**: User can enter and validate OpenAI-compatible API keys and base URLs
- [ ] **CONF-02**: User can select LLM model from presets (qwen-plus, GPT-4) or enter custom model name
- [ ] **CONF-03**: User can configure simulation parameters (agent count, interaction rounds, platform weights)
- [ ] **CONF-04**: User can configure Zep Cloud settings (API key, cloud URL, connection test)
- [ ] **CONF-05**: User can view Docker container status and perform basic management (start/stop/restart)
- [ ] **CONF-06**: Configuration persists across sessions (localStorage or backend config)
- [ ] **CONF-07**: User can test API connection before saving configuration

### Pipeline — Graph Construction

- [ ] **GRPH-01**: User can upload seed material files via drag-and-drop or file picker
- [ ] **GRPH-02**: User can describe prediction goal in natural language text input
- [ ] **GRPH-03**: User can see graph construction progress with status messages
- [ ] **GRPH-04**: User can view interactive knowledge graph visualization (zoom, pan, filter by entity type)
- [ ] **GRPH-05**: User can click graph nodes to inspect entity details

### Pipeline — Environment Setup

- [ ] **ENVR-01**: User can view extracted entities and relationships from the graph
- [ ] **ENVR-02**: User can view generated character profiles (personality, memory, stance)
- [ ] **ENVR-03**: User can view and adjust simulation parameters before running
- [ ] **ENVR-04**: User can see agent profile cards with personality traits, memory state, and opinion timeline

### Pipeline — Simulation

- [ ] **SIMU-01**: User can start and monitor simulation with real-time progress (agent counts, interaction counts, timeline)
- [ ] **SIMU-02**: User can view dual-platform split view (Twitter-like + Reddit-like) showing parallel simulations
- [ ] **SIMU-03**: User can see agent activity posts, comments, and debates in real-time via polling
- [ ] **SIMU-04**: User can view action timeline showing key events during simulation

### Pipeline — Reports

- [ ] **REPT-01**: User can view generated prediction report with rich markdown formatting (tables, charts, sections)
- [ ] **REPT-02**: User can export report as PDF
- [ ] **REPT-03**: User can export report as Markdown file
- [ ] **REPT-04**: User can view list of past simulations with status, date, and topic

### Pipeline — Interaction

- [ ] **CHAT-01**: User can have streaming chat conversation with ReportAgent about the prediction
- [ ] **CHAT-02**: User can select and chat with any simulated agent in the world
- [ ] **CHAT-03**: Chat displays agent personality/memory context alongside conversation
- [ ] **CHAT-04**: Chat renders markdown in responses with proper formatting

### Internationalization

- [ ] **I18N-01**: All UI strings externalized via i18n framework (react-i18next)
- [ ] **I18N-02**: Polish language as default with complete translations
- [ ] **I18N-03**: English language available via language switcher in header
- [ ] **I18N-04**: Polish plural forms handled correctly (4 plural forms via ICU MessageFormat)

### UI/UX

- [ ] **UIUX-01**: Minimalist, clean design with consistent component library (shadcn/ui)
- [ ] **UIUX-02**: 5-stage pipeline displayed as linear stepper/wizard navigation
- [ ] **UIUX-03**: Responsive layout — desktop-first, graceful degradation to tablet (min 1024px)
- [ ] **UIUX-04**: Dark mode with OS preference detection and manual toggle
- [ ] **UIUX-05**: Consistent loading states (skeletons, spinners, progress bars) for all async operations
- [ ] **UIUX-06**: Clear error messages with retry buttons for common failures (invalid API key, timeout, model unavailable)
- [ ] **UIUX-07**: Keyboard shortcuts for common actions (chat focus, simulation start/stop, panel switching)
- [ ] **UIUX-08**: Chinese backend error messages intercepted and mapped to Polish/English equivalents

### Infrastructure

- [x] **INFR-01**: Backend deployment setup (Docker Compose for MiroFish backend)
- [x] **INFR-02**: Frontend build pipeline (Vite 8 + React 19 + TypeScript)
- [ ] **INFR-03**: API client with typed contracts (Zod schemas for all backend endpoints)
- [ ] **INFR-04**: WebSocket/polling architecture for real-time simulation updates

### Documentation

- [ ] **DOCS-01**: README in English with project overview, features, screenshots
- [ ] **DOCS-02**: README in Polish (README.pl.md) with full translation
- [ ] **DOCS-03**: Installation and setup guide (Docker + source deployment)
- [ ] **DOCS-04**: Configuration guide (API keys, models, Zep Cloud)
- [ ] **DOCS-05**: Contributing guide (CONTRIBUTING.md)
- [ ] **DOCS-06**: License file (AGPL-3.0, compliant with MiroFish license)

## v2 Requirements

### Enhanced Interaction

- **CHAT-05**: Voice input for chat with agents
- **CHAT-06**: Chat conversation export

### Advanced Visualization

- **VIS-01**: 3D knowledge graph visualization
- **VIS-02**: Agent stance evolution animation over time

### Platform

- **PLAT-01**: PWA support for offline caching
- **PLAT-02**: Multi-language expansion (German, Spanish, etc.)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Backend rewrite | MiroFish backend is mature and functional — use as-is |
| User authentication | Single-user self-hosted tool, no auth needed |
| Mobile native app | Desktop-first, simulation views need screen real estate |
| Drag-and-drop workflow builder | MiroFish has fixed 5-step pipeline, not customizable |
| Custom agent personality editor | Backend generates personalities via LLM, not user-editable |
| Real-time collaborative editing | Single-user tool, no multi-user sessions |
| Plugin/extension system | Backend has fixed architecture, no extension points |
| Push notifications | Local tool, browser tab notifications sufficient |
| Analytics dashboard | MiroFish generates one-off predictions, no persistent dataset |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFR-01 | Phase 1 | Complete |
| INFR-02 | Phase 1 | Complete |
| INFR-03 | Phase 1 | Pending |
| INFR-04 | Phase 1 | Pending |
| I18N-01 | Phase 2 | Pending |
| I18N-02 | Phase 2 | Pending |
| I18N-03 | Phase 2 | Pending |
| I18N-04 | Phase 2 | Pending |
| UIUX-01 | Phase 2 | Pending |
| UIUX-02 | Phase 2 | Pending |
| UIUX-03 | Phase 2 | Pending |
| UIUX-05 | Phase 2 | Pending |
| UIUX-06 | Phase 2 | Pending |
| UIUX-08 | Phase 2 | Pending |
| CONF-01 | Phase 3 | Pending |
| CONF-02 | Phase 3 | Pending |
| CONF-03 | Phase 3 | Pending |
| CONF-04 | Phase 3 | Pending |
| CONF-05 | Phase 3 | Pending |
| CONF-06 | Phase 3 | Pending |
| CONF-07 | Phase 3 | Pending |
| GRPH-01 | Phase 4 | Pending |
| GRPH-02 | Phase 4 | Pending |
| GRPH-03 | Phase 4 | Pending |
| GRPH-04 | Phase 4 | Pending |
| GRPH-05 | Phase 4 | Pending |
| ENVR-01 | Phase 5 | Pending |
| ENVR-02 | Phase 5 | Pending |
| ENVR-03 | Phase 5 | Pending |
| ENVR-04 | Phase 5 | Pending |
| SIMU-01 | Phase 6 | Pending |
| SIMU-02 | Phase 6 | Pending |
| SIMU-03 | Phase 6 | Pending |
| SIMU-04 | Phase 6 | Pending |
| REPT-01 | Phase 7 | Pending |
| REPT-02 | Phase 7 | Pending |
| REPT-03 | Phase 7 | Pending |
| REPT-04 | Phase 7 | Pending |
| CHAT-01 | Phase 8 | Pending |
| CHAT-02 | Phase 8 | Pending |
| CHAT-03 | Phase 8 | Pending |
| CHAT-04 | Phase 8 | Pending |
| UIUX-04 | Phase 9 | Pending |
| UIUX-07 | Phase 9 | Pending |
| DOCS-01 | Phase 10 | Pending |
| DOCS-02 | Phase 10 | Pending |
| DOCS-03 | Phase 10 | Pending |
| DOCS-04 | Phase 10 | Pending |
| DOCS-05 | Phase 10 | Pending |
| DOCS-06 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 50 total
- Mapped to phases: 50
- Unmapped: 0

---
*Requirements defined: 2026-03-20*
*Last updated: 2026-03-20 after roadmap creation*
