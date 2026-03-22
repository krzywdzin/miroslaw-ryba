// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'

const { useElapsedTime } = await import(
  '@/features/simulation/hooks/useElapsedTime'
)

describe('useElapsedTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 when startTime is null', () => {
    const { result } = renderHook(() => useElapsedTime(null, true))
    expect(result.current).toBe(0)
  })

  it('increments every second when isRunning is true', () => {
    const startTime = Date.now()
    const { result } = renderHook(() => useElapsedTime(startTime, true))

    expect(result.current).toBe(0)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe(1)

    act(() => {
      vi.advanceTimersByTime(1000)
    })
    expect(result.current).toBe(2)
  })

  it('stops incrementing when isRunning is false', () => {
    const startTime = Date.now()
    const { result, rerender } = renderHook(
      ({ startTime, isRunning }) => useElapsedTime(startTime, isRunning),
      { initialProps: { startTime, isRunning: true } },
    )

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    expect(result.current).toBe(3)

    rerender({ startTime, isRunning: false })

    act(() => {
      vi.advanceTimersByTime(3000)
    })
    // Should not increment further
    expect(result.current).toBe(0)
  })
})
