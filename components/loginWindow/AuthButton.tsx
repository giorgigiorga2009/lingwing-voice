import { FC } from 'react'
import style from './AuthButton.module.scss'

interface Props {
  title: string
  onClick?: VoidFunction
  disabled?: boolean
}

export const AuthButton: FC<Props> = ({ title, onClick, disabled}) => {
  return (
    <button className={style.button} onClick={onClick} disabled={disabled}>
      {title}
    </button>
  )
}
