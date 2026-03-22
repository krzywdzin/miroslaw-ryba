import { useTranslation } from 'react-i18next'
import { Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TimelineRoundGroup } from './TimelineRoundGroup'

interface TimelineEvent {
  type: string
  description: string
  id?: string
  agentIds?: string[]
}

interface RoundData {
  round_num: number
  events: TimelineEvent[]
}

interface EventTimelineProps {
  timeline: unknown[]
  activeRoundFilter: number | null
  onRoundClick: (round: number | null) => void
  onEventClick: (eventId: string) => void
}

function parseTimeline(raw: unknown[]): RoundData[] {
  const rounds: RoundData[] = []

  for (const item of raw) {
    if (item && typeof item === 'object') {
      const obj = item as Record<string, unknown>
      const roundNum = typeof obj.round_num === 'number' ? obj.round_num : undefined
      const events = Array.isArray(obj.events)
        ? obj.events.map((e: unknown) => {
            if (e && typeof e === 'object') {
              const ev = e as Record<string, unknown>
              return {
                type: typeof ev.type === 'string' ? ev.type : 'post_batch',
                description: typeof ev.description === 'string' ? ev.description : '',
                id: typeof ev.id === 'string' ? ev.id : undefined,
                agentIds: Array.isArray(ev.agentIds) ? (ev.agentIds as string[]) : undefined,
              }
            }
            return { type: 'post_batch', description: '' }
          })
        : []

      if (roundNum != null) {
        rounds.push({ round_num: roundNum, events })
      }
    }
  }

  // Sort descending (newest at top)
  return rounds.sort((a, b) => b.round_num - a.round_num)
}

export function EventTimeline({
  timeline,
  activeRoundFilter,
  onRoundClick,
  onEventClick,
}: EventTimelineProps) {
  const { t } = useTranslation('simulation')
  const rounds = parseTimeline(timeline)

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Clock className="h-5 w-5" />
        <span className="text-[13px] font-semibold">{t('timeline.header')}</span>
      </div>

      {/* All rounds button */}
      {activeRoundFilter !== null && (
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRoundClick(null)}
          >
            {t('timeline.allRounds')}
          </Button>
        </div>
      )}

      {/* Round groups */}
      {rounds.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-[13px] text-muted-foreground">{t('timeline.waitingForEvents')}</p>
        </div>
      ) : (
        rounds.map((round) => (
          <TimelineRoundGroup
            key={round.round_num}
            roundNum={round.round_num}
            events={round.events}
            isActive={activeRoundFilter === round.round_num}
            onRoundClick={(r) => onRoundClick(r === activeRoundFilter ? null : r)}
            onEventClick={onEventClick}
          />
        ))
      )}
    </div>
  )
}
