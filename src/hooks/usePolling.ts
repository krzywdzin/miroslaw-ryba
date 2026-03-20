import { useQuery } from '@tanstack/react-query'

export function usePollingQuery<T>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options: {
    isComplete: (data: T) => boolean
    interval?: number
    enabled?: boolean
  },
) {
  return useQuery({
    queryKey,
    queryFn,
    enabled: options.enabled ?? true,
    refetchInterval: (query) => {
      if (!query.state.data) return options.interval ?? 1000
      if (options.isComplete(query.state.data)) return false
      return options.interval ?? 1000
    },
    structuralSharing: true,
    refetchIntervalInBackground: false,
  })
}
