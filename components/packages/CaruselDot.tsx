import { FC } from 'react'
import style from '@components/packages/CaruselDot.module.scss'
import classNames from 'classnames'
import TopIcon from "public/themes/images/v2/packages/payments_scroll_btn_svg/top.svg"
import BottomIcon from "public/themes/images/v2/packages/payments_scroll_btn_svg/bottom.svg"
import Image from "next/image"
import { useTranslation } from '@utils/useTranslation'

interface Props {
  index: number
  current: number
  scrollHandler: VoidFunction,
  duration: number
}

export const CaruselDot: FC<Props> = ({ index, current, scrollHandler, duration }) => {
  const { t } = useTranslation();
  return (
    // <button
    //   className={classNames(style.dot, index === current && style.dot__hover)}
    //   onClick={scrollHandler}
    //   // onTouchStart={scrollHandler}
    // >{ duration == 0 ? "მუდმივი" : `${duration} თვე` }</button>
    <div className={style.dotContainer}> {/* Container for positioning */}
      <button
        className={classNames(style.dot, index === current && style.dot__hover)}
        onClick={scrollHandler}
      >
        {duration === 0 ? t("APP_PACKAGE_LIFETIME")  : ` ${duration} ${t("APP_PACKAGE_MONTH")}`}
      </button>
      {index == 1 && current === 1 && <Image  src={TopIcon} alt='button icon' className={index == 1 ? style.topIcon : ''}/>}
      {index == 1 && current === 1 && <Image  src={BottomIcon} alt='button icon' className={index == 1 ? style.bottomIcon : ''}/>}
    </div>
  )
}
