import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface ConfigState {
  // API Keys (CONF-01)
  llmApiKey: string
  llmBaseUrl: string
  // Model (CONF-02)
  llmModel: string
  boostLlmApiKey: string
  boostLlmBaseUrl: string
  boostLlmModel: string
  // Simulation (CONF-03)
  agentCount: number
  maxRounds: number
  enableTwitter: boolean
  enableReddit: boolean
  // Zep (CONF-04)
  zepApiKey: string
  zepCloudUrl: string
  // Actions
  setConfig: (partial: Partial<Omit<ConfigState, 'setConfig'>>) => void
}

export const useConfigStore = create<ConfigState>()(
  persist(
    (set) => ({
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
      setConfig: (partial) => set(partial),
    }),
    {
      name: 'mirofish-config',
      partialize: (state) => {
        const { setConfig: _, ...rest } = state
        return rest
      },
    }
  )
)
