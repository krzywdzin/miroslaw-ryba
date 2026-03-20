# Technology Stack

**Project:** Miroslaw Ryba (MiroFish Polish Frontend)
**Researched:** 2026-03-20

## Decision Context

This is a greenfield SPA connecting to an **unmodified Python backend** via REST and WebSocket APIs. There is no SSR requirement -- the app is a prediction engine dashboard, not a content/marketing site. SEO is irrelevant (authenticated tool). The UI must support Polish (default) + English i18n, real-time data streams, knowledge graph visualization, and a comprehensive configuration panel.

## Recommended Stack

### Build Tool & Dev Server

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Vite** | ^8.0.1 | Build tool, dev server, bundler | Vite 8 ships Rolldown (Rust bundler) -- 10-30x faster builds than webpack. No SSR needed, so Next.js overhead is unjustified. SPA is the correct architecture for a dashboard connecting to a separate Python backend. The @vitejs/plugin-react v6 dropped Babel dependency entirely (uses Oxc), smaller install. | HIGH |

**Why NOT Next.js:** Next.js co-locates API routes with frontend -- we have a separate Python backend. Next.js adds SSR/SSG complexity we do not need. Vite enforces clean backend separation which is exactly our architecture. Next.js would add deployment complexity (Node.js server) for zero benefit.

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **React** | ^19.2.4 | UI framework | Stable, mature, largest ecosystem. React 19 brings Server Components (unused here but forward-compatible), improved concurrent features, and better performance. Every library in this stack has first-class React 19 support. | HIGH |
| **TypeScript** | ^5.7 | Type safety | Non-negotiable for production-grade. Catches integration bugs with backend API types. Every recommended library has full TS support. | HIGH |

### Routing

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **React Router** | ^7.13 | Client-side routing | Mature, stable, well-documented. In library/SPA mode it is simple and effective. TanStack Router has better type safety but adds learning curve and is less battle-tested at scale. For a dashboard with ~10 routes, React Router is the pragmatic choice. | HIGH |

**Why NOT TanStack Router:** Superior type safety, but smaller ecosystem, steeper learning curve, and overkill for a dashboard with a handful of routes. React Router v7 in library mode is perfectly adequate.

### State Management

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Zustand** | ^5.0.12 | Client-side state (UI state, settings, active selections) | 3KB, zero boilerplate, no providers needed. Centralized store model fits dashboard state (selected simulation, active tab, user preferences). Hook-based API is idiomatic React. | HIGH |
| **TanStack Query** | ^5.91 | Server state (API data fetching, caching, sync) | Handles REST API integration with automatic caching, background refetching, retry logic, and devtools. Eliminates manual loading/error state management. Built-in WebSocket/streaming support for real-time data. | HIGH |

**Pattern:** TanStack Query for all server state (API responses), Zustand for client-only state (UI preferences, active panels). This separation prevents the common mistake of mixing server and client state.

**Why NOT Redux:** Boilerplate overhead for a project this size. Zustand + TanStack Query covers all use cases with 1/10th the code.

**Why NOT Jotai:** Atomic model excels at fine-grained reactivity but dashboard state is mostly centralized (settings, active simulation). Zustand's centralized model is a better fit.

### Styling & Components

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Tailwind CSS** | ^4.2.1 | Utility-first CSS | v4 is CSS-first config (no tailwind.config.js), 5x faster builds, microsecond incremental rebuilds. Perfect for minimalist design -- utility classes enforce consistency without custom CSS sprawl. | HIGH |
| **shadcn/ui** | latest | Component primitives (buttons, forms, dialogs, tabs, tables) | Not a dependency -- copies source into your project. Built on Radix UI (accessibility) + Tailwind. Full control over every component. Updated for Tailwind v4 + React 19. Minimalist aesthetic by default. Provides all config panel components (forms, selects, switches, tabs). | HIGH |

**Why NOT Material UI / Ant Design / Chakra:** All impose strong visual opinions. shadcn/ui gives unstyled Radix primitives with Tailwind -- perfect for a custom minimalist aesthetic. No fighting the framework's design language.

### Internationalization (i18n)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **react-i18next** | ^16.5 | i18n framework | 2.1M weekly downloads, largest ecosystem, namespace support for lazy-loading translations. Works perfectly in SPAs (next-intl is Next.js-specific). Supports interpolation, pluralization, and context -- all needed for Polish (which has complex plural forms). | HIGH |
| **i18next** | ^25.x | i18n core | Required peer dependency of react-i18next. Supports language detection, fallback chains, and dynamic loading. | HIGH |

**Why NOT next-intl:** Designed specifically for Next.js App Router. Does not work with Vite SPAs.

**Why NOT react-intl (FormatJS):** Lighter but weaker ecosystem. ICU MessageFormat is powerful but verbose. react-i18next's namespace system is better for code-splitting translations.

**Polish language note:** Polish has 3 plural forms (1, 2-4, 5+). i18next handles this natively with its pluralization rules. Verify Polish plural rules are configured correctly during implementation.

### Forms & Validation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **React Hook Form** | ^7.71 | Form state management | Zero dependencies, smallest bundle, fewest re-renders (uncontrolled components). The config panel has many forms -- API keys, model selection, simulation parameters, Docker settings. Performance matters. | HIGH |
| **Zod** | ^4.3 | Schema validation | TypeScript-first, 2KB core (v4 is 57% smaller than v3). Generates TypeScript types from schemas. Integrates with React Hook Form via @hookform/resolvers. Use for both form validation and API response validation. | HIGH |

**Why NOT Formik:** More re-renders (controlled components), 9 dependencies, larger bundle. React Hook Form is strictly better for this use case.

### Data Visualization

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Recharts** | ^3.8 | Charts (simulation results, metrics, reports) | Declarative React components, SVG-based, 3.6M weekly downloads. Handles line charts, bar charts, area charts for simulation data display. Simple API, good for datasets under 10K points (our use case). | HIGH |
| **Reagraph** | ^4.30 | Knowledge graph visualization | WebGL-based, built specifically for React. Supports 2D/3D graph rendering, clustering, interactive exploration. Purpose-built for network/knowledge graphs -- exactly what MiroFish's GraphRAG output needs. | MEDIUM |

**Why NOT D3 directly:** D3 fights React's virtual DOM. Recharts wraps D3 in React components. For knowledge graphs, Reagraph is React-native.

**Why NOT Cytoscape.js:** Powerful but not React-native. Requires imperative DOM manipulation wrappers. Reagraph provides the same graph visualization with a declarative React API.

**Reagraph confidence note:** MEDIUM because it has a smaller community than Cytoscape.js. If Reagraph proves insufficient for MiroFish's graph complexity, fall back to `react-force-graph-2d` (more mature) or `@react-sigma/core` (Sigma.js React wrapper).

### Real-Time Communication

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Native WebSocket API** + custom hook | - | WebSocket connection to Python backend | MiroFish backend uses standard WebSocket, not Socket.IO. Adding Socket.IO would require backend changes (out of scope). A custom `useWebSocket` hook with reconnection logic is ~50 lines of code. TanStack Query's streaming support can handle the data flow. | HIGH |

**Why NOT Socket.IO:** Requires Socket.IO server on the backend. MiroFish uses plain WebSocket. Adding Socket.IO is a backend change -- out of scope.

**Why NOT react-use-websocket:** Adds a dependency for something achievable with a simple custom hook. If reconnection complexity grows, consider adding it later (~4KB).

### Developer Tooling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **ESLint** | ^9.x | Linting | Flat config format (v9). Use @eslint/js + typescript-eslint + eslint-plugin-react-hooks. | HIGH |
| **Prettier** | ^3.x | Code formatting | Opinionated formatting, no debates. Use prettier-plugin-tailwindcss for class sorting. | HIGH |
| **Vitest** | ^3.x | Unit/integration testing | Native Vite integration, same config, fast. Drop-in Jest replacement with better ESM support. | HIGH |
| **Playwright** | ^1.x | E2E testing | Cross-browser, reliable, better DX than Cypress. Handles WebSocket testing natively. | HIGH |
| **@tanstack/react-query-devtools** | ^5.91 | Query debugging | Inspect cache, queries, mutations in dev. Essential for debugging API integration. | HIGH |

### Infrastructure

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| **Docker** | - | Containerized deployment | MiroFish already uses Docker Compose. Add frontend as a service with nginx for static serving. | HIGH |
| **nginx** | alpine | Static file serving + API proxy | Serves built SPA, proxies /api/* to Python backend. Single entry point, handles CORS. | HIGH |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Framework | Vite + React | Next.js | SSR overhead unnecessary; separate Python backend makes Next.js API routes redundant; adds Node.js deployment complexity |
| Framework | Vite + React | Vue 3 | Original MiroFish uses Vue but we are building from scratch; React has larger ecosystem for all required features (graph viz, forms, i18n) |
| Framework | Vite + React | Svelte 5 | Smaller ecosystem for graph visualization and i18n; fewer battle-tested component libraries |
| State | Zustand | Redux Toolkit | Excessive boilerplate for dashboard-scale state; Zustand + TanStack Query covers all patterns |
| State | Zustand | Jotai | Atomic model less natural for centralized dashboard settings |
| Components | shadcn/ui | Material UI | Imposes Google's design language; fights minimalist aesthetic |
| Components | shadcn/ui | Ant Design | Chinese-origin design system (ironic for a project replacing Chinese UI); heavy bundle |
| Charts | Recharts | Victory | Less popular, more verbose API |
| Charts | Recharts | Nivo | Beautiful but heavier; Recharts is simpler for our chart types |
| Graph Viz | Reagraph | Cytoscape.js | Not React-native; imperative API conflicts with React patterns |
| i18n | react-i18next | next-intl | Next.js-specific, incompatible with Vite SPA |
| Forms | React Hook Form | Formik | More re-renders, more dependencies, larger bundle |
| Testing | Vitest | Jest | Slower, requires separate config from Vite, worse ESM support |
| E2E | Playwright | Cypress | Cypress has weaker WebSocket support; Playwright is faster and more reliable |

## Installation

```bash
# Initialize project
npm create vite@latest miroslaw-ryba -- --template react-ts

# Core dependencies
npm install react@^19.2.4 react-dom@^19.2.4 react-router@^7.13
npm install zustand@^5.0.12 @tanstack/react-query@^5.91
npm install react-i18next@^16.5 i18next@^25
npm install react-hook-form@^7.71 @hookform/resolvers zod@^4.3
npm install recharts@^3.8 reagraph@^4.30
npm install tailwindcss@^4.2

# shadcn/ui (run init after project setup)
npx shadcn@latest init

# Dev dependencies
npm install -D typescript@^5.7 @types/react @types/react-dom
npm install -D eslint@^9 @eslint/js typescript-eslint eslint-plugin-react-hooks
npm install -D prettier prettier-plugin-tailwindcss
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
npm install -D playwright @playwright/test
npm install -D @tanstack/react-query-devtools@^5.91
npm install -D @vitejs/plugin-react@^6
```

## Version Verification Sources

| Library | Verified Version | Source | Date Checked |
|---------|-----------------|--------|--------------|
| React | 19.2.4 | [npm](https://www.npmjs.com/package/react) | 2026-03-20 |
| Vite | 8.0.1 | [Vite releases](https://vite.dev/releases) | 2026-03-20 |
| Tailwind CSS | 4.2.1 | [GitHub releases](https://github.com/tailwindlabs/tailwindcss/releases) | 2026-03-20 |
| TanStack Query | 5.91.2 | [npm](https://www.npmjs.com/package/@tanstack/react-query) | 2026-03-20 |
| Zustand | 5.0.12 | [npm](https://www.npmjs.com/package/zustand) | 2026-03-20 |
| React Hook Form | 7.71.2 | [npm](https://www.npmjs.com/package/react-hook-form) | 2026-03-20 |
| react-i18next | 16.5.8 | [npm](https://www.npmjs.com/package/react-i18next) | 2026-03-20 |
| Zod | 4.3.6 | [npm](https://www.npmjs.com/package/zod) | 2026-03-20 |
| Recharts | 3.8.0 | [npm](https://www.npmjs.com/package/recharts) | 2026-03-20 |
| Reagraph | 4.30.8 | [npm](https://www.npmjs.com/package/reagraph) | 2026-03-20 |
| React Router | 7.13.1 | [npm](https://www.npmjs.com/package/react-router) | 2026-03-20 |
| @vitejs/plugin-react | 6.0.1 | [npm](https://www.npmjs.com/package/@vitejs/plugin-react) | 2026-03-20 |

## Sources

- [Vite 8 announcement](https://vite.dev/blog/announcing-vite8)
- [React 19.2 release](https://react.dev/blog/2025/10/01/react-19-2)
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4)
- [shadcn/ui Tailwind v4 support](https://ui.shadcn.com/docs/tailwind-v4)
- [TanStack Query docs](https://tanstack.com/query/latest)
- [Zustand docs](https://zustand.docs.pmnd.rs/)
- [react-i18next docs](https://react.i18next.com)
- [Reagraph](https://reagraph.dev/)
- [Recharts](https://recharts.github.io/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod v4](https://zod.dev/v4)
- [Vite vs Next.js comparison](https://strapi.io/blog/vite-vs-nextjs-2025-developer-framework-comparison)
- [TanStack Query vs SWR comparison](https://refine.dev/blog/react-query-vs-tanstack-query-vs-swr-2025/)
- [State management 2026 comparison](https://dev.to/jsgurujobs/state-management-in-2026-zustand-vs-jotai-vs-redux-toolkit-vs-signals-2gge)
