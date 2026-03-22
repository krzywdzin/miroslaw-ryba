// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import React from 'react'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'pl' },
  }),
}))

// Mock react-router
const mockNavigate = vi.fn()
vi.mock('react-router', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock sonner
vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}))

// Mock environment store
const mockEnvStore = {
  simulationId: 'sim-123',
}
vi.mock('@/features/environment/hooks/useEnvironmentStore', () => ({
  useEnvironmentStore: () => mockEnvStore,
}))

// Mock simulation store
const mockSimStore = {
  step: 'running' as string,
  simulationId: 'sim-123',
  activeRoundFilter: null as number | null,
  highlightedEventId: null as string | null,
  startTime: Date.now(),
  setStep: vi.fn(),
  setSimulationId: vi.fn(),
  setActiveRoundFilter: vi.fn(),
  setHighlightedEventId: vi.fn(),
  setStartTime: vi.fn(),
  reset: vi.fn(),
}
vi.mock('@/features/simulation/hooks/useSimulationStore', () => ({
  useSimulationStore: () => mockSimStore,
}))

// Mock hooks
vi.mock('@/features/simulation/hooks/useRunStatus', () => ({
  useRunStatus: () => ({
    data: {
      data: {
        runner_status: 'running',
        current_round: 2,
        total_rounds: 10,
        progress_percent: 20,
      },
    },
    isLoading: false,
  }),
}))

vi.mock('@/features/simulation/hooks/useSimulationActions', () => ({
  useSimulationActions: () => ({
    data: { data: { actions: [], count: 0 } },
    isLoading: false,
  }),
}))

vi.mock('@/features/simulation/hooks/useSimulationTimeline', () => ({
  useSimulationTimeline: () => ({
    data: { data: { timeline: [], rounds_count: 0 } },
    isLoading: false,
  }),
}))

vi.mock('@/features/simulation/hooks/useElapsedTime', () => ({
  useElapsedTime: () => 0,
}))

vi.mock('@/features/simulation/hooks/useScrollAnchor', () => ({
  useScrollAnchor: () => ({ isAtTop: true, scrollToTop: vi.fn() }),
}))

// Mock simulationApi
vi.mock('@/api/simulation', () => ({
  simulationApi: {
    stop: vi.fn(),
  },
}))

const { SimulationPage } = await import('@/features/simulation/pages/SimulationPage')

describe('SimulationPage layout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockEnvStore.simulationId = 'sim-123'
    mockSimStore.step = 'running'
  })

  it('renders progress bar with data-testid', () => {
    render(<SimulationPage />)
    expect(screen.getByTestId('progress-bar')).toBeDefined()
  })

  it('renders three-column layout when data available', () => {
    const { container } = render(<SimulationPage />)
    // Check for flex-1 border-r columns (Twitter and Reddit feeds)
    const borderRCols = container.querySelectorAll('.flex-1.border-r')
    expect(borderRCols.length).toBe(2)
  })

  it('renders timeline column with w-72 on xl screens', () => {
    const { container } = render(<SimulationPage />)
    const timelineCol = container.querySelector('.w-72.shrink-0')
    expect(timelineCol).not.toBeNull()
  })

  it('redirects to /environment when no simulationId', () => {
    mockEnvStore.simulationId = null as unknown as string
    render(<SimulationPage />)
    expect(mockNavigate).toHaveBeenCalledWith('/environment')
  })
})
