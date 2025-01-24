import { FC, PropsWithChildren } from 'react'
import style from './ContentContainer.module.scss'

export const ContentContainer: FC<PropsWithChildren> = ({ children }) => {
  return <div className={style.container}>{children}</div>
}
