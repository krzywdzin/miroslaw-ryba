import { useTranslation } from 'react-i18next'

interface SourcesListProps {
  sources: unknown[] | undefined
}

export function SourcesList({ sources }: SourcesListProps) {
  const { t } = useTranslation('chat')

  if (!sources || sources.length === 0) return null

  return (
    <div className="mt-3 border-t border-muted pt-3">
      <p className="text-xs font-semibold">{t('sources')}</p>
      <ul className="mt-1 list-disc pl-4">
        {sources.map((source, i) => (
          <li key={i} className="text-xs">
            {String(source)}
          </li>
        ))}
      </ul>
    </div>
  )
}
