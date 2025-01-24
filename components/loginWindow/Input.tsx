import { FC } from 'react'
import style from './Input.module.scss'

interface Props {
  type: 'email' | 'password'
  placeholder: string
  value?: string
  onChange?: (value: string) => void
  onBlur?: (value: string) => void
}

export const Input: FC<Props> = ({
  type,
  placeholder,
  value,
  onChange = () => {
    ('')
  },
  onBlur = () => {
    ('')
  },
}) => {
  return (
    <input
      className={style.input}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={event => onChange(event?.target.value)}
      onBlur={event => onBlur(event?.target.value)}
    />
  )
}
