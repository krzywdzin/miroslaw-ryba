import { simulationApi } from '@/api/simulation'
import { usePollingQuery } from '@/hooks/usePolling'

export function useRunStatus(simulationId: string | null) {
  return usePollingQuery(
    ['simulation', 'run-status', simulationId] as const,
    () => simulationApi.getRunStatus(simulationId!),
    {
      enabled: !!simulationId,
      interval: 2000,
      isComplete: (data) => {
        const status = data.data?.runner_status
        return status === 'completed' || status === 'failed' || status === 'stopped'
      },
    },
  )
}
