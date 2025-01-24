import { FC } from 'react'

import { CircleFlag } from '../CircleFlag'
import style from './WizardTile.module.scss'
import { useTranslation } from '@utils/useTranslation'
import { Language, LANGUAGE_NAMES } from '@utils/languages'

interface Props {
  language: Language
  //languageFrom: LanguageFrom | undefined
  onClick?: () => void
}

export const WizardTile: FC<Props> = ({ language, onClick }) => {
  const { t } = useTranslation()

  return (
    <button className={style.container} onClick={onClick}>
      <div className={style.circle}>
        <CircleFlag language={language} className={style.flag} />
      </div>
      <div className={style.title}>{t(LANGUAGE_NAMES[language])}</div>
    </button>
  )
}
