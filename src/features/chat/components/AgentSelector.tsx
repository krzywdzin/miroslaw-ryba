import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

interface AgentSelectorProps {
  selectedAgentId: string
  profiles: Array<{ agent_id: string; name: string }>
  onSelect: (agentId: string) => void
  isLoading?: boolean
}

export function AgentSelector({
  selectedAgentId,
  profiles,
  onSelect,
  isLoading,
}: AgentSelectorProps) {
  const { t } = useTranslation('chat')

  return (
    <div className="flex w-full items-center gap-3 border-b p-4">
      <span className="text-xs font-semibold">{t('selectAgent')}</span>
      <Select value={selectedAgentId} onValueChange={onSelect}>
        <SelectTrigger className="w-[200px]" data-testid="agent-selector-trigger">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{t('systemAgents')}</SelectLabel>
            <SelectItem value="report-agent">{t('reportAgent')}</SelectItem>
          </SelectGroup>
          <SelectSeparator />
          <SelectGroup>
            <SelectLabel>{t('simulatedAgents')}</SelectLabel>
            {isLoading ? (
              <>
                <div className="px-2 py-1.5">
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="px-2 py-1.5">
                  <Skeleton className="h-5 w-full" />
                </div>
                <div className="px-2 py-1.5">
                  <Skeleton className="h-5 w-full" />
                </div>
              </>
            ) : profiles.length === 0 ? (
              <SelectItem value="_no_agents" disabled>
                {t('noAgents')}
              </SelectItem>
            ) : (
              profiles.map((p) => (
                <SelectItem key={p.agent_id} value={p.agent_id}>
                  {p.name}
                </SelectItem>
              ))
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
