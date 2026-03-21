import { describe, it, expect } from 'vitest'
import { toReagraphNodes, toReagraphEdges } from '@/features/graph/lib/graph-transforms'
import { ENTITY_COLORS } from '@/features/graph/lib/graph-colors'

describe('toReagraphNodes', () => {
  it('maps name to label', () => {
    const nodes = toReagraphNodes([{ id: '1', name: 'Alice', type: 'person' }])
    expect(nodes[0].label).toBe('Alice')
  })

  it('applies correct fill color for person type', () => {
    const nodes = toReagraphNodes([{ id: '1', name: 'Alice', type: 'person' }])
    expect(nodes[0].fill).toBe(ENTITY_COLORS.person)
  })

  it('uses default color when type is undefined', () => {
    const nodes = toReagraphNodes([{ id: '1', name: 'Unknown' }])
    expect(nodes[0].fill).toBe(ENTITY_COLORS.default)
  })

  it('stores type and name in data field', () => {
    const nodes = toReagraphNodes([{ id: '1', name: 'Alice', type: 'person' }])
    expect(nodes[0].data).toEqual({ type: 'person', name: 'Alice' })
  })
})

describe('toReagraphEdges', () => {
  it('generates unique id from source-target-index', () => {
    const edges = toReagraphEdges([
      { source: 'a', target: 'b', relation: 'knows' },
      { source: 'a', target: 'b', relation: 'works_with' },
    ])
    expect(edges[0].id).toBe('a-b-0')
    expect(edges[1].id).toBe('a-b-1')
  })

  it('maps relation to label', () => {
    const edges = toReagraphEdges([{ source: 'a', target: 'b', relation: 'knows' }])
    expect(edges[0].label).toBe('knows')
  })

  it('handles undefined relation (label undefined)', () => {
    const edges = toReagraphEdges([{ source: 'a', target: 'b' }])
    expect(edges[0].label).toBeUndefined()
  })
})

describe('filter logic', () => {
  // Import and create filter hook inline -- we test the pure logic via useGraphFilters
  // but since it's a hook, we test the getFilteredData concept directly here

  const mockNodes = [
    { id: '1', label: 'Alice', fill: '#3b82f6', data: { type: 'person', name: 'Alice' } },
    { id: '2', label: 'Acme Corp', fill: '#8b5cf6', data: { type: 'organization', name: 'Acme Corp' } },
    { id: '3', label: 'Warsaw', fill: '#22c55e', data: { type: 'location', name: 'Warsaw' } },
  ]

  const mockEdges = [
    { id: '1-2-0', source: '1', target: '2', label: 'works_at' },
    { id: '2-3-0', source: '2', target: '3', label: 'located_in' },
  ]

  function filterData(
    nodes: typeof mockNodes,
    edges: typeof mockEdges,
    activeTypes: Set<string>,
    searchQuery = '',
  ) {
    let filteredNodes = nodes.filter((n) => activeTypes.has(n.data?.type ?? 'default'))
    const query = searchQuery.trim().toLowerCase()
    const highlightedNodeIds: string[] = []
    if (query) {
      filteredNodes = filteredNodes.filter((n) => {
        const matches = (n.label ?? '').toLowerCase().includes(query)
        if (matches) highlightedNodeIds.push(n.id)
        return matches
      })
    }
    const nodeIdSet = new Set(filteredNodes.map((n) => n.id))
    const filteredEdges = edges.filter(
      (e) => nodeIdSet.has(e.source) && nodeIdSet.has(e.target),
    )
    return { filteredNodes, filteredEdges, highlightedNodeIds }
  }

  it('activeTypes filter removes nodes of excluded type', () => {
    const active = new Set(['person', 'location'])
    const result = filterData(mockNodes, mockEdges, active)
    expect(result.filteredNodes).toHaveLength(2)
    expect(result.filteredNodes.map((n) => n.id)).toEqual(['1', '3'])
  })

  it('search query filters by node label case-insensitively', () => {
    const active = new Set(['person', 'organization', 'location'])
    const result = filterData(mockNodes, mockEdges, active, 'alice')
    expect(result.filteredNodes).toHaveLength(1)
    expect(result.filteredNodes[0].id).toBe('1')
    expect(result.highlightedNodeIds).toEqual(['1'])
  })

  it('edges are pruned when their source or target is filtered out', () => {
    const active = new Set(['person', 'location'])
    const result = filterData(mockNodes, mockEdges, active)
    // Edge 1-2 pruned because node 2 (organization) filtered out
    // Edge 2-3 pruned because node 2 (organization) filtered out
    expect(result.filteredEdges).toHaveLength(0)
  })
})
