import { z } from 'zod/v4'
import { ApiError, mapChineseError } from './errors'

const BASE_URL = '/api'

interface ApiRequestOptions extends RequestInit {
  schema?: z.ZodType
}

export async function apiRequest<T>(
  path: string,
  options?: ApiRequestOptions,
): Promise<T> {
  const url = `${BASE_URL}${path}`

  const headers = new Headers(options?.headers)
  if (options?.body instanceof FormData) {
    headers.delete('Content-Type')
  } else if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    let errorMessage = response.statusText
    let rawMessage: string | undefined
    try {
      const errorBody = await response.json()
      rawMessage = errorBody.message || errorBody.error || response.statusText
      errorMessage = mapChineseError(rawMessage ?? errorMessage)
    } catch {
      // If JSON parsing fails, use statusText
    }
    throw new ApiError(errorMessage, response.status, rawMessage)
  }

  const json = await response.json()

  if (options?.schema) {
    return options.schema.parse(json) as T
  }

  return json as T
}
