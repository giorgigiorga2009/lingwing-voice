import {
  LANGUAGE_FROM,
  LANGUAGE_NAMES,
  LanguageFrom,
  LANGUAGES_TO_LOCALES,
  LOCALES_TO_LANGUAGES,
  LANGUAGE_NAMES_DROPDOWN
} from '@utils/languages';
import { Locale } from '@utils/localization';
import { useLocaleStore } from '@utils/store';
import { useTranslation } from '@utils/useTranslation';
import { useRouter } from 'next/router';
import { FC, Fragment, useEffect, useState } from 'react';
import Foco from 'react-foco';
import { LocaleFlag } from './LocaleFlag';
import style from './LocalesDropdown.module.scss';

export const LocalesDropdown: FC<any>= ({ isDark }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = useLocaleStore();
  const initialLanguage =
    LOCALES_TO_LANGUAGES[(locale as Locale) || (router.locale as Locale)];

  const [selected, setSelected] = useState<LanguageFrom>(initialLanguage);
  const [open, setOpen] = useState(false);

  const handleClick = (language: LanguageFrom) => {
    setSelected(language);
    setOpen(false);
    const page = router.asPath;

    if (language in LANGUAGES_TO_LOCALES) {
      const localeKey = LANGUAGES_TO_LOCALES[language as keyof typeof LANGUAGES_TO_LOCALES];
      localStorage.setItem('locale', localeKey);
      router.replace(page, page, { locale: localeKey });
    }
  };

  useEffect(() => {
    setSelected(
      LOCALES_TO_LANGUAGES[(locale as Locale) || (router.locale as Locale)]
    );
  }, [router.locale, locale]);

  return (
    <Foco
      component="div"
      onClickOutside={() => setOpen(false)}
      className={style.dropdown}
    >
      <button className={style.button} onClick={() => setOpen(!open)}>
        <LocaleFlag language={selected} />
        <h6
          className={style.dropdownTitle}
          style={{
            color: isDark ? '#333333' : '#ffffff',
          }}
        >
          {selected === 'geo'
            ? t(selected.toUpperCase())
            : selected.toUpperCase()}
        </h6>
        <div className={style.arrow} />
      </button>
      {open && (
        <div className={style.dropdownContent}>
          {LANGUAGE_FROM.map((language: LanguageFrom) => (
            <Fragment key={language}>
              {language !== selected && (
                <button
                  className={style.option}
                  onClick={() => handleClick(language)}
                >
                  <LocaleFlag language={language} />
                  <div>{LANGUAGE_NAMES_DROPDOWN[language as keyof typeof LANGUAGE_NAMES_DROPDOWN]} </div>
                </button>
              )}
            </Fragment>
          ))}
        </div>
      )}
    </Foco>
  );
};
