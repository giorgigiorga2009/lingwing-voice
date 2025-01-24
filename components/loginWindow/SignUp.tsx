import { Input } from './Input';
import { auth } from '@utils/auth';
import { FC, useEffect, useState } from 'react';
import style from './SignUp.module.scss';
import { AuthButton } from './AuthButton';
import { SignUpFooter } from './SignUpFooter';
import { useTranslation } from '@utils/useTranslation';
import ShowErr from '@components/shared/ShowInputError';

import {
  getEmailValidation,
  getIsPasswordSame,
  getPasswordValidation,
} from '@utils/validations';

interface Props {
  signIn: () => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const SignUp: FC<Props> = ({
  signIn,
  email,
  setEmail,
  password,
  setPassword,
}) => {
  const { t } = useTranslation();
  const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [isPasswordValid, setIsPasswordValid] = useState<boolean>(true);
  const [isPasswordSame, setIsPasswordSame] = useState<boolean>(true);
  const [emailExistsError, setEmailExistsError] = useState<boolean>(false);
  const [userKey, setUserKey] = useState<any>();
  const [disable, setDisable] = useState(false);

  const passwordChangeHandler = (password: string) => {
    setIsPasswordValid(getPasswordValidation(password));
    setPassword(password);
  };

  const repeatPasswordChangeHandler = (repeatPassword: string) => {
    setIsPasswordSame(getIsPasswordSame(password, repeatPassword));
    setRepeatPassword(repeatPassword);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Access sessionStorage only client-side
      const storedUserId = sessionStorage.getItem(`userId`);
      setUserKey(storedUserId);
    }
  }, []);

  const signUp = async () => {
    if (!isEmailValid || !isPasswordValid || !isPasswordSame) return;
    setDisable(true); 
    try {
      const response = await auth({
        email,
        password,
        repeatPassword,
        userKey: userKey || '',
      });
      if (response) {
        signIn();
      } else {
        setEmailExistsError(true);
        setDisable(false); 
      }
    } catch (error) {
      console.log((error as Error).message);
      setDisable(false); 
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signUp();
  };
  
  return (
    <>
      <form className={style.form} onSubmit={handleSubmit}>
        {emailExistsError && <ShowErr ErrText={t('AUTH_ALREADY_REGISTERED')} />}
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
        <Input
          type="password"
          placeholder={t('AUTH_REPEAT_PASSWORD')}
          value={repeatPassword}
          onChange={repeatPasswordChangeHandler}
        />
        {!isPasswordSame && <ShowErr ErrText={t('AUTH_PASSWORD_NOT_SAME')} />}
        <AuthButton title={t('AUTH_SIGN_UP')} disabled={disable}/>
        <SignUpFooter />
      </form>
    </>
  );
};
