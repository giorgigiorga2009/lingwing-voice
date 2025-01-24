import React, { useState } from 'react'
import { useTranslation } from '@utils/useTranslation'
import style from './rateLingwing.module.scss'
import Image from 'next/image'
import stars from '@public/themes/images/v2/review-stars.png'
import heart from '@public/themes/images/v2/review-heart.png'
import facebook from '@/public/assets/images/networks/facebook.png'
import logo from '@public/themes/images/v2/logo-for-email.png'
import { RateLingwingProps } from '@utils/lessons/getStatsPerPercent'

const RateLingwingModal: React.FC<RateLingwingProps> = ({ completedTasks }) => {
  const { t } = useTranslation()
  const [isRateLingwingVisible, setIsRateLingwingVisible] =
    useState<boolean>(true)

  if (completedTasks?.length !== 20 || !isRateLingwingVisible) {
    return null
  }

  return (
    <div className={style.modal}>
      <div className={style.wrapper}>
        <div className={style.container}>
          <div className={style.leftSide}>
            <button onClick={() => setIsRateLingwingVisible(false)}>✕</button>
            <h2 className={style.title}>
              {t('RATE_LINGWING_MODAL_RATE')}
              <Image src={logo} alt="" className={style.logo} />
            </h2>
            <p>{t('RATE_LINGWING_MODAL_TEXT')}</p>
            <p>
              {t('RATE_LINGWING_MODAL_THANK_YOU')}{' '}
              <Image src={heart} alt="" width={15} height={15} />
            </p>
            <a
              href="https://www.facebook.com/lingwingcom/reviews"
              target="_blank"
              rel="noreferrer"
              className={style.facebook}
            >
              <Image src={facebook} alt="" className={style.facebookLogo} />
              {t('RATE_LINGWING_MODAL_RATE_US')}
            </a>
          </div>
        </div>
        <Image src={stars} alt="" className={style.stars} />
      </div>
    </div>
  )
}

export default RateLingwingModal
