import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { AgentProfileCard } from './AgentProfileCard'

interface AgentProfile {
  agent_id: string
  name: string
  personality?: string
  stance?: string
  platform?: string
}

interface AgentProfileGridProps {
  profiles: AgentProfile[]
  isLoading: boolean
  isPreparing: boolean
}

export function AgentProfileGrid({
  profiles,
  isLoading,
  isPreparing,
}: AgentProfileGridProps) {
  const { t } = useTranslation('environment')

  if (isLoading || isPreparing) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3 py-12"
        data-testid="agent-grid-loading"
      >
        <LoadingSpinner />
        <p className="text-sm text-muted-foreground">{t('agents.loading')}</p>
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <p
        className="text-sm text-muted-foreground py-8 text-center"
        data-testid="agent-grid-empty"
      >
        {t('agents.empty')}
      </p>
    )
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      data-testid="agent-grid"
    >
      {profiles.map((profile) => (
        <AgentProfileCard key={profile.agent_id} profile={profile} />
      ))}
    </div>
  )
}
