import { useTranslation } from 'react-i18next'
import { Bird, MessageCircle, User } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface AgentProfile {
  agent_id: string
  name: string
  personality?: string
  stance?: string
  platform?: string
}

interface AgentProfileCardProps {
  profile: AgentProfile
}

const PLATFORM_ICONS: Record<string, React.ElementType> = {
  twitter: Bird,
  reddit: MessageCircle,
}

export function AgentProfileCard({ profile }: AgentProfileCardProps) {
  const { t } = useTranslation('environment')
  const Icon = PLATFORM_ICONS[profile.platform?.toLowerCase() ?? ''] ?? User

  return (
    <Card data-testid="agent-card">
      <CardHeader className="flex-row items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardTitle className="text-base" data-testid="agent-name">
          {profile.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {profile.personality && (
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">
              {t('agents.personality')}:{' '}
            </span>
            <span data-testid="agent-personality">{profile.personality}</span>
          </div>
        )}
        {profile.stance && (
          <div className="text-sm">
            <span className="font-medium text-muted-foreground">
              {t('agents.stance')}:{' '}
            </span>
            <span data-testid="agent-stance">{profile.stance}</span>
          </div>
        )}
        {profile.platform && (
          <Badge variant="secondary" data-testid="agent-platform">
            {profile.platform}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}
