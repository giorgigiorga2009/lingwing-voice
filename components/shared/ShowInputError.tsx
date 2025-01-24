import React from 'react'
import style from './ShowInputError.module.scss'

interface Props {
  ErrText: string
}

const ShowErr: React.FC<Props> = ({ ErrText }) => {
  return <span className={style.error}>{ErrText}</span>
}

export default ShowErr
