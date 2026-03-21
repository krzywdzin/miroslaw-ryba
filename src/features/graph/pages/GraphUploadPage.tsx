import { useTranslation } from 'react-i18next'

export function GraphUploadPage() {
  const { t } = useTranslation('graph')

  return (
    <div className="flex items-center justify-center py-12">
      <h1 className="text-2xl font-bold">{t('upload.title')}</h1>
    </div>
  )
}
