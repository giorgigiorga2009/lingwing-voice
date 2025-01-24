import { FC } from 'react'
import style from './DialogMessage.module.scss'

interface MessageProps {
  message: string
  translation: string
  index: number
  totalCount: number
}

export const DialogMessage: FC<MessageProps> = ({
  message,
  translation,
  index,
  totalCount,
}) => {
  const messageStyle = index % 2 === 0 ? style.messageRight : style.messageLeft
  const translationStyle =
    index % 2 === 0 ? style.translationRight : style.translationLeft
  return (
    <div key={index} className={messageStyle}>
      <span className={style.enumerator}>
        {index + 1}/{totalCount}
      </span>
      <p>{message}</p>
      <p className={translationStyle}>{translation}</p>
    </div>
  )
}
