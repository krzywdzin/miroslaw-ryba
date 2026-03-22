import { simulationApi } from '@/api/simulation'
import { usePollingQuery } from '@/hooks/usePolling'

export function useSimulationTimeline(simulationId: string | null) {
  return usePollingQuery(
    ['simulation', 'timeline', simulationId] as const,
    () => simulationApi.getTimeline(simulationId!),
    {
      enabled: !!simulationId,
      interval: 3000,
      isComplete: () => false,
    },
  )
}
