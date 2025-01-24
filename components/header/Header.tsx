import CourseTimer from '@components/lessons/chat/timer/CourseTimer';
import { CourseObject } from '@utils/lessons/getTask';
import { UserInfo, useUserStore } from '@utils/store';
import { useTranslation } from '@utils/useTranslation';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';
import { LoginModal } from '../loginWindow/LoginModal';
import UserAvatar from '../shared/UserAvatar';
import style from './Header.module.scss';
import { LocalesDropdown } from './LocalesDropdown';
import { SideMenu } from './SideMenu';
import User from './User';

interface Props {
  size?: 's' | 'm';
  page?: 'landing' | '';
  loginClassName?: string;
  currentCourseObject?: CourseObject;
  token?: string | null;
  setShowTopScores: (show: boolean) => void;
  showTopScores: boolean;
  currentSection?: number | null;
  isHidden?: boolean;
  setIsHidden?: React.Dispatch<React.SetStateAction<boolean>>;
  tab?: string;
  isPaused?: boolean;
  setIsPaused?: (value: boolean) => void;
  bgColor?: boolean;
  isIndexPage?: boolean;
  showProfile?: boolean;
  showDashboard?: boolean;
  showLanguageDropdown?: boolean;
  isExercise?: boolean;
  showLogo?: boolean;
  hideAuthBox?: boolean;
  isMobile?: boolean;
}

const setUserToken = (state: UserInfo) => ({
  SetToken: state.SetToken,
});

export const Header: FC<Props> = ({
  size = 'm',
  page = '',
  loginClassName,
  currentCourseObject,
  token,
  setShowTopScores,
  showTopScores,
  currentSection,
  isHidden,
  setIsHidden,
  tab,
  isPaused,
  setIsPaused,
  bgColor,
  isIndexPage = false,
  showProfile = true,
  showDashboard = true,
  showLanguageDropdown = true,
  isExercise = false,
  showLogo = true,
  hideAuthBox = false,
  isMobile,
}) => {
  console.log('Header Props:', {
    isExercise,
    showLogo,
    hideAuthBox,
    status: useSession().status
  });
  
  const [openLogin, setOpenLogin] = useState(false);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { SetToken } = useUserStore(setUserToken);
  const [isDesktop, setIsDesktop] = useState(false);

  const router = useRouter();
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const isLessons = router.pathname.includes('lessons');
  const isDashboard = router.pathname.includes('dashboard');

  useEffect(() => {
    if (session) {
      SetToken(session.user.accessToken);
    }
  }, [session, SetToken]);

  const isDark = currentSection === 1 || currentSection === 2;
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize(); // Set initial state
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLearnMenu = useCallback(() => {
    let timeoutId: NodeJS.Timeout;

    if (setIsHidden && !isDesktop) {
      // Add a small delay before toggling the LearnMenu
      timeoutId = setTimeout(() => {
        setIsHidden((prev) => !prev);
      }, 50);
    } else {
      setOpenSideMenu(true);
    }

    return () => clearTimeout(timeoutId);
  }, [setIsHidden, isDesktop]);

  return (
    <header
      className={classNames(
        style.header,
        style[size],
        tab && tab !== 'course' && tab.length > 0 && style.hidden,
        style[page],
        { [style.darkMode]: isDark },
        { [style.bgColor]: bgColor },
        tab && tab.length > 0 && tab !== 'course' && style.hidden,
        isExercise && style.exerciseHeader,
        { [style.hidden]: isExercise && isMobile }
      )}
    >
      {isExercise && (
        <div className={style['back-button']}>
          {/* Add onClick handler if needed */}
        </div>
      )}
      {/* {isExercise && (
        <div className={style['score-container']}>
          <div className={style['current-score']}>10</div>
          <div className={style.divider}>/</div>
          <div className={style['total-sco100re']}></div>
        </div>
      )} */}
      {setIsPaused && (
        <CourseTimer
          isWorking={!isPaused || false}
          setIsWorking={(isWorking) => setIsPaused(!isWorking)}
          initialTimeSpent={currentCourseObject?.totalTimeSpent || 0}
          
        />
      )}

      <div className={classNames(style.leftBlock)}>
        <button
          className={`${style.button} ${
            isExercise ? style['exercise-mode'] : ''
          }`}
          onClick={toggleLearnMenu}
        />
        {showLogo && (
          <div className={style.logo}>
            <Link href="/" className={style.logo_link} />
          </div>
        )}
        <SideMenu
          onClose={() => setOpenSideMenu(false)}
          openSideMenu={openSideMenu}
          lessonsPage={isLessons ? true : false}
          currentCourseObject={currentCourseObject}
          token={token}
        />
      </div>
      <div className={style.rightBlock}>
        {showLanguageDropdown && <LocalesDropdown isDark={isDark} />}
        {status === 'authenticated' && (
          <>
            {showDashboard && !isLessons && (
              <Link
                href={{
                  pathname: `/dashboard`,
                }}
                locale={router.locale}
                as="/dashboard"
                className={classNames(style.dashboard, style.link)}
              >
                <h4>{t('APP_DASHBOARD')}</h4>
              </Link>
            )}
            {isLessons ? (
              <>
                <button
                  className={style.topScoresBtn}
                  onClick={() => setShowTopScores(!showTopScores)}
                />
                <Link
                  href={{
                    pathname: `/dashboard`,
                  }}
                  locale={router.locale}
                  as="/dashboard"
                  className={classNames(style.exit, style.link)}
                ></Link>
              </>
            ) : (
              showProfile && (
                <User
                  isDarkMode={
                    isIndexPage &&
                    (currentSection === 1 || currentSection === 2)
                  }
                />
              )
            )}
          </>
        )}

        {status === 'unauthenticated' && !hideAuthBox && (
          <div className={style.authorization_box}>
            <UserAvatar />
            <button
              className={classNames(style.singInButton, {
                [style.darkMode]: isDark,
              })}
              onClick={() => setOpenLogin(true)}
            >
              {t('AUTH_SIGN_IN')}
            </button>
          </div>
        )}
      </div>
      {openLogin && (
        <LoginModal
          openLogin={openLogin}
          setOpenLogin={setOpenLogin}
          onClick={() => setOpenLogin(false)}
          className={loginClassName}
        />
      )}
    </header>
  );
};
