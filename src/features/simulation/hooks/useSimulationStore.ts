import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SimulationStep = 'idle' | 'running' | 'completed' | 'failed' | 'stopped'

export interface SimulationState {
  step: SimulationStep
  simulationId: string | null
  activeRoundFilter: number | null
  highlightedEventId: string | null
  startTime: number | null
  setStep: (step: SimulationStep) => void
  setSimulationId: (id: string | null) => void
  setActiveRoundFilter: (round: number | null) => void
  setHighlightedEventId: (id: string | null) => void
  setStartTime: (time: number | null) => void
  reset: () => void
}

const initialState = {
  step: 'idle' as SimulationStep,
  simulationId: null as string | null,
  activeRoundFilter: null as number | null,
  highlightedEventId: null as string | null,
  startTime: null as number | null,
}

export const useSimulationStore = create<SimulationState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      setSimulationId: (simulationId) => set({ simulationId }),
      setActiveRoundFilter: (activeRoundFilter) => set({ activeRoundFilter }),
      setHighlightedEventId: (highlightedEventId) => set({ highlightedEventId }),
      setStartTime: (startTime) => set({ startTime }),
      reset: () => set(initialState),
    }),
    {
      name: 'mirofish-simulation',
      partialize: (state) => ({
        step: state.step,
        simulationId: state.simulationId,
        startTime: state.startTime,
      }),
    },
  ),
)
