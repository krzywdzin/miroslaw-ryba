import { useQuery } from '@tanstack/react-query'
import { apiRequest } from '@/api/client'

export function useBackendStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ['backend-status'],
    queryFn: () => apiRequest<unknown[]>('/graph_bp/projects'),
    select: () => true,
    refetchInterval: 30_000,
    retry: 1,
  })

  return {
    isConnected: data === true,
    isLoading,
  }
}
