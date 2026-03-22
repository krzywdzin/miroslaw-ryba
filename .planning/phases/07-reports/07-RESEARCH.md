# Phase 7: Reports - Research

**Researched:** 2026-03-22
**Domain:** Markdown rendering, PDF export, report generation UI, simulation history
**Confidence:** HIGH

## Summary

Phase 7 completes pipeline stage 4 by implementing report viewing, export, and simulation history browsing. The core technical challenges are: (1) rendering rich markdown with GFM tables/checklists via react-markdown, (2) implementing an article + sidebar layout with scroll spy for section navigation, (3) PDF export via browser print dialog, (4) report generation progress tracking with polling, and (5) a simulation history table.

The existing codebase provides strong foundations: `reportApi` is fully typed with Zod schemas, `usePollingQuery` handles generation progress polling, `EntityTable` provides the sortable table pattern for history, and shadcn/ui components (Progress, Badge, Table, ScrollArea) are already installed. Three new packages are needed: `react-markdown`, `remark-gfm`, and `@tailwindcss/typography`.

**Primary recommendation:** Build three pages -- ReportGeneratingPage (progress), ReportViewPage (article + sidebar), HistoryPage (table) -- following the feature-based directory pattern at `src/features/reports/`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Article layout with sidebar navigation: full-page rendered markdown on the left, sticky table of contents (outline) on the right
- Sidebar shows section list from report outline -- clicking a section scrolls to it
- Scroll spy: sidebar highlights the currently visible section as user scrolls
- Markdown rendered via react-markdown + remark-gfm plugin -- supports tables, checklists, links
- Styling via Tailwind Typography plugin (`prose` classes)
- Toolbar at top with export actions
- PDF: browser print dialog via `window.print()` with `@media print` CSS -- no additional libraries
- Markdown: download as .md file -- Blob from `markdown_content` + download link
- Both actions as buttons in the toolbar above the report
- Separate page at `/history` -- link in sidebar navigation
- Table layout with columns: topic, status (badge), date, agent count, report link
- Sortable by date (newest first by default)
- "Otworz" link in report column navigates to report view (if report exists)
- Simulations without reports show disabled/empty state in report column
- Consistent with EntityTable pattern from Phase 5
- Auto-triggered: when user clicks "Przejdz do raportu" from simulation page, check via `report.check` -- if no report, auto-call `report.generate`
- Section-based progress display: list of report sections with checkmarks (done/in-progress/pending)
- Progress bar with percentage at top
- Polling via `usePollingQuery` for `report.getProgress` endpoint
- After generation complete, auto-transition to report view

### Claude's Discretion
- Exact prose typography (font sizes, line heights, margins within the article)
- Print CSS specifics (page breaks, header/footer hiding)
- Section navigation smooth scroll behavior
- Scroll spy intersection observer thresholds
- Empty state design for history page
- Error handling during report generation (timeout, failure)
- Toolbar button styles and placement
- Responsive behavior -- sidebar may collapse on narrower screens
- How report check/generate flow handles edge cases (already generating, failed previous attempt)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| REPT-01 | User can view generated prediction report with rich markdown formatting (tables, charts, sections) | react-markdown + remark-gfm for GFM rendering, @tailwindcss/typography for prose styling, article+sidebar layout with scroll spy |
| REPT-02 | User can export report as PDF | window.print() with @media print CSS -- zero extra dependencies |
| REPT-03 | User can export report as Markdown file | Blob API + URL.createObjectURL for .md download |
| REPT-04 | User can view list of past simulations with status, date, and topic | simulationApi.list() + reportApi.check() for report status, EntityTable-consistent sortable table |
</phase_requirements>

## Standard Stack

### Core (NEW packages to install)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| react-markdown | 10.1.0 | Render markdown as React components | De facto standard for React markdown rendering, ESM-only, well-maintained |
| remark-gfm | 4.0.1 | GFM extension (tables, checklists, strikethrough) | Required for GFM table/tasklist support in react-markdown |
| @tailwindcss/typography | 0.5.19 | `prose` classes for typographic defaults | Official Tailwind plugin for styling rendered HTML/markdown content |

### Already Installed (use as-is)
| Library | Purpose | How Used |
|---------|---------|----------|
| @tanstack/react-query | Data fetching + polling | useQuery for report data, usePollingQuery for generation progress |
| zustand | Pipeline state | simulationStore provides simulationId |
| react-router | Routing | /report/:id and /history routes |
| lucide-react | Icons | Download, FileText, Printer, Check, Circle, Loader icons |
| shadcn/ui (progress) | Progress bar | Generation progress percentage |
| shadcn/ui (badge) | Status badges | Simulation status in history table |
| shadcn/ui (table) | Table component | History table foundation |
| shadcn/ui (scroll-area) | Scroll container | Report content scrollable area |
| shadcn/ui (button) | Action buttons | Toolbar export buttons |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-markdown | dangerouslySetInnerHTML | XSS risk, no React component tree, no custom renderers |
| window.print() | html2pdf.js / react-to-pdf | User decision: use print dialog, zero dependency approach |
| @tailwindcss/typography | Manual CSS | Massive effort to style all HTML elements, prose handles it perfectly |

**Installation:**
```bash
pnpm add react-markdown remark-gfm @tailwindcss/typography
```

## Architecture Patterns

### Recommended Project Structure
```
src/features/reports/
  index.ts                    # Public exports
  pages/
    ReportPage.tsx            # Router entry -- orchestrates check/generate/view
    HistoryPage.tsx           # Simulation history table
  components/
    ReportToolbar.tsx         # Export buttons (PDF, Markdown)
    ReportArticle.tsx         # Markdown rendering with prose styling
    ReportSidebar.tsx         # Table of contents with scroll spy
    ReportProgress.tsx        # Generation progress (sections + progress bar)
    HistoryTable.tsx          # Sortable history table (EntityTable pattern)
  hooks/
    useReportGeneration.ts    # Check/generate/poll orchestration hook
    useScrollSpy.ts           # Intersection Observer for active section
    useReportExport.ts        # PDF print + Markdown download logic
```

### Pattern 1: Report Page State Machine
**What:** Single ReportPage component that manages three states: checking, generating, viewing
**When to use:** When navigating to /report/:simulationId
**Example:**
```typescript
// ReportPage orchestrates the flow:
// 1. On mount: call reportApi.check(simulationId)
// 2. If has_report=true: fetch report and show ReportArticle
// 3. If has_report=false: call reportApi.generate(simulationId), show ReportProgress
// 4. While generating: poll reportApi.getProgress(reportId) via usePollingQuery
// 5. On complete: auto-transition to report view

type ReportPageState = 'checking' | 'generating' | 'viewing' | 'error'
```

### Pattern 2: Scroll Spy with Intersection Observer
**What:** Track which report section is visible and highlight it in sidebar TOC
**When to use:** ReportSidebar needs to show active section
**Example:**
```typescript
function useScrollSpy(sectionIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first intersecting entry
        const visible = entries.find(e => e.isIntersecting)
        if (visible) setActiveId(visible.target.id)
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [sectionIds])

  return activeId
}
```

### Pattern 3: Markdown Heading Extraction for TOC
**What:** Parse markdown_content to extract headings for sidebar navigation
**When to use:** Building the table of contents from report data
**Example:**
```typescript
// If report.outline is available from API, use it directly.
// Fallback: parse headings from markdown_content
function extractHeadings(markdown: string) {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm
  const headings: { level: number; text: string; id: string }[] = []
  let match
  while ((match = headingRegex.exec(markdown))) {
    const text = match[2]
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    headings.push({ level: match[1].length, text, id })
  }
  return headings
}
```

### Pattern 4: Print CSS for PDF Export
**What:** Hide non-report elements when printing
**When to use:** PDF export via window.print()
**Example:**
```css
@media print {
  /* Hide app shell */
  header, aside, footer, .no-print { display: none !important; }

  /* Full width for report content */
  main { padding: 0 !important; }
  .report-article { max-width: 100% !important; }

  /* Page break control */
  h2, h3 { break-after: avoid; }
  table, figure { break-inside: avoid; }

  /* Clean background */
  body { background: white !important; }
}
```

### Pattern 5: Markdown File Download
**What:** Create and trigger download of .md file from report content
**When to use:** Export as Markdown button click
**Example:**
```typescript
function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

### Anti-Patterns to Avoid
- **Rendering markdown with dangerouslySetInnerHTML:** XSS risk, loses React component tree benefits
- **Using a PDF library for window.print():** User explicitly chose browser print dialog -- no jsPDF/html2pdf
- **Polling without terminal state check:** Always stop polling when status is 'completed' or 'failed'
- **Storing report content in Zustand:** Reports are large strings -- fetch via TanStack Query with caching, not persist store

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown rendering | Custom parser | react-markdown + remark-gfm | Edge cases in GFM tables, nested lists, escaping |
| Typography styling | Manual CSS for headings/paragraphs/lists/tables | @tailwindcss/typography prose classes | 40+ element styles, responsive sizing, dark mode support |
| Scroll tracking | Manual scroll position math | IntersectionObserver API | Browser-native, performant, handles edge cases |
| File download | Custom fetch + save flow | Blob + URL.createObjectURL | Standard browser API, works cross-browser |
| Data polling | setInterval + fetch | usePollingQuery (existing) | Already handles cleanup, error states, stop conditions |
| Table sorting | Custom sort logic | Follow EntityTable useMemo pattern | Established pattern, consistent UX |

**Key insight:** The report view is primarily a presentation layer -- react-markdown handles the hard part (parsing + rendering), and @tailwindcss/typography handles styling. The custom work is in the orchestration (check/generate/view flow) and navigation (scroll spy).

## Common Pitfalls

### Pitfall 1: react-markdown ESM-only Import Issues
**What goes wrong:** Build errors from CJS/ESM mismatch
**Why it happens:** react-markdown 9+ is ESM-only
**How to avoid:** Project already uses `"type": "module"` in package.json and Vite (ESM-native). No issues expected.
**Warning signs:** "require is not defined" or "ERR_REQUIRE_ESM" errors

### Pitfall 2: Tailwind Typography v4 Plugin Registration
**What goes wrong:** `prose` classes have no effect
**Why it happens:** In Tailwind CSS v4, plugins are registered via `@plugin` directive in CSS, not in tailwind.config.js
**How to avoid:** Add `@plugin "@tailwindcss/typography";` to globals.css after `@import "tailwindcss";`
**Warning signs:** prose class exists in HTML but no typography styles applied

### Pitfall 3: Scroll Spy Race Condition on Mount
**What goes wrong:** No section highlighted on initial render
**Why it happens:** IntersectionObserver fires before markdown content renders, or heading elements don't exist yet
**How to avoid:** Initialize observer AFTER markdown renders (use useEffect with dependency on headings array). Set initial active section from first heading.
**Warning signs:** Sidebar shows no active section until user scrolls

### Pitfall 4: Print CSS Specificity Wars
**What goes wrong:** Sidebar, header, or footer still visible in print
**Why it happens:** Tailwind utility classes have high specificity
**How to avoid:** Use `!important` in @media print rules. Add `no-print` class to elements that must be hidden.
**Warning signs:** Extra UI elements appearing in PDF output

### Pitfall 5: Report Generation Polling Never Stops
**What goes wrong:** Infinite polling after report generation fails
**Why it happens:** isComplete callback doesn't handle 'failed' or 'error' status
**How to avoid:** Check for terminal states: `status === 'completed' || status === 'failed' || status === 'error'`
**Warning signs:** Network tab shows continuous requests after generation should be done

### Pitfall 6: Heading ID Collisions in Markdown
**What goes wrong:** Scroll-to-section navigates to wrong section
**Why it happens:** Two headings generate the same slug (e.g., "Summary" appears twice)
**How to avoid:** Append index or counter to duplicate IDs during heading extraction
**Warning signs:** Clicking TOC item scrolls to wrong position

## Code Examples

### react-markdown with remark-gfm and Custom Heading IDs
```typescript
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ReportArticleProps {
  content: string
}

export function ReportArticle({ content }: ReportArticleProps) {
  return (
    <article className="prose prose-slate max-w-none">
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Add IDs to headings for scroll spy
          h1: ({ children, ...props }) => {
            const id = slugify(String(children))
            return <h1 id={id} {...props}>{children}</h1>
          },
          h2: ({ children, ...props }) => {
            const id = slugify(String(children))
            return <h2 id={id} {...props}>{children}</h2>
          },
          h3: ({ children, ...props }) => {
            const id = slugify(String(children))
            return <h3 id={id} {...props}>{children}</h3>
          },
        }}
      >
        {content}
      </Markdown>
    </article>
  )
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}
```

### Tailwind CSS v4 Typography Setup
```css
/* globals.css */
@import "tailwindcss";
@import "@fontsource-variable/geist";
@plugin "@tailwindcss/typography";

/* ... existing :root and @theme definitions ... */
```

### Report Generation Orchestration Hook
```typescript
function useReportGeneration(simulationId: string) {
  const [state, setState] = useState<'checking' | 'generating' | 'ready' | 'error'>('checking')
  const [reportId, setReportId] = useState<string | null>(null)

  // Step 1: Check if report exists
  const checkQuery = useQuery({
    queryKey: ['report-check', simulationId],
    queryFn: () => reportApi.check(simulationId),
    enabled: state === 'checking',
  })

  // Step 2: Generate if needed (mutation)
  const generateMutation = useMutation({
    mutationFn: () => reportApi.generate({ simulation_id: simulationId }),
    onSuccess: (data) => {
      setReportId(data.data.report_id)
      setState('generating')
    },
    onError: () => setState('error'),
  })

  // Step 3: Poll progress
  const progressQuery = usePollingQuery(
    ['report-progress', reportId],
    () => reportApi.getProgress(reportId!),
    {
      isComplete: (data) => {
        const status = data.data.status
        return status === 'completed' || status === 'failed' || status === 'error'
      },
      interval: 2000,
      enabled: state === 'generating' && !!reportId,
    },
  )

  // React to check result
  useEffect(() => {
    if (!checkQuery.data) return
    if (checkQuery.data.data.has_report) {
      setState('ready')
    } else {
      generateMutation.mutate()
    }
  }, [checkQuery.data])

  // React to generation completion
  useEffect(() => {
    if (progressQuery.data?.data.status === 'completed') {
      setState('ready')
    }
    if (progressQuery.data?.data.status === 'failed') {
      setState('error')
    }
  }, [progressQuery.data])

  return { state, reportId, progress: progressQuery.data?.data }
}
```

### Section Progress Display
```typescript
// Three states per section: done (check), in-progress (spinner), pending (circle)
interface SectionProgress {
  name: string
  status: 'done' | 'in-progress' | 'pending'
}

function ReportProgress({ sections, progress }: { sections: SectionProgress[]; progress: number }) {
  return (
    <div>
      <Progress value={progress} className="mb-6" />
      <ul className="space-y-2">
        {sections.map((s) => (
          <li key={s.name} className="flex items-center gap-2">
            {s.status === 'done' && <Check className="h-4 w-4 text-success" />}
            {s.status === 'in-progress' && <Loader className="h-4 w-4 animate-spin" />}
            {s.status === 'pending' && <Circle className="h-4 w-4 text-muted-foreground" />}
            <span className={s.status === 'pending' ? 'text-muted-foreground' : ''}>
              {s.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-markdown CJS | react-markdown ESM-only (v9+) | 2023 | Must use ESM imports, Vite handles fine |
| tailwind.config.js plugins | @plugin directive in CSS (v4) | 2025 | Typography plugin registered in CSS, not JS config |
| remark-gfm v3 | remark-gfm v4 | 2024 | Peer dependency on unified v11, compatible with react-markdown v10 |

**Deprecated/outdated:**
- `dangerouslySetInnerHTML` for markdown: replaced by react-markdown component approach
- `jsPDF` / `html2pdf.js` for PDF: user chose window.print() approach (simpler, no dependency)

## Open Questions

1. **Report outline format from API**
   - What we know: `ReportSchema.outline` is typed as `z.unknown()` -- could be array of strings or nested objects
   - What's unclear: Exact shape of outline data from backend
   - Recommendation: Parse outline if available, fall back to heading extraction from markdown_content

2. **SimulationStateSchema missing topic/date fields**
   - What we know: Current schema has simulation_id, project_id, status, graph_id, enable_twitter, enable_reddit
   - What's unclear: Where topic and date come from for history table (may need backend data not in schema)
   - Recommendation: Use project_id as topic proxy, add created_at/updated_at as optional fields to schema, display what's available

3. **Agent count for history table**
   - What we know: History table needs agent count column per CONTEXT.md
   - What's unclear: SimulationStateSchema doesn't include agent count
   - Recommendation: Fetch profile count separately or add optional field to schema -- show "-" if unavailable

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 3 + @testing-library/react 16 |
| Config file | vitest.config.ts |
| Quick run command | `pnpm test -- --reporter=verbose` |
| Full suite command | `pnpm test` |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| REPT-01 | Report renders markdown with GFM tables/headings | unit | `pnpm test -- src/features/reports/components/ReportArticle.test.tsx` | No -- Wave 0 |
| REPT-01 | Scroll spy highlights active section | unit | `pnpm test -- src/features/reports/hooks/useScrollSpy.test.ts` | No -- Wave 0 |
| REPT-02 | PDF export calls window.print() | unit | `pnpm test -- src/features/reports/hooks/useReportExport.test.ts` | No -- Wave 0 |
| REPT-03 | Markdown export creates Blob download | unit | `pnpm test -- src/features/reports/hooks/useReportExport.test.ts` | No -- Wave 0 |
| REPT-04 | History table renders simulations with status/date | unit | `pnpm test -- src/features/reports/components/HistoryTable.test.tsx` | No -- Wave 0 |
| REPT-04 | History table sorts by date | unit | `pnpm test -- src/features/reports/components/HistoryTable.test.tsx` | No -- Wave 0 |

### Sampling Rate
- **Per task commit:** `pnpm test -- --reporter=verbose`
- **Per wave merge:** `pnpm test && pnpm typecheck`
- **Phase gate:** Full suite green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/features/reports/components/ReportArticle.test.tsx` -- covers REPT-01 markdown rendering
- [ ] `src/features/reports/hooks/useScrollSpy.test.ts` -- covers REPT-01 scroll spy
- [ ] `src/features/reports/hooks/useReportExport.test.ts` -- covers REPT-02, REPT-03 export
- [ ] `src/features/reports/components/HistoryTable.test.tsx` -- covers REPT-04 history
- [ ] `src/features/reports/hooks/useReportGeneration.test.ts` -- covers generation flow

## Sources

### Primary (HIGH confidence)
- `src/api/report.ts` -- Full report API already implemented with typed methods
- `src/api/schemas/report.ts` -- Zod schemas for all report responses
- `src/hooks/usePolling.ts` -- usePollingQuery hook implementation
- `src/features/environment/components/EntityTable.tsx` -- Table pattern reference
- `src/features/simulation/hooks/useSimulationStore.ts` -- Zustand persist store pattern
- `package.json` -- Current dependency versions verified

### Secondary (MEDIUM confidence)
- [react-markdown GitHub](https://github.com/remarkjs/react-markdown) -- ESM-only, component-based API
- [remark-gfm GitHub](https://github.com/remarkjs/remark-gfm) -- GFM extensions for react-markdown
- [Tailwind CSS v4 Typography Discussion](https://github.com/tailwindlabs/tailwindcss/discussions/15904) -- @plugin directive for v4

### Tertiary (LOW confidence)
- None -- all findings verified with primary sources or official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- react-markdown + remark-gfm is the established React markdown solution, versions verified via npm
- Architecture: HIGH -- follows established project patterns (feature directories, hooks, Zustand, TanStack Query)
- Pitfalls: HIGH -- based on direct code inspection (ESM already handled, Tailwind v4 plugin syntax verified)

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (stable ecosystem, no fast-moving dependencies)
