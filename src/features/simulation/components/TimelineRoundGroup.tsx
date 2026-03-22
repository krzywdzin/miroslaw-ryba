import { useTranslation } from 'react-i18next'
import { Swords, ArrowUpDown, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimelineEvent {
  type: string
  description: string
  id?: string
  agentIds?: string[]
}

interface TimelineRoundGroupProps {
  roundNum: number
  events: TimelineEvent[]
  isActive: boolean
  onRoundClick: (round: number) => void
  onEventClick: (eventId: string) => void
}

const EVENT_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  debate: { icon: Swords, color: 'text-amber-500' },
  stance_change: { icon: ArrowUpDown, color: 'text-primary' },
  post_batch: { icon: FileText, color: 'text-muted-foreground' },
}

export function TimelineRoundGroup({
  roundNum,
  events,
  isActive,
  onRoundClick,
  onEventClick,
}: TimelineRoundGroupProps) {
  const { t } = useTranslation('simulation')

  return (
    <div className="py-3">
      {/* Round header */}
      <button
        onClick={() => onRoundClick(roundNum)}
        className={cn(
          'w-full px-4 py-2 text-left text-[13px] font-semibold transition-colors',
          isActive
            ? 'border-l-[3px] border-accent bg-accent/10 text-accent-foreground'
            : 'hover:bg-muted/50',
        )}
      >
        {t('timeline.round', { round: roundNum })}
      </button>

      {/* Event items */}
      {events.map((event, i) => {
        const config = EVENT_ICONS[event.type] ?? EVENT_ICONS.post_batch
        const Icon = config.icon
        return (
          <button
            key={event.id ?? `${roundNum}-${i}`}
            onClick={() => event.id && onEventClick(event.id)}
            className="flex w-full items-center gap-2 px-4 py-1 text-left text-[13px] hover:bg-muted/30"
          >
            <Icon className={cn('h-4 w-4 shrink-0', config.color)} />
            <span className="truncate">{event.description}</span>
          </button>
        )
      })}
    </div>
  )
}
