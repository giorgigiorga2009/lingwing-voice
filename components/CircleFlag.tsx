import { FC } from 'react'
import classNames from 'classnames'
import style from './CircleFlag.module.scss'
import { LanguageFrom, LanguageTo } from '@utils/languages'

interface Props {
  language: LanguageFrom | LanguageTo | 'ukr' | 'chi'
  className: string
  modifier?: 'small' | 'big'
}

export const CircleFlag: FC<Props> = ({
  language,
  className,
  modifier = 'big',
}) => {
  return (
    <span
      className={classNames(
        style.flag,
        style[language],
        style[modifier],
        className,
      )}
    />
  )
}
