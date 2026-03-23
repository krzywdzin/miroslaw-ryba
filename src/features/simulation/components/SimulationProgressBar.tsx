import { useTranslation } from 'react-i18next'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SimulationProgressBarProps {
  runnerStatus: string
  currentRound: number
  totalRounds: number
  progressPercent: number
  postCount: number
  commentCount: number
  debateCount: number
  activeAgentCount: number
  elapsed: number
  onStop: () => void
  onGoToReport: () => void
  onReturnToEnv: () => void
}

export function SimulationProgressBar({
  runnerStatus,
  currentRound,
  totalRounds,
  progressPercent,
  postCount,
  commentCount,
  debateCount,
  activeAgentCount,
  elapsed,
  onStop,
  onGoToReport,
  onReturnToEnv,
}: SimulationProgressBarProps) {
  const { t } = useTranslation('simulation')

  const formattedTime =
    String(Math.floor(elapsed / 60)).padStart(2, '0') +
    ':' +
    String(elapsed % 60).padStart(2, '0')

  return (
    <div
      data-testid="progress-bar"
      className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-8"
    >
      {/* Left: round label + progress */}
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-semibold">
          {t('progress.round', { current: currentRound, total: totalRounds })}
        </span>
        <Progress value={progressPercent} className="w-[120px]" />
      </div>

      {/* Center: counters */}
      <div className="flex gap-6">
        <Counter value={postCount} label={t('progress.posts')} />
        <Counter value={commentCount} label={t('progress.comments')} />
        <Counter value={debateCount} label={t('progress.debates')} />
        <Counter value={activeAgentCount} label={t('progress.agents')} />
      </div>

      {/* Right: elapsed + action */}
      <div className="flex items-center gap-4">
        <span className="text-[13px] text-muted-foreground">{formattedTime}</span>

        {runnerStatus === 'running' && (
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={onStop}
          >
            {t('progress.stop')}
          </Button>
        )}

        {runnerStatus === 'completed' && (
          <>
            <Badge variant="default" className="bg-green-500">
              {t('completion.badge')}
            </Badge>
            <Button onClick={onGoToReport}>
              {t('completion.goToReport')}
            </Button>
          </>
        )}

        {runnerStatus === 'failed' && (
          <>
            <Badge variant="destructive">
              {t('error.heading')}
            </Badge>
            <Button variant="outline" onClick={onReturnToEnv}>
              {t('error.returnToEnv')}
            </Button>
          </>
        )}

        {runnerStatus === 'stopped' && (
          <>
            <Badge variant="default" className="bg-green-500">
              {t('completion.badge')}
            </Badge>
            <Button onClick={onGoToReport}>
              {t('completion.goToReport')}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

function Counter({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-[22px] font-semibold">{value}</span>
      <span className="text-[13px] text-muted-foreground">{label}</span>
    </div>
  )
}
