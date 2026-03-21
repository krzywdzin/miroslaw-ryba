import { useQuery } from '@tanstack/react-query'
import { graphApi } from '@/api/graph'
import { toReagraphNodes, toReagraphEdges } from '../lib/graph-transforms'

export function useGraphData(graphId: string | null) {
  return useQuery({
    queryKey: ['graph', 'data', graphId] as const,
    queryFn: () => graphApi.getGraphData(graphId!),
    enabled: !!graphId,
    staleTime: Infinity,
    select: (response) => ({
      nodes: toReagraphNodes(response.data?.nodes ?? []),
      edges: toReagraphEdges(response.data?.edges ?? []),
    }),
  })
}
