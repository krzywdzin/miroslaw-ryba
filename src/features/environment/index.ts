import { useTranslation } from 'react-i18next'

export function EnvironmentPage() {
  const { t } = useTranslation('environment')
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold">{t('entities.title')}</h1>
    </div>
  )
}
