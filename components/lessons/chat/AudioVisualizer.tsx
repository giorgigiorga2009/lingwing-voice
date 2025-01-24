import { useState, useEffect, useRef } from 'react';
import styles from '../VoiceRecognition.module.scss';

interface AudioDataProcessorProps {
  isListening: boolean;
}

const AudioDataProcessor: React.FC<AudioDataProcessorProps> = ({
  isListening, 
}) => {
  const [audioData, setAudioData] = useState<any>([]);
  const [isAudible, setIsAudible] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isListening) { 
      setAudioData(new Uint8Array(14).fill(0));
      setIsAudible(false);
      return;
    }

    const initAudio = async () => {
      const AudioContextClass =
        window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // Increase fftSize for more detailed data

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser); 

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;

        const updateAudioData = () => {
          const dataArray = new Uint8Array(analyser.frequencyBinCount);
          analyser.getByteFrequencyData(dataArray);
          const relevantData = dataArray.slice(4, 18);
          setAudioData(relevantData);

          // Check if the average volume is above a threshold
          const averageVolume = relevantData.reduce((sum, value) => sum + value, 0) / relevantData.length;
          setIsAudible(averageVolume > 45); // Adjust this threshold as needed

          animationFrameRef.current = requestAnimationFrame(updateAudioData);
        }; 

        updateAudioData();
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
      }
    };
  }, [isListening]);
  const svgWidth = 800;
  const svgHeight = 600; 
  const centerY = svgHeight / 2;
  const lineCount = 11; // Reduced number of lines

  return ( 
    <div
      style={{
        width: '12px',
        paddingTop: '6px',
        position: 'absolute',
        zIndex: '200',
        top: '0px',
        display: isListening && isAudible ? 'flex' : 'none',
      }}
    >
    <svg id="mainSVG" xmlns="http://www.w3.org/2000/svg" viewBox={`0 0 ${svgWidth} ${svgHeight}`} className={styles.audioVisualizer}>
      <linearGradient id="grad1" x1="0" y1="1" x2="0" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#993BDC"/>
        <stop offset="3" stopColor="#35AAF9"/> 
      </linearGradient>	
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <g id="bg" fill="none" stroke="#ffffff" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="10" filter="url(#glow)">
        {Array.from({ length: lineCount }).map((_, index) => { 
          // Center the data sampling around the middle of the audio data
          const centerOffset = Math.floor(audioData.length / 2);
          const dataIndex = centerOffset + Math.floor((index - lineCount / 2) * (audioData.length / lineCount));
          const value = audioData[dataIndex] || 0;
          const x = ((index + 0.5) / lineCount) * svgWidth;
          
          // Calculate a factor to emphasize the middle lines
          const middleEmphasis = Math.pow(Math.cos((index / (lineCount - 1) - 0.5) * Math.PI), 2);
          
          // Adjust the height calculation
          const baseHeight = (value / 255) * (svgHeight / 2);
          const adjustedHeight = baseHeight * (0.1 + 0.9 * middleEmphasis);
          
          return (
            <line 
              key={index}
              x1={x} 
              y1={centerY - adjustedHeight} 
              x2={x} 
              y2={centerY + adjustedHeight} 
              className={styles.audioLine}
            />
          );
        })}
      </g>
    </svg>
    </div>
  );
};

export default AudioDataProcessor;