import { apiRequest } from './client'
import {
  ActionsResponseSchema,
  EntitiesResponseSchema,
  EnvStatusResponseSchema,
  InterviewResponseSchema,
  PrepareStatusSchema,
  ProfilesResponseSchema,
  RunStatusSchema,
  SimulationListResponseSchema,
  SimulationResponseSchema,
  TimelineResponseSchema,
} from './schemas/simulation'

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

export const simulationApi = {
  getEntities(
    graphId: string,
    params?: { entity_types?: string; enrich?: boolean },
  ) {
    const query = buildQuery(params ?? {})
    return apiRequest(`/simulation/entities/${graphId}${query}`, {
      schema: EntitiesResponseSchema,
    })
  },

  getEntity(graphId: string, uuid: string) {
    return apiRequest(`/simulation/entities/${graphId}/${uuid}`)
  },

  getEntitiesByType(graphId: string, type: string, enrich?: boolean) {
    const query = enrich !== undefined ? `?enrich=${enrich}` : ''
    return apiRequest(
      `/simulation/entities/${graphId}/by-type/${type}${query}`,
    )
  },

  create(params: {
    project_id: string
    graph_id?: string
    enable_twitter?: boolean
    enable_reddit?: boolean
  }) {
    return apiRequest('/simulation/create', {
      method: 'POST',
      body: JSON.stringify(params),
      schema: SimulationResponseSchema,
    })
  },

  prepare(params: {
    simulation_id: string
    entity_types: string[]
    use_llm_for_profiles?: boolean
    parallel_profile_count?: number
    force_regenerate?: boolean
  }) {
    return apiRequest('/simulation/prepare', {
      method: 'POST',
      body: JSON.stringify(params),
      schema: PrepareStatusSchema,
    })
  },

  prepareStatus(params: { task_id?: string; simulation_id?: string }) {
    return apiRequest('/simulation/prepare/status', {
      method: 'POST',
      body: JSON.stringify(params),
      schema: PrepareStatusSchema,
    })
  },

  get(simulationId: string) {
    return apiRequest(`/simulation/${simulationId}`, {
      schema: SimulationResponseSchema,
    })
  },

  list(projectId?: string) {
    const query = projectId ? `?project_id=${projectId}` : ''
    return apiRequest(`/simulation/list${query}`, {
      schema: SimulationListResponseSchema,
    })
  },

  history(limit = 20) {
    return apiRequest(`/simulation/history?limit=${limit}`)
  },

  getProfiles(simId: string, platform?: string) {
    const query = platform ? `?platform=${platform}` : ''
    return apiRequest(`/simulation/${simId}/profiles${query}`, {
      schema: ProfilesResponseSchema,
    })
  },

  getRealtimeProfiles(simId: string, platform?: string) {
    const query = platform ? `?platform=${platform}` : ''
    return apiRequest(`/simulation/${simId}/profiles/realtime${query}`)
  },

  getRealtimeConfig(simId: string) {
    return apiRequest(`/simulation/${simId}/config/realtime`)
  },

  getConfig(simId: string) {
    return apiRequest(`/simulation/${simId}/config`)
  },

  async downloadConfig(simId: string) {
    const response = await fetch(`/api/simulation/${simId}/config/download`)
    return response.blob()
  },

  async downloadScript(name: string) {
    const response = await fetch(`/api/simulation/script/${name}/download`)
    return response.blob()
  },

  generateProfiles(params: {
    graph_id: string
    entity_types?: string[]
    use_llm?: boolean
    platform?: string
  }) {
    return apiRequest('/simulation/generate-profiles', {
      method: 'POST',
      body: JSON.stringify(params),
      schema: ProfilesResponseSchema,
    })
  },

  start(params: {
    simulation_id: string
    platform?: string
    max_rounds?: number
    enable_graph_memory_update?: boolean
    force?: boolean
  }) {
    return apiRequest('/simulation/start', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  stop(params: { simulation_id: string }) {
    return apiRequest('/simulation/stop', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  getRunStatus(simId: string) {
    return apiRequest(`/simulation/${simId}/run-status`, {
      schema: RunStatusSchema,
    })
  },

  getRunStatusDetail(simId: string, platform?: string) {
    const query = platform ? `?platform=${platform}` : ''
    return apiRequest(`/simulation/${simId}/run-status/detail${query}`)
  },

  getActions(
    simId: string,
    params?: {
      limit?: number
      offset?: number
      platform?: string
      agent_id?: string
      round_num?: number
    },
  ) {
    const query = buildQuery(params ?? {})
    return apiRequest(`/simulation/${simId}/actions${query}`, {
      schema: ActionsResponseSchema,
    })
  },

  getTimeline(
    simId: string,
    params?: { start_round?: number; end_round?: number },
  ) {
    const query = buildQuery(params ?? {})
    return apiRequest(`/simulation/${simId}/timeline${query}`, {
      schema: TimelineResponseSchema,
    })
  },

  getAgentStats(simId: string) {
    return apiRequest(`/simulation/${simId}/agent-stats`)
  },

  getPosts(
    simId: string,
    params?: { platform?: string; limit?: number; offset?: number },
  ) {
    const query = buildQuery(params ?? {})
    return apiRequest(`/simulation/${simId}/posts${query}`)
  },

  getComments(
    simId: string,
    params?: { post_id?: string; limit?: number; offset?: number },
  ) {
    const query = buildQuery(params ?? {})
    return apiRequest(`/simulation/${simId}/comments${query}`)
  },

  interview(params: {
    simulation_id: string
    agent_id: string
    prompt: string
    platform?: string
    timeout?: number
  }) {
    return apiRequest('/simulation/interview', {
      method: 'POST',
      body: JSON.stringify(params),
      schema: InterviewResponseSchema,
    })
  },

  interviewBatch(params: {
    simulation_id: string
    interviews: unknown[]
    platform?: string
    timeout?: number
  }) {
    return apiRequest('/simulation/interview/batch', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  interviewAll(params: {
    simulation_id: string
    prompt: string
    platform?: string
    timeout?: number
  }) {
    return apiRequest('/simulation/interview/all', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  interviewHistory(params: {
    simulation_id: string
    platform?: string
    agent_id?: string
    limit?: number
  }) {
    return apiRequest('/simulation/interview/history', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },

  envStatus(params: { simulation_id: string }) {
    return apiRequest('/simulation/env-status', {
      method: 'POST',
      body: JSON.stringify(params),
      schema: EnvStatusResponseSchema,
    })
  },

  closeEnv(params: { simulation_id: string; timeout?: number }) {
    return apiRequest('/simulation/close-env', {
      method: 'POST',
      body: JSON.stringify(params),
    })
  },
}
