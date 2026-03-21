import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'

import { useComposeAction } from '../../hooks/useDockerStatus'
import { Button } from '@/components/ui/button'

interface ComposeControlsProps {
  disabled?: boolean
}

export function ComposeControls({ disabled }: ComposeControlsProps) {
  const { t } = useTranslation('settings')
  const composeAction = useComposeAction()
  const [confirming, setConfirming] = useState(false)
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
    }
  }, [])

  function handleStop() {
    if (confirming) {
      setConfirming(false)
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
      composeAction.mutate('down')
    } else {
      setConfirming(true)
      confirmTimer.current = setTimeout(() => setConfirming(false), 3000)
    }
  }

  const isActionPending = composeAction.isPending
  const isDisabled = disabled || isActionPending

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        size="sm"
        onClick={() => composeAction.mutate('up')}
        disabled={isDisabled}
      >
        {isActionPending && composeAction.variables === 'up' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null}
        {t('actions.startBackend')}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={handleStop}
        disabled={isDisabled}
        className={
          confirming
            ? 'text-destructive hover:text-destructive transition-colors duration-150'
            : 'transition-colors duration-150'
        }
      >
        {isActionPending && composeAction.variables === 'down' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : null}
        {confirming ? t('confirmation.areYouSure') : t('actions.stopBackend')}
      </Button>
    </div>
  )
}
