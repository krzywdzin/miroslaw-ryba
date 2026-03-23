# Phase 10: Documentation and Release - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Project is ready for open-source release on GitHub with complete bilingual documentation — README in English and Polish, installation and configuration guides, contributing guide, and AGPL-3.0 license.

</domain>

<decisions>
## Implementation Decisions

### README structure
- Hero section: project title/logo, one-line description, 2-3 screenshots from main screens (graph, simulation, report)
- Features: bulleted list of key capabilities — 5 pipeline stages, dark mode, keyboard shortcuts, i18n PL/EN
- Quick Start: 3-4 commands to get running (Docker preferred, npm alternative)
- Links section: pointers to docs/installation.md, docs/configuration.md, CONTRIBUTING.md
- Polish README as README.pl.md — complete translation of English version, not a separate document
- Language switch note at top of each README linking to the other

### Documentation location
- docs/ directory in repo root — installation.md, configuration.md
- Linked from README
- Can be later migrated to GitHub Wiki if needed

### Documentation tone
- Professional but friendly — like Tailwind/Vite docs
- Concrete, direct, no jargon
- Emoji in headings acceptable
- Code examples with copy-paste commands

### Installation guide (docs/installation.md)
- Two paths: Docker Compose (recommended) and source deployment
- Docker: prerequisites, clone, docker compose up, verify
- Source: prerequisites (Node.js, Python), clone, install deps, start backend, start frontend
- Environment variables reference

### Configuration guide (docs/configuration.md)
- API key setup (OpenAI-compatible, base URL)
- Model selection (qwen-plus recommended, GPT-4, custom)
- Zep Cloud configuration
- Docker container management
- All with screenshots or code snippets

### CONTRIBUTING.md
- Standard structure: How to contribute, Development setup, Code style (ESLint/Prettier), PR process, Issue templates
- Modeled after popular open-source projects
- Bilingual: primarily English (international audience), Polish notes where relevant

### License
- AGPL-3.0 license file — required by MiroFish upstream license
- License header/notice in README

### Claude's Discretion
- Exact README badges (build status, license, language)
- Screenshot selection and placement
- Installation guide level of detail
- Configuration guide formatting
- CONTRIBUTING.md issue template content
- Whether to add a CHANGELOG.md
- docs/ directory structure beyond the two required files

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Context
- `.planning/PROJECT.md` — Project description, core value, constraints
- `.planning/REQUIREMENTS.md` — Full requirement list (what to document)
- `.planning/ROADMAP.md` — Phase structure (for feature list in README)

### Upstream License
- MiroFish is AGPL-3.0 — derivative work must use same license

### Existing Files
- `package.json` — Project name, scripts, dependencies (for installation guide)
- `docker-compose.yml` or similar — Docker setup (if exists)
- `src/styles/globals.css` — Design system reference
- `.eslintrc.*` or `eslint.config.*` — Code style for CONTRIBUTING.md

### Requirements
- `.planning/REQUIREMENTS.md` — DOCS-01..06 requirements

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- No existing documentation files to build on — all created from scratch
- package.json scripts section — source for development commands
- Existing i18n files — source for supported languages documentation

### Established Patterns
- Bilingual approach: PL default, EN available — same for docs (EN primary, PL translation)
- Feature-based directory structure — relevant for CONTRIBUTING.md dev guide

### Integration Points
- README.md and README.pl.md at repo root
- docs/ directory at repo root
- CONTRIBUTING.md at repo root
- LICENSE at repo root

</code_context>

<specifics>
## Specific Ideas

- Quick Start section is the most important — gets users running in minutes
- Screenshots make the README scannable and impressive for GitHub visitors
- Linking between EN and PL README at the top is standard for bilingual projects
- AGPL-3.0 compliance is non-negotiable — MiroFish enforces it

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 10-documentation-and-release*
*Context gathered: 2026-03-23*
