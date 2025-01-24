import React from 'react'
import style from './LeaderBoard.module.scss'
import { LeaderBoardProps } from '@utils/getReadCourse'

const LeaderBoard: React.FC<LeaderBoardProps> = ({ data, length }) => {
  const { position, firstName, lastName, rating, avatar } = data
  const altText = firstName ?  lastName ? firstName + ' ' + lastName : firstName : lastName ? lastName:'  User Avatar  '
  return (
    <div className={style.container} style={{ width: `${length}%` }}>
      <div className={style.position}>{position}</div>
      {
        avatar && <img src={avatar} alt={altText} className={style.image} />

      }
      <div className={style.personalInfo} style={{ maxWidth: `${length}%` }}>
        <span className={style.name}>{`${firstName ||''} ${lastName || ''}`}</span>
        <div className={style.score}>{rating}</div>
      </div>
    </div>
  )
}

export default LeaderBoard
