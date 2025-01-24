import {
  getRecognitionText,
  replayInputCheck,
  CommonProps,
  handleChange,
  updateCompletedTasks,
  handleOnKeyDown,
} from '@utils/lessons/taskInputUtils';
import { Hint } from './Hint';
import dynamic from 'next/dynamic';
import style from './Dialog.module.scss';
import { TaskProgress } from './TaskProgress';
import { DialogMessage } from './DialogMessage';
import { DictationInput } from './DictationInput';
import { TaskData } from '@utils/lessons/getTask';
import { saveTask } from '@utils/lessons/saveTask';
import { MistakesCounter } from './MistakesCounter';
import { VoiceRecognition } from './VoiceRecognition';
import { useTranslation } from '@utils/useTranslation';
import { FC, useEffect, useRef, useState } from 'react';
import { LevelsBubble } from './chatBubbles/LevelsBubble';
import { useVoiceRecognition, getVoiceRecognition } from '@utils/store';

const WaveSurferNext = dynamic(() => import('./WaveSurferNext'), {
  ssr: false,
});

interface DialogProps {
  currentMessageIndex?: number;
  currentTask?: TaskData;
  dialogArrayTo: any;
  dialogArrayFrom: any;
  isHistory: boolean;
  mistakesByLevel: number[];
  dialogArrayAudio?: any;
  Play?: (audioUrl: string) => void;
}

export const Dialog: FC<DialogProps> = ({
  currentMessageIndex = 0,
  currentTask,
  dialogArrayTo,
  dialogArrayFrom,
  isHistory,
  mistakesByLevel,
  dialogArrayAudio,
  Play
}) => {
  const { t } = useTranslation();

  const audioUrl = `${
    process.env.NEXT_PUBLIC_AUDIO_URL || process.env.AUDIO_URL
  }${dialogArrayAudio[currentMessageIndex]}.mp3`;

  const scrollbarsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollbarsRef && scrollbarsRef.current) {
      scrollbarsRef.current.scrollTop = scrollbarsRef.current?.scrollHeight;
    }
  }, [currentMessageIndex]);

  return (
    <div className={style.wrapper}>
      <LevelsBubble
        mistakesByLevel={mistakesByLevel}
        taskType="grammarOrDialog"
      />
      <div className={style.title}>{t('DIALOG_TITLE')}</div>
      <div className={style.dialog} ref={scrollbarsRef}>
        <span className={style.description}>
          {t('DIALOG_TYPE_FIRST_LETTERS')
            .split(' ')
            .map((word, index) => (
              <span key={word + index}>{word + ' '}</span>
            ))}
        </span>
        {currentMessageIndex >= 0 &&
          !isHistory &&
          dialogArrayTo
            .slice(0, currentMessageIndex)
            .map((message: string, index: number) => (
              <DialogMessage
                key={index}
                message={message}
                translation={dialogArrayFrom[index]}
                index={index}
                totalCount={dialogArrayTo.length}
              />
            ))}
        {/* {dialogArrayTo} */}

        {!isHistory && ( 
          <div className={style.bubbleContainer}>
            <div className={style.currentTask}>
              <WaveSurferNext audioURL={audioUrl} />
            </div>
            <Hint  Play={Play}/>
            {/* <Hint taskType={currentTask.taskType} data={currentTask} /> */}
          </div>
        )}

        {isHistory &&
          dialogArrayTo &&
          dialogArrayTo.map((message: any, index: number) => (
            <DialogMessage
              key={index}
              message={message}
              translation={dialogArrayFrom[index]}
              index={index}
              totalCount={dialogArrayTo.length}
            />
          ))}
      </div>
    </div>
  );
};

interface DialogInputProps {
  commonProps: CommonProps;
  setCurrentMessageIndex: (index: number) => void;
  currentMessageIndex: number;
}

export const DialogInput: FC<DialogInputProps> = ({
  setCurrentMessageIndex,
  currentMessageIndex,
  commonProps,
}) => {
  const [outputText, setOutputText] = useState('');
  const [mistakesCount, setMistakesCount] = useState(0);
  const [taskProgress, setTaskProgress] = useState('50%');
  const [forgivenErrorQuantity, setForgivenErrorQuantity] = useState(0);
  const [isMistake, setIsMistake] = useState(false);

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const errorLimit = commonProps.currentTask.errorLimit;
  const dialogArray = commonProps.currentTask.correctText as string[];
  const wordsSynonyms = commonProps.currentTask.wordsSynonyms;
  const { transcript } = useVoiceRecognition(getVoiceRecognition);

  const wordsArray =
    commonProps.currentTask.correctText[currentMessageIndex]
      .split(' ')
      .filter((item) => item !== '-') || [];
  const inputLength = outputText ? outputText.trim().split(' ').length : 0;

  const currentWordText = wordsArray[inputLength] || '';

  const params = {
    currWordIndex: inputLength,
    outputText,
    correctText: dialogArray[currentMessageIndex],
    textFromKeyboard: inputRef.current?.value ?? '',
    wordsSynonyms,
    transcript,
    currentWord: currentWordText,
    setMistakesCount,
    setForgivenErrorQuantity,
    setIsMistake,
  };
  // only for voiceRecognition
  useEffect(() => {
    if (transcript === '') return;
    setOutputText(getRecognitionText({ ...params }));
  }, [transcript]);

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (outputText.trim() === dialogArray[currentMessageIndex]) return;
    const inputText = handleChange(
      event,
      commonProps.languageTo as 'geo' | 'eng' | 'rus'
    );
    setOutputText(replayInputCheck({ inputText, ...params }));
  };

  useEffect(() => {
    if (!commonProps.Token && !commonProps.userId) return;
    // If the output text matches the correct text, save the task and move on to the next one
    if (outputText.trim() === dialogArray[currentMessageIndex]) {
      setTaskProgress(
        ((currentMessageIndex + 1) / dialogArray.length) * 100 + '%'
      );
      const timeoutId = setTimeout(async () => {
        if (currentMessageIndex === dialogArray.length - 1) {
          setCurrentMessageIndex(0);
          const isMistake = errorLimit - mistakesCount < 0 ? 1 : 0;

          const isSaved = await saveTask({
            ...commonProps,
            totalMistakes: mistakesCount,
            forgivenErrorQuantity: forgivenErrorQuantity,
            error: isMistake,
          });

          if (isSaved) {
            updateCompletedTasks(commonProps, isMistake);
            setMistakesCount(0);
          }
        } else {
          setCurrentMessageIndex(currentMessageIndex + 1);
        }
        setOutputText('');
      }, 1500);

      return () => clearTimeout(timeoutId);
    }
  }, [outputText]);

  return (
    <>
      <TaskProgress taskProgress={taskProgress} />
      <div className={style.container}>
        <MistakesCounter
          percentage={(1 - mistakesCount / errorLimit) * 100}
          errorLimit={Math.max(errorLimit - mistakesCount, 0)}
        />
        <DictationInput
          inputRef={inputRef}
          outputText={outputText}
          onKeyDown={(event: React.KeyboardEvent) =>
            handleOnKeyDown(event, inputRef)
          }
          onChange={handleTextareaChange}
          taskDone={taskProgress}
          mistake={isMistake}
        /> 
        {/* <VoiceRecognition progress={taskProgress} /> */}
      </div>
    </>
  );
};
