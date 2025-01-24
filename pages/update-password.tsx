import { NextPage } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { resetPassword, setPassword } from '@utils/auth';
import { useSession } from 'next-auth/react';
import style from './updatePassword.module.scss';
import { useTranslation } from '@utils/useTranslation';
import ContainerWrapper from '@components/passwordForget/Wrapper';
import { getIsPasswordSame, getPasswordValidation } from '@utils/validations';
import showAlert from '@components/reusables/Updatepassword';
import { useProfileStore } from '@utils/store';

const UpdatePassword: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session } = useSession();
  const token = session?.user.accessToken;
  const isPassword = useProfileStore((state) => state.isPassword);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');

  const isCurrentPassValid = getPasswordValidation(currentPassword);
  const isNewPassValid = getPasswordValidation(newPassword);
  const isRepeatPassValid = getPasswordValidation(repeatPassword);
  const isPasswordSame = getIsPasswordSame(newPassword, repeatPassword);
  const areAllPasswordsValid = 
  isNewPassValid && 
  isRepeatPassValid && 
  isPasswordSame && 
  newPassword && 
  repeatPassword && 
  (isPassword ? (isCurrentPassValid && currentPassword) : true);

    
const handleSubmitPassword = async () => {
  if (!areAllPasswordsValid) return;

  try {
    let res;

    try {
      if (isPassword) {
        res = await resetPassword({
          currentPassword,
          newPassword,
          repeatPassword,
          token,
        });
      } else {
        res = await setPassword({ newPassword, repeatPassword, token });
      }

      if (res?.status === 200) {
        await showAlert(t('PASSWORD_CHANGED_SUCCESS'), '', false, style);
        router.push('/profile');
      } else {
        throw new Error('Password change failed');
      }
    } catch (apiError) {
      console.error('API error:', apiError);
      await showAlert(
        t('PASSWORD_ERROR'),
        t('CURRENTPASSWORD_DONT_MATCH'),
        true,
        style
      );
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    await showAlert(
      t('PASSWORD_ERROR'),
      t('CURRENTPASSWORD_DONT_MATCH'),
      true,
      style
    );
  }
};


  return (
    <ContainerWrapper>
      <div className={style.title}>{t('PASSWORD_CHANGE')}</div>
      {isPassword && (
        <>
          <label htmlFor="currentPassword">
            {t('PASSWORD_CHANGE_CURRENT_PASSWORD')}
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          {!isCurrentPassValid && (
            <div className={style.error}>{t('AUTH_PASSWORD_NOT_VALID')}</div>
          )}
        </>
      )}
      <label htmlFor="newPassword">{t('PASSWORD_CHANGE_NEW_PASSWORD')}</label>
      <input
        id="newPassword"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
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
        onChange={(e) => setRepeatPassword(e.target.value)}
      />
      {!isRepeatPassValid && (
        <div className={style.error}>{t('AUTH_PASSWORD_NOT_VALID')}</div>
      )}
      {!isPasswordSame && isRepeatPassValid && repeatPassword && (
        <div className={style.error}>
          {t('PASSWORD_CHANGE_PASSWORDS_DONT_MATCH')}
        </div>
      )}
      <button
        className={areAllPasswordsValid ? style.passwordsAreValid : ''}
        onClick={handleSubmitPassword}
      >
        {t('PASSWORD_CHANGE_SET')}
      </button>
    </ContainerWrapper>
  );
};

export default UpdatePassword;
