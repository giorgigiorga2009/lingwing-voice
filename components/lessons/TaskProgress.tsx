import { FC } from 'react'
import style from './TaskProgress.module.scss'

interface Props {
  taskProgress: string
}

export const TaskProgress: FC<Props> = ({ taskProgress }) => {

  return (
    <div className={style.taskProgress} style={{ width: taskProgress }}></div>
  )
}
