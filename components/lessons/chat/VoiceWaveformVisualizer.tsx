import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const WaveformWrapper = styled.div<{ isVisible: boolean }>`
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: ${(props) => (props.isVisible ? '100px' : '0')};
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  visibility: ${(props) => (props.isVisible ? 'visible' : 'hidden')};
  z-index: 1;
  gap: 1.25rem;
  transition: max-height 0.3s ease, opacity 0.3s ease, visibility 0.3s ease;
`;

const Canvas = styled.canvas`
  width: 90%;
  height: 3rem;
  border-radius: 10px;
  background-color: transparent;
  @media (max-width: 768px) {
    height: 2rem;
    width: 90%;
    margin-left: -1rem;
  }
`;

const Timer = styled.div`
  min-width: 50px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: #F903E7;
  font-weight: 800;
  padding-left: 2rem;   
  @media (max-width: 768px) {
    padding-left: 0.5rem;
  }
`;

interface VoiceWaveformVisualizerProps {
  isListening: boolean;
}

const VoiceWaveformVisualizer: React.FC<VoiceWaveformVisualizerProps> = ({ isListening }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationIdRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const dotsRef = useRef<number[]>([]);
  const numDots = 80; // Increased number of rectangles for smoother visualization
  const lastUpdateTimeRef = useRef<number>(Date.now());

  
  

  useEffect(() => {
    let isActive = true;

    const startVisualizer = async () => {
      try {
        console.log('Starting visualizer, browser support:', !!navigator.mediaDevices?.getUserMedia);

        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Browser does not support audio input');
        }

        // Release any existing resources
        await stopVisualizer();

        // Request microphone permission with explicit error handling
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          } 
        });
        console.log('Stream obtained:', !!stream, 'Tracks:', stream.getTracks().length);

        if (!isActive) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        streamRef.current = stream;

        // Initialize audio context with error handling
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (!AudioContextClass) {
            throw new Error('Web Audio API is not supported in this browser');
          }
          audioContextRef.current = new AudioContextClass();
          console.log('Audio context created:', !!audioContextRef.current);
        } catch (err) {
          console.error('Failed to create AudioContext:', err);
          throw err;
        }

        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 512; // Increased fftSize for better frequency resolution
        analyserRef.current.smoothingTimeConstant = 0.8;
        console.log('Analyzer node created:', !!analyserRef.current, 'FFT size:', analyserRef.current?.fftSize);

        const bufferLength = analyserRef.current.frequencyBinCount;
        console.log('Buffer length:', bufferLength);
        dataArrayRef.current = new Uint8Array(bufferLength);

        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);

        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
          if (isActive) {
            setTimer(Math.floor((Date.now() - startTimeRef.current) / 1000));
          }
        }, 1000);

        dotsRef.current = Array(numDots).fill(0);
        draw();
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    };

    const draw = () => {
      if (!isActive) {
        console.log('Draw cancelled - not active');
        return;
      }

      const canvas = canvasRef.current;
      const canvasCtx = canvas?.getContext('2d');
      
      if (!canvas || !canvasCtx || !analyserRef.current || !dataArrayRef.current) {
        return;
      }
      
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      
      const drawLoop = () => {
        if (!isActive || !canvasCtx || !analyserRef.current || !dataArrayRef.current) {
          console.log('DrawLoop cancelled - missing requirements');
          return;
        }

        animationIdRef.current = requestAnimationFrame(drawLoop);

        const currentTime = Date.now();
        const timeDiff = currentTime - lastUpdateTimeRef.current;
        const updateInterval = 50;

        if (timeDiff >= updateInterval) {
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          
          const lowerBound = 10;
          const upperBound = 50;
          const relevantData = Array.from(dataArrayRef.current).slice(lowerBound, upperBound);
          const average = relevantData.reduce((a, b) => a + b, 0) / relevantData.length;

          dotsRef.current.unshift(average);
          if (dotsRef.current.length > numDots) {
            dotsRef.current.pop();
          }

          lastUpdateTimeRef.current = currentTime;

          canvasCtx.clearRect(0, 0, canvas.width, canvas.height);

          const padding = 40;
          const availableWidth = canvas.width - padding;
          const spacing = availableWidth / numDots;
          const rectWidth = spacing * 0.6;
          const rectPadding = (spacing - rectWidth) / 2;
          const baselineY = canvas.height / 2;

          dotsRef.current.forEach((value, i) => {
            const x = padding / 2 + i * spacing + rectPadding;
            const minBarHeight = 2;
            const barHeight = Math.max((value / 155) * (canvas.height / 2) * 0.9, minBarHeight);
            const y = baselineY - barHeight;

            const gradient = canvasCtx.createLinearGradient(x, y, x, baselineY + barHeight);
            gradient.addColorStop(0, '#F903E7');
            gradient.addColorStop(1, '#F903E7');

            canvasCtx.fillStyle = gradient;
            canvasCtx.fillRect(x, y, rectWidth, barHeight * 2);
          });
        }
      };

      drawLoop();
    };

    const stopVisualizer = async () => {
      console.log('Stopping visualizer, states:', {
        animationFrame: !!animationIdRef.current,
        audioContext: audioContextRef.current?.state,
        stream: !!streamRef.current
      });
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
        animationIdRef.current = null;
      }

      if (audioContextRef.current?.state !== 'closed') {
        await audioContextRef.current?.close();
        audioContextRef.current = null;
      }

      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      setTimer(0);
      dotsRef.current = Array(numDots).fill(0);

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    if (isListening) {
      startVisualizer();
    }

    return () => {
      isActive = false;
      stopVisualizer();
    };
  }, [isListening]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!isListening) return null;

  return (
    <WaveformWrapper isVisible={isListening}>
      <Timer>{formatTime(timer)}</Timer>
      <Canvas ref={canvasRef} />
    </WaveformWrapper>
  );
};

export default VoiceWaveformVisualizer;