import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  FC,
  useEffect,
  useRef,
} from 'react';
import {
  CommonProps,
  handleChange,
  updateCompletedTasks,
} from '@utils/lessons/taskInputUtils';
import classNames from 'classnames';
import { useTaskStore } from '@utils/store';
import { saveTask } from '@utils/lessons/saveTask';
import style from './MistakeCorrection.module.scss';
import { MistakesCounter } from './MistakesCounter';

interface Props {
  commonProps: CommonProps;
}

export const MistakeCorrectionTask: FC<Props> = ({ commonProps }) => {
  const setHintShow = useTaskStore((state) => state.SetHintShow);
  const setHintText = useTaskStore((state) => state.SetHintText);

  const mistakeText = commonProps.currentTask.errorText;
  const errorLimit = commonProps.currentTask.errorLimit;
  const correctText = commonProps.currentTask.correctText as string;

  const [inputText, setInputText] = useState(mistakeText);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [mistakeRepeat, setMistakeRepeat] = useState(false);
  const [isTaskDone, setIsTaskDone] = useState(false);

  const inputRef = useRef(null);

  const saveCurrentTask = async () => {
    try {
      await saveTask({
        ...commonProps,
        totalMistakes: mistakesCount,
        forgivenErrorQuantity: 0,
        error: errorLimit - mistakesCount < 0 ? 1 : 0,
      });
      return true;
    } catch (error) {
      console.error('Error saving task:', error);
      return false;
    }
  };

  useEffect(() => {
    if (!commonProps.Token && !commonProps.userId) return;

    if (
      inputText.replace(/\s+/g, ' ').trim().toLowerCase() ===
      correctText.trim().toLowerCase()
    ) {
      setIsTaskDone(true);
      const audio = new Audio('https://cdn.lingwing.com/assets/both/sounds/true.mp3');
      audio.play();
      setInputText(inputText.replace(/\s+/g, ' '));
      setTimeout(async () => {
        const isSaved = await saveCurrentTask();

        const isMistake = errorLimit - mistakesCount < 0 ? 1 : 0;

        if (isSaved) {
          setHintShow(false);
          updateCompletedTasks(commonProps, isMistake);
        }
      }, 1500);
    }
  }, [inputText]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (inputText === correctText) return;

    setInputText(
      handleChange(event, commonProps.languageTo as 'geo' | 'eng' | 'rus')
    ); //ეს შეიცვალა და დასატესტია

    setHintShow(false);
    setMistakeRepeat(false);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      checkAnswer();
    }
  };

  const checkAnswer = async () => {
    if (inputText === correctText) {
      setIsTaskDone(true);
      setMistakeRepeat(false);
      if (!commonProps.Token && !commonProps.userId) return;
      const isSaved = await saveCurrentTask();
      if (isSaved) {
        const isMistake = errorLimit - mistakesCount < 0 ? 1 : 0;

        setInputText('');
        updateCompletedTasks(commonProps, isMistake);
      }
    } else if (!mistakeRepeat) {
      setMistakesCount((prev) => prev + 1);
      setMistakeRepeat(true);
      setHintShow(true);
      setHintText(correctText);
    }
  };

  return (
    <div className={style.container}>
      <MistakesCounter
        percentage={(1 - mistakesCount / errorLimit) * 100}
        errorLimit={Math.max(errorLimit - mistakesCount, 0)}
      />{' '}
      <textarea
        ref={inputRef}
        className={classNames(style.input, isTaskDone && style.inputDone)}
        value={inputText}
        autoComplete="off"
        spellCheck="false"
        data-gramm="false"
        onChange={handleInputChange}
        onKeyDown={handleKeyPress}
      />
      <button
        className={style.checkButton}
        onClick={checkAnswer}
      >
        Check
      </button>
    </div>
  );
};
