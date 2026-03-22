// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (key === 'timeline.round' && params) return `Runda ${params.round}`
      return key
    },
    i18n: { language: 'pl' },
  }),
}))

import { EventTimeline } from '@/features/simulation/components/EventTimeline'

const sampleTimeline = [
  {
    round_num: 1,
    events: [
      { type: 'debate', description: 'agent1 vs agent2', id: 'e1' },
      { type: 'post_batch', description: '5 postow', id: 'e2' },
    ],
  },
  {
    round_num: 2,
    events: [
      { type: 'stance_change', description: 'agent3 zmienil stance', id: 'e3' },
    ],
  },
]

describe('EventTimeline', () => {
  const onRoundClick = vi.fn()
  const onEventClick = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders timeline header', () => {
    render(
      <EventTimeline
        timeline={sampleTimeline}
        activeRoundFilter={null}
        onRoundClick={onRoundClick}
        onEventClick={onEventClick}
      />,
    )
    expect(screen.getByText('timeline.header')).toBeDefined()
  })

  it('renders round groups for given timeline data', () => {
    render(
      <EventTimeline
        timeline={sampleTimeline}
        activeRoundFilter={null}
        onRoundClick={onRoundClick}
        onEventClick={onEventClick}
      />,
    )
    expect(screen.getByText('Runda 1')).toBeDefined()
    expect(screen.getByText('Runda 2')).toBeDefined()
  })

  it('clicking round calls onRoundClick', () => {
    render(
      <EventTimeline
        timeline={sampleTimeline}
        activeRoundFilter={null}
        onRoundClick={onRoundClick}
        onEventClick={onEventClick}
      />,
    )
    fireEvent.click(screen.getByText('Runda 1'))
    expect(onRoundClick).toHaveBeenCalledWith(1)
  })

  it('all rounds button appears when filter is active', () => {
    render(
      <EventTimeline
        timeline={sampleTimeline}
        activeRoundFilter={1}
        onRoundClick={onRoundClick}
        onEventClick={onEventClick}
      />,
    )
    expect(screen.getByText('timeline.allRounds')).toBeDefined()
  })

  it('all rounds button not shown when no filter', () => {
    render(
      <EventTimeline
        timeline={sampleTimeline}
        activeRoundFilter={null}
        onRoundClick={onRoundClick}
        onEventClick={onEventClick}
      />,
    )
    expect(screen.queryByText('timeline.allRounds')).toBeNull()
  })

  it('renders empty state when no timeline data', () => {
    render(
      <EventTimeline
        timeline={[]}
        activeRoundFilter={null}
        onRoundClick={onRoundClick}
        onEventClick={onEventClick}
      />,
    )
    expect(screen.getByText('timeline.waitingForEvents')).toBeDefined()
  })
})
