import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bird, MessageCircle, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { z } from 'zod/v4'
import type { ActionSchema } from '@/api/schemas/simulation'

type Action = z.infer<typeof ActionSchema>

interface PostCardProps {
  action: Action
  highlighted?: boolean
}

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  twitter: Bird,
  reddit: MessageCircle,
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: 'text-sky-500',
  reddit: 'text-orange-600',
}

export const PostCard = React.memo(function PostCard({ action, highlighted }: PostCardProps) {
  const { t } = useTranslation('simulation')
  const [expanded, setExpanded] = useState(false)

  const platform = action.platform?.toLowerCase() ?? ''
  const Icon = PLATFORM_ICONS[platform] ?? User
  const iconColor = PLATFORM_COLORS[platform] ?? 'text-muted-foreground'
  const namePrefix = platform === 'twitter' ? '@' : 'u/'

  return (
    <div
      data-testid="post-card"
      className={cn(
        'border-b px-4 py-2 transition-colors duration-150 animate-in slide-in-from-top-2 fade-in duration-200',
        highlighted && 'bg-accent/10 ring-1 ring-accent/50',
      )}
    >
      {/* Row 1: metadata */}
      <div className="flex items-center gap-1">
        <Icon className={cn('h-4 w-4', iconColor)} />
        <span className="text-[13px] font-semibold">
          {namePrefix}{action.agent_id}
        </span>
        {action.round_num != null && (
          <Badge variant="outline" className="text-xs">
            R{action.round_num}
          </Badge>
        )}
        <Badge variant="secondary" className="text-xs">
          {t('actionType.' + action.action_type)}
        </Badge>
        {action.timestamp && (
          <span className="ml-auto text-[13px] text-muted-foreground">
            {action.timestamp}
          </span>
        )}
      </div>

      {/* Row 2: content */}
      {action.content && (
        <p className={cn('mt-1 text-[15px]', !expanded && 'line-clamp-2')}>
          {action.content}
        </p>
      )}

      {/* Row 3: expand link */}
      {action.content && action.content.length > 140 && !expanded && (
        <button
          className="text-[13px] text-primary hover:underline"
          onClick={() => setExpanded(true)}
        >
          {t('feed.expand')}
        </button>
      )}
    </div>
  )
})
