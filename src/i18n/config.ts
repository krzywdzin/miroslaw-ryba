import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import plCommon from '@/locales/pl/common.json'
import plNavigation from '@/locales/pl/navigation.json'
import plDashboard from '@/locales/pl/dashboard.json'
import plErrors from '@/locales/pl/errors.json'

import enCommon from '@/locales/en/common.json'
import enNavigation from '@/locales/en/navigation.json'
import enDashboard from '@/locales/en/dashboard.json'
import enErrors from '@/locales/en/errors.json'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pl: {
        common: plCommon,
        navigation: plNavigation,
        dashboard: plDashboard,
        errors: plErrors,
      },
      en: {
        common: enCommon,
        navigation: enNavigation,
        dashboard: enDashboard,
        errors: enErrors,
      },
    },
    lng: 'pl',
    fallbackLng: 'en',
    ns: ['common', 'navigation', 'dashboard', 'errors'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })

export default i18n
