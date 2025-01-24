import {
  replayInputCheck,
  getRecognitionText,
  textCheck,
  CommonProps,
  handleChange,
  updateCompletedTasks,
  handleOnKeyDown,
} from '@utils/lessons/taskInputUtils';
import { TaskProgress } from './TaskProgress';
import { DictationInput } from './DictationInput';
import { saveTask } from '@utils/lessons/saveTask';
import { MistakesCounter } from './MistakesCounter';
import { useAudio } from '@utils/lessons/audioUtils';
import style from './TaskInputContainer.module.scss';
import { VoiceRecognition } from './VoiceRecognition';
import { useState, useEffect, FC, useRef } from 'react';
import { useVoiceRecognition, getVoiceRecognition } from '@utils/store';

interface TaskInputProps {
  commonProps: CommonProps;
  taskType: string;
}

export const TaskInputContainer: FC<TaskInputProps> = ({
  taskType,
  commonProps,
}) => {
  const [outputText, setOutputText] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [isMistake, setIsMistake] = useState(false);
  const [forgivenErrorQuantity, setForgivenErrorQuantity] = useState(0);
  const [taskProgress, setTaskProgress] = useState('0%');
  const [currWordIndex, setCurrWordIndex] = useState(0);
  // const { transcript } = useVoiceRecognition(getVoiceRecognition);
  // const { audioIndex, setAudios, wordAudioPlay, Play } = useAudio();

  const onlyLetters = /[^\p{L}\p{M}?"]/gu;
  const currTask = commonProps.currentTask;
  const errorLimit = commonProps.currentTask.errorLimit;
  const wordsSynonyms = currTask.wordsSynonyms;
  const correctText = currTask.correctText as string;
  const writtenWordsArray = outputText.trim().split(' ');
  const outputArray = writtenWordsArray.filter((item) => item !== '-');
  const wordsArray = currTask.wordsArray.filter(
    (item) => item.wordText !== '-'
  );
  const currentWord = wordsArray[currWordIndex];

  useEffect(() => {
    if (mistakesCount !== 0 && forgivenErrorQuantity !== 0) {
      const audio = new Audio('https://cdn.lingwing.com/assets/both/sounds/true.mp3');
      audio.play();
    }
    setTimeout(() => {
      setIsMistake(false);
    }, 700);
  }, [forgivenErrorQuantity, mistakesCount]);

  // useEffect(() => {
  //   if (transcript === '') {
  //     wordAudioPlay(currWordIndex);
  //   }
  // }, [currWordIndex]);

  // useEffect(() => {
  //   if (!currentWord) return;

  //   const writtenWord = outputArray[currWordIndex]?.replace(onlyLetters, '');
  //   const currWord = currentWord.wordText.replace(onlyLetters, '');

  //   if (currWord.trim().toLowerCase() === writtenWord?.trim().toLowerCase()) {
  //     // addAudio(`${currentWord?.wordAudioPath}`);
  //     setCurrWordIndex(currWordIndex + 1);
  //     setTaskProgress((outputArray.length / wordsArray.length) * 100 + '%');
  //   }
  // }, [outputText, audioIndex]);

  const params = {
    currWordIndex,
    outputText,
    correctText,
    wordsSynonyms,
    // transcript,
    textFromKeyboard: inputRef.current?.value || '',
    currentWord: currentWord?.wordText,
    setMistakesCount,
    setForgivenErrorQuantity,
    setIsMistake,
  };

  // only for voiceRecognition
  // useEffect(() => {
  //   if (transcript === '') return;

  //   setOutputText(getRecognitionText({ ...params }));
  // }, [transcript]);

  const resetTaskState = () => {
    // setAudios([]);
    setOutputText('');
    setMistakesCount(0);
    setCurrWordIndex(0);
    setTaskProgress('0%');
  };

  useEffect(() => {
    // console.log('useeff')
    if (!commonProps.Token && !commonProps.userId) return;
    if (outputText.trim() === correctText.trim()) {
      // setTimeout(() => {
      //   Play(`${commonProps.currentTask.sentenceAudioPath}`)
      // }, 1000) 

      setTimeout(async () => {
        const audio = new Audio('https://cdn.lingwing.com/assets/both/sounds/true.mp3');
        audio.play();

        const isMistake = errorLimit - mistakesCount < 0 ? 1 : 0;
        const isSaved = await saveTask({
          ...commonProps,
          totalMistakes: mistakesCount,
          forgivenErrorQuantity: forgivenErrorQuantity,
          error: isMistake,
        });

        if (isSaved) {
          resetTaskState();
          updateCompletedTasks(commonProps, isMistake);
        }
      }, 2500);
    }
  }, [taskProgress]);

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (outputText.trim() === correctText.trim()) return;

    const inputText = handleChange(
      event,
      commonProps.languageTo as 'geo' | 'eng' | 'rus'
    );

    taskType === 'dictation' || taskType === 'translate'
      ? setOutputText(textCheck({ inputText, ...params }))
      : setOutputText(replayInputCheck({ inputText, ...params }));
  };

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
