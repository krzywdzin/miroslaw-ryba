# Miroslaw Ryba

## What This Is

A fully-featured, production-grade Polish frontend for MiroFish — an AI-powered multi-agent prediction engine. Miroslaw Ryba replaces the original Chinese Vue frontend with a new, clean, minimalist UI built from scratch, adding a comprehensive configuration panel for API keys, model selection, simulation parameters, and infrastructure settings. The UI supports Polish (default) and English via language switching. This is an open-source project with full bilingual documentation.

## Core Value

Users can interact with the full MiroFish prediction pipeline — from graph construction through simulation to report generation — in a clean, Polish-language interface with complete system configurability.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] New frontend covering all 5 MiroFish features (Graph Construction, Environment Setup, Dual-Platform Simulation, Report Generation, Interactive Dialogue)
- [ ] Full configuration panel (API keys, model selection, simulation parameters, Zep Cloud settings, Docker config)
- [ ] Polish UI with English language toggle (i18n)
- [ ] Minimalist, clean design aesthetic
- [ ] Production-grade quality (error handling, responsiveness, accessibility, tests)
- [ ] Backend deployment setup (Docker/source)
- [ ] Full bilingual documentation (PL + EN) for open-source GitHub release
- [ ] Connected to MiroFish Python backend API

### Out of Scope

- Rewriting the MiroFish Python backend — we use it as-is
- Mobile native app — web-first (responsive)
- Adding new prediction algorithms — frontend only
- Modifying the core agent simulation logic

## Context

- **Base project:** [MiroFish](https://github.com/666ghj/MiroFish) — 37k+ stars, AGPL-3.0 license, by Shanda Group
- **Original stack:** Vue frontend (41.1%), Python backend (57.8%), Docker deployment
- **Original problem:** Entire UI is in Chinese, built by Chinese developers — inaccessible for Polish/international users
- **Backend APIs:** LLM integration (OpenAI SDK format), Zep Cloud for memory, GraphRAG for knowledge graphs
- **Supported models:** Alibaba Bailian qwen-plus (recommended), any OpenAI-compatible API
- **Deployment:** Docker Compose orchestration or source code deployment
- **Target audience:** Polish-speaking users who want to use MiroFish's prediction capabilities, plus international users via English toggle
- **Distribution:** Open-source on GitHub with full documentation

## Constraints

- **Backend compatibility**: Frontend must work with unmodified MiroFish Python backend API
- **License**: Must comply with AGPL-3.0 (MiroFish license) — derivative work must be open-source
- **Language**: UI defaults to Polish, with English as switchable alternative
- **Quality**: Production-grade — not a prototype or PoC
- **AI models**: Use Opus for all GSD planning agents (user preference)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| New frontend from scratch (not fork/translate) | Cleaner architecture, modern stack, easier to maintain | — Pending |
| Stack choice TBD (research phase) | Let research determine best fit for MiroFish backend integration | — Pending |
| Minimalist design | User preference for clean, spacious UI | — Pending |
| i18n from day one | Support PL + EN, extensible for more languages | — Pending |
| Full config panel | Users need to configure API keys, models, Zep, Docker without touching config files | — Pending |
| Bilingual documentation | Open-source project needs EN docs for reach + PL for target audience | — Pending |

---
*Last updated: 2026-03-20 after initialization*
