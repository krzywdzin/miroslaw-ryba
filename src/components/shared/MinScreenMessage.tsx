import { Monitor } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function MinScreenMessage() {
  const { t } = useTranslation()

  return (
    <div
      className="fixed inset-0 z-50 flex min-screen-overlay flex-col items-center justify-center gap-4 bg-background p-8 text-center"
      role="alert"
    >
      <Monitor className="h-16 w-16 text-muted-foreground" />
      <p className="max-w-md text-lg text-muted-foreground">
        {t('common:minScreenWidth')}
      </p>
      <style>{`
        .min-screen-overlay {
          display: flex;
        }
        @media (min-width: 1024px) {
          .min-screen-overlay {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
