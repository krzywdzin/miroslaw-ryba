// @vitest-environment jsdom
import { describe, it, expect, vi } from 'vitest'

// Mock usePollingQuery to verify correct params
const mockUsePollingQuery = vi.fn().mockReturnValue({
  data: undefined,
  isLoading: false,
  error: null,
})

vi.mock('@/hooks/usePolling', () => ({
  usePollingQuery: (...args: unknown[]) => mockUsePollingQuery(...args),
}))

vi.mock('@/api/graph', () => ({
  graphApi: {
    getTask: vi.fn(),
  },
}))

const { useBuildStatus } = await import(
  '@/features/graph/hooks/useBuildStatus'
)

describe('useBuildStatus', () => {
  it('passes enabled=false when taskId is null', () => {
    useBuildStatus(null)

    expect(mockUsePollingQuery).toHaveBeenCalledWith(
      ['graph', 'task', null],
      expect.any(Function),
      expect.objectContaining({ enabled: false }),
    )
  })

  it('passes enabled=true when taskId is provided', () => {
    mockUsePollingQuery.mockClear()
    useBuildStatus('task-123')

    expect(mockUsePollingQuery).toHaveBeenCalledWith(
      ['graph', 'task', 'task-123'],
      expect.any(Function),
      expect.objectContaining({ enabled: true }),
    )
  })

  it('uses 2000ms polling interval', () => {
    mockUsePollingQuery.mockClear()
    useBuildStatus('task-123')

    expect(mockUsePollingQuery).toHaveBeenCalledWith(
      expect.anything(),
      expect.any(Function),
      expect.objectContaining({ interval: 2000 }),
    )
  })

  it('isComplete returns true for completed status', () => {
    mockUsePollingQuery.mockClear()
    useBuildStatus('task-123')

    const options = mockUsePollingQuery.mock.calls[0][2]
    expect(options.isComplete({ data: { status: 'completed' } })).toBe(true)
  })

  it('isComplete returns true for failed status', () => {
    mockUsePollingQuery.mockClear()
    useBuildStatus('task-123')

    const options = mockUsePollingQuery.mock.calls[0][2]
    expect(options.isComplete({ data: { status: 'failed' } })).toBe(true)
  })

  it('isComplete returns false for processing status', () => {
    mockUsePollingQuery.mockClear()
    useBuildStatus('task-123')

    const options = mockUsePollingQuery.mock.calls[0][2]
    expect(options.isComplete({ data: { status: 'processing' } })).toBe(false)
  })
})
