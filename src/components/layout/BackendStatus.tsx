import { useTranslation } from 'react-i18next'
import { useBackendStatus } from '@/hooks/useBackendStatus'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export function BackendStatus() {
  const { t } = useTranslation('common')
  const { isConnected, isLoading } = useBackendStatus()

  const label = isConnected ? t('connected') : t('disconnected')

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          aria-label={label}
          className={cn(
            'size-2 rounded-full',
            isLoading && 'animate-pulse bg-muted-foreground',
            !isLoading && isConnected && 'bg-success',
            !isLoading && !isConnected && 'bg-destructive',
          )}
        />
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
