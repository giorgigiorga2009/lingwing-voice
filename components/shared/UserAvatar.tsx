import React from 'react'
import style from './UserAvatar.module.scss'
import Image from 'next/image'
import classNames from 'classnames'

interface Props {
  image?: string | null
  isLeaenMenu?: boolean
}

const UserAvatar: React.FC<Props> = ({ image, isLeaenMenu }) => {
  return (
    <div className={classNames(style.avatar, isLeaenMenu && style.avatarLeaenMenu)}>
      <Image
        src={image || '/assets/images/avatar-default-medium.png'}
        alt="User avatar"
        width={100}
        height={100}
        className={style.Image}
        priority
      />
    </div>
  )
}

export default UserAvatar
