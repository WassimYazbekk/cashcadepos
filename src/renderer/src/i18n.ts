import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import Backend from 'i18next-http-backend'

const i18n = i18next
  .use(Backend)
  .use(initReactI18next)
  .init({
    load: 'all',
    supportedLngs: ['en', 'ar'],
    lng: 'en',
    fallbackLng: 'en',
    backend: {
      loadPath: 'http://localhost:8080/api/locales/{{lng}}/{{ns}}'
    },
    interpolation: {
      escapeValue: false
    },
    ns: ['common', 'forms'],
    defaultNS: 'common'
  })

export default i18n
