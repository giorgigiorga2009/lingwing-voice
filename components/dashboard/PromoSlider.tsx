import classNames from 'classnames'
import style from './PromoSlider.module.scss'
import { FormattedMessage } from 'react-intl'
import { FC, useState, useEffect } from 'react'
import { useTranslation } from '../../utils/useTranslation'
import router from 'next/router'

const PromoSlider: FC = () => {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState<number>(0)
  
  const slideCount = 2

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(activeIndex === slideCount - 1 ? 0 : activeIndex + 1)
    }, 5000)
    return () => clearInterval(interval)
  })

  // const handleReferralClick = async () => {
  //   try {
  //    const res = await getReferral(Token)
  //     setReferralData(res)
  //   } catch (error) {
  //     console.error('failed getting referral code', error)
  //   }
  // }

  const handlePremiumClick = () => {
    router.push('/packages')
  }

  const handleClick = () => {
    router.push('/wizard?languageTo=geo')
  }


  
  return (
    <div className={style.container}>
      {/* slide 1 */}
      {/* <div
        className={classNames(
          style.slide,
          activeIndex === 0 ? style.slide_active : null,
        )}
      >
        <h5 className={style.title}>
          <FormattedMessage
            id="APP_DASHBOARD_BANNER1_TEXT"
            values={{ k: (chunks: React.ReactNode) => <span>{chunks}</span> }}
          />
        </h5>
        <button className={style.button} onClick={handleReferralClick}>
          <h6>{t('APP_DASHBOARD_BANNER1_LINK')}</h6>
        </button>
        <div className={style.parrot_img}></div>
        <div className={style.add_friends_img}></div>
      </div> */}

      {/* slide 2 */}
      <div
        className={classNames(
          style.slide,
          activeIndex === 0 ? style.slide_active : null,
        )}
      >
        <h5 className={style.title}>
          <FormattedMessage
            id="APP_DASHBOARD_BANNER2_TEXT"
            values={{ k: (chunks: React.ReactNode) => <span>{chunks}</span> }}
          />
        </h5>

        <button className={style.button} onClick={handlePremiumClick}>
          <div className={style.premium_icon}></div>
          <h6>{t('APP_BECOME_PREMIUM')}</h6>
        </button>
        <div className={style.parrot_img}></div>
        <div className={style.premium_img}></div>
      </div>

      {/* slide 3 */}
      <div
        className={classNames(
          style.slide,
          style.slide_liberty,
          activeIndex === 1 ? style.slide_active : null,
        )}
      >
        <h6 className={style.title}>{t('APP_DASHBOARD_BANNER3_TEXT')}</h6>
        <button className={style.button} onClick={handleClick}>
          <h6>{t('APP_DASHBOARD_BANNER3_BUTTON')}</h6>
        </button>
        <div className={style.liberty_img}></div>
      </div>
    </div>
  )
}

export default PromoSlider
