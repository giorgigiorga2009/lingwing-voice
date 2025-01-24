import en from '../public/localization/locale-en_US.json'
import bn from '../public/localization/locale-bn_BN.json'
import es from '../public/localization/locale-es_ES.json'
import ka from '../public/localization/locale-ka_GE.json'
import ru from '../public/localization/locale-ru_RU.json'
import tr from '../public/localization/locale-tr_TR.json'

const LOCALES = ['en', 'bn', 'es', 'ka', 'ru', 'tr'] as const
export type Locale = typeof LOCALES[number]

type Messages = {
  [x in Locale]: {}
}

export const messages = {
  en,
  bn,
  es,
  ka,
  ru,
  tr,
} as Messages
