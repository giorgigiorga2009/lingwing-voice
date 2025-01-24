import { FC } from 'react'
import style from './AirplaneIcon.module.scss'

const AirplaneIcon: FC = () => {
  return (
    <div className={style.container}>
      <div className={style.circle_transparent}>
        <div className={style.circle}>
          <div className={style.icon_airplane}></div>
        </div>
      </div>
    </div>
  )
}

export default AirplaneIcon
