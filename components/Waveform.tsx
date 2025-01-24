import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
// import WaveSurfer from ;

interface WaveformProps {
  audioUrl: string;
  isPaused?: boolean;
  width?: string | number;
}

const Waveform: React.FC<WaveformProps> = ({
  audioUrl,
  isPaused = true,
  width = '25%',
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#D1D6DA',
        progressColor: '#2D3436',
        cursorColor: 'transparent',
        barWidth: 1,
        barRadius: 3,
        barGap: 3,
        height: 40,
      });

      wavesurfer.current.load(audioUrl);
      const wavesurferInstance = wavesurfer.current;

      return () => {
        try {
          if (wavesurferInstance) {
            setTimeout(() => {
              if (wavesurferInstance) {
                wavesurferInstance.unAll();
                wavesurferInstance.destroy();
              }
            }, 100);
          }
        } catch (error) {
          console.error('Error during wavesurfer cleanup:', error);
        }
      };
    }
  }, [audioUrl]);

  useEffect(() => {
    if (wavesurfer.current) {
      if (isPaused) {
        wavesurfer.current.pause();
        setIsPlaying(false);
      } else {
        wavesurfer.current.play();
        setIsPlaying(true);
      }
    }
  }, [isPaused]);

  return <div ref={waveformRef} style={{ width }} />;
};

export default Waveform;
