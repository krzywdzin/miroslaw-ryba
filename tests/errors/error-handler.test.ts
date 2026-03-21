import { describe, it, expect, vi, beforeEach } from 'vitest'
import { toast } from 'sonner'
import i18n from '@/i18n/config'

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

// Dynamically import after mocks are set
const { handleApiError, resetRetryCounters } = await import(
  '@/lib/error-handler'
)

describe('handleApiError', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    resetRetryCounters()
    i18n.changeLanguage('pl')
  })

  it('calls toast.error with translated message on first call', async () => {
    await handleApiError(new Error('Some error'))

    expect(toast.error).toHaveBeenCalledWith(
      'Some error',
      expect.objectContaining({ duration: Infinity }),
    )
  })

  it('auto-retries up to 2 times before showing persistent toast', async () => {
    const retryFn = vi.fn().mockRejectedValue(new Error('fail'))

    await handleApiError(new Error('Network error'), {
      retryFn,
      context: 'test-retry',
    })

    // retryFn should have been called exactly 2 times (2 auto-retries)
    expect(retryFn).toHaveBeenCalledTimes(2)

    // Final persistent toast should appear after exhausting retries
    const lastCall = vi.mocked(toast.error).mock.calls.at(-1)
    expect(lastCall).toBeDefined()
    expect(lastCall![1]).toEqual(
      expect.objectContaining({
        duration: Infinity,
        action: expect.objectContaining({
          label: 'Spróbuj ponownie',
        }),
      }),
    )
  })

  it('maps Chinese error to Polish when locale is pl', async () => {
    await i18n.changeLanguage('pl')

    await handleApiError(new Error('项目不存在'))

    expect(toast.error).toHaveBeenCalledWith(
      'Projekt nie istnieje',
      expect.anything(),
    )
  })

  it('maps Chinese error to English when locale is en', async () => {
    await i18n.changeLanguage('en')

    await handleApiError(new Error('项目不存在'))

    expect(toast.error).toHaveBeenCalledWith(
      'Project does not exist',
      expect.anything(),
    )
  })

  it('shows retry button label in current locale after exhausting retries', async () => {
    await i18n.changeLanguage('en')
    const retryFn = vi.fn().mockRejectedValue(new Error('fail'))

    await handleApiError(new Error('Network error'), {
      retryFn,
      context: 'test-locale-retry',
    })

    const lastCall = vi.mocked(toast.error).mock.calls.at(-1)
    expect(lastCall![1]).toEqual(
      expect.objectContaining({
        action: expect.objectContaining({
          label: 'Try again',
        }),
      }),
    )
  })

  it('shows generic error message from i18n for unknown errors', async () => {
    await handleApiError('not an Error instance')

    expect(toast.error).toHaveBeenCalledWith(
      'Wystąpił nieoczekiwany błąd.',
      expect.anything(),
    )
  })
})
