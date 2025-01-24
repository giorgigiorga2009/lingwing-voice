import { FC } from 'react'
import style from './FeedbackButton.module.scss'
import { useTranslation } from '@utils/useTranslation'

interface Props {
  openFeedback: boolean
  setOpenFeedback: (openFeedback: boolean) => void
}

const FeedbackButton: FC<Props> = ({ openFeedback, setOpenFeedback }) => {
  const { t } = useTranslation()
  return (
    <button
      className={style.button}
      onClick={() => setOpenFeedback(!openFeedback)}
    >
      {t('FEEDBACK')}
    </button>
  )
}

export default FeedbackButton
