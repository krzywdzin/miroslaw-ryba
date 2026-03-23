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

import { ChatBubble } from '@/features/chat/components/ChatBubble'
import type { ChatMessage } from '@/features/chat/types'

function makeMessage(overrides: Partial<ChatMessage> = {}): ChatMessage {
  return {
    id: 'msg-1',
    role: 'agent',
    content: 'Hello',
    timestamp: Date.now(),
    ...overrides,
  }
}

describe('ChatBubble', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders user message with plain text', () => {
    render(<ChatBubble message={makeMessage({ role: 'user', content: 'Hi there' })} />)
    expect(screen.getByText('Hi there')).toBeDefined()
    const bubble = screen.getByTestId('chat-bubble')
    expect(bubble.className).toContain('bg-primary')
  })

  it('renders agent message with markdown', () => {
    render(<ChatBubble message={makeMessage({ content: '**bold** text' })} />)
    const bold = document.querySelector('strong')
    expect(bold).not.toBeNull()
    expect(bold!.textContent).toBe('bold')
  })

  it('renders sources section when sources present', () => {
    render(<ChatBubble message={makeMessage({ sources: ['src1'] })} />)
    expect(screen.getByText('sources')).toBeDefined()
  })

  it('does not render sources when empty', () => {
    render(<ChatBubble message={makeMessage()} />)
    expect(screen.queryByText('sources')).toBeNull()
  })

  it('renders error bubble with destructive styling', () => {
    render(<ChatBubble message={makeMessage({ error: true })} />)
    const bubble = screen.getByTestId('chat-bubble')
    expect(bubble.className).toContain('destructive')
  })
})
