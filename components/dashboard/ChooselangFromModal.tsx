import { ChooseLanguageStep } from '@components/wizard/ChooseLanguageStep';
import { LanguageFrom, LANGUAGES_TO } from '@utils/languages';
import { useTranslation } from '@utils/useTranslation';
import { FC, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { logHandler } from '@utils/lessons/taskUtils';

const ChooseLangFromModal: FC<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  languages: LanguageFrom[];
  targetCourseData: any;
}> = ({ isOpen, setIsOpen, languages, targetCourseData }) => {
  const { t } = useTranslation();
  const overlayRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (overlayRef.current === event.target) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [isOpen, setIsOpen]);

  const gotoCourse = (language: LanguageFrom) => {
    if (language && targetCourseData) {
      const { languageTo, courseName } = targetCourseData;

      // Log for debugging (you can remove these later)
    //   console.log('languageTo : ', languageTo);
    //   console.log('languageFrom : ', language);
    //   console.log('courseName : ', courseName);

      // Redirect to the soundcheck page with query parameters
      router.push({
        pathname: '/lessons/soundcheck',
        query: { languageTo, languageFrom: language, courseName },
      });
    }

    setIsOpen(false);
  };


  if (!isOpen) return null;


  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: 'rgba(255,255,255,.1)',
        backdropFilter: 'blur(10px)',
        width: '100%',
        height: '100%',
        zIndex: 10002,
        overflow: 'hidden',
      }}
    >
      <div style={{ width: 'fit-content', margin: 'auto' }}>
        <ChooseLanguageStep
          languages={languages}
          onClick={(language: "eng" | "geo" | "tur" | "ben" | "esp" | "rus" | "fre" | "deu" | "ita" | "chi") => gotoCourse(language as LanguageFrom)}
          title={t('wizardTitle2')}
        />
      </div>
    </div>
  );
};

export default ChooseLangFromModal;
