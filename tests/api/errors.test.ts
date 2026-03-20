import { describe, it, expect } from 'vitest'
import { mapChineseError, ApiError } from '../../src/api/errors'

describe('mapChineseError', () => {
  it('maps Chinese error to Polish by default', () => {
    expect(mapChineseError('项目不存在')).toBe('Projekt nie istnieje')
  })

  it('maps Chinese error to English when locale is en', () => {
    expect(mapChineseError('项目不存在', 'en')).toBe(
      'Project does not exist',
    )
  })

  it('returns original message when no mapping found', () => {
    expect(mapChineseError('unknown message')).toBe('unknown message')
  })

  it('maps simulation not found error', () => {
    expect(mapChineseError('模拟不存在')).toBe('Symulacja nie istnieje')
  })

  it('maps parameter error', () => {
    expect(mapChineseError('参数错误')).toBe('Blad parametrow')
  })
})

describe('ApiError', () => {
  it('has status and rawMessage fields', () => {
    const error = new ApiError('Mapped message', 404, 'Original Chinese')
    expect(error.status).toBe(404)
    expect(error.rawMessage).toBe('Original Chinese')
    expect(error.message).toBe('Mapped message')
    expect(error.name).toBe('ApiError')
  })

  it('extends Error', () => {
    const error = new ApiError('test', 500)
    expect(error).toBeInstanceOf(Error)
  })
})
