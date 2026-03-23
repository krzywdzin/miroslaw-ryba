import { useTranslation } from 'react-i18next'
import { Bird, MessageCircle, Bot, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { AgentTarget } from '../types'

interface AgentProfile {
  agent_id: string
  name: string
  personality?: string
  stance?: string
  platform?: string
}

interface AgentContextPanelProps {
  target: AgentTarget
  profile?: AgentProfile | null
  isLoading?: boolean
}

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  twitter: Bird,
  reddit: MessageCircle,
}

export function AgentContextPanel({
  target,
  profile,
  isLoading,
}: AgentContextPanelProps) {
  const { t } = useTranslation('chat')

  if (isLoading) {
    return (
      <aside
        aria-label={t('agentProfile')}
        className="w-80 border-l bg-muted/30 p-6 overflow-y-auto"
        data-testid="agent-context-panel"
      >
        <div className="flex flex-col items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </div>
      </aside>
    )
  }

  if (target.type === 'report') {
    return (
      <aside
        aria-label={t('agentProfile')}
        className="w-80 border-l bg-muted/30 p-6 overflow-y-auto"
        data-testid="agent-context-panel"
      >
        <div className="flex flex-col items-center gap-3 text-center">
          <Bot className="h-12 w-12 text-primary" />
          <p className="text-[15px] font-semibold">ReportAgent</p>
          <p className="text-[15px] text-muted-foreground">
            {t('reportAgentDescription')}
          </p>
        </div>
      </aside>
    )
  }

  if (!profile) {
    return (
      <aside
        aria-label={t('agentProfile')}
        className="w-80 border-l bg-muted/30 p-6 overflow-y-auto"
        data-testid="agent-context-panel"
      >
        <p className="text-sm text-muted-foreground">{t('noAgents')}</p>
      </aside>
    )
  }

  const PlatformIcon =
    PLATFORM_ICONS[profile.platform?.toLowerCase() ?? ''] ?? User

  return (
    <aside
      aria-label={t('agentProfile')}
      className="w-80 border-l bg-muted/30 p-6 overflow-y-auto"
      data-testid="agent-context-panel"
    >
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-[15px] font-semibold">{profile.name}</p>
          {profile.platform && (
            <Badge variant="secondary">
              <PlatformIcon className="mr-1 h-3 w-3" />
              {profile.platform}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-[13px] font-semibold text-muted-foreground">
              {t('personality')}
            </p>
            <p className="text-[15px]">{profile.personality || '-'}</p>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-muted-foreground">
              {t('stance')}
            </p>
            <p className="text-[15px]">{profile.stance || '-'}</p>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-muted-foreground">
              {t('memory')}
            </p>
            <p className="text-[15px]">{t('memoryUnavailable')}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
