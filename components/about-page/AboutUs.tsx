import { FC } from 'react'
import style from './AboutTabs.module.scss'
import { useTranslation } from '@utils/useTranslation'

const AboutUs: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <h2 className={style.subTitle}>{t('APP_ABOUT_US_TITLE_1')}</h2>
      <p>{t('APP_ABOUT_US_TEXT_1')}</p>
      <p>{t('APP_ABOUT_US_TEXT_1_b')}</p>
      <p>{t('APP_ABOUT_US_TEXT_1_c')}</p>
      <h2 className={style.subTitle}>{t('APP_ABOUT_US_TITLE_2')}</h2>
      <p>{t('APP_ABOUT_US_TEXT_2_b')}</p>
      <p>{t('APP_ABOUT_US_TEXT_2_c')}</p>
      <p>{t('APP_ABOUT_US_TEXT_2_d')}</p>
      <h2 className={style.subTitle}>{t('APP_ABOUT_US_TITLE_3')}</h2>
      <p>{t('APP_ABOUT_US_TEXT_3')}</p>
      <p>{t('APP_ABOUT_US_TEXT_3_b')}</p>
      <h2 className={style.subTitle}>{t('APP_ABOUT_US_TITLE_4')}</h2>
      <p>{t('APP_ABOUT_US_TEXT_4')}</p>
      <h2 className={style.subTitle}>{t('APP_ABOUT_US_TITLE_5')}</h2>
      <p>{t('APP_ABOUT_US_TEXT_5')}</p>
      <h2 className={style.subTitle}>{t('APP_ABOUT_US_TITLE_6')}</h2>
      <p>{t('APP_ABOUT_US_TEXT_6')}</p>
    </>
  )
}

export default AboutUs
