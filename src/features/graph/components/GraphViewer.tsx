import { forwardRef } from 'react'
import { GraphCanvas, type GraphCanvasRef, type InternalGraphNode } from 'reagraph'
import type { GraphNode, GraphEdge } from 'reagraph'

interface GraphViewerProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  selections?: string[]
  onNodeClick?: (node: InternalGraphNode) => void
}

export const GraphViewer = forwardRef<GraphCanvasRef, GraphViewerProps>(
  function GraphViewer({ nodes, edges, selections = [], onNodeClick }, ref) {
    return (
      <div className="h-full w-full">
        <GraphCanvas
          ref={ref}
          nodes={nodes}
          edges={edges}
          selections={selections}
          layoutType="forceDirected2d"
          animated
          cameraMode="pan"
          labelType="auto"
          onNodeClick={(node) => onNodeClick?.(node)}
        />
      </div>
    )
  },
)
