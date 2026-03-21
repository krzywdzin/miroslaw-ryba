import { usePollingQuery } from '@/hooks/usePolling'
import { simulationApi } from '@/api/simulation'

export function usePrepareStatus(taskId: string | null) {
  return usePollingQuery(
    ['simulation', 'prepare', 'status', taskId] as const,
    () => simulationApi.prepareStatus({ task_id: taskId! }),
    {
      enabled: !!taskId,
      isComplete: (data) => {
        const status = data.data?.status
        return status === 'completed' || status === 'failed'
      },
      interval: 2000,
    },
  )
}
