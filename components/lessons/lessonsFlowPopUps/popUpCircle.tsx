import React from 'react'
import style from './popUpCircle.module.scss'
import { useTranslation } from '@utils/useTranslation'

interface PopUpCircleProps {
  popUpNumber: number
  imageClass: string
  title?: string
  titleClass?: string
  handleOpenLogin: () => void
}

const PopUpCircle: React.FC<PopUpCircleProps> = ({
  popUpNumber,
  imageClass,
  title,
  titleClass,
  handleOpenLogin,
}) => {
  const { t } = useTranslation()
  function renderImagesDiv() {
    if (popUpNumber === 1) {
      return <div className={style[imageClass]}></div>
    } else if (popUpNumber === 2) {
      return <div className={style[imageClass + 'AfterLimitExpired']}></div>
    } else if (popUpNumber === 3) {
      return <div className={style[imageClass + 'AfterPayment']}></div>
    }
    return null // Default case if needed
  }

  return (
    <button className={style.container} onClick={handleOpenLogin}>
      <div className={style.mainPart}>
        {renderImagesDiv()}
        {/* {popUpNumber ? <div className={style[imageClass]}></div>: 
          <div className={style[imageClass + 'AfterPayment']}></div>
       } */}
        {title && <p className={style[titleClass || '']}>{t(title)}</p>}
      </div>
    </button>
  )
}

export default PopUpCircle
