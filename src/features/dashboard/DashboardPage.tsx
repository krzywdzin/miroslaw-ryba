import { useTranslation } from 'react-i18next'
import { BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SystemStatus } from './components/SystemStatus'
import { EmptyState } from './components/EmptyState'

export function DashboardPage() {
  const { t } = useTranslation('dashboard')

  return (
    <div className="mx-auto max-w-[640px] space-y-8">
      {/* Hero */}
      <div>
        <h1 className="text-[30px] font-semibold">{t('heading')}</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          {t('subheading')}
        </p>
      </div>

      {/* System Status */}
      <SystemStatus />

      {/* Recent Simulations */}
      <div>
        <h2 className="text-[22px] font-semibold">{t('recentSimulations')}</h2>
        <EmptyState
          icon={BarChart3}
          heading={t('emptyState.heading')}
          body={t('emptyState.body')}
        />
      </div>

      {/* Quick-start CTA */}
      <Button size="lg" className="w-full sm:w-auto">
        {t('quickStart')}
      </Button>
    </div>
  )
}
