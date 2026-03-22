import { useTranslation } from 'react-i18next'
import { Bird } from 'lucide-react'
import { PostCard } from './PostCard'
import type { z } from 'zod/v4'
import type { ActionSchema } from '@/api/schemas/simulation'

type Action = z.infer<typeof ActionSchema>

interface TwitterFeedProps {
  actions: Action[]
  roundFilter: number | null
  highlightedEventId: string | null
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export function TwitterFeed({ actions, roundFilter, highlightedEventId }: TwitterFeedProps) {
  const { t } = useTranslation('simulation')

  const filtered = roundFilter
    ? actions.filter((a) => a.round_num === roundFilter)
    : actions

  const reversed = [...filtered].reverse()

  return (
    <div>
      {/* Column header */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <Bird className="h-5 w-5 text-sky-500" />
        <span className="text-[13px] font-semibold">{t('feed.twitter')}</span>
      </div>

      {/* Posts */}
      {reversed.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-[13px] text-muted-foreground">{t('feed.waitingForPosts')}</p>
        </div>
      ) : (
        reversed.map((action, i) => (
          <PostCard
            key={`${action.agent_id}-${action.timestamp}-${i}`}
            action={action}
            highlighted={highlightedEventId === action.agent_id}
          />
        ))
      )}
    </div>
  )
}
