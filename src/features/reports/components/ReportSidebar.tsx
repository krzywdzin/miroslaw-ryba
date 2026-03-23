import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useScrollSpy } from '../hooks/useScrollSpy'
import { cn } from '@/lib/utils'

interface ReportSidebarProps {
  content: string
}

interface HeadingEntry {
  level: number
  text: string
  id: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function extractHeadings(markdown: string): HeadingEntry[] {
  const headings: HeadingEntry[] = []
  const seenIds = new Map<string, number>()
  const regex = /^(#{1,3})\s+(.+)$/gm
  let match

  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const base = slugify(text)
    const count = seenIds.get(base) ?? 0
    seenIds.set(base, count + 1)
    const id = count === 0 ? base : `${base}-${count}`
    headings.push({ level, text, id })
  }

  return headings
}

export function ReportSidebar({ content }: ReportSidebarProps) {
  const { t } = useTranslation('reports')

  const headings = useMemo(() => extractHeadings(content), [content])
  const headingIds = useMemo(
    () => headings.map((h) => h.id),
    [headings],
  )
  const activeId = useScrollSpy(headingIds)

  function scrollToHeading(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  if (headings.length === 0) return null

  return (
    <aside
      className="report-toc no-print sticky top-[104px] hidden w-[240px] shrink-0 xl:block"
      style={{ maxHeight: 'calc(100vh - 104px - 40px)' }}
    >
      <div className="overflow-y-auto rounded-md bg-secondary p-4">
        <h3 className="mb-3 text-[13px] font-semibold leading-[1.4]">
          {t('toc.heading')}
        </h3>
        <nav>
          <ul className="space-y-0.5">
            {headings.map((heading) => {
              const isActive = activeId === heading.id
              return (
                <li key={heading.id}>
                  <button
                    type="button"
                    onClick={() => scrollToHeading(heading.id)}
                    className={cn(
                      'w-full truncate rounded-sm py-1.5 text-left text-[13px] leading-[1.4] transition-colors duration-150 ease-out',
                      heading.level === 3 ? 'pl-7' : 'pl-3',
                      isActive
                        ? 'border-l-[3px] border-accent bg-[hsl(217_91%_60%/0.08)] font-semibold text-accent'
                        : 'border-l-[3px] border-transparent text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {heading.text}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </aside>
  )
}
