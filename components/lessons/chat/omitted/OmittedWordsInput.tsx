import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import style from './OmittedWordsInput.module.scss';

// Define interfaces for the words and component props
interface Word {
  _index: number;
  index: number;
  word: string;
  omit: boolean;
  done: boolean;
}

interface OmittedWordsInputProps {
  words: Word[];
  omitted: any[]; // You might want to define a proper type for omitted
  // onKeyDown: (char: string, index: number) => string | null;
  onChange: (data: any, action: 'check' | null) => string | null;
  nextHandler: () => void;
  isReadyForNext?: boolean;
  progress?: string;
  mistakeCount: number;
  totalMistakeCount?: number;
  errorLimit: number;
  isPaused: boolean;
}

const OmittedWordsInput: React.FC<OmittedWordsInputProps> = ({
  words,
  omitted,
  // onKeyDown,
  onChange,
  nextHandler,
  isReadyForNext,
  progress,
  mistakeCount,
  totalMistakeCount,
  errorLimit,
  isPaused,
}) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [isReady, setIsReady] = useState<boolean>(false);
  const [focusedWordIndex, setFocusedWordIndex] = useState<number>();
  const [isMistake, setIsMistake] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

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
      setIsReady(true);
    }
  }, [progress, isReadyForNext]);

  // Function to focus an input based on its index
  const focusInput = (index: number) => {
    const input = inputRefs.current[index];

    if (input) {
      input.focus();
    }
  };

  // Initialize the inputs state when the component mounts or when words change
  useEffect(() => {
    const initialInputs: { [key: string]: string } = {};
    words.forEach((item) => {
      if (item.omit) {
        initialInputs[`input-${item.index}`] = '';
      }
    });

    setInputs(initialInputs);
  }, [words]);

  // Effect to auto-focus the first input that isn't completed
  useEffect(() => {
    if (
      inputs &&
      Object.keys(inputs).length > 0 &&
      typeof focusedWordIndex !== 'number'
    ) {
      const key = Object.keys(inputs)[0].split('-')[1]; // from input-1  we will get  1
      focusInput(parseInt(key));
      setFocusedWordIndex(parseInt(key));
    }

    // console.log(omitted.find((item) => !words[item._index].done)?._index ?? 0);
    // focusInput(omitted.find((item) => !words[item._index].done)?._index ?? 0);
  }, [inputs]);

  const changeHandler = (
    action: null | 'check' = null,
    data: any = null,
    index: null | number
  ) => {
    if (index !== null) {
      setFocusedWordIndex(index);
    }

    // console.log(Object.keys(inputs)[0].split);

    if (
      action === 'check' &&
      index === null &&
      typeof focusedWordIndex === 'number'
    ) {
      focusInput(focusedWordIndex);
    }

    const taskState = onChange(data, action);
    if (taskState === 'isDone') {
      setIsDisabled(true);
    }
  };

  // console.log(focusedWordIndex);

  // const changeHandler = (index: number, key: string) => {
  //   // setFocusedWordIndex(index);

  //   // let goToElement = null;

  //   // if (['ArrowLeft', 'ArrowUp'].includes(key)) {
  //   //   goToElement = inputRefs.current
  //   //     .slice(0, index)
  //   //     .find((element) => element !== undefined);
  //   // }

  //   // if (['ArrowRight', 'ArrowDown'].includes(key)) {
  //   //   goToElement = inputRefs.current
  //   //     .slice(index + 1)
  //   //     .find((element) => element !== undefined);
  //   // }

  //   // if (goToElement) {
  //   //   goToElement.focus();
  //   // }

  //   const res = onKeyDown(key, index);
  //   if (res) {
  //     /** თუ  res !== null , მიმდინარე input - ს განვუახლებთ მნიშვნელობას */
  //     // inputRefs.current[index].value = inputRefs.current[index].value + key

  //     setInputs((prev: any) => {
  //       return {
  //         ...prev,
  //         [`input-${index}`]: prev[`input-${index}`] + res,
  //       };
  //     });

  //     let checkDone = true;

  //     /**
  //      *  თუ ერთი სიტყვა მაინც დარჩა ჩასასმელი
  //      *  ციკლი checkDone ცვლადს გახდის false.
  //      */
  //     omitted.forEach((item: any) => {
  //       if (!words[item._index].done) {
  //         checkDone = false;
  //       }
  //     });

  //     /** თუ checkDone === true , ნიშნავს რომ ტასკი დასრულდა ���ადავდივართ შემდეგზე */
  //     if (checkDone) {
  //       // delayedFunction(1000);
  //       setTimeout(() => {
  //         setFocusedWordIndex(null);
  //         setIsReady(false);
  //         nextHandler();
  //       }, 1500);
  //     }
  //   }
  // };

  const selectEndHander = (index: number) => {
    const target = inputRefs.current[index];

    if (target) {
      const position = target.value.length;
      target.setSelectionRange(position, position);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (progress !== '100%') onChange(inputs, 'check');
      }
    };

    // Add event listener for keydown event
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  return (
    <>
      <div className={style.container}>
        {inputs && (
          <div
            className={classNames(
              style.inputContainer,
              isReady
                ? errorLimit >= mistakeCount
                  ? style.isDone
                  : style.fail
                : null,
              isMistake && style.mistake
            )}
          >
            {words &&
              words.map((item: any, index) => {
                if (item.omit) {

                  
                  return (
                    <input
                      autoComplete="off"
                      spellCheck="false"
                      data-gramm="false"
                      ref={(el: any) => (inputRefs.current[index] = el!)}
                      key={item.index}
                      className={style.input}
                      readOnly={isDisabled || isPaused}
                      name={`input-${item.index}`}
                      defaultValue={inputs[`input-${item.index}`]}
                      onInput={(e) => {
                        const target = e.target as HTMLInputElement;

                        if (progress !== '100%') {
                          const newInputs = { ...inputs };
                          newInputs['input-' + item.index] = target.value;

                          changeHandler(null, newInputs, item.index);
                          setInputs(newInputs);
                        }
                      }}
                      // onKeyDown={(e) => changeHandler(item.index, e.key)}
                      tabIndex={item.index}
                      onFocus={() => selectEndHander(item.index)}
                      style={item.length ? { width: `${ (item.length * 0.8) + 0.9  }rem` } : undefined}
                    />
                  );
                } else {
                  return <span key={item.index}> {item.word} </span>;
                }
              })}
          </div>
        )}
        {/* 
      <button
        className={style.checkButton}
        onClick={() =>
          progress !== '100%' ? changeHandler('check', inputs, null) : null
        }
      >
        Check
      </button> */}
      </div>

      <div className={style.checkButtonWrapper}>
        <button
          className={style.checkButton}
          style={{ cursor: isPaused ? 'not-allowed' : 'pointer' }}
          disabled={isPaused}
          onClick={() =>
            progress !== '100%' ? changeHandler('check', inputs, null) : null
          }
        ></button>
      </div>
    </>
  );
};

export default OmittedWordsInput;
