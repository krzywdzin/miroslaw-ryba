import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useGraphStore } from '@/features/graph/hooks/useGraphStore'
import { useGraphData } from '@/features/graph/hooks/useGraphData'
import { useConfigStore } from '@/features/settings/hooks/useConfigStore'
import { useEnvironmentStore } from '../hooks/useEnvironmentStore'
import { useEntities } from '../hooks/useEntities'
import { useAgentProfiles } from '../hooks/useAgentProfiles'
import { usePrepareStatus } from '../hooks/usePrepareStatus'
import { simulationApi } from '@/api/simulation'
import type { SimulationFormValues } from '@/features/settings/schemas/config.schema'
import { EntityTable } from '../components/EntityTable'
import { AgentProfileGrid } from '../components/AgentProfileGrid'
import { ParameterSummary } from '../components/ParameterSummary'
import { ParameterOverrideForm } from '../components/ParameterOverrideForm'
import { LaunchConfirmDialog } from '../components/LaunchConfirmDialog'

export function EnvironmentPage() {
  const { t } = useTranslation('environment')
  const navigate = useNavigate()
  const graphStore = useGraphStore()
  const config = useConfigStore()
  const envStore = useEnvironmentStore()

  // Route guard: graph must be completed
  useEffect(() => {
    if (graphStore.step !== 'done' || !graphStore.graphId) {
      toast.error('Najpierw zbuduj graf wiedzy')
      navigate('/graph')
    }
  }, [graphStore.step, graphStore.graphId, navigate])

  // Entity data
  const entitiesQuery = useEntities(graphStore.graphId)
  const graphDataQuery = useGraphData(graphStore.graphId)

  // Relationship counts from graph edges
  const relationshipCounts = useMemo(() => {
    if (!graphDataQuery.data?.edges) return undefined
    const counts: Record<string, number> = {}
    for (const edge of graphDataQuery.data.edges) {
      const src = (edge as { source: string }).source
      const tgt = (edge as { target: string }).target
      if (src) counts[src] = (counts[src] ?? 0) + 1
      if (tgt) counts[tgt] = (counts[tgt] ?? 0) + 1
    }
    return counts
  }, [graphDataQuery.data?.edges])

  // Agent profiles
  const profilesQuery = useAgentProfiles(envStore.simulationId)

  // Prepare status polling
  const prepareQuery = usePrepareStatus(envStore.prepareTaskId)

  // When prepare completes, update step
  useEffect(() => {
    if (!prepareQuery.data) return
    const status = prepareQuery.data.data?.status
    if (status === 'completed') {
      envStore.setStep('review')
    } else if (status === 'failed') {
      envStore.setStep('review')
      toast.error('Przygotowanie symulacji nie powiodlo sie')
    }
  }, [prepareQuery.data])

  // Auto-prepare on mount
  useEffect(() => {
    if (!graphStore.graphId || !graphStore.projectId) return
    if (envStore.simulationId) return // Already created

    let cancelled = false

    async function autoPrepare() {
      try {
        envStore.setStep('loading')

        // Get entity types first
        const entityTypes = entitiesQuery.data?.entityTypes ?? []

        const createRes = await simulationApi.create({
          project_id: graphStore.projectId!,
          graph_id: graphStore.graphId!,
          enable_twitter: config.enableTwitter,
          enable_reddit: config.enableReddit,
        })

        if (cancelled) return

        const simId = createRes.data?.simulation_id
        if (!simId) throw new Error('No simulation_id returned')

        envStore.setSimulationId(simId)

        const prepareRes = await simulationApi.prepare({
          simulation_id: simId,
          entity_types: entityTypes,
          use_llm_for_profiles: true,
        })

        if (cancelled) return

        const taskId = prepareRes.data?.task_id
        if (taskId) {
          envStore.setPrepareTaskId(taskId)
          envStore.setStep('preparing')
        }
      } catch {
        if (!cancelled) {
          toast.error('Blad podczas tworzenia symulacji')
          envStore.setStep('review')
        }
      }
    }

    autoPrepare()
    return () => {
      cancelled = true
    }
  }, [graphStore.graphId, graphStore.projectId])

  // Parameter override local state (NOT persisted to config store)
  const [paramValues, setParamValues] = useState<SimulationFormValues>({
    agentCount: config.agentCount,
    maxRounds: config.maxRounds,
    enableTwitter: config.enableTwitter,
    enableReddit: config.enableReddit,
  })
  const [showForm, setShowForm] = useState(false)

  const handleValuesChange = useCallback((values: SimulationFormValues) => {
    setParamValues(values)
  }, [])

  const handleLaunch = useCallback(async () => {
    if (!envStore.simulationId) return
    try {
      await simulationApi.start({
        simulation_id: envStore.simulationId,
        max_rounds: paramValues.maxRounds,
      })
      envStore.setStep('ready')
      navigate('/simulation')
    } catch {
      toast.error('Blad podczas uruchamiania symulacji')
    }
  }, [envStore.simulationId, paramValues.maxRounds, navigate])

  const isPreparing = envStore.step === 'preparing' || envStore.step === 'loading'
  const canLaunch = envStore.step === 'review' || envStore.step === 'ready'

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Tabs defaultValue="entities">
        <TabsList>
          <TabsTrigger value="entities">{t('tabs.entities')}</TabsTrigger>
          <TabsTrigger value="agents">{t('tabs.agents')}</TabsTrigger>
          <TabsTrigger value="parameters">{t('tabs.parameters')}</TabsTrigger>
        </TabsList>

        <TabsContent value="entities">
          <EntityTable
            entities={entitiesQuery.data?.entities ?? []}
            entityTypes={entitiesQuery.data?.entityTypes ?? []}
            isLoading={entitiesQuery.isLoading}
            relationshipCounts={relationshipCounts}
          />
        </TabsContent>

        <TabsContent value="agents">
          <AgentProfileGrid
            profiles={profilesQuery.data?.profiles ?? []}
            isLoading={profilesQuery.isLoading}
            isPreparing={isPreparing}
          />
        </TabsContent>

        <TabsContent value="parameters">
          <div className="space-y-4">
            <ParameterSummary
              values={paramValues}
              onEdit={() => setShowForm((prev) => !prev)}
            />
            <ParameterOverrideForm
              defaultValues={paramValues}
              onValuesChange={handleValuesChange}
              visible={showForm}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end pt-4 border-t">
        <LaunchConfirmDialog
          params={paramValues}
          onConfirm={handleLaunch}
          disabled={!canLaunch}
        />
      </div>
    </div>
  )
}
