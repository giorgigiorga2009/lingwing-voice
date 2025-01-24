import classnames from 'classnames';
import style from './SoundCheck.module.scss';
import { FC, useEffect, useState, useRef } from 'react';
import { useTranslation } from '@utils/useTranslation';
import { useSoundStore, useTaskStore } from '@utils/store';

interface Props {
  setSoundChecked: (bool: boolean) => void;
  soundChecked: boolean;
}

const TIMEOUT_DELAY = 200; // Timeout delay in milliseconds

export const SoundCheck: FC<Props> = ({ setSoundChecked, soundChecked }) => {
  const { t } = useTranslation();
  const soundAllowed = useSoundStore((state:any) => state.soundAllowed);
  const allowSound = useSoundStore((state:any) => state.allowSound);
  const { SetHintShow, SetHintText, HintText, HintShown } = useTaskStore(
    (state:any) => state
  );

  /** Local state to manage sound and confirmation */
  const [sound, setSound] = useState(false);
  const [canConfirm, setCanConfirm] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (HintShown || HintText) {
      SetHintShow(false);
      SetHintText('');
    }

    if (soundAllowed ) {
      // If sound is already allowed, set soundChecked to true
      setSoundChecked(true);
      return;
    }

    /** Create a new audio element */
    const audioElement = new Audio('/assets/sounds/true.mp3');
    audioRef.current = audioElement;

    /** Cleanup function to reset audio and timeout references */
    const cleanup = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    return cleanup;
  }, []);

  const handlePlayAudio = () => {
    const audio = audioRef.current;
    if (audio) {
      audio
        .play()
        .then(() => {
          setSound(true);
          setCanConfirm(false);
          // Set the confirm button to be active after TIMEOUT_DELAY seconds
          timeoutRef.current = setTimeout(() => {
            setCanConfirm(true);
          }, TIMEOUT_DELAY);

          return;
        })
        .catch((error) => {
          console.error('Error playing audio:', error);
          // alert('There was an issue playing the audio. Please try again.');
        });
    }
  };

  /** Allow sound and update the state */
  const handleConfirm = () => {
    allowSound(true);
    sessionStorage.setItem('soundAllowed', 'true');
    setSoundChecked(true);
  };

  return (
    <div className={classnames(style.container, style[`${soundChecked}`])}>
      <div className={style.header}>{t('makeSureHear')}</div>
      <div className={style.checkContainer}>
        <div className={style.buttonContainer}>
          <button
            className={style.soundButton}
            onClick={handlePlayAudio}
            aria-label="Play sound"
          />
        </div>
        <div className={style.label}>{t('checkSound')}</div>
      </div>
      <button
        className={classnames(style.startButton, sound && style.slideOut)}
        onClick={handleConfirm}
        disabled={!canConfirm}
        aria-label="Confirm sound check"
      >
        {sound ? t('hearSound') : t('startButton')}
      </button>
    </div>
  );
};

export default SoundCheck;
