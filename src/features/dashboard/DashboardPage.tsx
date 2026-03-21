import { useTranslation } from 'react-i18next'

export function DashboardPage() {
  const { t } = useTranslation('dashboard')

  return (
    <div className="mx-auto max-w-[640px]">
      <h1 className="text-[30px] font-semibold">{t('heading')}</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        {t('subheading')}
      </p>
    </div>
  )
}
