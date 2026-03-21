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

const { useEnvironmentStore } = await import(
  '@/features/environment/hooks/useEnvironmentStore'
)

describe('useEnvironmentStore', () => {
  beforeEach(() => {
    localStorageMock.clear()
    useEnvironmentStore.setState({
      step: 'loading',
      simulationId: null,
      prepareTaskId: null,
      entityTypes: [],
    })
  })

  it('initializes with step=loading, simulationId=null, etc.', () => {
    const state = useEnvironmentStore.getState()
    expect(state.step).toBe('loading')
    expect(state.simulationId).toBeNull()
    expect(state.prepareTaskId).toBeNull()
    expect(state.entityTypes).toEqual([])
  })

  it('setStep updates step', () => {
    useEnvironmentStore.getState().setStep('review')
    expect(useEnvironmentStore.getState().step).toBe('review')
  })

  it('setSimulationId stores ID', () => {
    useEnvironmentStore.getState().setSimulationId('sim-123')
    expect(useEnvironmentStore.getState().simulationId).toBe('sim-123')
  })

  it('setPrepareTaskId stores task ID', () => {
    useEnvironmentStore.getState().setPrepareTaskId('task-456')
    expect(useEnvironmentStore.getState().prepareTaskId).toBe('task-456')
  })

  it('setEntityTypes stores entity types', () => {
    useEnvironmentStore.getState().setEntityTypes(['person', 'organization'])
    expect(useEnvironmentStore.getState().entityTypes).toEqual([
      'person',
      'organization',
    ])
  })

  it('reset returns all fields to defaults', () => {
    const store = useEnvironmentStore.getState()
    store.setStep('ready')
    store.setSimulationId('sim-123')
    store.setPrepareTaskId('task-456')
    store.setEntityTypes(['person'])

    useEnvironmentStore.getState().reset()

    const state = useEnvironmentStore.getState()
    expect(state.step).toBe('loading')
    expect(state.simulationId).toBeNull()
    expect(state.prepareTaskId).toBeNull()
    expect(state.entityTypes).toEqual([])
  })

  it('uses mirofish-environment as persist key', () => {
    expect(useEnvironmentStore.persist.getOptions().name).toBe(
      'mirofish-environment',
    )
  })

  it('excludes actions from persisted state', () => {
    const options = useEnvironmentStore.persist.getOptions()
    const partialize = options.partialize!
    const state = useEnvironmentStore.getState()
    const persisted = partialize(state)
    expect(persisted).not.toHaveProperty('setStep')
    expect(persisted).not.toHaveProperty('reset')
    expect(persisted).not.toHaveProperty('setSimulationId')
    expect(persisted).not.toHaveProperty('setPrepareTaskId')
    expect(persisted).not.toHaveProperty('setEntityTypes')
    expect(persisted).toHaveProperty('step')
    expect(persisted).toHaveProperty('simulationId')
    expect(persisted).toHaveProperty('prepareTaskId')
    expect(persisted).toHaveProperty('entityTypes')
  })
})
