import style from './lessonsFlowPopUps.module.scss'
import CountDown from '@components/payment/CountDown'
import { useTranslation } from '@utils/useTranslation'
import { RegistrationReminderPopupProps } from '@utils/lessons/getRegReminder'

const RenderParagraphContent: React.FC<RegistrationReminderPopupProps> = ({
  token,
  popUpNumber,
  completedTasks,
  dailyLimitDate,
  totalTasksAmount,
  packetTitle,
}) => {
  const { t } = useTranslation()
  if (popUpNumber === 1) {
    return (
      <>
        <span>{t('REG_REMINDER_YOU_HAVE_COMPLETED')}</span>
        <span className={style.number}>{completedTasks}</span>
        <span>{t('REG_REMINDER_OUT_OF')}</span>
        <span className={style.number}>{totalTasksAmount}</span>
        <span>{t('REG_REMINDER_TASKS')}</span>
      </>
    )
  } else if (popUpNumber === 2) {
    return (
      <>
        <span>{t('REG_REMINDER_FREE_TASKS_IN')}</span>
        <CountDown
          forLessonsFlowN2={true}
          dailyLimitDate={dailyLimitDate}
          token={token}
        />
        <span>{t('REG_REMINDER_HOURS')}</span>
      </>
    )
  } else if (popUpNumber === 3) {
    return (
      <p className={style.activated}>
        {`${t('REG_REMINDER_PACKAGE_ACTIVATED')} "${packetTitle}"`}
      </p>
    )
  }
  return null
}

export default RenderParagraphContent
