import {
  LanguageFrom,
  LanguageTo,
  LOCALES_TO_LANGUAGES,
} from '@utils/languages';
import classNames from 'classnames';
import { FC } from 'react';
import { useRouter } from 'next/router';
import { LevelOption } from './LevelOption';
import { Locale } from '@utils/localization';
import { useTranslation } from '@utils/useTranslation';
import style from './DifficultyLevelContainer.module.scss';
import { LanguageLevel } from '@utils/getDifficultyLevels';
import { getNumberWithComa } from '@utils/getNumberWithComa';

interface Props {
  level: LanguageLevel;
  languageTo?: LanguageTo;
  languageFrom?: LanguageFrom;
  isOpened: boolean;
  clickHandler: () => void;
}

export const DifficultyLevelContainer: FC<Props> = ({
  level,
  languageTo,
  languageFrom,
  isOpened,
  clickHandler,
}) => {
  const router = useRouter();
  const locale = (router.locale as Locale) ?? 'en';
  const { t } = useTranslation();

  const languageKey = LOCALES_TO_LANGUAGES[locale];

  return (
    <>
      <button
        className={classNames(style.container, isOpened && style.open)}
        onClick={() => clickHandler()}
      >
        <div className={style.levelLetter}>{level.name}</div>

        <div className={style.levelName}>
          {level?.smallDescription[languageKey]}
        </div>

        <div className={style.additionalInfo}>
          {level?.fullDescription[languageKey]}
        </div>

        <div className={style.amountOfStudents}>
          <span className={style.number}>
            {getNumberWithComa(level.uniqueStudentsCount)}
          </span>
          <span className={style.text}>{t('wizardStudents')}</span>
        </div>

        <div className={style.outerCircle}>
          <div className={style.innerCircle} />
        </div>

        {level.name === 'A2' ? (
          <span className={style.iconBalloon} />
        ) : (
          <span className={style.iconPlane} />
        )}

        <div className={style.iconArrowContainer}>
          <span
            className={classNames(
              style.iconArrow,
              isOpened ? style.up : style.down
            )}
          />
        </div>
      </button>
      {isOpened && (
        <div className={style.options}>
          {level.options.map((option, index) => (
            <LevelOption
              key={index}
              option={option}
              index={index + 1}
              languageTo={languageTo}
              languageFrom={languageFrom}
            />
          ))}
        </div>
      )}
    </>
  );
};
