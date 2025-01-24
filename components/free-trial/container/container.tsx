'use client'

import React, { useState } from 'react'
import style from './container.module.scss'
import OfferPackages from '../offerPackages/offerPackages'
import FreeTrialPackages from '../freeTrialPackages/freeTrialPackages'
import { useTranslation } from '@utils/useTranslation'
import Image from 'next/image'
import arrow from '@public/themes/images/v2/flow-Arrow.png'
import { useUserStore } from '@utils/store'

const Container = () => {
  const [showPackages, setShowPackages] = useState(false)
  const { t } = useTranslation()
  const accessToken = useUserStore((state) => state.Token);
  const handleContinueBtn = () => {
    setShowPackages(true)
  }

  if (showPackages) {
    return (
      <div className={style.packagesContainer}>
        <div className={style.wrapper}>
          <FreeTrialPackages accessToken={accessToken} selectedCurrency="GEL"/>
        </div>
      </div>
    )
  }

  return (
    <div className={style.advertiseContainer}>
      <OfferPackages />
      <button className={style.continue} onClick={handleContinueBtn}>
        {t('APP_FREE_TRIAL1_CONTINUE')}
        <Image src={arrow.src} width={15} height={20} alt="arrow" />
      </button>
    </div>
  )
}

export default Container
