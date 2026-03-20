import { z } from 'zod/v4'
import { apiResponse } from './common'

export const ReportSchema = z.object({
  report_id: z.string(),
  simulation_id: z.string().optional(),
  markdown_content: z.string().optional(),
  outline: z.unknown().optional(),
  status: z.string().optional(),
})

export const ReportResponseSchema = apiResponse(ReportSchema)

export const ReportListResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(ReportSchema),
  count: z.number(),
})

export const ReportGenerateResponseSchema = apiResponse(
  z.object({
    simulation_id: z.string(),
    report_id: z.string(),
    task_id: z.string(),
    status: z.string(),
  }),
)

export const ReportProgressSchema = apiResponse(
  z.object({
    status: z.string(),
    progress: z.number().optional(),
    current_section: z.string().optional(),
    completed_sections: z.array(z.string()).optional(),
  }),
)

export const ReportSectionsSchema = apiResponse(
  z.object({
    sections: z.array(z.unknown()),
    total_sections: z.number(),
    is_complete: z.boolean(),
  }),
)

export const ReportCheckSchema = apiResponse(
  z.object({
    has_report: z.boolean(),
    report_status: z.string().optional(),
    interview_unlocked: z.boolean().optional(),
  }),
)

export const ChatResponseSchema = apiResponse(
  z.object({
    response: z.string(),
    tool_calls: z.array(z.unknown()).optional(),
    sources: z.array(z.unknown()).optional(),
  }),
)

export const AgentLogSchema = apiResponse(
  z.object({
    logs: z.array(z.unknown()),
    total_lines: z.number(),
    has_more: z.boolean(),
  }),
)
