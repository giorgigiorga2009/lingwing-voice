import React, { useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
  isListening: boolean;
  mediaStream?: MediaStream | null;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isListening, mediaStream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    let source: MediaStreamAudioSourceNode | null = null;

    const setupAudioContext = async () => {
      if (!mediaStream) return;

      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        if (analyserRef.current) {
          analyserRef.current.disconnect();
        }

        analyserRef.current = audioContextRef.current.createAnalyser();
        source = audioContextRef.current.createMediaStreamSource(mediaStream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
      } catch (err) {
        console.error('Error setting up audio context:', err);
      }
    };

    const draw = () => {
      if (!canvasRef.current || !analyserRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height;
        
        ctx.fillStyle = '#FF1493';
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth;
      }

      if (isListening && mediaStream) {
        animationFrameId.current = requestAnimationFrame(draw);
      }
    };

    if (isListening && mediaStream) {
      setupAudioContext().then(() => {
        draw();
      });
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      if (source) {
        source.disconnect();
      }
      
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
    };
  }, [isListening, mediaStream]);

  return (
    <canvas 
      ref={canvasRef} 
      width={200} 
      height={50} 
      style={{ 
        position: 'absolute',
        top: '-60px',
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: '5px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        zIndex: 1000
      }}
    />
  );
};

export default VoiceVisualizer;
