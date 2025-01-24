import React, {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import style from './OmittedWordsInput.module.scss';
import { useAudio } from '@utils/lessons/audioUtils';

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
  onKeyDown: (char: string, index: number) => string | null;
  nextHandler: () => void;
  isReadyForNext?: boolean;
  progress?: string;
  mistakeCount: number;
  totalMistakeCount?: number;
  errorLimit: number;
}

const OmittedWordsInput: React.FC<OmittedWordsInputProps> = ({
  words,
  omitted,
  onKeyDown,
  nextHandler,
  isReadyForNext,
  progress,
  mistakeCount,
  totalMistakeCount,
  errorLimit,
}) => {
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const [isReady, setIsReady] = useState<boolean>(false);
  const [focusedWordIndex, setFocusedWordIndex] = useState<number | null>(null);
  const { PlaySuccess } = useAudio();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [isMistake, setIsMistake] = useState<boolean>(false);

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
      // const timeoutId = setTimeout(() => {
      setIsReady(true);
      // console.log('aq aris jima', progress, isReadyForNext)
      // }, 1000);

      // Clean up the timeout
      // return () => clearTimeout(timeoutId);
    }
  }, [progress, isReadyForNext]);

  // Use useCallback to memorize the delayed function to prevent unnecessary recreations
  const delayedFunction = useCallback(
    (timer: number) => {
      if (timeoutId) clearTimeout(timeoutId);
      const id = setTimeout(() => {
        PlaySuccess();
        setIsReady(true);
      }, timer);
      setTimeoutId(id);
    },
    [timeoutId, PlaySuccess, isReadyForNext]
  );

  // Function to focus an input based on its index
  const focusInput = (index: number) => {
    const input = inputRefs.current[index];
    if (input) {
      input.focus();
      // setFocusedWordIndex(index);
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
    focusInput(omitted.find((item) => !words[item._index].done)?._index ?? 0);
  }, [inputs.length]);

  const changeHandler = (index: number, key: string) => {
    // setFocusedWordIndex(index);

    let goToElement = null;

    if (['ArrowLeft', 'ArrowUp'].includes(key)) {
      goToElement = inputRefs.current
        .slice(0, index)
        .find((element) => element !== undefined);
    }

    if (['ArrowRight', 'ArrowDown'].includes(key)) {
      goToElement = inputRefs.current
        .slice(index + 1)
        .find((element) => element !== undefined);
    }

    if (goToElement) {
      goToElement.focus();
    }

    const res = onKeyDown(key, index);
    if (res) {
      /** თუ  res !== null , მიმდინარე input - ს განვუახლებთ მნიშვნელობას */
      // inputRefs.current[index].value = inputRefs.current[index].value + key

      setInputs((prev: any) => {
        return {
          ...prev,
          [`input-${index}`]: prev[`input-${index}`] + res,
        };
      });

      let checkDone = true;

      /**
       *  თუ ერთი სიტყვა მაინც დარჩა ჩასასმელი
       *  ციკლი checkDone ცვლადს გახდის false.
       */
      omitted.forEach((item: any) => {
        if (!words[item._index].done) {
          checkDone = false;
        }
      });

      /** თუ checkDone === true , ნიშნავს რომ ტასკი დასრულდა გადავდივართ შემდეგზე */
      if (checkDone) {
        // delayedFunction(1000);
        setTimeout(() => {
          setFocusedWordIndex(null);
          setIsReady(false);
          nextHandler();
        }, 1500);
      }
    }
  };

  const selectEndHander = (index: number) => {
    const target = inputRefs.current[index];

    if (target) {
      const position = target.value.length;
      target.setSelectionRange(position, position);
    }
  };
  return (
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
                    name={`input-${item.index}`}
                    value={inputs[`input-${item.index}`]}
                    onChange={() => console.log()}
                    onKeyDown={(e) => changeHandler(item.index, e.key)}
                    tabIndex={item.index}
                    onFocus={() => selectEndHander(item.index)}
                  />
                );
              } else {
                return <span key={item.index}> {item.word} </span>;
              }
            })}
        </div>
      )}
    </div>
  );
};

export default OmittedWordsInput;
