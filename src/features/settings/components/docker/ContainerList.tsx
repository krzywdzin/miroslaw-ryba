import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, Square, RotateCcw, Loader2 } from 'lucide-react'

import type { DockerContainer, ContainerAction } from '../../types/docker.types'
import { useContainerAction } from '../../hooks/useDockerStatus'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const STATUS_COLORS: Record<
  string,
  { bg: string; text: string }
> = {
  running: {
    bg: 'hsl(142 71% 45% / 0.15)',
    text: 'hsl(142 71% 35%)',
  },
  exited: {
    bg: 'hsl(0 84% 60% / 0.15)',
    text: 'hsl(0 84% 45%)',
  },
  paused: {
    bg: 'hsl(38 92% 50% / 0.15)',
    text: 'hsl(38 92% 40%)',
  },
  restarting: {
    bg: 'hsl(38 92% 50% / 0.15)',
    text: 'hsl(38 92% 40%)',
  },
  dead: {
    bg: 'hsl(240 4% 46% / 0.15)',
    text: 'hsl(240 4% 36%)',
  },
}

interface ContainerListProps {
  containers: DockerContainer[]
  isLoading: boolean
  isError: boolean
  composePending?: boolean
}

export function ContainerList({
  containers,
  isLoading,
  isError,
  composePending,
}: ContainerListProps) {
  const { t } = useTranslation('settings')
  const containerAction = useContainerAction()

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{t('docker.unavailable')}</AlertTitle>
        <AlertDescription>{t('docker.unavailableBody')}</AlertDescription>
      </Alert>
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[44px] w-full" />
        ))}
      </div>
    )
  }

  if (containers.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-[15px] text-muted-foreground">
          {t('docker.noContainers')}
        </p>
        <p className="mt-1 text-[13px] text-muted-foreground">
          {t('docker.noContainersBody')}
        </p>
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b text-left text-[13px] font-semibold text-muted-foreground">
          <th className="pb-2">Nazwa</th>
          <th className="pb-2">Obraz</th>
          <th className="pb-2">Status</th>
          <th className="pb-2">Akcje</th>
        </tr>
      </thead>
      <tbody>
        {containers.map((container) => (
          <ContainerRow
            key={container.Id}
            container={container}
            onAction={(action) =>
              containerAction.mutate({
                containerId: container.Id,
                action,
              })
            }
            actionPending={containerAction.isPending}
            disabled={composePending}
          />
        ))}
      </tbody>
    </table>
  )
}

function ContainerRow({
  container,
  onAction,
  actionPending,
  disabled,
}: {
  container: DockerContainer
  onAction: (action: ContainerAction) => void
  actionPending: boolean
  disabled?: boolean
}) {
  const { t } = useTranslation('settings')
  const [confirmStop, setConfirmStop] = useState(false)
  const confirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const colors = STATUS_COLORS[container.State] ?? STATUS_COLORS.dead
  const name = container.Names[0]?.replace(/^\//, '') ?? container.Id.slice(0, 12)
  const isRunning = container.State === 'running'
  const isDisabled = disabled || actionPending

  useEffect(() => {
    return () => {
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
    }
  }, [])

  function handleStop() {
    if (confirmStop) {
      setConfirmStop(false)
      if (confirmTimer.current) clearTimeout(confirmTimer.current)
      onAction('stop')
    } else {
      setConfirmStop(true)
      confirmTimer.current = setTimeout(() => setConfirmStop(false), 3000)
    }
  }

  return (
    <tr className="h-[44px] border-b last:border-b-0">
      <td className="font-mono text-[13px] font-semibold">{name}</td>
      <td className="text-[13px] text-muted-foreground">{container.Image}</td>
      <td>
        <Badge
          className="transition-colors duration-300"
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            borderColor: 'transparent',
          }}
        >
          {container.State}
        </Badge>
      </td>
      <td>
        <div className="flex items-center gap-1">
          {!isRunning && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onAction('start')}
                  disabled={isDisabled}
                >
                  {actionPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{t('actions.start')}</TooltipContent>
            </Tooltip>
          )}
          {isRunning && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onAction('restart')}
                    disabled={isDisabled}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t('actions.restart')}</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 ${confirmStop ? 'text-destructive hover:text-destructive' : ''}`}
                    onClick={handleStop}
                    disabled={isDisabled}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {confirmStop
                    ? t('confirmation.areYouSure')
                    : t('actions.stop')}
                </TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
