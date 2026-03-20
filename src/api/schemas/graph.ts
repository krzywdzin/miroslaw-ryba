import { z } from 'zod/v4'
import { apiResponse } from './common'

export const ProjectSchema = z.object({
  project_id: z.string(),
  project_name: z.string().optional(),
  simulation_requirement: z.string().optional(),
})

export const ProjectResponseSchema = apiResponse(ProjectSchema)

export const ProjectListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ProjectSchema),
  count: z.number(),
})

export const OntologyResponseSchema = apiResponse(
  z.object({
    project_id: z.string(),
    ontology: z.unknown(),
  }),
)

export const BuildResponseSchema = apiResponse(
  z.object({
    project_id: z.string(),
    task_id: z.string(),
  }),
)

export const TaskSchema = z.object({
  task_id: z.string(),
  status: z.string(),
  progress: z.number().optional(),
  error: z.string().optional(),
})

export const TaskResponseSchema = apiResponse(TaskSchema)

export const TaskListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(TaskSchema),
  count: z.number(),
})

export const GraphNodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string().optional(),
})

export const GraphEdgeSchema = z.object({
  source: z.string(),
  target: z.string(),
  relation: z.string().optional(),
})

export const GraphDataSchema = apiResponse(
  z.object({
    nodes: z.array(GraphNodeSchema),
    edges: z.array(GraphEdgeSchema),
  }),
)
