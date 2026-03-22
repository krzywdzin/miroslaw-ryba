import { useTranslation } from 'react-i18next'
import { MessageCircle } from 'lucide-react'
import { RedditThread } from './RedditThread'
import type { z } from 'zod/v4'
import type { ActionSchema } from '@/api/schemas/simulation'

type Action = z.infer<typeof ActionSchema>

interface RedditFeedProps {
  actions: Action[]
  roundFilter: number | null
  highlightedEventId: string | null
  scrollRef: React.RefObject<HTMLDivElement | null>
}

export function RedditFeed({ actions, roundFilter, highlightedEventId }: RedditFeedProps) {
  const { t } = useTranslation('simulation')

  const filtered = roundFilter
    ? actions.filter((a) => a.round_num === roundFilter)
    : actions

  // Group by round: first 'post' per round is root, comments/debates are replies
  const grouped = groupByRound(filtered)
  const rounds = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div>
      {/* Column header */}
      <div className="flex items-center gap-2 border-b px-4 py-3">
        <MessageCircle className="h-5 w-5 text-orange-600" />
        <span className="text-[13px] font-semibold">{t('feed.reddit')}</span>
      </div>

      {/* Threads */}
      {rounds.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-[13px] text-muted-foreground">{t('feed.waitingForPosts')}</p>
        </div>
      ) : (
        rounds.map((round) => {
          const { roots, replies } = grouped[round]
          return roots.map((root, i) => (
            <RedditThread
              key={`${root.agent_id}-${round}-${i}`}
              action={root}
              replies={replies}
              depth={0}
              highlightedId={highlightedEventId}
            />
          ))
        })
      )}
    </div>
  )
}

function groupByRound(actions: Action[]): Record<number, { roots: Action[]; replies: Action[] }> {
  const groups: Record<number, { roots: Action[]; replies: Action[] }> = {}

  for (const action of actions) {
    const round = action.round_num ?? 0
    if (!groups[round]) {
      groups[round] = { roots: [], replies: [] }
    }
    if (action.action_type === 'post') {
      groups[round].roots.push(action)
    } else {
      groups[round].replies.push(action)
    }
  }

  return groups
}
