import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import i18n from '@/i18n/config'

describe('Polish plural forms', () => {
  beforeAll(async () => {
    await i18n.changeLanguage('pl')
  })

  afterAll(async () => {
    await i18n.changeLanguage('pl')
  })

  describe('simulation (symulacja/symulacje/symulacji)', () => {
    const cases: [number, string][] = [
      [0, '0 symulacji'],      // many
      [1, '1 symulacja'],      // one
      [2, '2 symulacje'],      // few
      [3, '3 symulacje'],      // few
      [4, '4 symulacje'],      // few
      [5, '5 symulacji'],      // many
      [11, '11 symulacji'],    // many (teens are special)
      [12, '12 symulacji'],    // many (teen)
      [22, '22 symulacje'],    // few (ends in 2, not teen)
      [100, '100 symulacji'],  // many
    ]

    it.each(cases)('count=%i => "%s"', (count, expected) => {
      expect(i18n.t('common:simulation', { count })).toBe(expected)
    })
  })

  describe('agent (agent/agenty/agentów)', () => {
    const cases: [number, string][] = [
      [1, '1 agent'],        // one
      [2, '2 agenty'],       // few
      [3, '3 agenty'],       // few
      [4, '4 agenty'],       // few
      [5, '5 agentów'],      // many
      [11, '11 agentów'],    // many (teen)
      [22, '22 agenty'],     // few (ends in 2, not teen)
    ]

    it.each(cases)('count=%i => "%s"', (count, expected) => {
      expect(i18n.t('common:agent', { count })).toBe(expected)
    })
  })
})
