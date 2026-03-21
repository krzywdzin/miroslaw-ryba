import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ParameterSummaryProps {
  values: {
    agentCount: number
    maxRounds: number
    enableTwitter: boolean
    enableReddit: boolean
  }
  onEdit: () => void
}

export function ParameterSummary({ values, onEdit }: ParameterSummaryProps) {
  const { t } = useTranslation('environment')

  const platforms = [
    values.enableTwitter && t('parameters.twitter'),
    values.enableReddit && t('parameters.reddit'),
  ]
    .filter(Boolean)
    .join(' + ')

  return (
    <Card data-testid="parameter-summary">
      <CardContent className="flex items-center justify-between">
        <div className="text-sm space-x-4">
          <span>
            {t('parameters.summary.agents')}: <strong>{values.agentCount}</strong>
          </span>
          <span>
            {t('parameters.summary.rounds')}: <strong>{values.maxRounds}</strong>
          </span>
          <span>
            {t('parameters.summary.platforms')}: <strong>{platforms || '-'}</strong>
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onEdit}
          data-testid="adjust-button"
        >
          {t('parameters.adjust')}
        </Button>
      </CardContent>
    </Card>
  )
}
