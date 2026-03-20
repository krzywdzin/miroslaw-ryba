import { z } from 'zod/v4'
import { apiResponse } from './common'

export const SimulationStateSchema = z.object({
  simulation_id: z.string(),
  project_id: z.string(),
  status: z.string(),
  graph_id: z.string().optional(),
  enable_twitter: z.boolean().optional(),
  enable_reddit: z.boolean().optional(),
})

export const SimulationResponseSchema = apiResponse(SimulationStateSchema)

export const SimulationListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(SimulationStateSchema),
  count: z.number(),
})

export const EntitySchema = z.object({
  uuid: z.string(),
  name: z.string(),
  type: z.string(),
  description: z.string().optional(),
})

export const EntitiesResponseSchema = apiResponse(
  z.object({
    filtered_count: z.number(),
    entities: z.array(EntitySchema),
    entity_types: z.array(z.string()),
  }),
)

export const ProfileSchema = z.object({
  agent_id: z.string(),
  name: z.string(),
  personality: z.string().optional(),
  stance: z.string().optional(),
  platform: z.string().optional(),
})

export const ProfilesResponseSchema = apiResponse(
  z.object({
    platform: z.string(),
    count: z.number(),
    profiles: z.array(ProfileSchema),
  }),
)

export const PrepareStatusSchema = apiResponse(
  z.object({
    task_id: z.string(),
    status: z.string(),
    progress: z.number().optional(),
    prepare_info: z.unknown().optional(),
  }),
)

export const RunStatusSchema = apiResponse(
  z.object({
    runner_status: z.string(),
    current_round: z.number().optional(),
    total_rounds: z.number().optional(),
    progress_percent: z.number().optional(),
  }),
)

export const ActionSchema = z.object({
  agent_id: z.string(),
  action_type: z.string(),
  content: z.string().optional(),
  round_num: z.number().optional(),
  platform: z.string().optional(),
  timestamp: z.string().optional(),
})

export const ActionsResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    count: z.number(),
    actions: z.array(ActionSchema),
  }),
})

export const TimelineResponseSchema = apiResponse(
  z.object({
    rounds_count: z.number(),
    timeline: z.array(z.unknown()),
  }),
)

export const InterviewResponseSchema = apiResponse(
  z.object({
    agent_id: z.string(),
    prompt: z.string(),
    result: z.unknown(),
  }),
)

export const EnvStatusResponseSchema = apiResponse(
  z.object({
    env_alive: z.boolean(),
    twitter_available: z.boolean().optional(),
    reddit_available: z.boolean().optional(),
  }),
)
