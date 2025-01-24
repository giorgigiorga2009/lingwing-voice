import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import style from './GrammarInput.module.scss';
import { useTranslation } from '@utils/useTranslation';
import classNames from 'classnames';

let isDesktopSize = false;
  
  if (typeof window !== 'undefined') {
    isDesktopSize = window.innerWidth >= 1023;
  }
interface IGrammarInputProps {
  clickHandler: () => void;
  isReadyForNext?: boolean;
  progress: string;
  setIsReadyForNext: (isReady: boolean) => void;
  chatRef: React.RefObject<HTMLDivElement>;
  isPaused: boolean;
}

const GrammarInput: React.FC<IGrammarInputProps> = ({
  clickHandler,
  isReadyForNext,
  progress,
  setIsReadyForNext,
  chatRef,
  isPaused,
}) => {
  const { t } = useTranslation();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [showDone, setShowDone] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState(false);


  const checkScroll = useCallback(() => {
    if (chatRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
      const isScrolledToBottom = scrollHeight - scrollTop <= clientHeight + 30; // Add small tolerance

      setIsDisabled(!isScrolledToBottom);
    }
  }, [chatRef]);

  useEffect(() => {
    // const checkScroll = () => {
    //   if (chatRef.current) {
    //     const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
    //     const isScrolledToBottom = scrollHeight - scrollTop <= clientHeight + 25;

    //     logHandler(`
    //       scrollTop: ${scrollTop}
    //       scrollHeight: ${scrollHeight}
    //       clientHeight: ${clientHeight}
    //       isScrolledToBottom: ${isScrolledToBottom}

    //       ${scrollHeight  - scrollTop} <=  ${clientHeight}
    //       `)
    //     if (isScrolledToBottom) {
    //       setIsDisabled(false);
    //     } else {
    //       setIsDisabled(true);
    //     }
    //   }



    // };

    // Initial check
    checkScroll();

    const scrollElement = chatRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScroll);
      }
    };
  }, [chatRef]);

  useEffect(() => { 
    if (progress === '100%' && isReadyForNext) {
      setShowDone(true);
    }
  }, [progress, isReadyForNext]);

  // useEffect(() => {
  //   if (btnRef.current) {
  //     btnRef.current.focus();

  //     alert('focus')
  //   }
  // }, []); // Empty dependency array for focusing on mount
  useEffect(() => {
    if (btnRef.current ) {
      btnRef.current.focus();
    }
  }, []); // Empty dependency array for focusing on mount


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !isLoading && !isDisabled && !isPaused && isDesktopSize) {
        e.preventDefault();
        setIsLoading(true)
        clickHandler();
        // btnRef.current?.focus();
      }
    };
  
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLoading , isDisabled, isPaused, isDesktopSize]);


  // useEffect(() => {
  //   const handleGlobalClick = (event: MouseEvent) => {
  //     if (btnRef.current && !btnRef.current.contains(event.target as Node)) {
  //       btnRef.current.focus();
  //       alert('should be focused')
  //     }



  //   };

  //   document.addEventListener('click', handleGlobalClick);

  //   return () => {
  //     document.removeEventListener('click', handleGlobalClick);
  //   };
  // }, []);

  return (
    <div className={style.container}>
      <button
        disabled={isDisabled || isPaused}
        ref={btnRef}
        // onKeyDown={(e) => {
        //   if (e.key === 'Enter' && e.target === btnRef.current) {
        //     // Trigger action when  Enter is pressed

        //     clickHandler();
        //   }
        // }}
        onClick={(e) => {
          if (e.nativeEvent.detail === 0 && e.target === btnRef.current) {
            // This means it's a spacebar click, prevent submission
            e.preventDefault();
          } else {
            clickHandler();
          }
        }}
        // className={classNames(style.button, showDone && style.inputDone)}

        className={classNames(
          style.button,
          (isDisabled || isPaused) && style.buttonDisabled,
          !isDisabled && showDone && style.inputDone 
        )}
        style={{ cursor: isPaused ? 'not-allowed' : 'pointer' }}
      >
        {isDesktopSize ? t('LESSONS_NEXT_ENTER') : t('LESSONS_NEXT_MOBILE')}
      </button>
    </div>
  );
};

export default GrammarInput;
