import { FC } from 'react'
import classNames from 'classnames'
import style from './Tab.module.scss'

interface Props {
  onClick: () => void
  isActive: boolean
  text: string
}

export const Tab: FC<Props> = ({ onClick, isActive, text }) => {
  return (
    <button
      className={classNames(style.tab, isActive && style.active)}
      onClick={onClick}
    >
      {text}
    </button>
  )
}
