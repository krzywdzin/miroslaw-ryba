import { useState, useRef, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { GraphCanvasRef, InternalGraphNode } from 'reagraph'
import { useGraphStore } from '../hooks/useGraphStore'
import { useBuildStatus } from '../hooks/useBuildStatus'
import { useGraphData } from '../hooks/useGraphData'
import { useGraphFilters } from '../hooks/useGraphFilters'
import { statusToStep } from '../components/BuildProgress'
import { BuildProgress } from '../components/BuildProgress'
import { GraphViewer } from '../components/GraphViewer'
import { GraphToolbar } from '../components/GraphToolbar'
import { GraphLegend } from '../components/GraphLegend'
import { NodeDetailPanel } from '../components/NodeDetailPanel'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { graphApi } from '@/api/graph'

export function GraphViewPage() {
  const { t } = useTranslation('graph')
  const navigate = useNavigate()

  const step = useGraphStore((s) => s.step)
  const taskId = useGraphStore((s) => s.taskId)
  const graphId = useGraphStore((s) => s.graphId)
  const projectId = useGraphStore((s) => s.projectId)
  const setStep = useGraphStore((s) => s.setStep)
  const setGraphId = useGraphStore((s) => s.setGraphId)

  const graphRef = useRef<GraphCanvasRef>(null)
  const [selectedNode, setSelectedNode] = useState<{
    id: string
    label: string
    data: { type?: string; name: string }
  } | null>(null)

  // Build status polling (only active during building step)
  const buildStatus = useBuildStatus(step === 'building' ? taskId : null)
  const taskData = buildStatus.data?.data

  // When build completes, transition to 'done'
  useEffect(() => {
    if (taskData?.status === 'completed' && step === 'building') {
      // The backend returns graph_id; for now use projectId as graphId
      // since the API structure may vary
      if (projectId) {
        setGraphId(projectId)
      }
      setStep('done')
    }
  }, [taskData?.status, step, projectId, setGraphId, setStep])

  // Graph data fetching (only when done and graphId exists)
  const { data: graphData, isLoading: graphLoading } = useGraphData(
    step === 'done' ? graphId : null,
  )

  // Filter state
  const filters = useGraphFilters()
  const { filteredNodes, filteredEdges } = filters.getFilteredData(
    graphData?.nodes ?? [],
    graphData?.edges ?? [],
  )

  const handleNodeClick = useCallback((node: InternalGraphNode) => {
    setSelectedNode({
      id: node.id,
      label: node.label ?? node.id,
      data: {
        type: node.data?.type,
        name: node.data?.name ?? node.label ?? node.id,
      },
    })
  }, [])

  const handleFitToScreen = useCallback(() => {
    graphRef.current?.fitNodesInView()
  }, [])

  const handleRetry = useCallback(() => {
    if (projectId) {
      graphApi.buildGraph(projectId)
    }
  }, [projectId])

  // Redirect to upload if at upload step
  if (step === 'upload') {
    navigate('/graph', { replace: true })
    return null
  }

  // Building state: show progress
  if (step === 'building') {
    const currentStep = taskData ? statusToStep(taskData.status) : 0
    const hasError = taskData?.status === 'failed'

    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-lg">
          <BuildProgress
            currentStep={currentStep}
            error={hasError ? (taskData?.error ?? t('build.error')) : undefined}
            onRetry={handleRetry}
          />
        </div>
      </div>
    )
  }

  // Done state: show graph
  if (graphLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSkeleton variant="card" className="h-[400px] max-w-2xl" />
      </div>
    )
  }

  return (
    <div className="relative h-[calc(100vh-var(--header-height,64px))]">
      <GraphToolbar filters={filters} onFitToScreen={handleFitToScreen} />

      <GraphViewer
        ref={graphRef}
        nodes={filteredNodes}
        edges={filteredEdges}
        selections={selectedNode ? [selectedNode.id] : []}
        onNodeClick={handleNodeClick}
      />

      <GraphLegend />

      <NodeDetailPanel
        node={selectedNode}
        allNodes={filteredNodes}
        edges={filteredEdges}
        onClose={() => setSelectedNode(null)}
      />
    </div>
  )
}
