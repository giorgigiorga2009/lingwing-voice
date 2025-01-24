import {
  getCurrentLanguageCoursesList,
  LanguageCourse,
} from '@utils/lessons/getLanguageCoursesList';
import style from './LearnMenu.module.scss';
import { FC, useState, useEffect, useRef } from 'react';
import { useTranslation } from '@utils/useTranslation';
import { CoursesDropdown } from '@components/lessons/learnMenu/CoursesDropdown';
import { Tabs } from '@components/header/LessonsSideMenu';
import UserAvatar from '@components/shared/UserAvatar';
import Link from 'next/link';
import { logHandler } from '@utils/lessons/taskUtils';
import { useFocusStore, useUserStore } from '@utils/store';

interface Props {
  languageFrom: string | string[] | undefined;
  languageTo: string | string[] | undefined;
  token: string | null;
  languageCourseId: string;
  languageId: string;
  setTab: (value: Tabs) => void;
  tab: string;
  point: number;
  isHidden: boolean;
  setIsHidden: (value: boolean) => void;
  onResetCourse: () => void;
  courseName: string;
  isRatingOpen: boolean;
  setIsRatingOpen: (value: boolean) => void;
  setShowTopScores: (show: boolean) => void;
  showTopScores: boolean;
}

const LearnMenu: FC<Props> = ({
  languageFrom,
  languageTo,
  token,
  languageCourseId,

  languageId,
  setTab,
  tab,
  point,
  isHidden,
  setIsHidden,
  onResetCourse,
  courseName,
  isRatingOpen,
  setIsRatingOpen,
  setShowTopScores,
  showTopScores,
}) => {
  const { t } = useTranslation();
  const [currentLanguageCoursesList, setCurrentLanguageCoursesList] = useState<
    LanguageCourse[] | undefined
  >();
  const [isMouseMoving, setIsMouseMoving] = useState(true);
  const learnMenuRef = useRef<HTMLDivElement>(null);
  const { firstName, lastName, email, avatar } = useUserStore((state) => ({
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    avatar: state.avatar,
  }));

  let isDesktopSize = false;
  const { setShouldRefocus } = useFocusStore(); 

  
  if (typeof window !== 'undefined') {
    isDesktopSize = window.innerWidth >= 1023;
  }

  // console.log(languageCourseId);
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = () => {
      setIsMouseMoving(true);

      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsMouseMoving(true);
      }, 5000);
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    if (!languageFrom || !languageTo || !languageCourseId) return;

    getCurrentLanguageCoursesList({
      languageFrom,
      languageTo,
      token: token || '',
      languageCourseId: languageCourseId,
      languageId: languageId,
    })
      .then((currentCoursesList) =>
        setCurrentLanguageCoursesList(currentCoursesList)
      )
      .catch((error) => {
        console.error('Error fetching user course:', error);
        throw error;
      });
  }, [languageCourseId, token]);

  useEffect(() => {



    const handleGlobalClick = (event: MouseEvent) => {

      if (isDesktopSize) return;
      const target = event.target as HTMLElement;
      const isMenuTrigger = target.closest('.menuTrigger') !== null;
      const isBackButton = target.closest(`.${style.backButton}`) !== null;

      if (
        !isHidden &&
        !isMenuTrigger &&
        !isBackButton &&
        learnMenuRef.current &&
        !learnMenuRef.current.contains(target)
      ) {
        setIsHidden(true);
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [isHidden, isMouseMoving, setIsHidden]);

  const displayName = firstName || lastName ? `${firstName || ''} ${lastName || ''}`.trim() : email;


  const handleClose = () => {
    setIsHidden(true);
    setShouldRefocus(true); 
  };

  return (
    <div
      className={`${style.learnMenuWrapper} ${
        isMouseMoving && !isHidden ? style.visible : ''
      } ${!isHidden ? style.showContainer : ''}`}
    >
      <div
        ref={learnMenuRef}
        id="learnMenuContainer"
        className={`${style.foldersContainer} ${
          isMouseMoving && !isHidden ? style.visible : ''
        } ${!isHidden ? style.showContainer : ''}`}
      >
        <div
          className={`${style.menuTrigger} menuTrigger`}
          onClick={() => setIsHidden(!isHidden)}
        >
          {t("LEARN_MENU_BUTTON")}
        </div>

        <div className={style.header}>
          <div
            className={style.backButton}
            onClick={handleClose}
          >
            {' '}
          </div>

          <div className={style.headerContent}>
            <div className={style.userAvatarContainer}>
              <UserAvatar image={avatar} isLeaenMenu={true} />
            </div>
            <div className={style.userInfo}>
              <p className={style.userName}> {displayName}</p>
            </div>
          </div>
        </div>

        {currentLanguageCoursesList && (
          <div className={style.coursesDropdownContainer}>
            <CoursesDropdown
              languageCoursesList={currentLanguageCoursesList}
              languageTo={languageTo as string}
            />
          </div>
        )}

        <Link
          href={{
            pathname: '/aboutCourse',
            query: {
              languageTo,
              languageFrom,
              courseName,
            },
          }}
          className={`${style.folderName} ${
            tab === 'course' && style.activeButton
          }  ${style.courseButton} `}
        >
          {t('LEARN_MENU_COURSE')}
        </Link>

        <button
          className={`${style.folderName} ${
            tab === 'statistics' && style.activeButton
          } ${style.statisticsButton}`}
          onClick={() => setTab('statistics')}
        >
          {t('LEARN_MENU_STATISTICS')}
        </button>

        <button
          className={`${style.folderName} ${
            tab === 'grammar' && style.activeButton
          } ${style.grammarButton}`}
          onClick={() => setTab('grammar')}
        >
          {t('LEARN_MENU_GRAMMAR')}
        </button>

        <button
          className={`${style.folderName} ${
            tab === 'vocabulary' && style.activeButton
          } ${style.vocabularyButton}`}
          onClick={() => setTab('vocabulary')}
        >
          {t('LEARN_MENU_VOCABULARY')}
        </button>

        <button
          className={`${style.folderName} ${
            tab === 'rating' && style.activeButton
          } ${style.ratingButton}`}
          onClick={() => {
            setShowTopScores(!showTopScores)
            setIsHidden(true)
          }}
        >
          {t('LEARN_MENU_RATING')}
        </button>

        <button
          className={`${style.folderName} ${
            tab === 'levels' && style.activeButton
          } ${style.modeButton}`}
          onClick={() => setTab('levels')}
        >
          {t('LEARNING_MODE')}
        </button>

        <Link
          href={{
            pathname: '/wizard',
            query: {
              languageTo,
              // languageFrom,
              // courseName,
            },
          }}
          className={`${style.folderName} ${
            tab === 'locale' && style.activeButton
          } ${style.menuButton}`}
          onClick={() => console.log('locale')}
        >
          {t('LEARN_MENU_LOCALE')}
        </Link>

        <Link
          href={{
            pathname: token ? '/dashboard' : '/wizard',
            // query: {
            //   languageTo,
            //   languageFrom,
            // },
          }}
          className={`${style.folderName} ${
            tab === 'switch-course' && style.activeButton
          } ${style.switchCourseButton}`}
          onClick={() => console.log('switch-course')}
        >
          {t('LEARN_MENU_SWITCH_COURSE')}
        </Link>

        <Link
          href={{
            pathname: '/lessons/reset',
            query: {
              languageTo,
              languageFrom,
              courseName,
            },
          }}
          className={`${style.folderName} ${
            tab === 'reset-course' && style.activeButton
          } ${style.resetProgressButton}`}
          onClick={onResetCourse}
        >
          {t('LEARN_MENU_RESET_COURSE')}
        </Link>

        <Link href='/faq'
            className={`${style.folderName} ${
              tab === 'vocabulary' && style.activeButton
            } ${style.helpButton}`}
            // onClick={() => setTab('vocabulary')}
          >
            {t('LEARN_MENU_HELP')}
          </Link>
      </div>
    </div>
  );
};

export default LearnMenu;
