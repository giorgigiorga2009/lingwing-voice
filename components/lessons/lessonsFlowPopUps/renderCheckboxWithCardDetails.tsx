import React, { useState } from 'react'
import style from './lessonsFlowPopUps.module.scss'
import { RegistrationReminderPopupProps } from '@utils/lessons/getRegReminder'
import { useTranslation } from '@utils/useTranslation'

const RenderCheckboxWithCardDetails: React.FC<
  RegistrationReminderPopupProps
> = ({ popUpNumber, paymentsData }) => {
  const { t } = useTranslation()
  const [agreed, setAgreed] = useState(false)

  if (popUpNumber === 2) {
    return (
      <>
        <span>{t('REG_REMINDER_LEARN_A_LANGUAGE')}</span>
        <span className={style.blackedOut}>{t('REG_REMINDER_5_TIMES')}</span>
        <span>{t('REG_REMINDER_MORE_COMFORTABLE')}</span>
      </>
    )
  } else if (popUpNumber === 3 && paymentsData?.creditCard.isAttached) {
    return (
      <div className={style.cardNumbers}>
        <label className={style.checkBoxContainer}>
          <input
            type="checkbox"
            id="agreement"
            checked={agreed}
            onChange={() => setAgreed(prev => !prev)}
          />
          <span className={style.customCheckBox}></span>
          <span>
            {`${paymentsData.creditCard.type} * ${paymentsData.creditCard.number}`}
          </span>
          <span>{t('REG_REMINDER_REMEMBER_CARD')}</span>
        </label>
      </div>
    )
  }
  return null
}

export default RenderCheckboxWithCardDetails
