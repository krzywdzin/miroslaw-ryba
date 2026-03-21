import type { GraphNode, GraphEdge } from 'reagraph'
import { ENTITY_COLORS } from './graph-colors'

interface ApiNode {
  id: string
  name: string
  type?: string
}

interface ApiEdge {
  source: string
  target: string
  relation?: string
}

export function toReagraphNodes(apiNodes: ApiNode[]): GraphNode[] {
  return apiNodes.map((node) => ({
    id: node.id,
    label: node.name,
    fill: ENTITY_COLORS[node.type ?? 'default'],
    data: {
      type: node.type,
      name: node.name,
    },
  }))
}

export function toReagraphEdges(apiEdges: ApiEdge[]): GraphEdge[] {
  return apiEdges.map((edge, i) => ({
    id: `${edge.source}-${edge.target}-${i}`,
    source: edge.source,
    target: edge.target,
    label: edge.relation,
  }))
}
