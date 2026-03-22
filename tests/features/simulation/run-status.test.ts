// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock usePollingQuery
const mockUsePollingQuery = vi.fn().mockReturnValue({ data: undefined, isLoading: true })
vi.mock('@/hooks/usePolling', () => ({
  usePollingQuery: (...args: unknown[]) => mockUsePollingQuery(...args),
}))

// Mock simulationApi
vi.mock('@/api/simulation', () => ({
  simulationApi: {
    getRunStatus: vi.fn(),
  },
}))

import { simulationApi } from '@/api/simulation'

const { useRunStatus } = await import(
  '@/features/simulation/hooks/useRunStatus'
)

describe('useRunStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls usePollingQuery with correct query key', () => {
    useRunStatus('sim-1')
    expect(mockUsePollingQuery).toHaveBeenCalledWith(
      ['simulation', 'run-status', 'sim-1'],
      expect.any(Function),
      expect.objectContaining({
        enabled: true,
        interval: 2000,
      }),
    )
  })

  it('calls simulationApi.getRunStatus in queryFn', () => {
    useRunStatus('sim-1')
    const queryFn = mockUsePollingQuery.mock.calls[0][1]
    queryFn()
    expect(simulationApi.getRunStatus).toHaveBeenCalledWith('sim-1')
  })

  it('is disabled when simulationId is null', () => {
    useRunStatus(null)
    expect(mockUsePollingQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Function),
      expect.objectContaining({
        enabled: false,
      }),
    )
  })

  it('isComplete returns true for completed status', () => {
    useRunStatus('sim-1')
    const isComplete = mockUsePollingQuery.mock.calls[0][2].isComplete
    expect(isComplete({ data: { runner_status: 'completed' } })).toBe(true)
  })

  it('isComplete returns true for failed status', () => {
    useRunStatus('sim-1')
    const isComplete = mockUsePollingQuery.mock.calls[0][2].isComplete
    expect(isComplete({ data: { runner_status: 'failed' } })).toBe(true)
  })

  it('isComplete returns true for stopped status', () => {
    useRunStatus('sim-1')
    const isComplete = mockUsePollingQuery.mock.calls[0][2].isComplete
    expect(isComplete({ data: { runner_status: 'stopped' } })).toBe(true)
  })

  it('isComplete returns false for running status', () => {
    useRunStatus('sim-1')
    const isComplete = mockUsePollingQuery.mock.calls[0][2].isComplete
    expect(isComplete({ data: { runner_status: 'running' } })).toBe(false)
  })
})
