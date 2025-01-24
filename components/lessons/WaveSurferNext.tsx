import WaveSurfer from 'wavesurfer.js';
import style from './WaveSurferNext.module.scss';
import React, { useState, useEffect, useRef, useCallback, FC } from 'react';
import { useVoiceActive } from '@utils/store';

const formWaveSurferOptions = (ref: HTMLElement) => ({
  container: '#' + ref.id,
  waveColor: '#eee',
  progressColor: '#B692E3',
  cursorColor: '#ffffff00',
  barWidth: 4,
  barRadius: 3,
  responsive: true,
  height: 15,
  normalize: true,
  partialRender: true,
  hideScrollbar: true,
});

interface WaveSurferNextProps {
  audioURL: string;
}

const WaveSurferNext: FC<WaveSurferNextProps> = ({ audioURL }) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const { isVoicePlaying, ToggleVoicePlaying } = useVoiceActive();
  const proxyURL = `/api/audioProxy?url=${encodeURIComponent(audioURL)}`;

  const create = useCallback(() => {
    if (!waveformRef.current) {
      console.error('Waveform element not found'); // Added null check for waveformRef
      return;
    }
    if (!wavesurfer.current) {
      // Changed condition to always initialize if wavesurfer.current is null
      const options = formWaveSurferOptions(waveformRef.current);
      wavesurfer.current = WaveSurfer.create(options);
      wavesurfer.current.load(proxyURL);

      wavesurfer.current.on('audioprocess', () => {
        if (wavesurfer.current) {
          // Added check to ensure wavesurfer.current is not null
          const currentTime = wavesurfer.current.getCurrentTime();
          setProgress(currentTime);
        }
      });

      wavesurfer.current.on('ready', () => {
        if (wavesurfer.current) {
          // Added check to ensure wavesurfer.current is not null
          const length = wavesurfer.current.getDuration();
          setDuration(length);
          setPlaying(true);
          ToggleVoicePlaying(true);
          wavesurfer.current.play(); // Play the audio on mount
        }
      });

      wavesurfer.current.on('finish', () => {
        setPlaying(false);
        ToggleVoicePlaying(false);
        setProgress(0);
      });

      wavesurfer.current.on('error', (message) => {
        console.error('WaveSurfer error:', message);
      });
    }
  }, [proxyURL, ToggleVoicePlaying]); // Changed dependency array to include only necessary dependencies

  useEffect(() => {
    create();
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [create]);

  useEffect(() => {
    ToggleVoicePlaying(true);
    return () => {
      ToggleVoicePlaying(false);
    };
  }, [audioURL, ToggleVoicePlaying]); // Added ToggleVoicePlaying to dependency array

  // Added useEffect for global key listener for 'Control' key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Control') {
        if (wavesurfer.current) {
          wavesurfer.current.play();
          setPlaying(true);
          ToggleVoicePlaying(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ToggleVoicePlaying]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      if (playing) {
        wavesurfer.current.pause(); // Ensured that pause is called when playing
      } else {
        wavesurfer.current.play(); // Ensured that play is called when paused
      }
      setPlaying(!playing);
      ToggleVoicePlaying(!isVoicePlaying);
    }
  };

  return (
    <div
      className={style.container}
      onClick={handlePlayPause}
      role="button"
      tabIndex={0}
      aria-pressed={playing}
      onKeyDown={() => playing}
    >
      <div>
        <button className={!playing ? style.playButton : style.pauseButton} />
      </div>
      <div className={style.waveform}>
        <div id="waveform" ref={waveformRef} />
      </div>
      <div className={style.progress}>{(duration - progress).toFixed(0)}</div>
    </div>
  );
};

export default WaveSurferNext;
