import { FC } from 'react'
import Image from 'next/image'
import style from './benefits.module.scss'
import { useTranslation } from '@utils/useTranslation'
import greenTick from '@public/assets/images/tick-check/green-tick.png'

interface TickOrDash {
  feature: boolean
}

interface PaymentFeatures {
  feature: {
    certificate: boolean
    grammarAndStatistics: boolean
    allTask: boolean
    tasks: number
    voiceRecognition: boolean
  }
}

const TickOrDash: FC<TickOrDash> = ({ feature }) => {
  return (
    <>
      {feature ? (
        <Image src={greenTick} alt={'Y'} height="20" width="20" />
      ) : (
        <p>-</p>
      )}
    </>
  )
}

export const PaymentFeatures: FC<PaymentFeatures> = ({
  feature: { certificate, grammarAndStatistics, allTask, voiceRecognition },
}) => {
  const { t } = useTranslation()
  return (
    <div className={style.featuresContainer}>
      <div className={style.features}>
        <h3>{t('PAYMENT_WHAT_YOU_GET')}</h3>
        <div>{t('PAYMENT_UNLIMITED')}</div>
        <div>{t('PAYMENT_LANGUAGES_COURSES')}</div>
        <div>{t('Certificate')}</div>
        <div>{t('PAYMENT_VOICE_RECOGNITION')}</div>
      </div>
      <div className={style.tickOrDash}>
        <h3>{t('PAYMENT_FREE')}</h3>
        <div>-</div>
        <div>-</div>
        <div>-</div>
        <div>-</div>
      </div>
      <div className={style.tickOrDash}>
        <h3>{t('PREMIUM')}</h3>
        <div>{<TickOrDash feature={grammarAndStatistics} />}</div>
        <div>{<TickOrDash feature={allTask} />}</div>
        <div>{<TickOrDash feature={certificate} />}</div>
        <div>{<TickOrDash feature={voiceRecognition} />}</div>
      </div>
    </div>
  )
}
