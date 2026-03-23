import { forwardRef, useMemo } from 'react'
import { GraphCanvas, type GraphCanvasRef, type InternalGraphNode, lightTheme, darkTheme } from 'reagraph'
import type { GraphNode, GraphEdge, Theme } from 'reagraph'
import { useTheme } from '@/hooks/useTheme'

interface GraphViewerProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  selections?: string[]
  onNodeClick?: (node: InternalGraphNode) => void
}

export const GraphViewer = forwardRef<GraphCanvasRef, GraphViewerProps>(
  function GraphViewer({ nodes, edges, selections = [], onNodeClick }, ref) {
    const { resolvedTheme } = useTheme()

    const graphTheme: Theme = useMemo(() => {
      if (resolvedTheme === 'dark') {
        return {
          ...darkTheme,
          canvas: { ...darkTheme.canvas, background: 'transparent' },
          edge: {
            ...darkTheme.edge,
            fill: '#515159',
            label: { ...darkTheme.edge.label, color: '#fafafa' },
          },
          node: {
            ...darkTheme.node,
            label: { ...darkTheme.node.label, color: '#fafafa' },
          },
        }
      }
      return {
        ...lightTheme,
        canvas: { ...lightTheme.canvas, background: 'transparent' },
        edge: {
          ...lightTheme.edge,
          fill: '#c6c6d0',
          label: { ...lightTheme.edge.label, color: '#0a0a14' },
        },
        node: {
          ...lightTheme.node,
          label: { ...lightTheme.node.label, color: '#0a0a14' },
        },
      }
    }, [resolvedTheme])

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
          theme={graphTheme}
          onNodeClick={(node) => onNodeClick?.(node)}
        />
      </div>
    )
  },
)
