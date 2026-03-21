import { useQuery } from '@tanstack/react-query'
import { simulationApi } from '@/api/simulation'

export function useEntities(graphId: string | null, entityTypeFilter?: string) {
  return useQuery({
    queryKey: ['simulation', 'entities', graphId, entityTypeFilter] as const,
    queryFn: () =>
      simulationApi.getEntities(graphId!, {
        entity_types: entityTypeFilter,
      }),
    enabled: !!graphId,
    staleTime: Infinity,
    select: (response) => ({
      entities: response.data?.entities ?? [],
      entityTypes: response.data?.entity_types ?? [],
      count: response.data?.filtered_count ?? 0,
    }),
  })
}
