import React, { ChangeEvent, RefObject, useEffect, useState } from 'react';
import classNames from 'classnames';
import style from './MistakeCorrectionInput.module.scss';
import { logHandler } from '@utils/lessons/taskUtils';

interface IMistakeCorrectionInputProps {
  inputRef: RefObject<HTMLTextAreaElement>;
  onChange: (key: string, key2?: string) => void;
  name?: string;
  value: string;
  totalMistakeCount?: number;
  progress?: string;
  mistakeCount: number;
  errorLimit: number;
  isReadyForNext?: boolean;
  isDone: boolean;
  isPaused: boolean;  
}

const MistakeCorrectionInput: React.FC<IMistakeCorrectionInputProps> = ({
  inputRef,
  onChange,
  name,
  value,
  totalMistakeCount,
  progress,
  mistakeCount,
  errorLimit,
  isReadyForNext,
  isDone,
  isPaused,
}) => {
  const [isMistake, setIsMistake] = useState<boolean>(false);
  const [showDone, setShowDone] = useState<boolean>(false);

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
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.selectionStart = inputRef.current.selectionEnd =
        value.length;
    }
  }, []); // Empty dependency array for focusing on mount

  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        !isClickedElementInExcludedArea(event.target as HTMLElement)
      ) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleGlobalClick);

    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  const isClickedElementInExcludedArea = (element: HTMLElement): boolean => {
    const excludedAreas = [
      document.querySelector('header'),
      document.querySelector('.some-other-class'), // Add other areas you want to exclude
    ];

    return excludedAreas.some((area) => area && area.contains(element));
  };

  return (
    <>
      <textarea
        ref={inputRef}
        className={classNames(
          style.input,
          showDone
            ? errorLimit >= mistakeCount
              ? style.inputDone
              : style.fail
            : null,
          isMistake && style.mistake
        )}
        autoComplete="off"
        name={name}
        spellCheck="false"
        readOnly={isDone}
        disabled={isDone || isPaused}
        data-gramm="false"
        defaultValue={value}
        placeholder="Correct The Text"
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChange(e.target.value)
        }
      />

      <div className={style.checkButtonWrapper}>
        <button
          className={style.checkButton}
          disabled={isPaused}
          style = {{cursor: isPaused ? 'not-allowed' : 'pointer'}}
          onClick={() =>
            progress !== '100%'
              ? onChange(inputRef?.current?.value || '', 'check')
              : null
          }
        ></button>
      </div>
    </>
  );
};

export default MistakeCorrectionInput;
