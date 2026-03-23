export interface ChatMessage {
  id: string
  role: 'user' | 'agent'
  content: string
  sources?: unknown[]
  toolCalls?: unknown[]
  timestamp: number
  error?: boolean
}

export type AgentTarget =
  | { type: 'report' }
  | { type: 'simulated'; agentId: string; platform?: string }
