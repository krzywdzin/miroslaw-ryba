import { useTranslation } from 'react-i18next'
import { useBackendStatus } from '@/hooks/useBackendStatus'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export function SystemStatus() {
  const { t } = useTranslation('dashboard')
  const { isConnected, isLoading } = useBackendStatus()

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="text-[22px] font-semibold">{t('systemStatus')}</h2>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-[15px]">
          {isConnected
            ? t('backendStatus.connected')
            : t('backendStatus.disconnected')}
        </span>
        {isLoading ? (
          <Skeleton className="h-5 w-24" />
        ) : isConnected ? (
          <Badge className="bg-success text-success-foreground">
            {t('backendStatus.connected')}
          </Badge>
        ) : (
          <Badge variant="destructive">
            {t('backendStatus.disconnected')}
          </Badge>
        )}
      </div>
    </div>
  )
}
