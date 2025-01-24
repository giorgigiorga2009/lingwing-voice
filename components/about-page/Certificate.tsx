import { FC } from 'react'
import style from './AboutTabs.module.scss'
import Image from 'next/image'
import { useTranslation } from '@utils/useTranslation'
import certificateImage from '@public/themes/images/v2/certificate/certificate.png'

const Certificate: FC = () => {
  const { t } = useTranslation()
  return (
    <>
      <h2 className={style.subTitle}>
        {t('APP_ABOUT_WHEN_WILL_THE_CERTIFICATE_BE_ISSUED?')}
      </h2>
      <p>{t('APP_ABOUT_CERTIFICATE_TEXT_1')}</p>
      <p>{t('APP_ABOUT_CERTIFICATE_TEXT_2')}</p>
      <p>{t('APP_ABOUT_CERTIFICATE_TEXT_3')}</p>
      <h2 className={style.subTitle}>
        {t('APP_ABOUT_HOW_CAN_I_RECEIVE_MY_CERTIFICATE?')}
      </h2>
      <p>{t('APP_ABOUT_CERTIFICATE_TEXT_4')}</p>
      <p>{t('APP_ABOUT_CERTIFICATE_TEXT_5')}</p>
      <Image
        src={certificateImage}
        className={style.certificateImage}
        alt="Certificate Template"
        width={700}
        height={700}
      />
    </>
  )
}

export default Certificate
