import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { simulationApi } from '@/api/simulation'
import { useChatSession } from '../hooks/useChatSession'
import { ChatLayout } from '../components/ChatLayout'
import { AgentSelector } from '../components/AgentSelector'
import { MessageList } from '../components/MessageList'
import { ChatInput } from '../components/ChatInput'
import { AgentContextPanel } from '../components/AgentContextPanel'
import type { AgentTarget } from '../types'

export function ChatPage() {
  const { simulationId } = useParams<{ simulationId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (!simulationId) {
      navigate('/graph', { replace: true })
    }
  }, [simulationId, navigate])

  const profilesQuery = useQuery({
    queryKey: ['profiles', simulationId],
    queryFn: () => simulationApi.getProfiles(simulationId!),
    enabled: !!simulationId,
  })

  const profiles = profilesQuery.data?.data?.profiles ?? []

  const { messages, target, send, switchAgent, isPending } = useChatSession(
    simulationId!,
  )

  const selectedAgentId =
    target.type === 'report' ? 'report-agent' : target.agentId

  const currentProfile =
    target.type === 'simulated'
      ? profiles.find((p) => p.agent_id === target.agentId) ?? null
      : null

  function handleAgentSelect(agentId: string) {
    if (agentId === 'report-agent') {
      switchAgent({ type: 'report' })
    } else {
      const profile = profiles.find((p) => p.agent_id === agentId)
      switchAgent({
        type: 'simulated',
        agentId,
        platform: profile?.platform,
      } as AgentTarget & { type: 'simulated' })
    }
  }

  if (!simulationId) return null

  return (
    <ChatLayout
      selector={
        <AgentSelector
          selectedAgentId={selectedAgentId}
          profiles={profiles}
          onSelect={handleAgentSelect}
          isLoading={profilesQuery.isLoading}
        />
      }
      messageArea={<MessageList messages={messages} isPending={isPending} />}
      inputArea={<ChatInput onSend={send} disabled={isPending} />}
      contextPanel={
        <AgentContextPanel
          target={target}
          profile={currentProfile}
          isLoading={profilesQuery.isLoading}
        />
      }
    />
  )
}
