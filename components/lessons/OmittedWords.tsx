import {
  textCheck,
  handleChange,
  CommonProps,
  updateCompletedTasks,
  handleOnKeyDown,
  getRecognitionText,
} from '@utils/lessons/taskInputUtils';
import { TaskProgress } from './TaskProgress';
import style from './OmittedWords.module.scss';
import { saveTask } from '@utils/lessons/saveTask';
import { MistakesCounter } from './MistakesCounter';
import { VoiceRecognition } from './VoiceRecognition';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useVoiceRecognition, getVoiceRecognition } from '@utils/store';

interface Props {
  commonProps: CommonProps;
}

export const OmittedWords: FC<Props> = ({ commonProps }) => {
  // const [words, setWords] = useState<string[]>([])
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [taskProgress, setTaskProgress] = useState('0%');
  const [forgivenErrorQuantity, setForgivenErrorQuantity] = useState(0);
  const [outputText, setOutputText] = useState('');
  const [isMistake, setIsMistake] = useState(false);
  const { transcript } = useVoiceRecognition(getVoiceRecognition);

  const errorLimit = commonProps.currentTask.errorLimit;
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const currTask = commonProps.currentTask.correctText as string;
  const wordsArray = currTask.match(/(\[.*?\])|(\S+)/g) ?? [];
  const inputsCount = wordsArray.filter((item) => /^\[.*\]$/.test(item)).length;
  const firstWordIndex = wordsArray.findIndex((word) => word.startsWith('['));
  const missingWord = wordsArray[firstWordIndex].slice(1, -1);

  const params = {
    currWordIndex: 0,
    outputText,
    correctText: missingWord,
    wordsSynonyms: commonProps.currentTask.wordsSynonyms,
    transcript: '',
    textFromKeyboard: inputRefs.current[firstWordIndex]?.value || '',
    currentWord: missingWord,
    setMistakesCount,
    setForgivenErrorQuantity,
    setIsMistake,
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (correctWords.length === inputsCount) return;
    const inputText = handleChange(
      event,
      commonProps.languageTo as 'geo' | 'eng' | 'rus'
    );
    const missingWord = wordsArray[index].slice(1, -1);
    //const newWords = [...words]

    const newText = textCheck({ inputText, ...params });
    setOutputText(newText);
    const isTextValid = newText.toLowerCase() === missingWord.toLowerCase();

    if (isTextValid) {
      // newWords[index] = missingWord
      // setWords(newWords)
      setTaskProgress(correctWords.length / wordsArray.length + '%');

      const nextInputRef = inputRefs.current
        .slice(index + 1)
        .find((element) => element !== undefined);

      setCorrectWords((prevWords) => [...prevWords, missingWord]);
      nextInputRef && nextInputRef.focus();
    }
  };

  useEffect(() => {
    if (!commonProps.Token && !commonProps.userId) return;

    if (correctWords.length === inputsCount) {
      const isMistake = errorLimit - mistakesCount < 0 ? 1 : 0;
      setTimeout(async () => {
        const isSaved = await saveTask({
          ...commonProps,
          totalMistakes: mistakesCount,
          forgivenErrorQuantity: forgivenErrorQuantity,
          error: isMistake,
        });

        isSaved && updateCompletedTasks(commonProps, isMistake);
      }, 1500);
    }
  }, [correctWords, outputText]);

  useEffect(() => {
    inputRefs.current.find((element) => element !== undefined)?.focus();
  }, []);

  useEffect(() => {
    if (transcript === '') return;
    setOutputText(getRecognitionText({ ...params }));
    setCorrectWords((prevWords) => [...prevWords, missingWord]);
  }, [transcript]);

  return (
    <>
      <TaskProgress taskProgress={taskProgress} />
      <div className={style.container}>
        <MistakesCounter
          percentage={(1 - mistakesCount / errorLimit) * 100}
          errorLimit={Math.max(errorLimit - mistakesCount, 0)}
        />
        <div className={style.inputContainer}>
          {wordsArray.map((word, index) => {
            if (word.startsWith('[')) {
              //const currentValue = words[index]
              return (
                <input
                  className={style.input}
                  key={index}
                  value={outputText}
                  onChange={(event) => handleInputChange(event, index)}
                  onKeyDown={(event: React.KeyboardEvent) =>
                    handleOnKeyDown(event, inputRefs)
                  }
                  ref={(el: any) => (inputRefs.current[index] = el!)}
                />
              );
            } else {
              return <span key={index}>{word} </span>;
            } 
          })}
        </div>

        {/* <VoiceRecognition progress={taskProgress} /> */}
      </div>
    </>
  );
};
