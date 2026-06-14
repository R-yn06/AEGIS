import React from 'react'
import { LanguageCode, SUPPORTED_LANGUAGES } from '../constants/brand'
import en from '../locales/en.json'
import tl from '../locales/tl.json'
import ceb from '../locales/ceb.json'

type Dictionary = typeof en
type TranslationKey = string

const dictionaries: Record<LanguageCode, Dictionary> = { en, tl, ceb }

type I18nContextValue = {
  language: LanguageCode
  languages: typeof SUPPORTED_LANGUAGES
  setLanguage: (language: LanguageCode) => void
  t: (key: TranslationKey) => string
}

const I18nContext = React.createContext<I18nContextValue | undefined>(undefined)

function getNestedValue(source: unknown, key: string): string | undefined {
  return key.split('.').reduce<unknown>((value, segment) => {
    if (value && typeof value === 'object' && segment in value) {
      return (value as Record<string, unknown>)[segment]
    }
    return undefined
  }, source) as string | undefined
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = React.useState<LanguageCode>(() => {
    const stored = window.localStorage.getItem('aegis-language') as LanguageCode | null
    return stored && stored in dictionaries ? stored : 'en'
  })

  const setLanguage = React.useCallback((nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage)
    window.localStorage.setItem('aegis-language', nextLanguage)
    document.documentElement.lang = nextLanguage
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const t = React.useCallback(
    (key: TranslationKey) => {
      return getNestedValue(dictionaries[language], key) ?? getNestedValue(dictionaries.en, key) ?? key
    },
    [language],
  )

  const value = React.useMemo(
    () => ({ language, languages: SUPPORTED_LANGUAGES, setLanguage, t }),
    [language, setLanguage, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = React.useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
