// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      if (key === 'progress.round' && params) return `Runda ${params.current}/${params.total}`
      return key
    },
    i18n: { language: 'pl' },
  }),
}))

import { SimulationProgressBar } from '@/features/simulation/components/SimulationProgressBar'

const baseProps = {
  runnerStatus: 'running',
  currentRound: 3,
  totalRounds: 10,
  progressPercent: 30,
  postCount: 42,
  commentCount: 18,
  debateCount: 5,
  activeAgentCount: 8,
  elapsed: 154,
  onStop: vi.fn(),
  onGoToReport: vi.fn(),
  onReturnToEnv: vi.fn(),
}

describe('SimulationProgressBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders round label', () => {
    render(<SimulationProgressBar {...baseProps} />)
    expect(screen.getByText('Runda 3/10')).toBeDefined()
  })

  it('renders progress bar component', () => {
    render(<SimulationProgressBar {...baseProps} />)
    expect(screen.getByTestId('progress-bar')).toBeDefined()
  })

  it('renders all 4 counter values', () => {
    render(<SimulationProgressBar {...baseProps} />)
    expect(screen.getByText('42')).toBeDefined()
    expect(screen.getByText('18')).toBeDefined()
    expect(screen.getByText('5')).toBeDefined()
    expect(screen.getByText('8')).toBeDefined()
  })

  it('renders elapsed time formatted as MM:SS', () => {
    render(<SimulationProgressBar {...baseProps} />)
    expect(screen.getByText('02:34')).toBeDefined()
  })

  it('renders stop button when running', () => {
    render(<SimulationProgressBar {...baseProps} />)
    expect(screen.getByText('progress.stop')).toBeDefined()
  })

  it('renders go to report button when completed', () => {
    render(<SimulationProgressBar {...baseProps} runnerStatus="completed" />)
    expect(screen.getByText('completion.goToReport')).toBeDefined()
  })

  it('renders error badge when failed', () => {
    render(<SimulationProgressBar {...baseProps} runnerStatus="failed" />)
    expect(screen.getByText('error.heading')).toBeDefined()
  })
})
