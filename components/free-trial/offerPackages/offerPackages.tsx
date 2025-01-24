import React from 'react'
import style from './offerPackages.module.scss'
import { useTranslation } from '@utils/useTranslation'
import SlideShow from '../slideShow/slideShow'

const Advertise = () => {
  const { t } = useTranslation()
  return (
    <div className={style.offerContainer}>
      <h1 className={style.title}>
        {t('APP_FREE_TRIAL1_TITLE2')}
        <span className={style.price}>1{t('APP_FREE_TRIAL1_TITLE5')} !</span>
      </h1>
      <h3 className={style.description}>{t('APP_FREE_TRIAL1_DESCRIPTION')}</h3>
      <SlideShow />
    </div>
  )
}

export default Advertise
