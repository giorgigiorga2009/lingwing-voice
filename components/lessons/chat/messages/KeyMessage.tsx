import React, { useEffect, useState } from 'react';
import styles from './KeyMessage.module.scss';
import { useTranslation } from '@utils/useTranslation';
import { LanguageFrom, LanguageTo } from '@utils/languages';
import { logHandler } from '@utils/lessons/taskUtils';

type KeyMessageProps = {
  messageType: string ;
  text: string;
  showMessage: boolean;
  from?: LanguageFrom;  
  to?: LanguageTo;
};

const KeyMessage: React.FC<KeyMessageProps> = ({ messageType ,   text, showMessage , from  , to}) => {
  const [animate, setAnimate] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (showMessage) {
      setAnimate(true);
    } else {
      timeoutId = setTimeout(() => setAnimate(false), 500); // Match the animation durations
    }

    // Cleanup timeout when component unmounts or effect re-runs
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [showMessage]);

  return animate ? (
    <div
      className={`${styles.textContainer} ${
        showMessage ? styles.fadeIn : styles.fadeOut
      }`}
    >
      {text ? t(text) : ' '}  
      {messageType === 'keyboard'  && to  &&  ` (${to.toUpperCase()})`}

      <div className={styles.arrow}></div>
    </div>
  ) : null;
};

export default KeyMessage;
