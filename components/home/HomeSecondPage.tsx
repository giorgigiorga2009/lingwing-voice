import { useTranslation } from '@utils/useTranslation';
import { FC, useEffect, useState } from 'react';
import style from './HomeSecondPage.module.scss';
import QrCode from '@components/reusables/qrCode/QrCode';
import ScrollArrows from '@components/reusables/scrollArrows/ScrollArrows';
import ScrollHandler from '@components/reusables/ScrollHandler';
import { ChatAnimationContainer } from './ChatAnimationContainer';
import { StartButton } from './StartButton';

export const HomeSecondPage: FC<any> = ({
  currentSection,
  handleChatAnimationEnd,
  handleChatAnimationReset,
  clickHandler
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (currentSection !== 1) {
      handleChatAnimationReset();
    }
  }, [currentSection]);

  return (
    <div className={style.secondPageContainer}>
      <div className={style.vector} />
      <div className={style.star1} />
      <div className={style.star2} />
      <div className={style.star3} />
      <div className={style.star4} />
      <div className={style.star5} />
      <div className={style.secondPageContent}> 
        <div className={style.secondPageTitle}>
          {/* {t('secondPageTitle')} */}
        </div>
        <div className={style.secondPageBody}>
          {/* {currentSection === 1 && <ChatAnimationContainer />} */}
          {currentSection === 1 && (
            <ChatAnimationContainer onAnimationEnd={handleChatAnimationEnd} />
          )}
        </div>
      </div>
      <div className={style.parrotRocket} />
      {/* <QrCode isCustomPage={true} /> */}
      {/* <StartButton /> */}
      {/* <StartButton 
        currentSection={currentSection} 
        startAnimation={chatAnimationEnded} 
      /> */}
      <ScrollArrows numOfArrows={3} isCustomPage={true} currentSection={currentSection} clickHandler={clickHandler}/>
      <ScrollHandler />
    </div>
  );
};
