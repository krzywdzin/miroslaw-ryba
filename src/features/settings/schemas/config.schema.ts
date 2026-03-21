import { z } from 'zod/v4'

export const apiKeysSchema = z.object({
  llmApiKey: z.string().min(1, 'Klucz API jest wymagany'),
  llmBaseUrl: z.url('Nieprawidlowy adres URL'),
})

export const modelSchema = z.object({
  llmModel: z.string().min(1, 'Model jest wymagany'),
  boostLlmApiKey: z.string().optional(),
  boostLlmBaseUrl: z.union([z.url(), z.literal('')]).optional(),
  boostLlmModel: z.string().optional(),
})

export const simulationSchema = z
  .object({
    agentCount: z.number().int().min(2, 'Minimum 2 agentow').max(50, 'Maksimum 50 agentow'),
    maxRounds: z.number().int().min(1, 'Minimum 1 runda').max(20, 'Maksimum 20 rund'),
    enableTwitter: z.boolean(),
    enableReddit: z.boolean(),
  })
  .refine((data) => data.enableTwitter || data.enableReddit, {
    message: 'Wybierz co najmniej jedna platforme',
    path: ['enableReddit'],
  })

export const zepSchema = z.object({
  zepApiKey: z.string().optional(),
  zepCloudUrl: z.union([z.url(), z.literal('')]).optional(),
})

export type ApiKeysFormValues = z.infer<typeof apiKeysSchema>
export type ModelFormValues = z.infer<typeof modelSchema>
export type SimulationFormValues = z.infer<typeof simulationSchema>
export type ZepFormValues = z.infer<typeof zepSchema>
