import languagesFromData from '../utils/languagesFrom.json'

export const LANGUAGE_NAMES = {
  eng: 'English',
  geo: 'Georgian',
  tur: 'Turkish',
  ben: 'Bengali',
  esp: 'Spanish',
  fre: 'French',
  ita: 'Italian',
  deu: 'German',
  rus: 'Russian',
  ukr: 'Ukrainian',
  chi: 'Chinese',
}

export const LANGUAGE_NAMES_DROPDOWN = {
  eng: 'English',
  geo: 'ქართული',
  tur: 'Türkçe',
  ben: 'বাংলা',
  esp: 'Español',
  fre: 'French',
  ita: 'Italian',
  deu: 'German',
  rus: 'Русский',
}

export const LANGUAGES_TO = [
  'eng',
  'esp',
  'geo',
  'fre',
  'deu',
  'ita',
  'rus',
] as const

export const LANGUAGES_TO_LOCALES = {
  eng: 'en',
  geo: 'ka',
  tur: 'tr',
  ben: 'bn',
  esp: 'es',
  rus: 'ru',
} as const

export const LOCALES_TO_LANGUAGES = {
  en: 'eng',
  ka: 'geo',
  tr: 'tur',
  bn: 'ben',
  es: 'esp',
  ru: 'rus',
} as const

export const LANGUAGE_FROM = Object.keys(LANGUAGES_TO_LOCALES) as LanguageFrom[]

export type LanguageTo = typeof LANGUAGES_TO[number]
export type Language = keyof typeof LANGUAGE_NAMES
export type LanguageFrom = keyof typeof LANGUAGES_TO_LOCALES | 'chi'

export const getLanguagesFrom = (language: string): LanguageFrom[] => {
  const languageData = languagesFromData.data.find(
    data => data.nameCode === language,
  )
  return languageData !== undefined
    ? languageData.iLearnFrom.map(language => language.nameCode as LanguageFrom)
    : []
}
