import React, { useEffect, useRef, useState } from 'react';
import style from '../VoiceRecognition.module.scss';

const MicWave: React.FC = () => {
  const [isTalking, setIsTalking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const AUDIO_THRESHOLD = 5; // Adjust this value based on testing

  useEffect(() => {
    const initAudio = async () => {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const checkAudioLevel = () => {
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          
          setIsTalking(average > AUDIO_THRESHOLD);

          animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
        };

        checkAudioLevel();
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    initAudio();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  return isTalking ? <div className={style.micwave} /> : null;
};

export default MicWave; 