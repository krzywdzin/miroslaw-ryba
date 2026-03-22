import { useTranslation } from 'react-i18next'
import { PostCard } from './PostCard'
import type { z } from 'zod/v4'
import type { ActionSchema } from '@/api/schemas/simulation'

type Action = z.infer<typeof ActionSchema>

interface RedditThreadProps {
  action: Action
  replies: Action[]
  depth?: number
  highlightedId?: string | null
}

export function RedditThread({ action, replies, depth = 0, highlightedId }: RedditThreadProps) {
  const { t } = useTranslation('simulation')
  const indent = Math.min(depth, 4) * 16

  return (
    <div style={{ marginLeft: indent > 0 ? indent : undefined }}>
      {depth > 0 && (
        <div className="border-l border-muted pl-2">
          {depth > 4 && (
            <span className="text-xs text-muted-foreground">
              {t('feed.replyingTo')} @{action.agent_id}
            </span>
          )}
          <PostCard action={action} highlighted={highlightedId === action.agent_id} />
        </div>
      )}
      {depth === 0 && (
        <PostCard action={action} highlighted={highlightedId === action.agent_id} />
      )}
      {replies.map((reply, i) => (
        <RedditThread
          key={`${reply.agent_id}-${reply.timestamp}-${i}`}
          action={reply}
          replies={[]}
          depth={depth + 1}
          highlightedId={highlightedId}
        />
      ))}
    </div>
  )
}
