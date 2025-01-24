import { FC } from 'react'
import style from './FlagIcon.module.scss'

interface Props {
  item: {
    nameCode: string
  }
  size: string
  LANGUAGE_NAMES: { [key: string]: string }
}

const FlagIcon: FC<Props> = ({ item, size, LANGUAGE_NAMES }): JSX.Element => {
  return (
    <>
      <img
        className={
          size === 'small' ? style.flag_icon_small : style.flag_icon_big
        }
        src={`/assets/images/flags/circle/big/${
          LANGUAGE_NAMES[item.nameCode]
        }.png`}
        alt={`${LANGUAGE_NAMES[item.nameCode]} icon`}
      />
    </>
  )
}

export default FlagIcon
