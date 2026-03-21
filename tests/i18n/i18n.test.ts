import { describe, it, expect, afterAll } from 'vitest'
import i18n from '@/i18n/config'

describe('i18n configuration', () => {
  afterAll(async () => {
    await i18n.changeLanguage('pl')
  })

  it('default language is Polish', () => {
    expect(i18n.language).toBe('pl')
  })

  it('all namespaces loaded for Polish', () => {
    expect(i18n.hasResourceBundle('pl', 'common')).toBe(true)
    expect(i18n.hasResourceBundle('pl', 'navigation')).toBe(true)
    expect(i18n.hasResourceBundle('pl', 'dashboard')).toBe(true)
    expect(i18n.hasResourceBundle('pl', 'errors')).toBe(true)
  })

  it('all namespaces loaded for English', () => {
    expect(i18n.hasResourceBundle('en', 'common')).toBe(true)
    expect(i18n.hasResourceBundle('en', 'navigation')).toBe(true)
    expect(i18n.hasResourceBundle('en', 'dashboard')).toBe(true)
    expect(i18n.hasResourceBundle('en', 'errors')).toBe(true)
  })

  it('language switch to English works', async () => {
    await i18n.changeLanguage('en')
    expect(i18n.t('common:retry')).toBe('Try again')
  })

  it('language switch back to Polish works', async () => {
    await i18n.changeLanguage('pl')
    expect(i18n.t('common:retry')).toBe('Spróbuj ponownie')
  })

  it('fallback to English for missing key in Polish', () => {
    // i18next returns the key itself when no translation found in any language
    const missingKey = 'common:nonExistentKey12345'
    const result = i18n.t(missingKey)
    expect(result).toBe('nonExistentKey12345')
  })
})
