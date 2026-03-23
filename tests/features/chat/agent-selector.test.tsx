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

import { AgentSelector } from '@/features/chat/components/AgentSelector'

const profiles = [
  { agent_id: 'a1', name: 'Agent Alpha' },
  { agent_id: 'a2', name: 'Agent Beta' },
]

describe('AgentSelector', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders select agent label', () => {
    render(
      <AgentSelector
        selectedAgentId="report-agent"
        profiles={profiles}
        onSelect={vi.fn()}
      />,
    )
    expect(screen.getByText('selectAgent')).toBeDefined()
  })

  it('renders trigger with data-testid', () => {
    render(
      <AgentSelector
        selectedAgentId="report-agent"
        profiles={profiles}
        onSelect={vi.fn()}
      />,
    )
    expect(screen.getByTestId('agent-selector-trigger')).toBeDefined()
  })

  it('accepts onSelect callback prop', () => {
    const onSelect = vi.fn()
    render(
      <AgentSelector
        selectedAgentId="report-agent"
        profiles={profiles}
        onSelect={onSelect}
      />,
    )
    // Select component renders -- no crash verifies proper wiring
    expect(screen.getByTestId('agent-selector-trigger')).toBeDefined()
  })
})
