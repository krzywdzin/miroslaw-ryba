import { describe, it, expect } from 'vitest'
import {
  apiKeysSchema,
  modelSchema,
  simulationSchema,
  zepSchema,
} from '@/features/settings/schemas/config.schema'

describe('apiKeysSchema', () => {
  it('accepts valid key and URL', () => {
    const result = apiKeysSchema.safeParse({
      llmApiKey: 'sk-test-key-123',
      llmBaseUrl: 'https://api.openai.com/v1',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty API key', () => {
    const result = apiKeysSchema.safeParse({
      llmApiKey: '',
      llmBaseUrl: 'https://api.openai.com/v1',
    })
    expect(result.success).toBe(false)
  })

  it('rejects invalid URL', () => {
    const result = apiKeysSchema.safeParse({
      llmApiKey: 'sk-test-key',
      llmBaseUrl: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })
})

describe('modelSchema', () => {
  it('accepts preset model name', () => {
    const result = modelSchema.safeParse({
      llmModel: 'qwen-plus',
    })
    expect(result.success).toBe(true)
  })

  it('rejects empty model name', () => {
    const result = modelSchema.safeParse({
      llmModel: '',
    })
    expect(result.success).toBe(false)
  })

  it('accepts model with optional boost fields', () => {
    const result = modelSchema.safeParse({
      llmModel: 'gpt-4',
      boostLlmApiKey: 'sk-boost-key',
      boostLlmBaseUrl: 'https://api.openai.com/v1',
      boostLlmModel: 'gpt-4-turbo',
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty boost base URL', () => {
    const result = modelSchema.safeParse({
      llmModel: 'gpt-4',
      boostLlmBaseUrl: '',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid boost base URL', () => {
    const result = modelSchema.safeParse({
      llmModel: 'gpt-4',
      boostLlmBaseUrl: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })
})

describe('simulationSchema', () => {
  it('accepts valid simulation params', () => {
    const result = simulationSchema.safeParse({
      agentCount: 10,
      maxRounds: 5,
      enableTwitter: true,
      enableReddit: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects agent count below 2', () => {
    const result = simulationSchema.safeParse({
      agentCount: 1,
      maxRounds: 5,
      enableTwitter: true,
      enableReddit: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects agent count above 50', () => {
    const result = simulationSchema.safeParse({
      agentCount: 51,
      maxRounds: 5,
      enableTwitter: true,
      enableReddit: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects max rounds below 1', () => {
    const result = simulationSchema.safeParse({
      agentCount: 10,
      maxRounds: 0,
      enableTwitter: true,
      enableReddit: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects max rounds above 20', () => {
    const result = simulationSchema.safeParse({
      agentCount: 10,
      maxRounds: 21,
      enableTwitter: true,
      enableReddit: true,
    })
    expect(result.success).toBe(false)
  })

  it('requires at least one platform enabled', () => {
    const result = simulationSchema.safeParse({
      agentCount: 10,
      maxRounds: 5,
      enableTwitter: false,
      enableReddit: false,
    })
    expect(result.success).toBe(false)
  })

  it('allows only Twitter enabled', () => {
    const result = simulationSchema.safeParse({
      agentCount: 10,
      maxRounds: 5,
      enableTwitter: true,
      enableReddit: false,
    })
    expect(result.success).toBe(true)
  })

  it('allows only Reddit enabled', () => {
    const result = simulationSchema.safeParse({
      agentCount: 10,
      maxRounds: 5,
      enableTwitter: false,
      enableReddit: true,
    })
    expect(result.success).toBe(true)
  })

  it('accepts boundary values', () => {
    expect(
      simulationSchema.safeParse({
        agentCount: 2,
        maxRounds: 1,
        enableTwitter: true,
        enableReddit: false,
      }).success
    ).toBe(true)

    expect(
      simulationSchema.safeParse({
        agentCount: 50,
        maxRounds: 20,
        enableTwitter: false,
        enableReddit: true,
      }).success
    ).toBe(true)
  })
})

describe('zepSchema', () => {
  it('accepts empty values (all optional)', () => {
    const result = zepSchema.safeParse({})
    expect(result.success).toBe(true)
  })

  it('accepts valid API key and URL', () => {
    const result = zepSchema.safeParse({
      zepApiKey: 'zep-key-123',
      zepCloudUrl: 'https://api.getzep.com',
    })
    expect(result.success).toBe(true)
  })

  it('accepts empty cloud URL', () => {
    const result = zepSchema.safeParse({
      zepCloudUrl: '',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid cloud URL', () => {
    const result = zepSchema.safeParse({
      zepCloudUrl: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })
})
