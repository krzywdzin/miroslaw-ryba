import { toast } from 'sonner'
import i18n from '@/i18n/config'
import { mapChineseError } from '@/api/errors'

const MAX_RETRIES = 2
const retryCounters = new Map<string, number>()

export async function handleApiError(
  error: unknown,
  options?: {
    retryFn?: () => Promise<void>
    context?: string
  },
): Promise<void> {
  const locale = i18n.language as 'pl' | 'en'
  const ctx = options?.context ?? 'default'

  // Determine error message
  let message: string
  if (error instanceof Error) {
    message = mapChineseError(error.message, locale)
  } else {
    message = i18n.t('errors:unknown')
  }

  const currentCount = retryCounters.get(ctx) ?? 0

  // Auto-retry if retryFn provided and retries not exhausted
  if (currentCount < MAX_RETRIES && options?.retryFn) {
    retryCounters.set(ctx, currentCount + 1)
    toast.error(i18n.t('errors:networkError'), { duration: 3000 })
    try {
      await options.retryFn()
      retryCounters.delete(ctx)
      return
    } catch {
      return handleApiError(error, options)
    }
  }

  // Exhausted retries or no retryFn -- show persistent toast
  retryCounters.delete(ctx)
  toast.error(message, {
    duration: Infinity,
    action: options?.retryFn
      ? {
          label: i18n.t('common:retry'),
          onClick: () => {
            retryCounters.delete(ctx)
            options.retryFn!()
          },
        }
      : undefined,
  })
}

export function resetRetryCounters(): void {
  retryCounters.clear()
}
