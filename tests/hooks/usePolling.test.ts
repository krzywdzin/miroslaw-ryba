import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import type { ReactNode } from 'react'
import { usePollingQuery } from '../../src/hooks/usePolling'

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    )
  }
}

describe('usePollingQuery', () => {
  it('returns isLoading true initially', () => {
    const queryFn = vi.fn().mockResolvedValue({ status: 'pending' })

    const { result } = renderHook(
      () =>
        usePollingQuery(['test-loading'], queryFn, {
          isComplete: (data: { status: string }) => data.status === 'done',
          interval: 1000,
        }),
      { wrapper: createWrapper() },
    )

    expect(result.current.isLoading).toBe(true)
  })

  it('stops polling when isComplete returns true', async () => {
    let callCount = 0
    const queryFn = vi.fn().mockImplementation(() => {
      callCount++
      return Promise.resolve({
        status: callCount >= 2 ? 'done' : 'pending',
      })
    })

    const { result } = renderHook(
      () =>
        usePollingQuery(['test-complete'], queryFn, {
          isComplete: (data: { status: string }) => data.status === 'done',
          interval: 100,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(
      () => {
        expect(result.current.data?.status).toBe('done')
      },
      { timeout: 3000 },
    )

    const countAfterComplete = queryFn.mock.calls.length
    // Wait a bit to verify no more calls happen
    await new Promise((r) => setTimeout(r, 300))
    expect(queryFn.mock.calls.length).toBe(countAfterComplete)
  })

  it('does not call queryFn when enabled is false', async () => {
    const queryFn = vi.fn().mockResolvedValue({ status: 'pending' })

    renderHook(
      () =>
        usePollingQuery(['test-disabled'], queryFn, {
          isComplete: () => false,
          enabled: false,
        }),
      { wrapper: createWrapper() },
    )

    // Wait to ensure no calls are made
    await new Promise((r) => setTimeout(r, 200))
    expect(queryFn).not.toHaveBeenCalled()
  })
})
