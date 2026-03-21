import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type EnvironmentStep = 'loading' | 'review' | 'preparing' | 'ready'

export interface EnvironmentState {
  step: EnvironmentStep
  simulationId: string | null
  prepareTaskId: string | null
  entityTypes: string[]
  setStep: (step: EnvironmentStep) => void
  setSimulationId: (id: string | null) => void
  setPrepareTaskId: (id: string | null) => void
  setEntityTypes: (types: string[]) => void
  reset: () => void
}

const initialState = {
  step: 'loading' as EnvironmentStep,
  simulationId: null as string | null,
  prepareTaskId: null as string | null,
  entityTypes: [] as string[],
}

export const useEnvironmentStore = create<EnvironmentState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      setSimulationId: (simulationId) => set({ simulationId }),
      setPrepareTaskId: (prepareTaskId) => set({ prepareTaskId }),
      setEntityTypes: (entityTypes) => set({ entityTypes }),
      reset: () => set(initialState),
    }),
    {
      name: 'mirofish-environment',
      partialize: (state) => ({
        step: state.step,
        simulationId: state.simulationId,
        prepareTaskId: state.prepareTaskId,
        entityTypes: state.entityTypes,
      }),
    },
  ),
)
