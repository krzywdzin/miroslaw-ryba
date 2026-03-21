import { useState, useCallback, useMemo } from 'react'
import type { GraphNode, GraphEdge } from 'reagraph'
import { ENTITY_TYPES } from '../lib/graph-colors'

export function useGraphFilters() {
  const [activeTypes, setActiveTypes] = useState<Set<string>>(
    () => new Set(ENTITY_TYPES),
  )
  const [searchQuery, setSearchQuery] = useState('')

  const toggleType = useCallback((type: string) => {
    setActiveTypes((prev) => {
      const next = new Set(prev)
      if (next.has(type)) {
        next.delete(type)
      } else {
        next.add(type)
      }
      return next
    })
  }, [])

  const getFilteredData = useCallback(
    (nodes: GraphNode[], edges: GraphEdge[]) => {
      // Filter by active entity types
      let filteredNodes = nodes.filter((node) =>
        activeTypes.has(node.data?.type ?? 'default'),
      )

      // Search filter
      const query = searchQuery.trim().toLowerCase()
      const highlightedNodeIds: string[] = []

      if (query) {
        filteredNodes = filteredNodes.filter((node) => {
          const matches = (node.label ?? '').toLowerCase().includes(query)
          if (matches) {
            highlightedNodeIds.push(node.id)
          }
          return matches
        })
      }

      // Prune edges to only those connecting filtered nodes
      const nodeIdSet = new Set(filteredNodes.map((n) => n.id))
      const filteredEdges = edges.filter(
        (edge) => nodeIdSet.has(edge.source) && nodeIdSet.has(edge.target),
      )

      return { filteredNodes, filteredEdges, highlightedNodeIds }
    },
    [activeTypes, searchQuery],
  )

  return {
    activeTypes,
    searchQuery,
    toggleType,
    setSearchQuery,
    getFilteredData,
  }
}
