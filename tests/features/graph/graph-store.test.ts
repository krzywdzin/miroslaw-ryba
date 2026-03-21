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

const { useGraphStore } = await import(
  '@/features/graph/hooks/useGraphStore'
)

describe('useGraphStore', () => {
  beforeEach(() => {
    localStorageMock.clear()
    useGraphStore.setState({
      step: 'upload',
      projectId: null,
      taskId: null,
      graphId: null,
      predictionGoal: '',
    })
  })

  it('initializes with step=upload, projectId=null, etc.', () => {
    const state = useGraphStore.getState()
    expect(state.step).toBe('upload')
    expect(state.projectId).toBeNull()
    expect(state.taskId).toBeNull()
    expect(state.graphId).toBeNull()
    expect(state.predictionGoal).toBe('')
  })

  it('setStep updates step', () => {
    useGraphStore.getState().setStep('building')
    expect(useGraphStore.getState().step).toBe('building')
  })

  it('setProjectId updates projectId', () => {
    useGraphStore.getState().setProjectId('proj-123')
    expect(useGraphStore.getState().projectId).toBe('proj-123')
  })

  it('setTaskId updates taskId', () => {
    useGraphStore.getState().setTaskId('task-456')
    expect(useGraphStore.getState().taskId).toBe('task-456')
  })

  it('setGraphId updates graphId', () => {
    useGraphStore.getState().setGraphId('graph-789')
    expect(useGraphStore.getState().graphId).toBe('graph-789')
  })

  it('setPredictionGoal updates goal text', () => {
    useGraphStore.getState().setPredictionGoal('Predict stock prices')
    expect(useGraphStore.getState().predictionGoal).toBe('Predict stock prices')
  })

  it('reset returns all fields to defaults', () => {
    const store = useGraphStore.getState()
    store.setStep('done')
    store.setProjectId('proj-123')
    store.setTaskId('task-456')
    store.setGraphId('graph-789')
    store.setPredictionGoal('Some goal')

    useGraphStore.getState().reset()

    const state = useGraphStore.getState()
    expect(state.step).toBe('upload')
    expect(state.projectId).toBeNull()
    expect(state.taskId).toBeNull()
    expect(state.graphId).toBeNull()
    expect(state.predictionGoal).toBe('')
  })

  it('uses mirofish-graph as persist key', () => {
    expect(useGraphStore.persist.getOptions().name).toBe('mirofish-graph')
  })

  it('excludes actions from persisted state', () => {
    const options = useGraphStore.persist.getOptions()
    const partialize = options.partialize!
    const state = useGraphStore.getState()
    const persisted = partialize(state)
    expect(persisted).not.toHaveProperty('setStep')
    expect(persisted).not.toHaveProperty('reset')
    expect(persisted).toHaveProperty('step')
    expect(persisted).toHaveProperty('projectId')
    expect(persisted).toHaveProperty('predictionGoal')
  })
})
