import ContainerWrapper from '@components/passwordForget/Wrapper';
import Social from '@components/profileAssets/Social';
import ShowErr from '@components/shared/ShowInputError';
import tic from '@public/assets/images/tick-check/green-tick.png';
import { auth } from '@utils/auth';
import { useTranslation } from '@utils/useTranslation';
import {
  getEmailValidation,
  getIsPasswordSame,
  getPasswordValidation,
} from '@utils/validations';
import { NextPage } from 'next';
import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import facebook from '../public/assets/images/networks/facebook.png';
import google from '../public/assets/images/networks/gplus.png';
import style from './signUp.module.scss';
import Loader from '@components/loaders/loader';

const UpdatePassword: NextPage = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const isPassValid = getPasswordValidation(password);
  const isRepeatPassValid = getPasswordValidation(repeatPassword);
  const isPasswordSame = getIsPasswordSame(password, repeatPassword);
  const isEmailValid = getEmailValidation(email);
  const [emailExistsError, setEmailExistsError] = useState<boolean>(false);

  const areAllPasswordsValid =
    isPassValid &&
    isRepeatPassValid &&
    isPasswordSame &&
    password &&
    repeatPassword;

useEffect(() => {
  if (status === 'authenticated') {
    router.push('/');
  } 
}, [status, router.isReady]);


  const signUp = async () => {
    if (!isEmailValid || !password || !isPasswordSame) return;

    try {
      // Attempt to sign up the user
      const signUpResponse = await auth({
        email,
        password,
        repeatPassword,
        // referral,
      });

      if (signUpResponse) {
        // If sign-up is successful, attempt to sign in
        try {
          const signInResponse = await signIn('credentials', {
            email,
            password,
            callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
            redirect: false,
          });

          if (signInResponse?.ok) {
           await router.push({ pathname: '/' });
          }
        } catch (signInError) {
          console.error((signInError as Error).message);
        }
      } else {
        // If sign-up fails, set an error
        setEmailExistsError(true);
      }
    } catch (signUpError) {
      console.log((signUpError as Error).message);
    }
  };


  if(session) return <Loader />
  return (
    <ContainerWrapper>
      <div className={style.container}>
        <h2 className={style.title}>{t('singUp')}</h2>
        <p>
          {t('REFERRAL_REGISTER_HEADING_LIGHT')}{' '}
          <span>{t('REFERRAL_REGISTER_EMAIL_ADDRESS')}</span>
        </p>
        <div className={style.formWrapper}>
          <div className={style.email}>
            <div className={style.emailField}>
              <label htmlFor="email">{t('AUTH_EMAIL')}</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailExistsError(false);
                }}
              />
              <div className={style.tic}>
                {isEmailValid && email.length > 0 && (
                  <Image src={tic} width={15} height={15} alt="" />
                )}
              </div>
            </div>
            <div className={style.error}>
              {!isEmailValid && <ShowErr ErrText={t('AUTH_EMAIL_NOT_VALID')} />}
            </div>
            <div className={style.error}>
              {emailExistsError && (
                <ShowErr ErrText={t('AUTH_ALREADY_REGISTERED')} />
              )}
            </div>
          </div>
          <div className={style.wrapper}>
            <div className={style.fieldWrapper}>
              <div className={style.passField}>
                <label htmlFor="newPassword">
                  {t('PASSWORD_CHANGE_NEW_PASSWORD')}
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={style.error}>
                {!isPassValid && (
                  <ShowErr ErrText={t('AUTH_PASSWORD_NOT_VALID')} />
                )}
              </div>
            </div>
            <div className={style.fieldWrapper}>
              <div className={style.passField}>
                <label htmlFor="repeatPassword">
                  {t('PASSWORD_CHANGE_REPEAT_NEW_PASSWORD')}
                </label>
                <input
                  id="repeatPassword"
                  type="password"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                />
              </div>
              <div className={style.error}>
                {!isRepeatPassValid && (
                  <ShowErr ErrText={t('AUTH_PASSWORD_NOT_VALID')} />
                )}
              </div>
              <div className={style.error}>
                {!isPasswordSame && isRepeatPassValid && repeatPassword && (
                  <ShowErr
                    ErrText={t('PASSWORD_CHANGE_PASSWORDS_DONT_MATCH')}
                  />
                )}
              </div>
            </div>
          </div>
          <div className={style.buttonPart}>
            <button
              className={
                areAllPasswordsValid ? style.passwordsAreValid : style.ordinary
              }
              onClick={signUp}
            >
              {t('singUp!')}
            </button>
            <div className={style.socialsPart}>
              <span>
                <span>{t('AUTH_OR_WITH')}</span> {t('AUTH_SOC_MEDIA2')}
              </span>
              <div className={style.socialLinks}>
                <Social
                  network="facebook"
                  image={facebook.src}
                  arrowOrTic={false}
                  color="rgb(82, 91, 172)"
                  width={12}
                  height={20}
                  isSignUpPage
                />
                <Social
                  network="google"
                  image={google.src}
                  arrowOrTic={false}
                  color="rgb(227, 78, 78)"
                  width={27}
                  height={20}
                  isSignUpPage
                />
              </div>
            </div>
          </div>
          <div className={style.bottomPart}>
            <Link
              href={'/forgot-password'}
              className={style.forgotPasswordLink}
            >
              {t('AUTH_FORGET_PASSWORD')}
            </Link>
            <div>
              <span>{t('REFERRAL_MODAL_SIGN_IN_SUGGESTION')}</span>
              <Link
                href={'/forgot-password'}
                className={style.forgotPasswordLink}
              >
                {t('AUTH_SIGN_IN!')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ContainerWrapper>
  );
};

export default UpdatePassword;
