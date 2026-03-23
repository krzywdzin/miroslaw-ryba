// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import type { ReactNode } from 'react'

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'pl' },
  }),
}))

const mockChat = vi.fn().mockResolvedValue({
  success: true,
  data: { response: 'test response', sources: [], tool_calls: [] },
})

const mockInterview = vi.fn().mockResolvedValue({
  success: true,
  data: { agent_id: 'a1', prompt: 'test', result: 'interview response' },
})

vi.mock('@/api/report', () => ({
  reportApi: {
    chat: (...args: unknown[]) => mockChat(...args),
  },
}))

vi.mock('@/api/simulation', () => ({
  simulationApi: {
    interview: (...args: unknown[]) => mockInterview(...args),
  },
}))

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}))

const { useChatSession } = await import(
  '@/features/chat/hooks/useChatSession'
)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    )
  }
}

describe('useChatSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('sends to reportApi.chat for report target', async () => {
    const { result } = renderHook(() => useChatSession('sim1'), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.send('hello')
    })

    await waitFor(() => {
      expect(mockChat).toHaveBeenCalledWith(
        expect.objectContaining({
          simulation_id: 'sim1',
          message: 'hello',
        }),
      )
    })
  })

  it('sends to simulationApi.interview for simulated target', async () => {
    const { result } = renderHook(() => useChatSession('sim1'), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.switchAgent({
        type: 'simulated',
        agentId: 'a1',
        platform: 'twitter',
      })
    })

    act(() => {
      result.current.send('hi agent')
    })

    await waitFor(() => {
      expect(mockInterview).toHaveBeenCalledWith({
        simulation_id: 'sim1',
        agent_id: 'a1',
        prompt: 'hi agent',
        platform: 'twitter',
      })
    })
  })

  it('clears messages on agent switch', async () => {
    const { result } = renderHook(() => useChatSession('sim1'), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.send('hello')
    })

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0)
    })

    act(() => {
      result.current.switchAgent({ type: 'simulated', agentId: 'a2' })
    })

    expect(result.current.messages).toHaveLength(0)
  })

  it('appends user message on mutate', async () => {
    const { result } = renderHook(() => useChatSession('sim1'), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.send('test message')
    })

    await waitFor(() => {
      const userMsg = result.current.messages.find((m) => m.role === 'user')
      expect(userMsg).toBeDefined()
      expect(userMsg!.content).toBe('test message')
    })
  })
})
