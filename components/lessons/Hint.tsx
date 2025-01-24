import { FC, useEffect } from 'react';
import style from './Hint.module.scss';
import { useTaskStore, Hints, useVoiceActive } from '@utils/store';
import { useAudioManagement } from '@/hooks/useAudioManagement';
import { useTranslation } from '@utils/useTranslation';
 
export type taskTypes =
  | 'translate'
  | 'dictation'
  | 'omittedwords'
  | 'dialog'
  | 'mistakecorrection'
  | 'replay'
  | 'grammar'
  | 'welcome';

interface HintProps {
  taskType?: taskTypes;
  data?: any;
  Play?: (audioUrl: string) => void;
} 

const getHintInfo = (state: Hints) => ({
  HintShown: state.HintShown,
  HintText: state.HintText,
  HintAudioURL: state.HintAudioURL,
  AudioPlayCases: state.AudioPlayCases,
});

export const Hint: FC<HintProps> = ({ taskType, data , Play }) => {
  const { HintShown, HintText, HintAudioURL, AudioPlayCases } =
    useTaskStore(getHintInfo);
  // const { Play, isAudioPlaying } = useAudioManagement();
  const { ToggleVoicePlaying , isVoicePlaying } = useVoiceActive();
  const { t } = useTranslation();

  // useEffect(() => {
  //   ToggleVoicePlaying(isAudioPlaying);
  // }, [isAudioPlaying]);

  useEffect(() => {
    if (HintAudioURL && HintShown && AudioPlayCases.includes('autoStart')) {
      const timer = setTimeout(() => {
        Play && Play(HintAudioURL);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [HintAudioURL, HintShown]);

  return (
    <div className={HintShown ? style.hint : style.hidden}>
      {/* <span className = {style.light}></span> */}
      {taskType && ['translate', 'dictation'].includes(taskType) && (
        <div className={style.playButtonWrapper}>
          <button
            className={style.playButton}
            onClick={() => {
              if (!isVoicePlaying && AudioPlayCases.includes('playButton')) {
                Play && Play(HintAudioURL);
              }
            }}
          />
        </div>
      )}


      { HintText === '␣' ? ' გამოტოვე :' : t('rewrite') + ' :'}   
      <span
        className={style.hintText}
        dangerouslySetInnerHTML={{
          __html: HintText,
        }}
      />
      {/* {HintText === 'გამოტოვე' && <span className={style.spaceIcon}></span>} */}
    </div>
  );
};
