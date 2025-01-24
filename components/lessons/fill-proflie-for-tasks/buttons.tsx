import React from 'react'
import style from './fillProfileForTasks.module.scss'
import { useTranslation } from '@utils/useTranslation'

interface Props {
  isShowingSecondSide: boolean
  onSubmit: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  onClose: () => void
  isFormFilled: boolean
}

const ProfileFormButtons: React.FC<Props> = ({
  isShowingSecondSide,
  onSubmit,
  onClose,
  isFormFilled
}) => {
  const { t } = useTranslation()

  return (
    <div className={style.buttons}>
      {!isShowingSecondSide ? (
        <button
          className={style.continueButton}
          onClick={e => onSubmit(e)}
          type="submit"
          disabled={!isFormFilled}
        >
          {t('FILL_PROFILE_FOR_TASKS_CONTINUE')}
        </button>
      ) : (
        <button
          className={style.continueButton}
          onClick={e => onSubmit(e)}
          type="submit"
          disabled={!isFormFilled}
        >
          {t('FILL_PROFILE_FOR_TASKS_OBTAIN')}
        </button>
      )}
      <button className={style.skipButton} onClick={onClose}>
        {t('FILL_PROFILE_FOR_TASKS_SKIP')}
      </button>
    </div>
  )
}

export default ProfileFormButtons
