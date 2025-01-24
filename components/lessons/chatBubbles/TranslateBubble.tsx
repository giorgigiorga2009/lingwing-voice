import { FC } from 'react';
import dynamic from 'next/dynamic';
import classNames from 'classnames';
import { LevelsBubble } from './LevelsBubble';
import UserAvatar from '../../shared/UserAvatar';
import style from './TranslateBubble.module.scss';
import { useTaskStore } from '@utils/store';

interface Props {
  utteranceType: 'taskDescription' | 'answer';
  taskText: string;
  correctText: string;
  isCurrentTask: boolean;
  sentenceAudioPath?: string;
  answers?: number[];
  mistakesByLevel: number[];
  isDone?: boolean;
  textType:
    | 'dictation'
    | 'translate'
    | 'dialog'
    | 'omittedwords'
    | 'replay'
    | 'mistakecorrection'
    | 'grammar'
    | 'welcome';
  isReadyForNext?: boolean;
  isWelcome?: boolean;
}

const WaveSurferNext = dynamic(() => import('../WaveSurferNext'), {
  ssr: false,
});

let isDesktopSize = false;
  
  if (typeof window !== 'undefined') {
    isDesktopSize = window.innerWidth >= 1023;
  }



export const TranslateBubble: FC<Props> = ({
  taskText,
  correctText,
  utteranceType,
  isCurrentTask,
  sentenceAudioPath,
  textType,
  isWelcome,
  mistakesByLevel,
  isDone = false,
  isReadyForNext,
}) => {
  const {
    SetHintShow,
    SetHintText,
    HintText,
    HintShown,
    SetHintAudioURL,
    SetAudioPlayCases,
    MistakeCount,
    SetMistakeCount
  } = useTaskStore((state) => state);

  if (typeof taskText === 'string') {
    taskText = taskText
      .replaceAll('(FR)', '🤗')
      .replaceAll('(SH)', '✂️')
      .replaceAll('(F)', '👧')
      .replaceAll('(M)', '👦')
      .replaceAll('(M/F)', '👦👧')
      .replaceAll(/\((.*?)\)/g, '<span>($1)</span>');
  } else {
    console.error('taskText is not a string:', taskText);
  }

  const audioUrl = `${
    process.env.NEXT_PUBLIC_AUDIO_URL || process.env.AUDIO_URL
  }${sentenceAudioPath}.mp3`;

  const clickHandler = () => {
    if(HintShown || !['replay', 'translate'].includes(textType) || isDesktopSize || !isCurrentTask)  return;
    SetMistakeCount(MistakeCount + 1);
    SetHintShow(true);
  };

  return (
    <div
      className={classNames(
        style.container,
        style[utteranceType],
        style[textType],
        style[`${isCurrentTask}`]
      )}
    >
      <div
        className={style.content}
        style={{ width: isCurrentTask ? '100%' : 'auto' }}
      >
        {/* <div className={style.avatar}>
          <UserAvatar />
        </div> */}

        <span className={style.correctText}>{correctText}</span>
        <div
          className={
            textType !== 'welcome' || !isWelcome ? style[textType + 'Icon'] : ''
          }
        />
        {textType !== 'replay' ? (
          <>
            {isCurrentTask && textType === 'dictation' ? (
              <>
                {!isDone ? (
                  <span className={style.waveform}>
                    <WaveSurferNext audioURL={audioUrl} />
                  </span>
                ) : (
                  <span
                    className={style.taskText}
                    dangerouslySetInnerHTML={{ __html: taskText }}
                  ></span>
                )}
              </>
            ) : (
              <span
                className={style.taskText}
                dangerouslySetInnerHTML={{ __html: taskText }}
                style={{
                  cursor: ['translate'].includes(textType) && !isDesktopSize ? 'pointer' : 'default',
                }}
                onClick={clickHandler} 
              ></span>
            )}
          </>
        ) : (
          <span className={style.taskText}>
            {taskText && taskText.split(' ').map((word, index) => (
              // <span key={word + '-' + index}>{word + ' '}</span>
              <span
                key={word + '-' + index}
                dangerouslySetInnerHTML={{ __html: word + ' ' }}
                style={{
                  cursor: ['replay'].includes(textType) && !isDesktopSize ? 'pointer' : 'default',
                }}
                onClick={clickHandler} 
              />
            ))}
          </span>
        )}

        {utteranceType === 'taskDescription' && (
          <LevelsBubble
            isCurrentTask={isCurrentTask}
            mistakesByLevel={mistakesByLevel || []}
          />
        )}
      </div>
    </div>
  );
};
