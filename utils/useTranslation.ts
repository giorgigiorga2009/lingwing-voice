import { useIntl } from 'react-intl'

export const useTranslation = () => {
  const intl = useIntl()
  const t = (id: string) => intl.formatMessage({ id })
  const localeMap: { [key: string]: string } = {
    'ka': 'geo', 
    'en': 'eng', 
    'ru': 'rus',
    'tr': 'tur',
    'es': 'esp',
    'bn': 'ben'
  };
  const locale = localeMap[intl.locale] || intl.locale;
  
  return { t, locale }
}
