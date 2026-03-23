import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { reportApi } from '@/api/report'
import { simulationApi } from '@/api/simulation'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import type { ChatMessage, AgentTarget } from '../types'

function extractSimulatedResponse(result: unknown): string {
  if (typeof result === 'string') return result
  if (result && typeof result === 'object' && 'response' in result) {
    const r = (result as { response: unknown }).response
    if (typeof r === 'string') return r
  }
  return JSON.stringify(result)
}

export function useChatSession(simulationId: string) {
  const { t } = useTranslation('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [target, setTarget] = useState<AgentTarget>({ type: 'report' })

  const sendMutation = useMutation({
    mutationFn: async (message: string) => {
      if (target.type === 'report') {
        return reportApi.chat({
          simulation_id: simulationId,
          message,
          chat_history: messages.map((m) => ({
            role: (m.role === 'user' ? 'user' : 'assistant') as
              | 'user'
              | 'assistant',
            content: m.content,
          })),
        })
      }
      return simulationApi.interview({
        simulation_id: simulationId,
        agent_id: target.agentId,
        prompt: message,
        platform: target.platform,
      })
    },
    onMutate: (message: string) => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'user',
          content: message,
          timestamp: Date.now(),
        },
      ])
    },
    onSuccess: (data) => {
      const response = data as { data: Record<string, unknown> }
      let content: string
      let sources: unknown[] | undefined
      let toolCalls: unknown[] | undefined

      if (target.type === 'report') {
        content = response.data.response as string
        sources = response.data.sources as unknown[] | undefined
        toolCalls = response.data.tool_calls as unknown[] | undefined
      } else {
        content = extractSimulatedResponse(response.data.result)
      }

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'agent',
          content,
          sources,
          toolCalls,
          timestamp: Date.now(),
        },
      ])
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'agent',
          content: '',
          timestamp: Date.now(),
          error: true,
        },
      ])
      toast.error(t('sendError'))
    },
  })

  function switchAgent(newTarget: AgentTarget) {
    setTarget(newTarget)
    setMessages([])
    sendMutation.reset()
  }

  return {
    messages,
    target,
    send: sendMutation.mutate,
    switchAgent,
    isPending: sendMutation.isPending,
  }
}
