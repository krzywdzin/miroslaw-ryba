import { useTranslation } from 'react-i18next'
import { ExternalLink } from 'lucide-react'

const APP_VERSION = '0.0.1'
const GITHUB_URL = 'https://github.com/antoniosubasic/miroslaw-ryba'

export function Footer() {
  const { t } = useTranslation('common')

  return (
    <footer className="flex h-[var(--footer-height)] shrink-0 items-center justify-between border-t bg-muted px-6 text-[13px] text-muted-foreground">
      <span>v{APP_VERSION}</span>
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
      >
        <ExternalLink className="size-3.5" />
        GitHub
      </a>
      <span>{t('agplNote')}</span>
    </footer>
  )
}
