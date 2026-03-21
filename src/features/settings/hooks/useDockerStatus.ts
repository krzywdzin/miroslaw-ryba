import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usePollingQuery } from '@/hooks/usePolling'
import { handleApiError } from '@/lib/error-handler'
import type {
  DockerContainer,
  DockerStats,
  ContainerAction,
} from '../types/docker.types'
import { calculateCpuPercent } from '../types/docker.types'

const DOCKER_POLL_INTERVAL = 10_000

export function useDockerStatus() {
  const query = usePollingQuery<DockerContainer[]>(
    ['docker', 'containers'],
    async () => {
      const res = await fetch('/docker-api/containers/json?all=true')
      if (!res.ok) throw new Error(`Docker API error: ${res.status}`)
      return res.json()
    },
    {
      isComplete: () => false,
      interval: DOCKER_POLL_INTERVAL,
    }
  )

  return {
    containers: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}

export function useContainerStats(containerId: string, enabled: boolean) {
  const query = usePollingQuery<{
    cpuPercent: number
    memoryUsage: number
    memoryLimit: number
  }>(
    ['docker', 'stats', containerId],
    async () => {
      const res = await fetch(
        `/docker-api/containers/${containerId}/stats?stream=false`
      )
      if (!res.ok) throw new Error(`Stats error: ${res.status}`)
      const stats: DockerStats = await res.json()
      return {
        cpuPercent: calculateCpuPercent(stats),
        memoryUsage: stats.memory_stats.usage,
        memoryLimit: stats.memory_stats.limit,
      }
    },
    {
      isComplete: () => false,
      interval: DOCKER_POLL_INTERVAL,
      enabled,
    }
  )

  return {
    cpuPercent: query.data?.cpuPercent ?? 0,
    memoryUsage: query.data?.memoryUsage ?? 0,
    memoryLimit: query.data?.memoryLimit ?? 0,
    isLoading: query.isLoading,
  }
}

export function useContainerLogs(containerId: string, enabled: boolean) {
  const query = usePollingQuery<string>(
    ['docker', 'logs', containerId],
    async () => {
      const res = await fetch(
        `/docker-api/containers/${containerId}/logs?stdout=true&stderr=true&tail=100`
      )
      if (!res.ok) throw new Error(`Logs error: ${res.status}`)
      return res.text()
    },
    {
      isComplete: () => false,
      interval: DOCKER_POLL_INTERVAL,
      enabled,
    }
  )

  return {
    logs: query.data ?? '',
    refetch: query.refetch,
    isLoading: query.isLoading,
  }
}

export function useContainerAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      containerId,
      action,
    }: {
      containerId: string
      action: ContainerAction
    }) => {
      const res = await fetch(
        `/docker-api/containers/${containerId}/${action}`,
        { method: 'POST' }
      )
      if (!res.ok) throw new Error(`Action failed: ${res.status}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['docker', 'containers'] })
    },
    onError: (error) => {
      handleApiError(error, { context: 'docker-action' })
    },
  })
}

export function useComposeAction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (action: 'up' | 'down') => {
      const res = await fetch(`/docker-api/compose/${action}`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error(`Compose ${action} failed: ${res.status}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['docker', 'containers'] })
    },
    onError: (error) => {
      handleApiError(error, { context: 'docker-compose' })
    },
  })
}
