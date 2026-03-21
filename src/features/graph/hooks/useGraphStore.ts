import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type GraphStep = 'upload' | 'building' | 'done'

export interface GraphState {
  step: GraphStep
  projectId: string | null
  taskId: string | null
  graphId: string | null
  predictionGoal: string
  setStep: (step: GraphStep) => void
  setProjectId: (id: string | null) => void
  setTaskId: (id: string | null) => void
  setGraphId: (id: string | null) => void
  setPredictionGoal: (goal: string) => void
  reset: () => void
}

const initialState = {
  step: 'upload' as GraphStep,
  projectId: null as string | null,
  taskId: null as string | null,
  graphId: null as string | null,
  predictionGoal: '',
}

export const useGraphStore = create<GraphState>()(
  persist(
    (set) => ({
      ...initialState,
      setStep: (step) => set({ step }),
      setProjectId: (projectId) => set({ projectId }),
      setTaskId: (taskId) => set({ taskId }),
      setGraphId: (graphId) => set({ graphId }),
      setPredictionGoal: (predictionGoal) => set({ predictionGoal }),
      reset: () => set(initialState),
    }),
    {
      name: 'mirofish-graph',
      partialize: (state) => ({
        step: state.step,
        projectId: state.projectId,
        taskId: state.taskId,
        graphId: state.graphId,
        predictionGoal: state.predictionGoal,
      }),
    },
  ),
)
