import React from 'react'
import classNames from 'classnames'
import style from './RotatableArrow.module.scss'

interface Props {
  open: boolean
}
const RotatableArrow: React.FC<Props> = ({ open }) => {
  return (
    <div className={style.iconArrowContainer}>
      <span
        className={classNames(style.iconArrow, open ? style.up : style.down)}
      />
    </div>
  )
}

export default RotatableArrow
