import ContainerWrapper from '@components/passwordForget/Wrapper'
import showAlert from '@components/reusables/Updatepassword'
import { resetPassword } from '@utils/auth'
import { useTranslation } from '@utils/useTranslation'
import { getIsPasswordSame, getPasswordValidation } from '@utils/validations'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'
import style from '../forgotPassword.module.scss'

const UpdatePassword: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation()
  const token = router.query.token

  const [newPassword, setNewPassword] = useState<string>('')
  const [repeatPassword, setRepeatPassword] = useState<string>('')

  const isNewPassValid = getPasswordValidation(newPassword)
  const isRepeatPassValid = getPasswordValidation(repeatPassword)
  const isPasswordSame = getIsPasswordSame(newPassword, repeatPassword)
  const areAllPasswordsValid =
    isNewPassValid &&
    isRepeatPassValid &&
    isPasswordSame &&
    newPassword &&
    repeatPassword


  const handleSubmitPassword = async () => {
    if (!areAllPasswordsValid) return

    try {
      await resetPassword({
        newPassword,
        repeatPassword,
        token: '',
        expirationToken: token,
      })
      showAlert(t('PASSWORD_CHANGED_SUCCESS'), '', false, style)
        .then(result => {
          result.isConfirmed && router.push('/login')
          return result
        })
        .catch(error => {
          console.error('Swal error:', error)
        })
    } catch (error) {
      showAlert(t('PASSWORD_ERROR'), t('CURRENTPASSWORD_DONT_MATCH'), true, style)
    }
  }

  return (
    <ContainerWrapper>
      <div className={style.title}>{t('RESET_PASSWORD')}</div>
      <div className={style.wrapper}>
        <label htmlFor="newPassword">{t('PASSWORD_CHANGE_NEW_PASSWORD')}</label>
        <input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
        />
        {!isNewPassValid && (
          <div className={style.error}>{t('AUTH_PASSWORD_NOT_VALID')}</div>
        )}
        <label htmlFor="repeatPassword">
          {t('PASSWORD_CHANGE_REPEAT_NEW_PASSWORD')}
        </label>
        <input
          id="repeatPassword"
          type="password"
          value={repeatPassword}
          onChange={e => setRepeatPassword(e.target.value)}
        />
        {!isRepeatPassValid && (
          <div className={style.error}>{t('AUTH_PASSWORD_NOT_VALID')}</div>
        )}
        {!isPasswordSame && isRepeatPassValid && repeatPassword && (
          <div className={style.error}>
            {t('PASSWORD_CHANGE_PASSWORDS_DONT_MATCH')}
          </div>
        )}
      </div>
      <button
        className={areAllPasswordsValid ? style.passwordsAreValid : ''}
        onClick={handleSubmitPassword}
      >
        {t('PASSWORD_CHANGE_SET')}
      </button>
    </ContainerWrapper>
  )
}

export default UpdatePassword
