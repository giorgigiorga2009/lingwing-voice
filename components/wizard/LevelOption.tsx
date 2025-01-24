import { FC, useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import classNames from 'classnames';
import style from './LevelOption.module.scss';
import { Option } from '@utils/getDifficultyLevels';
import { useTranslation } from '@utils/useTranslation';
import { getNumberWithComa } from '@utils/getNumberWithComa';
import { LanguageFrom, LanguageTo } from '@utils/languages';
import { useSoundStore, useUserStore } from '@utils/store';

interface Props {
  option: Option;
  index: number;
  languageTo?: LanguageTo;
  languageFrom?: LanguageFrom;
}

export const LevelOption: FC<Props> = ({
  option,
  index,
  languageTo,
  languageFrom,
}) => {
  const { t } = useTranslation();
  const courseName = option.title.toLowerCase().replace(/\s/g, '_');
  const [label, setLabel] = useState('');

  const Token = useUserStore((state:any) => state.Token);
  const soundAllowed = useSoundStore((state:any) => state.soundAllowed);

  const courseURL = soundAllowed ? '/lessons/course' : '/lessons/soundcheck'


  // const updateCourseState = useCallback(
  //   (num: number) => {
  //     let title = '';
  //     if (num <= 0) {
  //       title = 'start';
  //     } else if (option.status.buy) {
  //       title = 'buy';
  //     } else if (option.status.continue) {
  //       title = 'continue';
  //     }

  //     setLabel(title);
  //   },
  //   [option.status.buy, option.status.continue]
  // );

  const updateCourseState = useCallback(
    (num: number | null) => {
      let title = '';

      if (option?.status?.buy) {
        title = 'buy';
      } else if (num !== null && num > 0) {
        title = 'continue';
      } else {
        title = 'start';
      }

      // if (num <= 0) {
      //   title = 'start';
      // } else if (option?.status?.buy) {
      //   title = 'buy';
      // } else if (option?.status?.continue) {
      //   title = 'continue';
      // }

      setLabel(title);
    },
    [option?.status?.buy, option?.status?.continue]
  );

  useEffect(() => {
    if (!Token) {
      updateCourseState(0);
    } else if (
      option?.status?.allPassedTasks !== undefined &&
      typeof option.status.allPassedTasks === 'number'
    ) {
      updateCourseState(option.status.allPassedTasks);
    } else {
      updateCourseState(null);
    }
  }, [option, option?.status?.allPassedTasks, updateCourseState]);

  return (
    <div className={style.optionContainer}>
      <div className={style.logoContainer}>
        <div
          className={classNames(style.courseLogo, style[`course-${index}`])}
        />
        <span className={style.courseName}>
          {t('wizardCourse')}
          {index}
        </span>
      </div>
      <div className={style.titleContainer}>
        <span className={style.title}>{option.title}</span>
        <span className={style.amountOfStudents}>
          <span className={style.number}>
            {getNumberWithComa(option.studyingTheCourse)}
          </span>
          <span className={style.text}>{t('wizardStudents')}</span>
        </span>
      </div>
      <div className={classNames(style.buttons)}>
        <Link
          className={classNames(style.link, style.aboutButton)}
          href={{
            pathname: '/aboutCourse',
            query: { languageTo, languageFrom, courseName },
          }}
        >
          {t('wizardAbout')}
        </Link>
        <Link
          className={classNames(style.link, style.startButton)}
          href={{
            pathname: label === 'buy' ? '/packages' : courseURL,
            query:
              label === 'buy' ? {} : { languageTo, languageFrom, courseName },
          }}
        >
          {label === 'start' && t('startButton')}
          {label === 'continue' && t('APP_GENERAL_CONTINUE')}
          {label === 'buy' && t('APP_GENERAL_BUY')}

          {/* {label === '' ? (
            option.status.continue ? (
              <>{t('APP_GENERAL_CONTINUE')}</>
            ) : option.status.start ? (
              <>{t('startButton')}</>
            ) : option.status.retake ? (
              <>{t('retake')}</>
            ) : (
              <>{t('buy')}</>
            )
          ) : (
            ''
          )} */}
        </Link>
      </div>
    </div>
  );
};
