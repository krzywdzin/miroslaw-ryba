import { apiRequest } from './client'
import { apiMessageResponse } from './schemas/common'
import {
  BuildResponseSchema,
  GraphDataSchema,
  OntologyResponseSchema,
  ProjectListResponseSchema,
  ProjectResponseSchema,
  TaskListResponseSchema,
  TaskResponseSchema,
} from './schemas/graph'

export const graphApi = {
  getProject(projectId: string) {
    return apiRequest(`/graph/project/${projectId}`, {
      schema: ProjectResponseSchema,
    })
  },

  listProjects(limit = 50) {
    return apiRequest(`/graph/project/list?limit=${limit}`, {
      schema: ProjectListResponseSchema,
    })
  },

  deleteProject(projectId: string) {
    return apiRequest(`/graph/project/${projectId}`, {
      method: 'DELETE',
      schema: apiMessageResponse,
    })
  },

  resetProject(projectId: string) {
    return apiRequest(`/graph/project/${projectId}/reset`, {
      method: 'POST',
      schema: ProjectResponseSchema,
    })
  },

  generateOntology(formData: FormData) {
    return apiRequest('/graph/ontology/generate', {
      method: 'POST',
      body: formData,
      schema: OntologyResponseSchema,
    })
  },

  buildGraph(projectId: string) {
    return apiRequest('/graph/build', {
      method: 'POST',
      body: JSON.stringify({ project_id: projectId }),
      schema: BuildResponseSchema,
    })
  },

  getTask(taskId: string) {
    return apiRequest(`/graph/task/${taskId}`, {
      schema: TaskResponseSchema,
    })
  },

  listTasks() {
    return apiRequest('/graph/tasks', {
      schema: TaskListResponseSchema,
    })
  },

  getGraphData(graphId: string) {
    return apiRequest(`/graph/data/${graphId}`, {
      schema: GraphDataSchema,
    })
  },

  deleteGraph(graphId: string) {
    return apiRequest(`/graph/delete/${graphId}`, {
      method: 'DELETE',
      schema: apiMessageResponse,
    })
  },
}
