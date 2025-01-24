import React, { RefObject, useState } from 'react';
import { TaskProgress } from '../TaskProgress';
import style from './InputWrapper.module.scss';
import { MistakesCounter } from '../MistakesCounter';
import DefaultInput from './input/DefaultInput';
import GrammarInput from './grammar/GrammarInput';
import OmittedWordsInput from './omitted/OmittedWordsInput';
import MistakeCorrectionInput from './mistake/MistakeCorrectionInput';
import VoiceHandler from './VoiceHandler';
import VoiceWaveformVisualizer from './VoiceWaveformVisualizer';
import VoiceVisualizer from './VoiceVisualizer';

// Define the interface for the props
interface InputWrapperProps {
  inputRef: RefObject<HTMLTextAreaElement>;
  voiceHandler?: (str: string) => void;
  lastKeyHandler: (str: string) => void;
  wordsHandler: (str: string) => void;
  mistakeCorrectionHandler: (str: string, str2?: string) => void;
  nextHandler: () => void;
  // omittedWordsHandler: (char: string, index: number) => string | null;
  omittedWordsHandler: (data: any, action: 'check' | null) => string | null;
  setIsReadyForNext: (isReady: boolean) => void;
  taskType: string;
  name?: string;
  value?: string;
  taskProgress: string;
  percentage: any;
  errorLimit: any;
  lang: string;
  mistakeCount: number;
  currentTask: any;
  isDone?: boolean;
  totalMistakeCount?: number;
  isReadyForNext?: boolean;
  showModal?: boolean;
  isAudioPlaying: boolean;
  chatRef: React.RefObject<HTMLDivElement>;
  isPaused: boolean;
}

// Define the InputWrapper component
const InputWrapper: React.FC<InputWrapperProps> = ({
  inputRef,
  voiceHandler,
  lastKeyHandler,
  wordsHandler,
  nextHandler,
  omittedWordsHandler,
  mistakeCorrectionHandler,
  taskType,
  name = '',
  value = '',
  taskProgress,
  percentage,
  errorLimit,
  lang,
  mistakeCount,
  currentTask,
  isDone = false,
  totalMistakeCount,
  isReadyForNext,
  setIsReadyForNext,
  showModal,
  isAudioPlaying,
  chatRef,
  isPaused,
}) => {
  let InputComponent = null;

  const [isListening, setIsListening] = useState(false);

  switch (taskType) {
    case 'grammar':
      InputComponent = (
        <GrammarInput
          key={currentTask._id}
          clickHandler={nextHandler}
          isReadyForNext={isReadyForNext}
          progress={isDone ? '100%' : ''}
          setIsReadyForNext={setIsReadyForNext}
          chatRef={chatRef}
          isPaused={isPaused}
        />
      );
      break;

    case 'omittedwords':
      InputComponent = (
        <OmittedWordsInput
          key={currentTask._id}
          words={currentTask.wordsAudio.words.data}
          omitted={currentTask.wordsAudio.words.omitted}
          // onKeyDown={omittedWordsHandler}
          onChange={omittedWordsHandler}
          nextHandler={nextHandler}
          isReadyForNext={isReadyForNext}
          progress={isDone ? '100%' : ''}
          mistakeCount={mistakeCount}
          totalMistakeCount={totalMistakeCount}
          errorLimit={
            currentTask && currentTask.errorLimit ? currentTask.errorLimit : 0
          }
          isPaused={isPaused}
        />
      );
      break;
    case 'mistakecorrection':
      InputComponent = (
        <MistakeCorrectionInput
          key={currentTask._id}
          inputRef={inputRef}
          onChange={mistakeCorrectionHandler}
          name={name}
          value={currentTask.iLearn.errorText}
          totalMistakeCount={totalMistakeCount}
          progress={isDone ? '100%' : ''}
          mistakeCount={mistakeCount}
          errorLimit={
            currentTask && currentTask.errorLimit ? currentTask.errorLimit : 0
          }
          isReadyForNext={isReadyForNext}
          isDone={isDone}
          isPaused={isPaused}
        />
      );
      break;
    default:
      InputComponent = (
        <DefaultInput
          showModal={showModal}
          key={currentTask._id} 
          onKeyDown={lastKeyHandler}
          onChange={() => {
            2 + 2;
          }} // todo : handle ...
          name={name}
          value={value}
          mistakeCount={mistakeCount}
          errorLimit={
            currentTask && currentTask.errorLimit ? currentTask.errorLimit : 0
          }
          progress={isDone ? '100%' : ''}
          totalMistakeCount={totalMistakeCount}
          isReadyForNext={isReadyForNext}
          setIsReadyForNext={setIsReadyForNext}
          isPaused={isPaused}
        />
      );
      break;
  }
 
  return (
    <>
      <TaskProgress taskProgress={taskProgress} />

      {/* {isListening && <VoiceWaveformVisualizer isListening={isListening} />} */}
      {/* <VoiceWaveformVisualizer isListening={true} /> */}
      <div className={style.container}>
        <MistakesCounter
          percentage={percentage}
          errorLimit={taskType === 'grammar' ? 0 : errorLimit}
        />
        <div className={style.inputComponentWrapper}>
          {InputComponent}

          {!['mistakecorrection', 'omittedwords', 'grammar'].includes(
            currentTask.taskType.nameCode
          ) &&
            voiceHandler &&
            !isPaused && (
              <VoiceHandler
                lang={lang}
                voiceHandler={voiceHandler}
                isAudioPlaying={isAudioPlaying}
                setIsListening={setIsListening}
              />
            )}
        </div>
      </div>
    </>
  );
};

export default InputWrapper;
