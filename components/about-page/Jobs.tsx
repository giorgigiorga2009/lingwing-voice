import { FC } from 'react'
import style from './AboutTabs.module.scss'
import { useTranslation } from '@utils/useTranslation'

const AboutUs: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <h2 className={style.subTitle}>{t('menuJobs')}</h2>
      <p>{t('APP_ABOUT_US_JOB_text_0')}</p>
      <p>{t('APP_ABOUT_US_JOB_text_1')}</p>
      <p>{t('APP_ABOUT_US_JOB_text_1_b')}</p>
      <p>{t('APP_ABOUT_US_JOB_text_2')}</p>
      <ul>
        <li>{t('APP_ABOUT_US_JOB_text_2_a')}</li>
        <li>{t('APP_ABOUT_US_JOB_text_2_b')}</li>
        <li>{t('APP_ABOUT_US_JOB_text_2_c')}</li>
        <li>{t('APP_ABOUT_US_JOB_text_2_d')}</li>
      </ul>
      <p>{t('APP_ABOUT_US_JOB_text_3')}</p>
      <ul>
        <li>{t('APP_ABOUT_US_JOB_text_3_a')}</li>
        <li>{t('APP_ABOUT_US_JOB_text_3_b')}</li>
        <li>{t('APP_ABOUT_US_JOB_text_3_c')}</li>
      </ul>
      <p>{t('APP_ABOUT_US_JOB_text_4')}</p>
      <ul>
        <li>{t('APP_ABOUT_US_JOB_text_4_a')}</li>
        <li>{t('APP_ABOUT_US_JOB_text_4_b')}</li>
      </ul>
      <p>{t('APP_ABOUT_US_JOB_text_5')}</p>
      <p>{t('APP_ABOUT_US_JOB_text_6')}</p>
      <ul>
        <li>{t('APP_ABOUT_US_JOB_text_6_a')}</li>
        <li>{t('APP_ABOUT_US_JOB_text_6_b')}</li>
      </ul>
      <p>{t('APP_ABOUT_US_JOB_text_7')}</p>
      <p>{t('APP_ABOUT_US_JOB_text_8')}</p>
      <p>{t('APP_ABOUT_US_JOB_text_9')}</p>
      <p>{t('APP_ABOUT_US_JOB_text_10')}</p>
    </>
  )
}

export default AboutUs
