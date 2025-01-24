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
  width = '100%',
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current){
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#D1D6DA',
        progressColor: '#2D3436',
        cursorColor: 'transparent',
        barWidth: 2,
        barRadius: 3,
        barGap: 3,
        height: 40,
      });

      wavesurfer.current.load(audioUrl);
      const wavesurferInstance = wavesurfer.current;

      return () => {
        if (wavesurferInstance) {
          wavesurferInstance.destroy();
          wavesurferInstance.unAll();
        }
      };
    }
  }, [audioUrl]);

  useEffect(() => {
    if (wavesurfer.current) {
      if (isPaused) {
        wavesurfer.current.pause();
      } else {
        wavesurfer.current.play();
      }
    }
  }, [isPaused]);

  return <div ref={waveformRef} style={{ width }} />;
};

export default Waveform;
