import { useQuery } from '@tanstack/react-query'
import { simulationApi } from '@/api/simulation'

export function useAgentProfiles(simulationId: string | null) {
  return useQuery({
    queryKey: ['simulation', 'profiles', simulationId] as const,
    queryFn: () => simulationApi.getProfiles(simulationId!),
    enabled: !!simulationId,
    select: (response) => ({
      profiles: response.data?.profiles ?? [],
      count: response.data?.count ?? 0,
      platform: response.data?.platform ?? '',
    }),
  })
}
