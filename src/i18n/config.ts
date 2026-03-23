import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import plCommon from '@/locales/pl/common.json'
import plNavigation from '@/locales/pl/navigation.json'
import plDashboard from '@/locales/pl/dashboard.json'
import plErrors from '@/locales/pl/errors.json'
import plSettings from '@/locales/pl/settings.json'
import plGraph from '@/locales/pl/graph.json'
import plEnvironment from '@/locales/pl/environment.json'
import plSimulation from '@/locales/pl/simulation.json'
import plReports from '@/locales/pl/reports.json'

import enCommon from '@/locales/en/common.json'
import enNavigation from '@/locales/en/navigation.json'
import enDashboard from '@/locales/en/dashboard.json'
import enErrors from '@/locales/en/errors.json'
import enSettings from '@/locales/en/settings.json'
import enGraph from '@/locales/en/graph.json'
import enEnvironment from '@/locales/en/environment.json'
import enSimulation from '@/locales/en/simulation.json'
import enReports from '@/locales/en/reports.json'

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
        settings: plSettings,
        graph: plGraph,
        environment: plEnvironment,
        simulation: plSimulation,
        reports: plReports,
      },
      en: {
        common: enCommon,
        navigation: enNavigation,
        dashboard: enDashboard,
        errors: enErrors,
        settings: enSettings,
        graph: enGraph,
        environment: enEnvironment,
        simulation: enSimulation,
        reports: enReports,
      },
    },
    lng: 'pl',
    fallbackLng: 'en',
    ns: ['common', 'navigation', 'dashboard', 'errors', 'settings', 'graph', 'environment', 'simulation', 'reports'],
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
