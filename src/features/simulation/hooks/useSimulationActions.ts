import { simulationApi } from '@/api/simulation'
import { usePollingQuery } from '@/hooks/usePolling'

export function useSimulationActions(simulationId: string | null, platform?: string) {
  return usePollingQuery(
    ['simulation', 'actions', simulationId, platform] as const,
    () => simulationApi.getActions(simulationId!, { platform, limit: 50 }),
    {
      enabled: !!simulationId,
      interval: 2500,
      isComplete: () => false,
    },
  )
}
