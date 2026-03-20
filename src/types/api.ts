import { z } from 'zod/v4'
import {
  ProjectSchema,
  TaskSchema,
  GraphNodeSchema,
  GraphEdgeSchema,
} from '../api/schemas/graph'
import {
  SimulationStateSchema,
  EntitySchema,
  ProfileSchema,
  ActionSchema,
} from '../api/schemas/simulation'
import { ReportSchema } from '../api/schemas/report'

// Graph types
export type Project = z.infer<typeof ProjectSchema>
export type Task = z.infer<typeof TaskSchema>
export type GraphNode = z.infer<typeof GraphNodeSchema>
export type GraphEdge = z.infer<typeof GraphEdgeSchema>

// Simulation types
export type SimulationState = z.infer<typeof SimulationStateSchema>
export type Entity = z.infer<typeof EntitySchema>
export type Profile = z.infer<typeof ProfileSchema>
export type Action = z.infer<typeof ActionSchema>

// Report types
export type Report = z.infer<typeof ReportSchema>
