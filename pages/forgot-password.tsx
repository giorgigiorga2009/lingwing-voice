import Swal from 'sweetalert2'
import { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { forgotPassword } from '@utils/auth'
import style from './forgotPassword.module.scss'
import { useTranslation } from '@utils/useTranslation'
import { getEmailValidation } from '@utils/validations'
import ContainerWrapper from '@components/passwordForget/Wrapper'

const UpdatePassword: NextPage = () => {
  const router = useRouter()
  const { t } = useTranslation()

  const [email, setEmail] = useState<string>('')

  const isEmailValid = getEmailValidation(email)
  const isEmailEntered = isEmailValid && email.trim().length > 0

  const showAlert = (titleText: string, isError: boolean) => {
    const title = `<span style="font-family: Noto Sans Georgian SemiBold;">${titleText}</span>`

    return Swal.fire({
      title,
      icon: isError ? 'error' : 'success',
      showConfirmButton: true,
      confirmButtonColor: 'rgb(105 46 150)',
      confirmButtonText: 'OK',
      customClass: {
        popup: style.swalPopup
      }
    })
  }

  const handleSendEmail = async () => {
    if (!isEmailValid) return
    forgotPassword(email)
    showAlert(t('RESET_PASSWORD_EMAIL_SENT'), false)
      .then(result => {
        result.isConfirmed && router.push('/login')
        return result
      })
      .catch(error => {
        console.error('Swal error:', error)
      })
  }

  return (
    <ContainerWrapper>
      <div className={style.title}>{t('RESET_PASSWORD')}</div>
      <div className={style.wrapper}>
        <p className={style.description}>{t('RESET_PASSWORD_DESCRIPTION')} </p>
        <label htmlFor="email">{t('AUTH_EMAIL')}</label>
        <input
          id="email"
          type="text"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        {!isEmailValid && (
          <div className={style.error}>{t('AUTH_EMAIL_NOT_VALID')}</div>
        )}
      </div>
      <button
        className={`${style.submitButton} ${isEmailEntered ? style.passwordsAreValid : ''}`}
        onClick={handleSendEmail}
        disabled={!isEmailEntered}
      >
        {t('RESET_PASSWORD_SEND_LINK')}
      </button>
    </ContainerWrapper>
  )
}

export default UpdatePassword
