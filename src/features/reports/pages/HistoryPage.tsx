import { useTranslation } from 'react-i18next'
import { useQuery, useQueries } from '@tanstack/react-query'
import { z } from 'zod/v4'
import { simulationApi } from '@/api/simulation'
import { reportApi } from '@/api/report'
import { SimulationListResponseSchema } from '@/api/schemas/simulation'
import { ReportCheckSchema } from '@/api/schemas/report'
import { ErrorAlert } from '@/components/shared/ErrorAlert'
import { HistoryTable, type HistoryItem } from '../components/HistoryTable'

type SimulationListResponse = z.infer<typeof SimulationListResponseSchema>
type ReportCheckResponse = z.infer<typeof ReportCheckSchema>

export function HistoryPage() {
  const { t } = useTranslation('reports')

  const {
    data: simData,
    isLoading: isSimLoading,
    isError: isSimError,
    refetch,
  } = useQuery<SimulationListResponse>({
    queryKey: ['simulations'],
    queryFn: () => simulationApi.list() as Promise<SimulationListResponse>,
  })

  const simulations = simData?.data ?? []

  const reportChecks = useQueries({
    queries: simulations.map((sim) => ({
      queryKey: ['report-check', sim.simulation_id] as const,
      queryFn: () =>
        reportApi.check(sim.simulation_id) as Promise<ReportCheckResponse>,
      enabled: simulations.length > 0,
      staleTime: 60_000,
    })),
  })

  const items: HistoryItem[] = simulations.map((sim, i) => ({
    simulationId: sim.simulation_id,
    topic: sim.project_id,
    status: sim.status,
    date: null,
    agentCount: null,
    hasReport: reportChecks[i]?.data?.data?.has_report ?? false,
  }))

  const isLoading =
    isSimLoading || reportChecks.some((q) => q.isLoading)

  if (isSimError) {
    return (
      <div className="p-6" data-testid="history-page">
        <ErrorAlert
          message={t('error.historyFetchFailed')}
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6" data-testid="history-page">
      <h1 className="text-[22px] font-semibold">{t('page.history')}</h1>
      <HistoryTable items={items} isLoading={isLoading} />
    </div>
  )
}
