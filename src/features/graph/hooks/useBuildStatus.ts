import { graphApi } from '@/api/graph'
import { usePollingQuery } from '@/hooks/usePolling'

export function useBuildStatus(taskId: string | null) {
  return usePollingQuery(
    ['graph', 'task', taskId] as const,
    () => graphApi.getTask(taskId!),
    {
      enabled: !!taskId,
      interval: 2000,
      isComplete: (data) => {
        const status = data.data?.status
        return status === 'completed' || status === 'failed'
      },
    },
  )
}
