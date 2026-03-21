import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'

interface PredictionInputProps {
  value: string
  onChange: (value: string) => void
}

export function PredictionInput({ value, onChange }: PredictionInputProps) {
  const { t } = useTranslation('graph')

  return (
    <div className="space-y-2">
      <label htmlFor="prediction-goal" className="text-sm font-medium">
        {t('upload.prediction.label')}
      </label>
      <textarea
        id="prediction-goal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('upload.prediction.placeholder')}
        rows={5}
        className={cn(
          'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
          'placeholder:text-muted-foreground',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'resize-y',
        )}
      />
      <p className="text-xs text-muted-foreground">
        {t('upload.prediction.hint')}
      </p>
    </div>
  )
}
