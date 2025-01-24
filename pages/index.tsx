import { PageHead } from '@components/PageHead';
import { Header } from '@components/header/Header';
import { FollowButtons } from '@components/home/FollowButtons';
import { HomeSecondPage } from '@components/home/HomeSecondPage';
import { HomeThirdPage } from '@components/home/HomeThirdPage';
import { LanguagesBlock } from '@components/home/LanguagesBlock';
import { StartButton } from '@components/home/StartButton';
import QrCode from '@components/reusables/qrCode/QrCode';
import ScrollArrows from '@components/reusables/scrollArrows/ScrollArrows';
import ScrollDots from '@components/reusables/startButton/ScrollDots';
import style from '@styles/Home.module.scss';
import { useTranslation } from '@utils/useTranslation';
import type { NextPage } from 'next';
import { useEffect, useRef, useState } from 'react';

const Home: NextPage = () => {
  const { t } = useTranslation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [chatAnimationEnded, setChatAnimationEnded] = useState(false);

  const handleChatAnimationEnd = () => {
    setChatAnimationEnded(true);
  };

  const handleChatAnimationReset = () => {
    setChatAnimationEnded(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (wrapperRef.current) {
        const scrollPosition = wrapperRef.current.scrollTop;
        const windowHeight = window.innerHeight;
        const newSection = Math.round(scrollPosition / windowHeight);
        setCurrentSection(newSection);
      }
    };

    const wrapperElement = wrapperRef.current;
    if (wrapperElement) {
      wrapperElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (wrapperElement) {
        wrapperElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const scrollToSection = (index: number) => {
    if (wrapperRef.current) {
      wrapperRef.current.scrollTo({
        top: index * window.innerHeight,
        behavior: 'smooth',
      });
    }
  };
  return (
    <div className={style.wrapper} ref={wrapperRef}>
      <div className={`${style.container} ${style.section}`}>
        <PageHead
          title="indexPageTitle"
          description="META_TAG_INDEX_DESCRIPTION"
          keywords="META_TAG_INDEX_KEYWORDS"
        /> 
        <Header setShowTopScores={() => false} showTopScores={false} page='landing' currentSection={currentSection} isIndexPage={true} />
        <div className={style.content}>
          <div className={style.title}>
            {t('homeTitle1')}
            <span className={style.styledTitle}>{t('homeTitle2')}</span>
            {t('homeTitle3')}
          </div>
          <LanguagesBlock />
          <div className={style.parrot} />
          {/* <QrCode /> */}

      {
        currentSection !== 2 && (
          <StartButton
            currentSection={currentSection}
            startAnimation={chatAnimationEnded} 
          />
        ) 
      }

          <FollowButtons isCustomPage={true} />
          <ScrollArrows numOfArrows={3} currentSection = {currentSection} clickHandler = {scrollToSection}/>
        </div>
      </div>
      <div className={style.section}>
        <HomeSecondPage
          currentSection={currentSection}
          handleChatAnimationEnd={handleChatAnimationEnd}
          handleChatAnimationReset={handleChatAnimationReset}
          clickHandler = {scrollToSection}
        />
      </div>
      <div className={style.section}>
        <HomeThirdPage />
      </div>
      <ScrollDots
        totalSections={3}
        currentSection={currentSection}
        onDotClick={scrollToSection}
      />
    </div>
  );
};

export default Home;
