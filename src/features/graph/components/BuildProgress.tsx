import { Check } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { ErrorAlert } from '@/components/shared/ErrorAlert'

interface BuildProgressProps {
  currentStep: number
  error?: string
  onRetry?: () => void
}

const STEP_KEYS = ['analyzing', 'extracting', 'building', 'done'] as const

export function statusToStep(status: string): number {
  switch (status) {
    case 'pending':
      return 0
    case 'processing':
      return 1
    case 'building_relations':
      return 2
    case 'completed':
      return 3
    default:
      return 0
  }
}

export function BuildProgress({ currentStep, error, onRetry }: BuildProgressProps) {
  const { t } = useTranslation('graph')

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">{t('build.title')}</h2>

      <div className="flex items-center gap-2">
        {STEP_KEYS.map((key, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isPending = index > currentStep

          return (
            <div key={key} className="flex items-center gap-2 flex-1">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium shrink-0',
                    isCompleted && 'bg-green-500 text-white',
                    isCurrent && 'bg-accent text-accent-foreground animate-pulse',
                    isPending && 'bg-muted text-muted-foreground',
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    'text-xs text-center',
                    (isCompleted || isCurrent) && 'font-medium',
                    isPending && 'text-muted-foreground',
                  )}
                >
                  {t(`build.steps.${key}`)}
                </span>
              </div>
              {index < STEP_KEYS.length - 1 && (
                <div
                  className={cn(
                    'h-0.5 flex-1 -mt-5',
                    index < currentStep ? 'bg-green-500' : 'bg-muted',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {error && (
        <ErrorAlert message={error} onRetry={onRetry} />
      )}
    </div>
  )
}
