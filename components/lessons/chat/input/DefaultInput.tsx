import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import style from './DefaultInput.module.scss';
import { logHandler } from '@utils/lessons/taskUtils';
import { useTranslation } from '@utils/useTranslation';
import { useFocusStore, useRecognitionActive, useUIStore } from '@utils/store';
import { MOBILE_BREAKPOINT } from '@components/home/ChatAnimationContainer';

interface IDefaultInputProps {
  onKeyDown: (key: string) => void;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  setIsReadyForNext: (isReady: boolean) => void;
  name?: string;
  value: string;
  progress?: string;
  mistakeCount: number;
  totalMistakeCount?: number;
  isReadyForNext?: boolean;
  errorLimit: number;
  showModal?: boolean;
  isPaused: boolean;
}

const DefaultInput: React.FC<IDefaultInputProps> = ({
  onKeyDown,
  onChange,
  name,
  value,
  progress,
  mistakeCount,
  totalMistakeCount,
  isReadyForNext,
  setIsReadyForNext,
  errorLimit,
  showModal,
  isPaused,
}) => {
  const [isMistake, setIsMistake] = useState<boolean>(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [showDone, setShowDone] = useState<boolean>(false);
  const [isAndroid, setIsAndroid] = useState<boolean>(false);
  const { t } = useTranslation();
  const { isKeyboardVisible } = useRecognitionActive();
  const { isSideMenuOpen } = useUIStore((state) => ({
    isSideMenuOpen: state.isSideMenuOpen,
  }));
  const { shouldRefocus, setShouldRefocus } = useFocusStore(); 

  useEffect(() => {
    if (totalMistakeCount && totalMistakeCount > 0 && progress !== '100%') {
      setIsMistake(true);

      const timeoutId = setTimeout(() => {
        setIsMistake(false);
      }, 100);

      // Clean up the timeout
      return () => clearTimeout(timeoutId);
    }
  }, [totalMistakeCount]);

  useEffect(() => {
    if (progress === '100%' && isReadyForNext) {
      setShowDone(true);
    }
  }, [progress, isReadyForNext]);

useEffect(() => {
  if (!inputRef.current || showModal || !isKeyboardVisible && !shouldRefocus) return;

  const animationFrame = requestAnimationFrame(() => {
    inputRef.current?.focus();
    if (shouldRefocus) setShouldRefocus(false);
  });

  return () => cancelAnimationFrame(animationFrame);
}, [showModal, isKeyboardVisible, shouldRefocus, setShouldRefocus]);



  
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !showModal &&
        !isSideMenuOpen &&
        (!isMobile ||
          (!isClickedElementInHeader(event.target as HTMLElement) &&
          !isClickedElementInLearnMenu(event.target as HTMLElement)))
        // !isClickedElementInModal(event.target as HTMLElement)
      ) {
        if (isKeyboardVisible) {
          inputRef.current.focus();
        }
      }

    };
    

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, [showModal, isKeyboardVisible, isSideMenuOpen]);


  const isMobile = window.innerWidth < MOBILE_BREAKPOINT;


  useEffect(() => {
    const isAndroidDevice = /Android/i.test(navigator.userAgent);
    setIsAndroid(isAndroidDevice);
  }, []);


  useEffect(() => {
    if (!isKeyboardVisible && inputRef.current) {
      inputRef.current.blur(); 
    }
  }, [isKeyboardVisible]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' || e.key === 'Backspace') {
      onKeyDown(e.key);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const currentValue = e.currentTarget.value;
    if (isAndroid) {
      if (currentValue.length > value.length) {
        // New character added
        const lastChar = currentValue[currentValue.length - 1];
        onKeyDown(lastChar);
      } else if (currentValue.length < value.length) {
        // Character removed (Backspace)
        console.log('Input event (Android): Backspace');
        onKeyDown('Backspace');
      }

      const timeoutId = setTimeout(() => {
        if (inputRef.current) {
          const length = inputRef.current.value.length;
          inputRef.current.setSelectionRange(length, length);
        }
      }, 0);

      // Clean up timeout to prevent memory leaks
      return () => clearTimeout(timeoutId);
    }
  };

  const isClickedElementInHeader = (element: HTMLElement): boolean => {
    if (!isMobile) return false;
    const header = document.querySelector('header'); // Adjust this selector as needed
    return header ? header.contains(element) : false;
  };

  const isClickedElementInLearnMenu = (element: HTMLElement): boolean => {
    if (!isMobile) return false;
    const learnMenu = document.querySelector('.LearnMenu_foldersContainer__UWB6R');
    return learnMenu ? learnMenu.contains(element) : false;
  };

  const isClickedElementInModal = (element: HTMLElement): boolean => {
    const modal = document.querySelector('#modal'); // Adjust this selector as needed
    return modal ? modal.contains(element) : false;
  };

  return (
    <textarea
      className={classNames(
        style.input,
        showDone
          ? errorLimit >= mistakeCount
            ? style.inputDone
            : style.fail
          : null,
        isMistake && style.mistake
      )}
      // className={classNames(
      //   style.input,
      //   style.fail
      // )}
      disabled={isPaused}
      ref={inputRef}
      autoComplete="off"
      autoCorrect="off" 
      autoCapitalize="off" 
      aria-autocomplete="none" 
      inputMode="text" 
      aria-label="input" 
      data-form-type="other" 
      name={name}
      spellCheck="false"
      data-gramm="false"
      value={value}
      placeholder={t(`${'INPUT_PLACEHOLDER'}`)}
      onKeyDown={
        isAndroid
          ? handleKeyDown
          : (e: KeyboardEvent<HTMLTextAreaElement>) => onKeyDown(e.key)
      }
      onInput={isAndroid ? handleInput : () => console.log('')}
      onChange={onChange}
    />
  );
};

export default DefaultInput;