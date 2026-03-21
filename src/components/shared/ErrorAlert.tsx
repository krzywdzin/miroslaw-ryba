import { AlertCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorAlertProps {
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorAlert({ message, onRetry, className }: ErrorAlertProps) {
  const { t } = useTranslation()

  return (
    <Alert variant="destructive" className={cn(className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{message}</AlertTitle>
      {onRetry && (
        <AlertDescription>
          <Button variant="outline" size="sm" onClick={onRetry}>
            {t('common:retry')}
          </Button>
        </AlertDescription>
      )}
    </Alert>
  )
}
