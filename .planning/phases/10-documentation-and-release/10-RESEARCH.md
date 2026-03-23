# Phase 10: Documentation and Release - Research

**Researched:** 2026-03-23
**Domain:** Open-source documentation, bilingual README, AGPL-3.0 compliance
**Confidence:** HIGH

## Summary

Phase 10 is a documentation-only phase -- no code changes, only creation of markdown files at well-defined locations. The deliverables are six files: README.md, README.pl.md, docs/installation.md, docs/configuration.md, CONTRIBUTING.md, and LICENSE. All content can be derived from existing project artifacts (package.json, docker-compose.yml, .env.example, ROADMAP.md, REQUIREMENTS.md, and the feature set built across Phases 1-9).

The primary risk is not technical but completeness -- ensuring all configuration options, prerequisites, and setup steps are accurately documented. The AGPL-3.0 license is a hard constraint from MiroFish upstream and must be the exact GNU text.

**Primary recommendation:** Create docs in two plans -- Plan 1 for core files (LICENSE, README.md, README.pl.md), Plan 2 for detailed guides (docs/installation.md, docs/configuration.md, CONTRIBUTING.md).

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Hero section: project title/logo, one-line description, 2-3 screenshots from main screens (graph, simulation, report)
- Features: bulleted list of key capabilities -- 5 pipeline stages, dark mode, keyboard shortcuts, i18n PL/EN
- Quick Start: 3-4 commands to get running (Docker preferred, npm alternative)
- Links section: pointers to docs/installation.md, docs/configuration.md, CONTRIBUTING.md
- Polish README as README.pl.md -- complete translation of English version, not a separate document
- Language switch note at top of each README linking to the other
- docs/ directory in repo root -- installation.md, configuration.md
- Professional but friendly tone -- like Tailwind/Vite docs
- Concrete, direct, no jargon; emoji in headings acceptable; code examples with copy-paste commands
- Installation guide: two paths (Docker Compose recommended, source deployment)
- Configuration guide: API key setup, model selection, Zep Cloud, Docker management
- CONTRIBUTING.md: standard structure, primarily English, Polish notes where relevant
- AGPL-3.0 license file -- required by MiroFish upstream

### Claude's Discretion
- Exact README badges (build status, license, language)
- Screenshot selection and placement
- Installation guide level of detail
- Configuration guide formatting
- CONTRIBUTING.md issue template content
- Whether to add a CHANGELOG.md
- docs/ directory structure beyond the two required files

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DOCS-01 | README in English with project overview, features, screenshots | README.md structure, badge patterns, feature list from ROADMAP.md |
| DOCS-02 | README in Polish (README.pl.md) with full translation | Bilingual linking pattern, translation of all content |
| DOCS-03 | Installation and setup guide (Docker + source deployment) | docker-compose.yml, package.json scripts, .env.example, prerequisites |
| DOCS-04 | Configuration guide (API keys, models, Zep Cloud) | .env.example variables, UI configuration panel docs |
| DOCS-05 | Contributing guide (CONTRIBUTING.md) | ESLint/Prettier config, project structure, PR process |
| DOCS-06 | License file (AGPL-3.0, compliant with MiroFish license) | GNU AGPL-3.0 standard text |
</phase_requirements>

## Standard Stack

This phase creates static markdown files. No libraries needed.

### Core
| Tool | Purpose | Why Standard |
|------|---------|--------------|
| Markdown | All documentation format | GitHub renders natively, universal standard |
| GitHub Flavored Markdown | Tables, task lists, alerts | Native GitHub rendering support |

### Supporting
No additional tooling required. All files are plain markdown.

## Architecture Patterns

### File Structure
```
/ (repo root)
├── README.md              # English README (DOCS-01)
├── README.pl.md           # Polish README (DOCS-02)
├── LICENSE                 # AGPL-3.0 text (DOCS-06)
├── CONTRIBUTING.md         # Contributing guide (DOCS-05)
└── docs/
    ├── installation.md     # Docker + source setup (DOCS-03)
    └── configuration.md    # API keys, models, Zep (DOCS-04)
```

### Pattern 1: Bilingual README Linking
**What:** Each README links to the other language version at the very top.
**When to use:** Always for bilingual repos.
**Example:**
```markdown
<!-- In README.md -->
> **[Przeczytaj po polsku](README.pl.md)** | Read in English (current)

<!-- In README.pl.md -->
> **[Read in English](README.md)** | Przeczytaj po polsku (aktualny)
```

### Pattern 2: Badge Row
**What:** Status badges at top of README showing key project metadata.
**Example:**
```markdown
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vite.dev/)
```

### Pattern 3: Quick Start Section
**What:** Minimal commands to get the project running, with Docker as primary path.
**Example:**
```markdown
## Quick Start

```bash
git clone https://github.com/user/miroslaw-ryba.git
cd miroslaw-ryba
cp .env.example .env        # Edit with your API keys
docker compose up -d         # Start MiroFish backend
npm install && npm run dev   # Start frontend
```
```

### Anti-Patterns to Avoid
- **Wall of text README:** Break into scannable sections with headers, badges, and screenshots
- **Outdated prerequisites:** Always reference actual versions from package.json
- **Undocumented env vars:** Every variable in .env.example must be documented
- **Monolingual CONTRIBUTING.md for bilingual project:** Include Polish notes for local contributors

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| License text | Custom license wording | GNU AGPL-3.0 verbatim text | Legal compliance requires exact text |
| Badge images | Custom badge SVGs | shields.io badge URLs | Standard, auto-updating, recognized |
| Screenshot hosting | External image hosting | Relative paths to assets in repo | Stable, no external dependencies |

## Common Pitfalls

### Pitfall 1: Incorrect AGPL-3.0 License
**What goes wrong:** Modified or abbreviated license text invalidates compliance.
**Why it happens:** Copy-paste from wrong source or editing the license text.
**How to avoid:** Use the exact GNU AGPL-3.0 text from gnu.org. The LICENSE file must contain the complete, unmodified text. Set copyright line to project-appropriate values.
**Warning signs:** LICENSE file is significantly shorter than ~34KB.

### Pitfall 2: README Screenshots with Absolute Paths
**What goes wrong:** Screenshots break when repo is cloned or forked.
**Why it happens:** Using absolute URLs or paths outside the repo.
**How to avoid:** Use relative paths like `docs/screenshots/graph.png`. Create a screenshots directory.
**Warning signs:** Images use `file://` or absolute system paths.

### Pitfall 3: Docker Instructions Diverging from docker-compose.yml
**What goes wrong:** Users follow README steps but get errors because docs don't match actual config.
**Why it happens:** Docker config evolves during development, docs written later don't reflect final state.
**How to avoid:** Reference actual docker-compose.yml content when writing docs. Use the real service names, ports, and environment variables.
**Warning signs:** Port numbers, service names, or env vars in docs differ from docker-compose.yml.

### Pitfall 4: Missing Prerequisites
**What goes wrong:** Users can't install because undocumented system requirements (Node version, Docker version, etc.)
**Why it happens:** Developer has everything installed, doesn't realize what's needed from scratch.
**How to avoid:** List explicit version requirements: Node.js >= 18, Docker >= 24, pnpm (if used).
**Warning signs:** No version numbers next to prerequisites.

### Pitfall 5: Polish Translation Drift
**What goes wrong:** README.pl.md gets out of sync with README.md over time.
**Why it happens:** Structure and content are maintained independently.
**How to avoid:** Create README.pl.md as a direct structural mirror of README.md. Same sections, same order, same anchors where possible.
**Warning signs:** Section count or order differs between EN and PL versions.

## Code Examples

### README.md Structure (Verified from CONTEXT.md decisions)
```markdown
<!-- Language switch -->
> **[Przeczytaj po polsku](README.pl.md)**

<!-- Badges -->
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)
...

# Miroslaw Ryba

One-line description of the project.

<!-- Screenshots -->
![Graph Construction](docs/screenshots/graph.png)
![Simulation](docs/screenshots/simulation.png)
![Report](docs/screenshots/report.png)

## Features

- 5-stage prediction pipeline (Graph -> Environment -> Simulation -> Reports -> Chat)
- Dark mode with OS preference detection
- Keyboard shortcuts for common actions
- Bilingual interface (Polish / English)
- Full configuration panel (API keys, models, Docker)
- Interactive knowledge graph visualization
- Real-time dual-platform simulation monitoring
- PDF and Markdown report export
- AI agent conversations

## Quick Start

...

## Documentation

- [Installation Guide](docs/installation.md)
- [Configuration Guide](docs/configuration.md)
- [Contributing](CONTRIBUTING.md)

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
Based on [MiroFish](https://github.com/666ghj/MiroFish) by Shanda Group.
```

### docs/installation.md Structure
```markdown
# Installation Guide

## Prerequisites

- **Docker** >= 24.0 (for backend)
- **Docker Compose** v2 (included with Docker Desktop)
- **Node.js** >= 18.0 (for frontend development)
- **npm** >= 9.0

## Option 1: Docker (Recommended)

### 1. Clone the repository
git clone ...
cd miroslaw-ryba

### 2. Configure environment
cp .env.example .env
# Edit .env with your API keys (see Configuration Guide)

### 3. Start MiroFish backend
docker compose up -d

### 4. Start frontend
npm install
npm run dev

### 5. Verify
Open http://localhost:5173

## Option 2: Source Deployment

### Backend
(Python requirements, manual backend setup)

### Frontend
npm install
npm run dev
```

### docs/configuration.md Structure
```markdown
# Configuration Guide

## Environment Variables

All configuration is done via `.env` file in the project root.

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| LLM_API_KEY | OpenAI-compatible API key | sk-... |
| LLM_BASE_URL | API endpoint URL | https://dashscope.aliyuncs.com/compatible-mode/v1 |
| LLM_MODEL_NAME | Model to use | qwen-plus |
| ZEP_API_KEY | Zep Cloud API key | z_... |

### Optional

| Variable | Description | Default |
|----------|-------------|---------|
| BACKEND_PORT | Backend port | 5050 |
| VITE_PORT | Frontend dev server port | 5173 |
| LLM_BOOST_API_KEY | Secondary LLM for faster processing | (empty) |
| LLM_BOOST_BASE_URL | Secondary LLM endpoint | (empty) |
| LLM_BOOST_MODEL_NAME | Secondary model name | (empty) |

## UI Configuration

Configuration can also be done through the Settings panel in the UI...
```

### CONTRIBUTING.md Structure
```markdown
# Contributing to Miroslaw Ryba

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Start backend: `docker compose up -d`
4. Start dev server: `npm run dev`

## Code Style

- **TypeScript** with strict mode
- **ESLint** flat config (eslint.config.mjs)
- **Prettier** for formatting (semi: false, singleQuote: true, printWidth: 100)
- Run `npm run lint` before committing
- Run `npm run format` to auto-format

## Project Structure

src/
├── api/          # API client modules
├── app/          # App shell, router, providers
├── components/   # Shared UI components (shadcn/ui)
├── features/     # Feature modules (one per pipeline stage)
├── hooks/        # Shared hooks
├── i18n/         # i18n configuration
├── lib/          # Utility functions
├── locales/      # Translation files (pl/, en/)
├── styles/       # Global styles, Tailwind
└── types/        # Shared TypeScript types

## Pull Request Process

1. Create a feature branch from main
2. Make changes with tests
3. Run `npm run lint && npm run test`
4. Submit PR with description

## Internationalization

All UI strings must go through react-i18next. Add translations to both:
- src/locales/pl/*.json (Polish - default)
- src/locales/en/*.json (English)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Single-language README | Bilingual with language switcher | Common practice 2020+ | Wider audience reach |
| README-only docs | README + docs/ directory | GitHub standard | Keeps README concise |
| MIT/Apache default | AGPL-3.0 (upstream requirement) | MiroFish license | Must comply |

## Key Data Points from Project

### From package.json
- **Project name:** miroslaw-ryba
- **Version:** 0.0.1
- **Scripts:** dev, build, preview, lint, format, test, test:watch, typecheck
- **Package manager:** npm (with pnpm.onlyBuiltDependencies suggesting pnpm compatibility)

### From docker-compose.yml
- **Service:** mirofish-backend
- **Image:** ghcr.io/666ghj/MiroFish:latest
- **Internal port:** 5001
- **External port:** ${BACKEND_PORT:-5050}
- **Volume:** ./data/uploads:/app/backend/uploads
- **Command:** python backend/run.py
- **Healthcheck:** curl http://localhost:5001/health

### From .env.example
- LLM_API_KEY, LLM_BASE_URL (default: dashscope.aliyuncs.com), LLM_MODEL_NAME (default: qwen-plus)
- ZEP_API_KEY
- LLM_BOOST_API_KEY, LLM_BOOST_BASE_URL, LLM_BOOST_MODEL_NAME (optional)
- BACKEND_PORT (default: 5050), VITE_PORT (default: 5173)

### From eslint.config.mjs
- Flat config format (ESLint 9+)
- typescript-eslint recommended rules
- react-hooks plugin
- Ignores: dist/, node_modules/, backend/

### From .prettierrc
- semi: false
- singleQuote: true
- trailingComma: all
- printWidth: 100
- tabWidth: 2

### Feature Modules (from src/features/)
- chat, dashboard, environment, errors, graph, reports, settings, simulation

### Locales
- Polish (pl/) and English (en/) with 10 namespaces each

### Screenshot Candidates (from pipeline stages)
- Graph construction visualization (Reagraph interactive graph)
- Dual-platform simulation view (Twitter/Reddit split)
- Report view with markdown rendering
- Settings/configuration panel
- Chat interface with agent context

## Open Questions

1. **Screenshot placeholders vs actual screenshots**
   - What we know: CONTEXT.md specifies 2-3 screenshots from main screens
   - What's unclear: Whether actual screenshot images exist or need to be captured
   - Recommendation: Use placeholder references (`docs/screenshots/*.png`) with `<!-- TODO: capture screenshot -->` comments. Screenshots require a running instance with data, which may not be available during docs authoring.

2. **GitHub repository URL**
   - What we know: Project will be open-source on GitHub
   - What's unclear: Exact repository URL (user/org name)
   - Recommendation: Use placeholder `https://github.com/OWNER/miroslaw-ryba` that can be find-and-replaced before release.

3. **CHANGELOG.md inclusion**
   - What we know: Listed under Claude's Discretion
   - Recommendation: Skip for initial release. The project is v0.0.1 and git history serves as changelog. Add when there are actual releases to document.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual review (documentation phase) |
| Config file | N/A |
| Quick run command | `cat README.md \| head -5` (verify file exists) |
| Full suite command | Verify all 6 files exist at correct paths |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DOCS-01 | README.md exists with required sections | smoke | `test -f README.md && grep -c "##" README.md` | No - Wave 0 |
| DOCS-02 | README.pl.md exists with matching structure | smoke | `test -f README.pl.md && grep -c "##" README.pl.md` | No - Wave 0 |
| DOCS-03 | Installation guide exists | smoke | `test -f docs/installation.md` | No - Wave 0 |
| DOCS-04 | Configuration guide exists | smoke | `test -f docs/configuration.md` | No - Wave 0 |
| DOCS-05 | CONTRIBUTING.md exists | smoke | `test -f CONTRIBUTING.md` | No - Wave 0 |
| DOCS-06 | LICENSE exists with AGPL-3.0 | smoke | `test -f LICENSE && grep -q "GNU AFFERO GENERAL PUBLIC LICENSE" LICENSE` | No - Wave 0 |

### Sampling Rate
- **Per task commit:** Verify created files exist and have content
- **Per wave merge:** All 6 files present, README sections match spec
- **Phase gate:** All files exist, LICENSE is valid AGPL-3.0, README.pl.md structurally mirrors README.md

### Wave 0 Gaps
None -- documentation phase creates files from scratch, no test infrastructure needed. Validation is file existence and content review.

## Sources

### Primary (HIGH confidence)
- Project files: package.json, docker-compose.yml, .env.example, eslint.config.mjs, .prettierrc -- actual project configuration
- CONTEXT.md -- user decisions for this phase
- REQUIREMENTS.md -- DOCS-01 through DOCS-06 specifications
- ROADMAP.md -- complete phase and feature list

### Secondary (MEDIUM confidence)
- GNU AGPL-3.0 license text format -- well-known standard, available at gnu.org/licenses/agpl-3.0.txt
- shields.io badge format -- standard open-source practice

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no libraries needed, plain markdown files
- Architecture: HIGH -- file locations and structure defined in CONTEXT.md
- Pitfalls: HIGH -- common documentation issues are well-understood
- Content accuracy: HIGH -- all data points extracted from actual project files

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (stable -- documentation patterns don't change)
