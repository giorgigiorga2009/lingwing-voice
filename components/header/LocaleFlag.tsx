import { FC } from 'react'
import classNames from 'classnames'
import styles from './LocaleFlag.module.scss'
import { LanguageFrom } from '@utils/languages'

interface Props {
  language: LanguageFrom
}

export const LocaleFlag: FC<Props> = ({ language }) => {
  return <div className={classNames(styles.flag, styles[language])} />
}
