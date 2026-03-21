import { useTranslation } from 'react-i18next'
import { SectionNav } from './components/SectionNav'
import { ApiKeysSection } from './components/ApiKeysSection'
import { ModelSection } from './components/ModelSection'
import { SimulationSection } from './components/SimulationSection'

export function SettingsPage() {
  const { t } = useTranslation('settings')

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-[30px] font-semibold leading-[1.1]">
          {t('pageTitle')}
        </h1>
        <p className="mt-1 text-[15px] text-muted-foreground">
          {t('pageSubtitle')}
        </p>
      </div>

      <div className="flex gap-8">
        <SectionNav />

        <div className="max-w-[720px] flex-1 space-y-12">
          <ApiKeysSection />
          <ModelSection />
          <SimulationSection />
        </div>
      </div>
    </div>
  )
}
