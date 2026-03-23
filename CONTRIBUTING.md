# Contributing to Miroslaw Ryba

Thank you for considering contributing! This guide will help you get started.

*Polska wersja wkrotce / Polish version coming soon*

## Development Setup

1. **Fork and clone** the repository:

   ```bash
   git clone https://github.com/YOUR_USERNAME/miroslaw-ryba.git
   cd miroslaw-ryba
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the backend:**

   ```bash
   docker compose up -d
   ```

4. **Start the dev server:**

   ```bash
   npm run dev
   ```

5. **Run tests:**

   ```bash
   npm run test
   ```

For detailed setup instructions, see the [Installation Guide](docs/installation.md).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |

## Code Style

The project uses **TypeScript** with strict mode enabled.

### Linting

- **ESLint 9** flat config (`eslint.config.mjs`) with `typescript-eslint` and `react-hooks` plugins
- Run `npm run lint` before committing

### Formatting

**Prettier** is configured with the following rules:

| Rule | Value |
|------|-------|
| `semi` | `false` |
| `singleQuote` | `true` |
| `trailingComma` | `all` |
| `printWidth` | `100` |
| `tabWidth` | `2` |

Run `npm run format` to auto-format all source files.

### Before Committing

Always run both linting and formatting:

```bash
npm run lint && npm run format
```

## Project Structure

```
src/
├── api/          # API client modules (typed with Zod)
├── app/          # App shell, router, providers
├── components/   # Shared UI components (shadcn/ui)
├── features/     # Feature modules (one per pipeline stage)
│   ├── chat/
│   ├── dashboard/
│   ├── environment/
│   ├── graph/
│   ├── reports/
│   ├── settings/
│   └── simulation/
├── hooks/        # Shared React hooks
├── i18n/         # i18n configuration
├── lib/          # Utility functions
├── locales/      # Translation files (pl/, en/)
├── stores/       # Zustand state stores
├── styles/       # Global styles, Tailwind CSS v4
└── types/        # Shared TypeScript types
```

Each **feature module** in `src/features/` corresponds to a stage in the MiroFish prediction pipeline. New features should follow this pattern -- create a directory under `src/features/` with its own components, hooks, and types.

## Internationalization

All UI strings must go through **react-i18next**. Never hardcode user-facing text.

### Adding Translations

Add translations to **both** locale directories:

- `src/locales/pl/*.json` -- Polish (default language)
- `src/locales/en/*.json` -- English

### Polish Plurals

Polish has **4 plural forms** (CLDR categories). Use ICU MessageFormat for any pluralized strings:

```json
{
  "items": "{count, plural, one {# element} few {# elementy} many {# elementow} other {# elementu}}"
}
```

*Uwaga: Polski jest jezykiem domyslnym aplikacji. Wszystkie nowe teksty musza miec tlumaczenie polskie.*

## Pull Request Process

1. **Create a feature branch** from `main`:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes** with tests where applicable

3. **Ensure all checks pass:**

   ```bash
   npm run lint && npm run test && npm run typecheck
   ```

4. **Submit a PR** with a clear description of your changes

5. **Keep PRs focused** -- one feature or fix per Pull Request

## Issue Reporting

Use **GitHub Issues** for bug reports and feature requests.

### Bug Reports

Please include:

- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Browser and OS information
- Console errors (if applicable)

Label bug reports with **`bug`**.

### Feature Requests

Describe the feature, its use case, and any proposed implementation approach. Label with **`enhancement`**.

## License

By contributing, you agree that your contributions will be licensed under the [AGPL-3.0 License](LICENSE).
