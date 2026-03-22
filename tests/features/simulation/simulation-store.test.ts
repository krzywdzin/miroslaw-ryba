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

const { useSimulationStore } = await import(
  '@/features/simulation/hooks/useSimulationStore'
)

describe('useSimulationStore', () => {
  beforeEach(() => {
    localStorageMock.clear()
    useSimulationStore.setState({
      step: 'idle',
      simulationId: null,
      activeRoundFilter: null,
      highlightedEventId: null,
      startTime: null,
    })
  })

  it('initializes with step=idle, simulationId=null, activeRoundFilter=null, highlightedEventId=null, startTime=null', () => {
    const state = useSimulationStore.getState()
    expect(state.step).toBe('idle')
    expect(state.simulationId).toBeNull()
    expect(state.activeRoundFilter).toBeNull()
    expect(state.highlightedEventId).toBeNull()
    expect(state.startTime).toBeNull()
  })

  it('setStep updates step to running', () => {
    useSimulationStore.getState().setStep('running')
    expect(useSimulationStore.getState().step).toBe('running')
  })

  it('setSimulationId stores the ID', () => {
    useSimulationStore.getState().setSimulationId('sim-1')
    expect(useSimulationStore.getState().simulationId).toBe('sim-1')
  })

  it('setActiveRoundFilter sets round filter', () => {
    useSimulationStore.getState().setActiveRoundFilter(3)
    expect(useSimulationStore.getState().activeRoundFilter).toBe(3)
  })

  it('setHighlightedEventId sets highlighted event', () => {
    useSimulationStore.getState().setHighlightedEventId('evt-1')
    expect(useSimulationStore.getState().highlightedEventId).toBe('evt-1')
  })

  it('setStartTime stores start timestamp', () => {
    const now = Date.now()
    useSimulationStore.getState().setStartTime(now)
    expect(useSimulationStore.getState().startTime).toBe(now)
  })

  it('reset returns all fields to defaults', () => {
    const store = useSimulationStore.getState()
    store.setStep('running')
    store.setSimulationId('sim-1')
    store.setActiveRoundFilter(3)
    store.setHighlightedEventId('evt-1')
    store.setStartTime(Date.now())

    useSimulationStore.getState().reset()

    const state = useSimulationStore.getState()
    expect(state.step).toBe('idle')
    expect(state.simulationId).toBeNull()
    expect(state.activeRoundFilter).toBeNull()
    expect(state.highlightedEventId).toBeNull()
    expect(state.startTime).toBeNull()
  })

  it('uses mirofish-simulation as persist key', () => {
    expect(useSimulationStore.persist.getOptions().name).toBe(
      'mirofish-simulation',
    )
  })

  it('excludes actions from persisted state', () => {
    const options = useSimulationStore.persist.getOptions()
    const partialize = options.partialize!
    const state = useSimulationStore.getState()
    const persisted = partialize(state)
    expect(persisted).not.toHaveProperty('setStep')
    expect(persisted).not.toHaveProperty('reset')
    expect(persisted).not.toHaveProperty('setSimulationId')
    expect(persisted).not.toHaveProperty('setActiveRoundFilter')
    expect(persisted).not.toHaveProperty('setHighlightedEventId')
    expect(persisted).not.toHaveProperty('setStartTime')
    expect(persisted).toHaveProperty('step')
    expect(persisted).toHaveProperty('simulationId')
    expect(persisted).toHaveProperty('startTime')
  })
})
