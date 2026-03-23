// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'pl' },
  }),
}))

import { AgentContextPanel } from '@/features/chat/components/AgentContextPanel'

describe('AgentContextPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows ReportAgent description for report target', () => {
    render(<AgentContextPanel target={{ type: 'report' }} />)
    expect(screen.getByText('reportAgentDescription')).toBeDefined()
    expect(screen.getByText('ReportAgent')).toBeDefined()
  })

  it('shows personality and stance for simulated agent', () => {
    render(
      <AgentContextPanel
        target={{ type: 'simulated', agentId: 'a1' }}
        profile={{
          agent_id: 'a1',
          name: 'Test Agent',
          personality: 'Friendly',
          stance: 'Optimistic',
          platform: 'twitter',
        }}
      />,
    )
    expect(screen.getByText('Friendly')).toBeDefined()
    expect(screen.getByText('Optimistic')).toBeDefined()
    expect(screen.getByText('Test Agent')).toBeDefined()
  })

  it('shows memory unavailable placeholder', () => {
    render(
      <AgentContextPanel
        target={{ type: 'simulated', agentId: 'a1' }}
        profile={{
          agent_id: 'a1',
          name: 'Test Agent',
        }}
      />,
    )
    expect(screen.getByText('memoryUnavailable')).toBeDefined()
  })

  it('renders data-testid', () => {
    render(<AgentContextPanel target={{ type: 'report' }} />)
    expect(screen.getByTestId('agent-context-panel')).toBeDefined()
  })
})
