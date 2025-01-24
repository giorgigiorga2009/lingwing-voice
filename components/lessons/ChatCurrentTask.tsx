import { FC } from 'react';
import { Hint } from './Hint';
import { Dialog } from './Dialog';
import { Grammar } from './Grammar';
import { TaskData } from '@utils/lessons/getTask';
import style from './ChatCurrentTask.module.scss';
import { TranslateBubble } from './chatBubbles/TranslateBubble';

import { logHandler } from '@utils/lessons/taskUtils';
import { useTranslation } from '@utils/useTranslation';

interface Props {
  currentTask: TaskData;
  currentMessageIndex: number;
  onDivHeight: (height: number) => void;
  mistakesByLevel: number[];
  isDone?: boolean;
  isReadyForNext?: boolean;
  fetchType?: 'default' | 'ordinalNumber' | 'taskType';
  languageFrom?: any;
  Play: (audioUrl: string) => void;
}

let isDesktopSize = false;

if (typeof window !== 'undefined') {
  isDesktopSize = window.innerWidth >= 1023;
}

const ChatCurrentTask: FC<Props> = ({
  currentTask,
  currentMessageIndex,
  onDivHeight,
  mistakesByLevel,
  isDone,
  isReadyForNext,
  fetchType,
  languageFrom,
  Play,
}) => {
  let dialogArrayTo = [];
  let dialogArrayFrom = [];
  let dialogArrayAudio = [];
  const { t } = useTranslation();
  // let isHistory = false;

  if (currentTask.taskType === 'dialog') {
    const original =
      fetchType === 'taskType'
        ? currentTask?.obj?.wordsAudio?.dialog?.original[0].original
        : currentTask?.obj?.wordsAudio?.dialog?.original;
    const translation = currentTask?.obj?.wordsAudio?.dialog?.translation;

    dialogArrayTo = original.map((item: any) => item.sentence[0] || '');
    dialogArrayFrom = translation.map((item: any) => item.sentence?.text || '');
    dialogArrayAudio = translation.map((item: any) =>
      item.sentence?.filePath && item.sentence?.audioFileName
        ? item.sentence?.filePath + '/' + item.sentence?.audioFileName
        : null
    );
  }

  //   const ob = {
  //     ben: "অনুপস্থিত শব্দগুলো পূরণ করুন",
  //     chi: "填写省略的单词",
  //     eng: "Fill omitted words",
  //     esp: "Escribe la palabra omitido",
  //     geo: "შეავსეთ გამოტოვებული სიტყვები",
  //     rus: "Заполните пропущенные слова",
  //     tur: "Altanan kelimeleri doldurun",
  //     ukr: "Заповніть пропущені слова",
  //   }

  // currentTask.mobileTaskDescription = ob;
  let mobileTaskDescription = '';

  if (currentTask && currentTask.mobileTaskDescription) {
    if (typeof currentTask.mobileTaskDescription === 'object') {
      mobileTaskDescription =
        currentTask.mobileTaskDescription[languageFrom || 'eng'];
    } else if (typeof currentTask.mobileTaskDescription === 'string') {
      mobileTaskDescription = currentTask.mobileTaskDescription;
    }
  }

  return (
    <>
      {currentTask.taskType !== 'grammar' && currentTask.taskType !== 'dialog' && (
        <div className={style.currentTask}>
          {/* <div className={style.header}>
            {isDesktopSize
              ? currentTask.taskDescription
              : currentTask.mobileTaskDescription}
          </div> */}

          <div className={style.header}>
            {isDesktopSize 
              ? currentTask.taskDescription
              : mobileTaskDescription}
          </div>

          <div className={style.arrowDown}></div>
          <div className={style.bubbleContainer}>
            {(currentTask.taskType === 'translate' ||
              currentTask.taskType === 'omittedwords') && (
              <TranslateBubble
                utteranceType="taskDescription"
                textType={currentTask.taskType}
                isCurrentTask={true}
                taskText={currentTask.taskText}
                correctText={currentTask.correctText as string}
                mistakesByLevel={mistakesByLevel}
                isReadyForNext={isReadyForNext}
              />
            )}
            {currentTask.taskType === 'dictation' && (
              <TranslateBubble
                sentenceAudioPath={currentTask.sentenceAudioPath}
                utteranceType="taskDescription"
                textType={currentTask.taskType}
                isCurrentTask={true}
                taskText={currentTask.taskText}
                correctText={currentTask.correctText as string}
                mistakesByLevel={mistakesByLevel}
                isDone={isDone}
                isReadyForNext={isReadyForNext}
              />
            )}
            {currentTask.taskType === 'mistakecorrection' && (
              <TranslateBubble
                utteranceType="taskDescription"
                textType={currentTask.taskType}
                isCurrentTask={true}
                taskText={currentTask.mistakeTaskText}
                correctText={currentTask.correctText as string}
                mistakesByLevel={mistakesByLevel}
                isReadyForNext={isReadyForNext}
              />
            )}
            {currentTask.taskType === 'replay' && (
              <TranslateBubble
                utteranceType="taskDescription"
                textType={currentTask.taskType}
                isCurrentTask={true}
                taskText={currentTask.taskText}
                correctText={currentTask.correctText as string}
                mistakesByLevel={mistakesByLevel}
                isReadyForNext={isReadyForNext}
              />
            )}

            <Hint taskType={currentTask.taskType} data={currentTask}  Play = {Play}/>
          </div>
        </div>
      )}

      {currentTask.taskType === 'grammar' && (
        <div className={style.currentTask}>
          <Grammar
            onDivHeight={onDivHeight}
            taskText={currentTask.taskText}
            mistakesByLevel={mistakesByLevel}
          />
        </div>
      )}

      {currentTask.taskType === 'dialog' && (
        <div className={style.currentTask}>
          <Dialog
            isHistory={false}
            currentTask={currentTask}
            currentMessageIndex={currentMessageIndex}
            dialogArrayTo={dialogArrayTo as string[]}
            dialogArrayFrom={dialogArrayFrom as string[]}
            dialogArrayAudio={dialogArrayAudio as string[]}
            mistakesByLevel={mistakesByLevel}
            Play = {Play}
          />
        </div>
      )}
      {/* <div className={style.prompts}>{transcript}</div> */}
    </>
  );
};

export default ChatCurrentTask;
