import Link from 'next/link';
import { Input } from './Input';
import { FC, useState } from 'react';
import style from './SignIn.module.scss';
import { AuthButton } from './AuthButton';
import { useTranslation } from '@utils/useTranslation';
import ShowErr from '@components/shared/ShowInputError';
import { getEmailValidation, getPasswordValidation } from '@utils/validations';

interface Props {
  signIn: () => void;
  err: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const SignIn: FC<Props> = ({
  signIn,
  err,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  const { t } = useTranslation();

  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);

  const passwordChangeHandler = (password: string) => {
    setIsPasswordValid(getPasswordValidation(password));
    setPassword(password);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isEmailValid && isPasswordValid) {
      signIn();
    }
  };
  return (
    <>
      <form className={style.form} onSubmit={handleSubmit}>
        {err && <ShowErr ErrText={t('AUTH_EMAIL_NOT_FOUND')} />}
        <Input
          type="email"
          placeholder={t('AUTH_EMAIL')}
          value={email}
          onChange={setEmail}
          onBlur={(email) => setIsEmailValid(getEmailValidation(email))}
        />
        {!isEmailValid && <ShowErr ErrText={t('AUTH_EMAIL_NOT_VALID')} />}
        <Input
          type="password"
          placeholder={t('AUTH_PASSWORD')}
          value={password}
          onChange={passwordChangeHandler}
        />
        {!isPasswordValid && <ShowErr ErrText={t('AUTH_PASSWORD_NOT_VALID')} />}
        <div className={style.bottomWrapper} id="bottomWrapper">
          <Link href={'/forgot-password'} className={style.forgotPasswordLink}>
            {t('AUTH_FORGET_PASSWORD')}
          </Link>
          <AuthButton
            title={t('AUTH_SIGN_IN')}
            onClick={() => isEmailValid && isPasswordValid && signIn()}
          />
        </div>
      </form>
    </>
  );
};
