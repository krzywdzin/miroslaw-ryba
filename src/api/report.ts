import { apiRequest } from './client'
import { apiMessageResponse } from './schemas/common'
import {
  AgentLogSchema,
  ChatResponseSchema,
  ReportCheckSchema,
  ReportGenerateResponseSchema,
  ReportListResponseSchema,
  ReportProgressSchema,
  ReportResponseSchema,
  ReportSectionsSchema,
} from './schemas/report'

function buildQuery(params: Record<string, unknown>): string {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      search.set(key, String(value))
    }
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export const reportApi = {
  generate(params: { simulation_id: string; force_regenerate?: boolean }) {
    return apiRequest('/report/generate', {
      method: 'POST',
      body: JSON.stringify(params),
      schema: ReportGenerateResponseSchema,
    })
  },

  generateStatus(params: { task_id?: string; simulation_id?: string }) {
    return apiRequest('/report/generate/status', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  get(reportId: string) {
    return apiRequest(`/report/${reportId}`, {
      schema: ReportResponseSchema,
    })
  },

  getBySimulation(simId: string) {
    return apiRequest(`/report/by-simulation/${simId}`)
  },

  list(params?: { simulation_id?: string; limit?: number }) {
    const query = buildQuery(params ?? {})
    return apiRequest(`/report/list${query}`, {
      schema: ReportListResponseSchema,
    })
  },

  async download(reportId: string) {
    const response = await fetch(`/api/report/${reportId}/download`)
    return response.blob()
  },

  delete(reportId: string) {
    return apiRequest(`/report/${reportId}`, {
      method: 'DELETE',
      schema: apiMessageResponse,
    })
  },

  chat(params: {
    simulation_id: string
    message: string
    chat_history?: unknown[]
  }) {
    return apiRequest('/report/chat', {
      method: 'POST',
      body: JSON.stringify(params),
      schema: ChatResponseSchema,
    })
  },

  getProgress(reportId: string) {
    return apiRequest(`/report/${reportId}/progress`, {
      schema: ReportProgressSchema,
    })
  },

  getSections(reportId: string) {
    return apiRequest(`/report/${reportId}/sections`, {
      schema: ReportSectionsSchema,
    })
  },

  getSection(reportId: string, index: number) {
    return apiRequest(`/report/${reportId}/section/${index}`)
  },

  check(simId: string) {
    return apiRequest(`/report/check/${simId}`, {
      schema: ReportCheckSchema,
    })
  },

  getAgentLog(reportId: string, fromLine = 0) {
    return apiRequest(
      `/report/${reportId}/agent-log?from_line=${fromLine}`,
      { schema: AgentLogSchema },
    )
  },

  streamAgentLog(reportId: string) {
    return apiRequest(`/report/${reportId}/agent-log/stream`)
  },

  getConsoleLog(reportId: string, fromLine = 0) {
    return apiRequest(
      `/report/${reportId}/console-log?from_line=${fromLine}`,
    )
  },

  streamConsoleLog(reportId: string) {
    return apiRequest(`/report/${reportId}/console-log/stream`)
  },

  searchGraph(params: { graph_id: string; query: string; limit?: number }) {
    return apiRequest('/report/tools/search', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  graphStatistics(params: { graph_id: string }) {
    return apiRequest('/report/tools/statistics', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },
}
