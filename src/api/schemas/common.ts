import { z } from 'zod/v4'

export const apiResponse = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
  })

export const apiListResponse = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(itemSchema),
    count: z.number().optional(),
  })

export const apiMessageResponse = z.object({
  success: z.boolean(),
  message: z.string(),
})
