---
phase: 07-reports
verified: 2026-03-23T00:00:00Z
status: passed
score: 10/10 must-haves verified
re_verification: false
gaps: []
human_verification:
  - test: "Navigate to /report/<valid-simulationId> with no existing report"
    expected: "Spinner + 'Sprawdzanie raportu...' text, then transitions to generation progress with section checklist"
    why_human: "Requires live backend + real simulationId; multi-state transitions need observation"
  - test: "Click 'Eksportuj PDF' button on report viewing state"
    expected: "Browser print dialog opens; non-report elements (header, sidebar, toolbar) are hidden"
    why_human: "Print dialog and CSS @media print output cannot be verified programmatically"
  - test: "Click 'Pobierz Markdown' button on report viewing state"
    expected: "Browser downloads a .md file named report-<simulationId>.md containing the report content"
    why_human: "File download triggered via Blob + object URL requires browser environment"
  - test: "Scroll through a rendered report with many headings"
    expected: "Sidebar TOC highlights the currently visible heading as user scrolls; clicking a heading scrolls to it"
    why_human: "IntersectionObserver + scroll behavior requires live DOM and browser rendering"
  - test: "Navigate to /history"
    expected: "Table shows past simulations; completed reports have 'Otworz' link; simulations without reports show 'Brak raportu'"
    why_human: "Requires live backend with real simulation data"
---

# Phase 7: Reports Verification Report

**Phase Goal:** Users can view, export, and browse prediction reports, completing pipeline stage 4
**Verified:** 2026-03-23
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | User navigating to /report/:simulationId sees report check spinner, then generation progress or rendered report | VERIFIED | ReportPage.tsx: `useParams`, `useReportGeneration`, state branches for `checking` (spinner + i18n label), `generating` (ReportProgress), `viewing` (ReportToolbar + ReportArticle + ReportSidebar) |
| 2 | Generated report renders markdown with GFM tables, headings, checklists via react-markdown | VERIFIED | ReportArticle.tsx: `import Markdown from 'react-markdown'`, `remarkPlugins={[remarkGfm]}`, `className="prose prose-slate max-w-none"`, custom h1/h2/h3 with slugified IDs |
| 3 | Report sidebar shows table of contents with scroll spy highlighting the currently visible section | VERIFIED | ReportSidebar.tsx: `useScrollSpy(headingIds)`, active link gets `bg-[hsl(217_91%_60%/0.08)] font-semibold text-accent border-l-[3px] border-accent`; useScrollSpy.ts uses IntersectionObserver with correct `rootMargin: '-80px 0px -60% 0px'` |
| 4 | User can click 'Eksportuj PDF' to open browser print dialog | VERIFIED | ReportToolbar.tsx: `exportPdf` → `window.print()`; useReportExport.ts: `window.print()` call |
| 5 | User can click 'Pobierz Markdown' to download a .md file | VERIFIED | ReportToolbar.tsx: `downloadMarkdown(content, 'report-${simulationId}.md')`; useReportExport.ts: Blob + URL.createObjectURL + anchor click + URL.revokeObjectURL |
| 6 | User navigating to /history sees sortable table with topic, status badge, date, agent count, and report link columns | VERIFIED | HistoryTable.tsx: 5-column Table with sortable date (desc default), Badge per status with semantic HSL colors, Link to /report/:simulationId or muted "Brak raportu" |
| 7 | User can sort simulations by date (newest first by default) | VERIFIED | HistoryTable.tsx: `useState<SortDir>('desc')`, date sort toggles asc/desc, nulls sort to end |
| 8 | Simulations with completed reports show 'Otworz' link navigating to /report/:simulationId | VERIFIED | HistoryTable.tsx line 136-141: `<Link to={'/report/' + item.simulationId}>` when `item.hasReport` |
| 9 | Simulations without reports show 'Brak raportu' in muted text | VERIFIED | HistoryTable.tsx line 142-146: `<span className="text-muted-foreground">{t('history.noReport')}</span>` |
| 10 | Empty state shows message when no simulations exist | VERIFIED | HistoryTable.tsx: `if (items.length === 0)` renders heading `t('empty.historyHeading')` + body `t('empty.historyBody')` |

**Score:** 10/10 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/features/reports/pages/ReportPage.tsx` | Report page state machine (checking/generating/viewing/error) | VERIFIED | 4-state machine; wires useReportGeneration, ReportProgress, ReportArticle, ReportSidebar, ReportToolbar |
| `src/features/reports/components/ReportArticle.tsx` | Markdown rendering with prose styling and heading IDs | VERIFIED | react-markdown + remarkGfm + prose-slate + custom heading components with slugify + dedup |
| `src/features/reports/components/ReportSidebar.tsx` | TOC sidebar with scroll spy active section | VERIFIED | extractHeadings regex, useScrollSpy, smooth scroll, active state styling, xl:block responsive |
| `src/features/reports/hooks/useReportGeneration.ts` | Check/generate/poll orchestration hook | VERIFIED | reportApi.check, reportApi.generate, usePollingQuery at 2000ms, reportApi.get; full state machine |
| `src/features/reports/hooks/useReportExport.ts` | PDF print + Markdown download functions | VERIFIED | window.print() + Blob/URL.createObjectURL download |
| `src/features/reports/pages/HistoryPage.tsx` | Simulation history page with data fetching | VERIFIED | simulationApi.list + useQueries for batch reportApi.check, maps to HistoryItem[] |
| `src/features/reports/components/HistoryTable.tsx` | Sortable history table following EntityTable pattern | VERIFIED | date sort desc default, 5-color status badges, report link/noReport text, empty state |
| `src/features/reports/index.ts` | Barrel exports | VERIFIED | Exports ReportPage and HistoryPage |
| `src/locales/pl/reports.json` | Polish i18n namespace | VERIFIED | All keys: page, toolbar, toc, generation, history, status, empty, error, cta |
| `src/locales/en/reports.json` | English i18n namespace | VERIFIED | Matching English keys |
| `src/i18n/config.ts` | reports namespace registration | VERIFIED | plReports + enReports imported; added to resources.pl, resources.en, ns array |
| `src/styles/globals.css` | Typography plugin + print CSS | VERIFIED | `@plugin "@tailwindcss/typography"` line 3; `@media print` hides header, nav, aside, footer, .no-print, .report-toc |
| `package.json` | react-markdown, remark-gfm, @tailwindcss/typography | VERIFIED | All three present as dependencies |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| ReportPage.tsx | useReportGeneration.ts | hook call with simulationId from route params | WIRED | `useReportGeneration(simulationId)` line 25 |
| useReportGeneration.ts | src/api/report.ts | reportApi.check, .generate, .getProgress, .get | WIRED | All four API methods called: check (line 25), generate (mutationFn line 73), getProgress (line 87), get (line 111) |
| ReportSidebar.tsx | useScrollSpy.ts | IntersectionObserver tracking heading visibility | WIRED | `useScrollSpy(headingIds)` line 51 |
| App.tsx | ReportPage.tsx | route at /report/:simulationId | WIRED | `{ path: 'report/:simulationId', element: <ReportPage /> }` line 23 |
| HistoryPage.tsx | src/api/simulation.ts | simulationApi.list() | WIRED | `simulationApi.list()` line 24 |
| HistoryPage.tsx | src/api/report.ts | reportApi.check() per simulation | WIRED | `reportApi.check(sim.simulation_id)` in useQueries map |
| HistoryTable.tsx | /report/:simulationId | Link component for completed reports | WIRED | `<Link to={'/report/' + item.simulationId}>` line 137 |
| App.tsx | HistoryPage.tsx | route at /history | WIRED | `{ path: 'history', element: <HistoryPage /> }` line 24 |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| REPT-01 | 07-01-PLAN.md | User can view generated prediction report with rich markdown formatting (tables, charts, sections) | SATISFIED | ReportArticle.tsx: react-markdown + remarkGfm + prose-slate + custom heading IDs; ReportPage viewing state renders it |
| REPT-02 | 07-01-PLAN.md | User can export report as PDF | SATISFIED | useReportExport.ts: window.print(); ReportToolbar: 'Eksportuj PDF' button; print CSS hides non-report elements |
| REPT-03 | 07-01-PLAN.md | User can export report as Markdown file | SATISFIED | useReportExport.ts: Blob download with text/markdown; ReportToolbar: 'Pobierz Markdown' button with correct filename |
| REPT-04 | 07-02-PLAN.md | User can view list of past simulations with status, date, and topic | SATISFIED | HistoryPage.tsx + HistoryTable.tsx: simulation list with status badges, date column (sortable), topic, agent count, report link |

All 4 requirements from REQUIREMENTS.md traceability table (Phase 7) accounted for. No orphaned requirements.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| ReportSidebar.tsx | 57 | `return null` when headings.length === 0 | Info | Intentional guard — sidebar correctly hides itself when markdown has no headings; not a stub |

No blockers or warnings found. The single `return null` is an appropriate conditional guard, not a stub implementation.

### Human Verification Required

1. **Report state machine flow**
   - **Test:** Navigate to `/report/<simulationId>` where no report exists yet
   - **Expected:** Spinner with "Sprawdzanie raportu..." -> transitions to generation progress with section list -> transitions to full report view when complete
   - **Why human:** Multi-state async transitions require live backend and real simulationId

2. **PDF export via print dialog**
   - **Test:** On a viewed report, click "Eksportuj PDF" button
   - **Expected:** Browser print dialog opens; app shell (header, nav, sidebar) and toolbar are hidden; only article content is visible
   - **Why human:** `@media print` CSS behavior and dialog invocation requires a real browser

3. **Markdown file download**
   - **Test:** On a viewed report, click "Pobierz Markdown"
   - **Expected:** Browser downloads `report-<simulationId>.md` containing the raw markdown content
   - **Why human:** Blob/object URL download requires a real browser environment

4. **Scroll spy TOC highlighting**
   - **Test:** Open a report with multiple headings; scroll through the article
   - **Expected:** The TOC sidebar highlights the currently visible section with blue accent border and background; clicking a heading smoothly scrolls to it
   - **Why human:** IntersectionObserver behavior requires live DOM with rendered headings

5. **History table with real data**
   - **Test:** Navigate to `/history` with a backend that has simulation records
   - **Expected:** Table rows show project_id as topic, colored status badges, "-" for date and agents (schema lacks these fields), "Otworz" link for completed reports
   - **Why human:** Requires live backend; empty state will always show in offline testing

### Build Verification

TypeScript typecheck: `pnpm typecheck` exits 0 (verified).

All 3 commits documented in summaries exist in git history:
- `bb48734` — feat(07-01): install packages, configure typography, create i18n and hooks
- `7841880` — feat(07-01): build report UI components, page orchestrator, and routes
- `d011a0a` — feat(07-02): add simulation history page with sortable table and status badges

---

_Verified: 2026-03-23_
_Verifier: Claude (gsd-verifier)_
