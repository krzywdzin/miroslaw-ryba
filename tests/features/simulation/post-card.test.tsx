// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'pl' },
  }),
}))

import { PostCard } from '@/features/simulation/components/PostCard'

const baseAction = {
  agent_id: 'agent1',
  action_type: 'post',
  content: 'Hello world',
  round_num: 3,
  platform: 'twitter',
  timestamp: '12:34:56',
}

describe('PostCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders agent name with @ prefix for twitter platform', () => {
    render(<PostCard action={baseAction} />)
    expect(screen.getByText('@agent1')).toBeDefined()
  })

  it('renders agent name with u/ prefix for reddit platform', () => {
    render(<PostCard action={{ ...baseAction, platform: 'reddit' }} />)
    expect(screen.getByText('u/agent1')).toBeDefined()
  })

  it('renders round badge with "R" prefix', () => {
    render(<PostCard action={baseAction} />)
    expect(screen.getByText('R3')).toBeDefined()
  })

  it('renders action type badge', () => {
    render(<PostCard action={baseAction} />)
    expect(screen.getByText('actionType.post')).toBeDefined()
  })

  it('truncates content with line-clamp-2 class', () => {
    render(<PostCard action={baseAction} />)
    const content = screen.getByText('Hello world')
    expect(content.className).toContain('line-clamp-2')
  })

  it('shows expand button for long content', () => {
    const longContent = 'A'.repeat(200)
    render(<PostCard action={{ ...baseAction, content: longContent }} />)
    expect(screen.getByText('feed.expand')).toBeDefined()
  })

  it('highlight state adds ring class', () => {
    render(<PostCard action={baseAction} highlighted />)
    const card = screen.getByTestId('post-card')
    expect(card.className).toContain('ring-1')
    expect(card.className).toContain('bg-accent/10')
  })

  it('renders data-testid', () => {
    render(<PostCard action={baseAction} />)
    expect(screen.getByTestId('post-card')).toBeDefined()
  })
})
