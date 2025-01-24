import React from 'react'
import style from './lessonsFlowPopUps.module.scss'
import Image from 'next/image'
import greenTick from '@public/themes/images/v2/bon-check.png'
import { useTranslation } from '@utils/useTranslation'
import { RegistrationReminderPopupProps } from '@utils/lessons/getRegReminder'

const RenderHeaderContent: React.FC<RegistrationReminderPopupProps> = ({
  popUpNumber,
  language,
}) => {
  const { t } = useTranslation()
  if (popUpNumber === 1) {
    return <p className={style.header}>{t('REG_REMINDER_HEADER')}</p>
  } else if (popUpNumber === 2) {
    return (
      <>
        <p className={style.header}>{`${language}${t(
          'REG_REMINDER_DAILY_LIMIT',
        )}`}</p>
      </>
    )
  } else if (popUpNumber === 3) {
    return (
      <div className={style.headerContainer}>
        <Image src={greenTick} alt="" />
        <p className={style.header}>{t('REG_REMINDER_TRANSACTION')}</p>
      </div>
    )
  }
  return null
}

export default RenderHeaderContent
