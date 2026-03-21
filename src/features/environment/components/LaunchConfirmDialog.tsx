import { useTranslation } from 'react-i18next'
import type { SimulationFormValues } from '@/features/settings/schemas/config.schema'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

interface LaunchConfirmDialogProps {
  params: SimulationFormValues
  onConfirm: () => void
  disabled: boolean
}

export function LaunchConfirmDialog({
  params,
  onConfirm,
  disabled,
}: LaunchConfirmDialogProps) {
  const { t } = useTranslation('environment')

  const platforms = [
    params.enableTwitter && t('parameters.twitter'),
    params.enableReddit && t('parameters.reddit'),
  ]
    .filter(Boolean)
    .join(' + ')

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="lg" disabled={disabled} data-testid="launch-button">
          {t('launch.button')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('launch.confirm.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('launch.confirm.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="text-sm space-y-1 py-2">
          <p>
            {t('parameters.summary.agents')}: <strong>{params.agentCount}</strong>
          </p>
          <p>
            {t('parameters.summary.rounds')}: <strong>{params.maxRounds}</strong>
          </p>
          <p>
            {t('parameters.summary.platforms')}: <strong>{platforms}</strong>
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('launch.confirm.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {t('launch.confirm.action')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
