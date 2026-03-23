> **[Przeczytaj po polsku](README.pl.md)** | Read in English (current)

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6-purple.svg)](https://vite.dev/)

# Miroslaw Ryba

A modern React frontend for [MiroFish](https://github.com/666ghj/MiroFish) -- an LLM-powered social simulation platform for prediction and analysis. Replaces the original Chinese Vue interface with a clean Polish/English React SPA.

## Screenshots

![Graph Construction](docs/screenshots/graph.png)
<!-- TODO: capture screenshot of graph visualization -->

![Simulation Dual-Platform View](docs/screenshots/simulation.png)
<!-- TODO: capture screenshot of dual-platform simulation monitoring -->

![Report View](docs/screenshots/report.png)
<!-- TODO: capture screenshot of report with markdown rendering -->

## Features

- 5-stage prediction pipeline (Graph -> Environment -> Simulation -> Reports -> Chat)
- Interactive knowledge graph visualization with entity filtering
- Real-time dual-platform simulation monitoring (Twitter + Reddit)
- PDF and Markdown report export
- AI agent conversations (ReportAgent and simulated agents)
- Dark mode with OS preference detection
- Keyboard shortcuts for common actions
- Bilingual interface (Polish / English)
- Full configuration panel (API keys, models, Docker management)

## Quick Start

```bash
git clone https://github.com/OWNER/miroslaw-ryba.git
cd miroslaw-ryba
cp .env.example .env        # Edit with your API keys
docker compose up -d         # Start MiroFish backend
npm install && npm run dev   # Start frontend at http://localhost:5173
```

## Documentation

- [Installation Guide](docs/installation.md)
- [Configuration Guide](docs/configuration.md)
- [Contributing](CONTRIBUTING.md)

## Tech Stack

| Category | Technology |
|----------|------------|
| UI Framework | React 19 |
| Language | TypeScript 5.7 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Data Fetching | TanStack Query |
| Graph Visualization | Reagraph |
| Internationalization | react-i18next |

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE). Based on [MiroFish](https://github.com/666ghj/MiroFish) by Shanda Group.
