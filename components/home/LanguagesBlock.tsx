import { FC } from 'react'
import Link from 'next/link'
import classNames from 'classnames'
import { useRouter } from 'next/router'
import { CircleFlag } from '../CircleFlag'
import style from './LanguagesBlock.module.scss'
import { useTranslation } from '@utils/useTranslation'
import { LanguageTo, LANGUAGE_NAMES, LANGUAGES_TO } from '@utils/languages'

interface Props {
  language: LanguageTo
}

const LanguageTile: FC<Props> = ({ language }) => {
  const { t } = useTranslation()
  const router = useRouter()

  return (
    <Link
      href={{
        pathname: `/wizard`,
        query: { languageTo: language },
      }}
      locale={router.locale}
      //as={`/wizard`}
    >
      <div className={classNames(style.tileContainer, style[language])}>
        <span className={style.start}>{t('startButton')}</span>
        <span className={style.title}>{t(LANGUAGE_NAMES[language])}</span>
        <CircleFlag
          language={language}
          modifier="small"
          className={style.flag}
        />
        <span className={style.parrot} />
      </div>
    </Link>
  )
}

export const LanguagesBlock: FC = () => {
  return (
    <div className={style.block}>
      {LANGUAGES_TO.map((language, key) => (
        <div className={style.item} key={key}>
          <LanguageTile language={language} key={language} />
        </div>
      ))}
    </div>
  )
}
