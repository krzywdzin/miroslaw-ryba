import { useTranslation } from 'react-i18next'

export function SettingsPage() {
  const { t } = useTranslation('common')

  return (
    <div className="mx-auto max-w-[640px]">
      <h1 className="text-[22px] font-semibold">{t('settings')}</h1>
      <p className="mt-2 text-[15px] text-muted-foreground">
        {t('settingsComingSoon')}
      </p>
    </div>
  )
}
