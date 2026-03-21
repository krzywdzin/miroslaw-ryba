// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage before importing the store
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      store = {}
    }),
    get length() {
      return Object.keys(store).length
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Import store after localStorage mock is in place
const { useConfigStore } = await import(
  '@/features/settings/hooks/useConfigStore'
)

describe('useConfigStore', () => {
  beforeEach(() => {
    localStorageMock.clear()
    // Reset store to defaults between tests
    useConfigStore.setState({
      llmApiKey: '',
      llmBaseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      llmModel: 'qwen-plus',
      boostLlmApiKey: '',
      boostLlmBaseUrl: '',
      boostLlmModel: '',
      agentCount: 10,
      maxRounds: 5,
      enableTwitter: true,
      enableReddit: true,
      zepApiKey: '',
      zepCloudUrl: 'https://api.getzep.com',
    })
  })

  it('has correct default values', () => {
    const state = useConfigStore.getState()
    expect(state.llmApiKey).toBe('')
    expect(state.llmBaseUrl).toBe(
      'https://dashscope.aliyuncs.com/compatible-mode/v1'
    )
    expect(state.llmModel).toBe('qwen-plus')
    expect(state.boostLlmApiKey).toBe('')
    expect(state.boostLlmBaseUrl).toBe('')
    expect(state.boostLlmModel).toBe('')
    expect(state.agentCount).toBe(10)
    expect(state.maxRounds).toBe(5)
    expect(state.enableTwitter).toBe(true)
    expect(state.enableReddit).toBe(true)
    expect(state.zepApiKey).toBe('')
    expect(state.zepCloudUrl).toBe('https://api.getzep.com')
  })

  it('updates values via setConfig', () => {
    const { setConfig } = useConfigStore.getState()
    setConfig({ llmApiKey: 'sk-test-key', llmModel: 'gpt-4' })

    const state = useConfigStore.getState()
    expect(state.llmApiKey).toBe('sk-test-key')
    expect(state.llmModel).toBe('gpt-4')
    // Other values remain unchanged
    expect(state.llmBaseUrl).toBe(
      'https://dashscope.aliyuncs.com/compatible-mode/v1'
    )
  })

  it('partially updates without overwriting other fields', () => {
    const { setConfig } = useConfigStore.getState()
    setConfig({ agentCount: 20 })
    setConfig({ maxRounds: 10 })

    const state = useConfigStore.getState()
    expect(state.agentCount).toBe(20)
    expect(state.maxRounds).toBe(10)
  })

  it('uses mirofish-config as persist key', () => {
    const persistOptions = useConfigStore.persist
    expect(persistOptions.getOptions().name).toBe('mirofish-config')
  })

  it('excludes setConfig from persisted state', () => {
    const options = useConfigStore.persist.getOptions()
    const partialize = options.partialize!
    const state = useConfigStore.getState()
    const persisted = partialize(state)
    expect(persisted).not.toHaveProperty('setConfig')
    expect(persisted).toHaveProperty('llmApiKey')
  })
})
