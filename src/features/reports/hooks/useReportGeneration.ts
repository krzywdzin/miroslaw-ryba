import { useState, useCallback, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { usePollingQuery } from '@/hooks/usePolling'
import { reportApi } from '@/api/report'
import type { z } from 'zod/v4'
import type {
  ReportCheckSchema,
  ReportProgressSchema,
  ReportResponseSchema,
} from '@/api/schemas/report'

type ReportState = 'checking' | 'generating' | 'viewing' | 'error'

type ReportCheckResponse = z.infer<typeof ReportCheckSchema>
type ReportProgressResponse = z.infer<typeof ReportProgressSchema>
type ReportResponse = z.infer<typeof ReportResponseSchema>

export function useReportGeneration(simulationId: string) {
  const [state, setState] = useState<ReportState>('checking')
  const [reportId, setReportId] = useState<string | null>(null)

  // Step 1: Check if report exists
  const checkQuery = useQuery({
    queryKey: ['report-check', simulationId],
    queryFn: () => reportApi.check(simulationId) as Promise<ReportCheckResponse>,
    enabled: !!simulationId,
    retry: 1,
  })

  // Handle check result
  useEffect(() => {
    if (checkQuery.isError) {
      setState('error')
      return
    }
    if (!checkQuery.data) return

    const { has_report, report_status } = checkQuery.data.data

    if (has_report && report_status === 'completed') {
      // Report exists and is completed -- fetch it
      setState('viewing')
      // We need to get the report ID -- fetch by simulation
      reportApi.getBySimulation(simulationId).then((result: unknown) => {
        const res = result as { data?: { report_id?: string }; report_id?: string }
        const id = res.data?.report_id ?? res.report_id
        if (id) setReportId(id)
      }).catch(() => {
        setState('error')
      })
    } else if (has_report && report_status === 'generating') {
      // Report is currently being generated -- get the ID and poll progress
      reportApi.getBySimulation(simulationId).then((result: unknown) => {
        const res = result as { data?: { report_id?: string }; report_id?: string }
        const id = res.data?.report_id ?? res.report_id
        if (id) {
          setReportId(id)
          setState('generating')
        }
      }).catch(() => {
        setState('error')
      })
    } else if (!has_report) {
      // No report -- trigger generation
      generateMutation.mutate({ simulation_id: simulationId })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkQuery.data, checkQuery.isError, simulationId])

  // Step 2: Generate report
  const generateMutation = useMutation({
    mutationFn: (params: { simulation_id: string; force_regenerate?: boolean }) =>
      reportApi.generate(params),
    onSuccess: (data) => {
      const result = data as { data: { report_id: string } }
      setReportId(result.data.report_id)
      setState('generating')
    },
    onError: () => {
      setState('error')
    },
  })

  // Step 3: Poll progress while generating
  const progressQuery = usePollingQuery<ReportProgressResponse>(
    ['report-progress', reportId],
    () => reportApi.getProgress(reportId!) as Promise<ReportProgressResponse>,
    {
      enabled: state === 'generating' && !!reportId,
      interval: 2000,
      isComplete: (data) =>
        ['completed', 'failed', 'error'].includes(data.data.status),
    },
  )

  // Handle progress completion
  useEffect(() => {
    if (!progressQuery.data || state !== 'generating') return

    const { status } = progressQuery.data.data
    if (status === 'completed') {
      setState('viewing')
    } else if (status === 'failed' || status === 'error') {
      setState('error')
    }
  }, [progressQuery.data, state])

  // Step 4: Fetch full report when viewing
  const reportQuery = useQuery({
    queryKey: ['report', reportId],
    queryFn: () => reportApi.get(reportId!) as Promise<ReportResponse>,
    enabled: state === 'viewing' && !!reportId,
  })

  // Retry handler
  const retry = useCallback(() => {
    setState('checking')
    setReportId(null)
    generateMutation.mutate({
      simulation_id: simulationId,
      force_regenerate: true,
    })
  }, [simulationId, generateMutation])

  return {
    state,
    reportId,
    progress: progressQuery.data?.data ?? null,
    report: reportQuery,
    retry,
  }
}
