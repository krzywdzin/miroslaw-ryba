import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

export function NotFoundPage() {
  const { t } = useTranslation('errors')

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-[22px] font-semibold">{t('pageNotFound')}</h1>
      <Link
        to="/"
        className="text-primary hover:underline"
      >
        {t('returnHome')}
      </Link>
    </div>
  )
}
