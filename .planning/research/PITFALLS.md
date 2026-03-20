# Domain Pitfalls

**Domain:** Frontend replacement for AI prediction engine (MiroFish)
**Researched:** 2026-03-20

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Assuming API Behavior from Vue Source Code Alone

**What goes wrong:** The existing Vue frontend has service modules (`frontend/src/services/simulation.js`, `report.js`, `graph.js`) wrapping ~28+ API calls. Developers reverse-engineer these calls and assume the request/response contracts are complete and correct. But the Vue code may contain dead endpoints, handle edge cases silently (Chinese error messages swallowed by catch blocks), or make assumptions about backend state that are not obvious from reading JS alone.

**Why it happens:** No OpenAPI spec exists. The Flask backend uses blueprints (`simulation_bp`, `report_bp`, `project_bp`, `graph_bp`, `ipc_bp`) on port 5001, but endpoint behavior -- especially error responses, validation rules, and edge-case handling -- is only discoverable by running the backend and testing.

**Consequences:** Frontend builds against a mental model of the API that diverges from reality. Features appear to work in happy-path testing but break under real conditions (empty graphs, failed simulations, LLM timeouts). Discovery happens late, during integration.

**Prevention:**
1. Before writing any frontend code, run the MiroFish backend locally and capture every API call the Vue frontend makes using browser DevTools Network tab. Export as HAR files.
2. Create an `api-contracts/` directory with typed interfaces for every endpoint, documenting request shape, response shape, error responses, and status codes -- verified against live calls.
3. Write a thin API client layer first (before UI components) and integration-test it against the real backend.

**Detection:** If you are building UI components without a running backend to test against, you are in this trap.

**Phase:** Must be addressed in Phase 1 (API discovery/documentation). This is the single highest-risk activity and should gate all other work.

---

### Pitfall 2: Polling Architecture Causes Performance Death by a Thousand Cuts

**What goes wrong:** MiroFish uses HTTP polling (not WebSockets/SSE) for real-time updates during simulation. The Vue frontend polls `GET /api/simulation/status` every ~1 second, plus `GET /api/simulation/profiles/realtime` and `GET /api/simulation/config/realtime`. A naive React implementation causes cascading re-renders on every poll cycle, freezing the UI when displaying simulation data with hundreds of agents.

**Why it happens:** React's reconciliation model means any state update triggers re-renders down the component tree. Polling 3 endpoints every second means 3 state updates/second minimum, each potentially re-rendering graph visualizations, agent tables, and status indicators simultaneously.

**Consequences:** UI becomes sluggish or unresponsive during simulation (the core feature). Users see janky updates, frozen graphs, or browser tab crashes on longer simulations. This is especially bad because simulations are the primary user activity.

**Prevention:**
1. Isolate polling state from rendering state. Use React Query or SWR with `structuralSharing` to only trigger re-renders when data actually changes (not on every poll response).
2. Memoize heavily: `React.memo` on all simulation display components, `useMemo` for derived data.
3. Virtualize agent lists (use `@tanstack/react-virtual`) -- MiroFish can simulate up to 1M agents.
4. Pause polling when browser tab is not visible (`document.visibilityState`).
5. Consider adaptive polling intervals: fast (1s) during active simulation, slow (5s) when idle.

**Detection:** If the browser DevTools Performance tab shows >16ms frame times during simulation polling, you have this problem.

**Phase:** Architecture decisions in Phase 1 (data layer design), implementation in the simulation dashboard phase.

---

### Pitfall 3: Treating i18n as "Just String Replacement"

**What goes wrong:** Developers set up `react-i18next` with simple key-value JSON files (`{"submit": "Wyslij"}`) and call it done. Polish grammar then breaks the UI in subtle ways: truncated text, broken pluralization, wrong gender agreement, layout shifts from longer Polish strings.

**Why it happens:** Polish is grammatically complex in ways that English developers do not anticipate:
- **Pluralization:** Polish has 4 plural forms (one/few/many/other). "1 agent" = "1 agent", "2 agenty" (few), "5 agentow" (many), "22 agenty" (few again). The rules involve modular arithmetic on the number.
- **String length:** Polish translations are typically 20-30% longer than English equivalents. UI designed for English text will overflow.
- **Diacritics:** Characters like a-ogonek, l-stroke, z-dot require proper UTF-8 handling and font support (some monospace/code fonts lack Polish glyphs).
- **Case inflection:** Nouns change form based on grammatical case, making template-based string interpolation fragile.

**Consequences:** UI text looks broken or grammatically wrong to Polish speakers. Layout breaks on longer strings. Pluralization errors make the product feel amateur. These are hard to fix retroactively because they require restructuring translation keys and sometimes component layouts.

**Prevention:**
1. Use ICU MessageFormat from day one (supported by `react-i18next` with `i18next-icu`). This handles Polish pluralization natively.
2. Design all UI layouts with 30% text expansion headroom. Never hardcode widths on text containers.
3. Test with Polish strings from the start, not English placeholders. Have a native Polish speaker review translation files.
4. Use a font stack verified to include Polish diacritics (Inter, Roboto, Noto Sans all work).
5. Set `<html lang="pl">` default; structure i18n namespace per feature area, not per page.

**Detection:** If your translation files only have `"key": "value"` without any `{count, plural, ...}` ICU syntax, you are in this trap.

**Phase:** Must be addressed in Phase 1 (project scaffolding). Retrofitting ICU MessageFormat onto simple key-value i18n is painful.

---

### Pitfall 4: Building Against a Stale or Non-Running Backend

**What goes wrong:** Developers mock the entire API layer and build the frontend in isolation for weeks. When integration happens, they discover: the backend requires specific initialization sequences (create project before simulation), state machine constraints (cannot start simulation without preparation step completing), file system dependencies (project directories must exist), and environment requirements (valid LLM API key, Zep Cloud connection).

**Why it happens:** MiroFish backend has a strict 5-stage workflow: Graph Building -> Environment Setup -> Simulation -> Report -> Interaction. Each stage has prerequisites. The backend reads/writes state to `state.json`, `profiles.csv`, `simulation.json`, and `run_state.json` files. Mocking all this correctly is harder than just running the backend.

**Consequences:** Months of frontend work that does not actually work when connected. State management assumptions are wrong. Error handling is missing for real failure modes. The "integration phase" becomes a second rewrite.

**Prevention:**
1. Get the MiroFish backend running in Docker on day one. Document the exact steps. Make it a prerequisite for any developer setup.
2. Never mock API calls for feature development. Use the real backend. Only mock for unit tests of component rendering logic.
3. Build features in the same 5-stage order as the backend workflow. Do not jump to "simulation dashboard" before "project creation" works end-to-end.
4. Keep a `.env.development` with test API keys (Alibaba Bailian offers free tier for qwen-plus).

**Detection:** If any developer on the project cannot run the full backend locally, you are accumulating integration debt.

**Phase:** Phase 0 / pre-development setup. Backend must be running before frontend development begins.

---

## Moderate Pitfalls

### Pitfall 5: Graph Visualization Library Mismatch

**What goes wrong:** Choosing a charting library (Chart.js, Recharts) for knowledge graph visualization when you need a network/graph library (force-directed layouts, node-link diagrams). MiroFish uses GraphRAG to build entity-relationship knowledge graphs. Displaying these requires a graph visualization tool, not a data charting tool.

**Prevention:**
1. Use a dedicated graph visualization library: `reagraph` (WebGL-based, handles large graphs), `react-force-graph` (d3-force based), or `@antv/g6` (feature-rich, used in Chinese ecosystem -- may have existing MiroFish compatibility).
2. Evaluate against actual GraphRAG output from the backend: how many nodes/edges typical, what metadata is on each node, do you need interactive exploration or static display.
3. Ensure the library supports: force-directed layout, zoom/pan, node click handlers, dynamic data updates, and can handle 500+ nodes without lag.

**Detection:** If your graph visualization library's examples page only shows bar charts and line graphs, wrong tool.

**Phase:** Technology selection phase; must be decided before building the graph construction feature.

---

### Pitfall 6: AGPL-3.0 License Compliance Gaps

**What goes wrong:** Building the new frontend without proper AGPL-3.0 compliance. Since MiroFish is AGPL-3.0, the derivative frontend work must also be AGPL-3.0. Common mistakes: forgetting to include the license, not providing "Corresponding Source" access, using incompatible dependencies (MIT/Apache are compatible; GPL-2.0-only is not; proprietary is not), or not displaying license notice in the running application.

**Prevention:**
1. Add `AGPL-3.0` to `package.json` license field and include full `LICENSE` file from day one.
2. Audit every npm dependency for license compatibility before adding. Use `license-checker` or `license-report` npm packages. Block GPL-2.0-only and proprietary licenses.
3. Include a "Source Code" link in the application footer pointing to the GitHub repository (AGPL requires this for network-accessible software).
4. Document in README that this is a derivative work of MiroFish under AGPL-3.0.

**Detection:** Run `npx license-checker --production --failOn "GPL-2.0"` in CI. If it fails, you have an incompatible dependency.

**Phase:** Phase 1 (project scaffolding) for license file and package.json; ongoing CI check for dependency auditing.

---

### Pitfall 7: Configuration Panel State Explosion

**What goes wrong:** The configuration panel must handle: API keys (LLM, Zep Cloud), model selection (multiple providers), simulation parameters (nested: platform settings, agent counts, temporal parameters), Docker configuration, and infrastructure settings. Developers store this as deeply nested state and end up with unmaintainable update logic, stale state bugs, and forms that lose data on re-render.

**Prevention:**
1. Flatten the configuration state. Use normalized form: `{ "llm.apiKey": "...", "llm.baseUrl": "...", "simulation.agentCount": 100 }` with dot-notation keys instead of deeply nested objects.
2. Use a form library that handles nested fields well: React Hook Form with its `useFieldArray` and nested field support, or TanStack Form.
3. Separate "settings that hit the backend" from "local UI preferences." Settings that configure the backend should POST to the backend on save, not be stored in frontend state long-term.
4. Validate configuration before sending to backend. The backend will not give helpful error messages (Chinese Flask error responses).
5. Add a "Test Connection" button for API keys and Zep Cloud -- validate immediately, do not wait for a simulation to fail.

**Detection:** If your config form component exceeds 300 lines or has more than 5 levels of nested state updates, refactor.

**Phase:** Configuration panel phase. Design the state shape before building UI components.

---

### Pitfall 8: Chinese Error Messages and Logging in Backend Responses

**What goes wrong:** The MiroFish backend was written by Chinese developers. Error messages, log entries, console output, and potentially some response fields contain Chinese text. The frontend displays these directly to Polish/English users, creating a confusing experience.

**Prevention:**
1. Build an error mapping layer in the API client. Intercept all error responses and map known Chinese error strings to Polish/English equivalents.
2. For unknown errors, display a generic user-friendly message with the raw error available in a "details" expandable section (for debugging).
3. Catalog all error messages from the backend during the API discovery phase. The `console_log.txt` and `agent_log.jsonl` files will contain Chinese text.
4. Do not suppress errors -- surface them, but translate the user-facing portion.

**Detection:** If you see Chinese characters in your browser console during development, this is happening.

**Phase:** API client layer (early phase). Error mapping should be part of the API contract documentation.

---

### Pitfall 9: Subprocess Lifecycle Blind Spots

**What goes wrong:** MiroFish runs simulations as OASIS subprocesses (`run_parallel_simulation.py`). These can crash, hang, or produce partial output. The Flask API reads state files written by these subprocesses. If a subprocess dies mid-write, the state file may be corrupt JSON. The frontend must handle: simulation never starting, simulation hanging indefinitely, partial results, and corrupt status responses.

**Prevention:**
1. Implement timeout handling on the frontend: if `GET /api/simulation/status` returns the same state for >N minutes, show a "simulation may be stalled" warning.
2. Handle JSON parse errors gracefully in the API client (subprocess may write incomplete JSON to state files).
3. Provide a "Force Stop" button that calls `POST /api/simulation/stop` and handles the case where even that fails.
4. Show elapsed time prominently during simulation so users can judge if something is wrong.
5. Do not assume simulations complete quickly. Some may run for hours depending on agent count and LLM latency.

**Detection:** Test by killing the backend mid-simulation and observing frontend behavior. If it freezes or shows a blank screen, you need better error handling.

**Phase:** Simulation dashboard phase. Must be designed into the simulation status component from the start.

---

## Minor Pitfalls

### Pitfall 10: Docker Compose Port Conflicts

**What goes wrong:** Default ports 3000 (frontend) and 5001 (backend) conflict with common development tools. Port 3000 is used by many React dev servers, Node tools, and Grafana. Port 5001 conflicts with macOS AirPlay Receiver (enabled by default on recent macOS).

**Prevention:** Make ports configurable via environment variables in Docker Compose and dev scripts. Document the macOS AirPlay conflict in the README (System Preferences -> General -> AirDrop & Handoff -> AirPlay Receiver -> OFF).

**Detection:** "Address already in use" errors on first setup.

**Phase:** Project setup documentation.

---

### Pitfall 11: Forgetting File Upload/Download Flows

**What goes wrong:** MiroFish supports document upload (`POST /api/project/upload` for PDF, Markdown, TXT) for entity extraction, and generates reports as Markdown files. Developers focus on the simulation UI and forget to implement file handling. These are not glamorous features but are required for the complete workflow.

**Prevention:** Include file upload (with drag-and-drop) and report download in the feature list from the start. Test with actual PDF files against the backend -- the DocumentProcessor may have size limits or format requirements not documented anywhere.

**Detection:** If your feature backlog does not mention file upload or report download, you have forgotten this.

**Phase:** Project creation phase (upload) and report generation phase (download).

---

### Pitfall 12: Ignoring the IPC/Agent Interview Feature

**What goes wrong:** MiroFish has an "Interactive Dialogue" feature where users chat with agents in the simulated world via `/api/ipc/*` endpoints. This is the least documented feature and easiest to overlook. But it is one of the 5 core features listed in the project requirements.

**Prevention:** Investigate the IPC endpoints during API discovery. They likely involve a chat-like interface with message history. Design the chat component early, even if implementation comes later.

**Detection:** If your feature list has 4 features instead of 5, you dropped this one.

**Phase:** Final feature phase (depends on simulation being complete), but API discovery in Phase 1.

---

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| Project scaffolding | i18n architecture too simple (Pitfall 3) | ICU MessageFormat from day one, Polish-first design |
| API discovery | Incomplete contract documentation (Pitfall 1) | HAR capture, typed interfaces, live backend testing |
| Backend setup | Docker port conflicts, macOS AirPlay (Pitfall 10) | Configurable ports, documented workarounds |
| Data layer | Polling performance (Pitfall 2) | React Query with structural sharing, memoization |
| Graph construction UI | Wrong visualization library (Pitfall 5) | Use graph library (reagraph/react-force-graph), not chart library |
| Configuration panel | State explosion (Pitfall 7) | Flatten state, form library, validate before send |
| Simulation dashboard | Subprocess failures unhandled (Pitfall 9) | Timeouts, corrupt JSON handling, force-stop UI |
| Report generation | Missing file download flow (Pitfall 11) | Include in feature list, test with real backend output |
| Interactive dialogue | Feature forgotten entirely (Pitfall 12) | Include in Phase 1 API discovery even if built last |
| Open-source release | AGPL compliance gaps (Pitfall 6) | License file, dependency audit, source code link in UI |
| All phases | Building without running backend (Pitfall 4) | Backend running is a prerequisite, not an afterthought |
| All phases | Chinese error messages leak through (Pitfall 8) | Error mapping layer in API client |

## Sources

- [DeepWiki MiroFish Architecture](https://deepwiki.com/666ghj/MiroFish) - API endpoint documentation, architecture details
- [MiroFish GitHub Repository](https://github.com/666ghj/MiroFish) - Project structure, Docker setup, configuration
- [Frontend Migration Guide - Frontend Mastery](https://frontendmastery.com/posts/frontend-migration-guide/) - Rewrite pitfalls
- [API Contracts Survival Guide - Evil Martians](https://evilmartians.com/chronicles/api-contracts-and-everything-i-wish-i-knew-a-frontend-survival-guide) - API integration pitfalls
- [i18n Best Practices - Shopify Engineering](https://shopify.engineering/internationalization-i18n-best-practices-front-end-developers) - Internationalization pitfalls
- [20 i18n Mistakes in React - TranslatedRight](https://www.translatedright.com/blog/20-i18n-mistakes-developers-make-in-react-apps-and-how-to-fix-them/) - React i18n specifics
- [Phrase i18n Beyond Code](https://phrase.com/blog/posts/internationalization-beyond-code-a-developers-guide-to-real-world-language-challenges/) - Polish pluralization complexity
- [AGPL Compliance Guide - Vaultinum](https://vaultinum.com/blog/essential-guide-to-agpl-compliance-for-tech-companies) - License compliance
- [FOSSA AGPL Guide](https://fossa.com/blog/open-source-software-licenses-101-agpl-license/) - AGPL pitfalls
- [React State Structure - react.dev](https://react.dev/learn/choosing-the-state-structure) - Nested state anti-patterns
- [Integrating React with Flask - DEV](https://dev.to/connor-quitt/integrating-react-with-a-flask-backend-best-practices-and-common-pitfalls-240l) - CORS and proxy setup
- [React Graph Visualization Guide](https://cambridge-intelligence.com/react-graph-visualization-library/) - Graph library selection
- [reagraph - WebGL Graph Visualizations](https://github.com/reaviz/reagraph) - Graph visualization for React
