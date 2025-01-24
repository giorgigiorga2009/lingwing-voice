import Link from 'next/link'
import style from './lessonsFlowPopUps.module.scss'
import React, { useCallback, useState } from 'react'
import { useTranslation } from '@utils/useTranslation'
import { ReccuringPrice } from '@components/packages/Prices'
import { LoginModal } from '@components/loginWindow/LoginModal'
import { RegistrationReminderPopupProps } from '@utils/lessons/getRegReminder'

const RenderButtons: React.FC<RegistrationReminderPopupProps> = ({
  popUpNumber,
  languageTo,
  languageFrom,
  price,
  duration,
}) => {
  const { t } = useTranslation()
  const [openLogin, setOpenLogin] = useState(false)
  const [activeTab, setActiveTab] = useState<'signUp' | 'signIn'>('signUp')

  const handleOpenLogin = useCallback(() => setOpenLogin(true), [])
  const handleCloseLogin = useCallback(() => setOpenLogin(false), [])

  if (popUpNumber === 1) {
    return (
      <>
        <button className={style.regButton} onClick={handleOpenLogin}>
          {t('REG_REMINDER_REGISTER_AND_CONTINUE')}
        </button>
        {openLogin && (
          <LoginModal
            openLogin={openLogin}
            setOpenLogin={setOpenLogin}
            onClick={handleCloseLogin}
            initialTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
        <button className={style.coursesButton}>
          <Link
            href={`/wizard?languageTo=${languageTo}&languageFrom=${languageFrom}`}
          >
            {t('REG_REMINDER_OTHER_COURSES')}
          </Link>
        </button>
      </>
    )
  } else if (popUpNumber === 2) {
    return (
      <>
        <button className={style.regButton}>
          <Link href="/packages">{t('REG_REMINDER_CHOOSE_PREMIUM')}</Link>
        </button>

        <div className={style.priceWrapper}>
          <p>{t('REG_REMINDER_MONTHS')}</p>
          <div className={style.monthlyPrice} style={{ display: 'flex', alignItems: 'center' }}>
            <ReccuringPrice
              whereTo={1}
              price={price || 0}
              duration={duration || 0}
              symbol="GEL"
            />
          </div>
        </div>
        <button className={style.orangeButton}>
          <Link href="/free-trial">{t('REG_REMINDER_5_DAY_TRIAL')}</Link>
        </button>
      </>
    )
  } else if (popUpNumber === 3) {
    return (
      <button className={style.regButton}>
        <Link href="/dashboard">{t('REG_REMINDER_DASHBOARD')}</Link>
      </button>
    )
  } else {
    return null
  }
}

export default RenderButtons
