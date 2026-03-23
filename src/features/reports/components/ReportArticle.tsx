import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'

interface ReportArticleProps {
  content: string
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function ReportArticle({ content }: ReportArticleProps) {
  const seenIds = new Map<string, number>()

  function getUniqueId(text: string): string {
    const base = slugify(text)
    const count = seenIds.get(base) ?? 0
    seenIds.set(base, count + 1)
    return count === 0 ? base : `${base}-${count}`
  }

  const components: Components = {
    h1: ({ children }) => {
      const text = String(children)
      const id = getUniqueId(text)
      return <h1 id={id}>{children}</h1>
    },
    h2: ({ children }) => {
      const text = String(children)
      const id = getUniqueId(text)
      return <h2 id={id}>{children}</h2>
    },
    h3: ({ children }) => {
      const text = String(children)
      const id = getUniqueId(text)
      return <h3 id={id}>{children}</h3>
    },
  }

  return (
    <article
      className="report-article prose prose-slate max-w-none"
      data-testid="report-article"
    >
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </article>
  )
}
