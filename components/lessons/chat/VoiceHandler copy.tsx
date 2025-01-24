import React, { FC, useEffect, useRef, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';
import style from '../VoiceRecognition.module.scss';
import { useVoiceActive } from '@utils/store';
import MicWave from './MicWave';

import AudioVisualizer from '@components/lessons/chat/AudioVisualizer';

interface IVoiceHandlerProps {
  voiceHandler: (arg: string) => void;
  lang: string;
  isAudioPlaying: boolean;
}

const VoiceHandler: FC<IVoiceHandlerProps> = ({
  voiceHandler,
  lang,
  isAudioPlaying,
}) => {
  const [isStopped, setIsStopped] = useState<boolean>(false);
  // const [voiceSaid, setVoiceSaid] = useState<string>('');
  const tempRef = useRef<string>('');

  const {
    listening,
    interimTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
    transcript,
    resetTranscript
  } = useSpeechRecognition();
  
  const isAndroid = useRef<boolean>(false);

  useEffect(() => {
    isAndroid.current = /android/i.test(navigator.userAgent.toLowerCase());
  }, []);





  const { isVoicePlaying } = useVoiceActive();
  // const [tempStr, setTempStr] = useState('');
  const voiceParams = { continuous: !isAndroid.current, language: lang };

  useEffect(() => {
    return () => {
      SpeechRecognition.stopListening(); 
    }
  }, [])

  // useEffect(() => {
  //   if (interimTranscript.length > 0 && listening) {
  //     // setTempStr(interimTranscript);
  //     tempRef.current = interimTranscript;

  //   } else if (tempRef.current.length > 0 && !listening) {
  //     // voiceHandler(tempRef.current);
  //     // // setVoiceSaid(tempStr);
  //     // tempRef.current = '';
  //     voiceHandler(tempRef.current);
  //     // setVoiceSaid(tempStr);
  //     tempRef.current = '';
  //   }
  // }, [interimTranscript, listening]);

  useEffect(() => {
    if (isAndroid.current && interimTranscript.length > 0 && !listening) {
      voiceHandler(transcript);
      resetTranscript();
    }

    else if (finalTranscript.length > 0) {
      // setTempStr(interimTranscript);
      voiceHandler(finalTranscript);
      resetTranscript();
      } 
  }, [finalTranscript, listening]);

  useEffect(() => {
    // console.log('VoiceHandler state:', {
    //   isVoicePlaying,
    //   listening,
    //   isStopped,
    // });
    const handleListeningState = async () => {
      if (isVoicePlaying && listening) {
        try {
          // console.log('Attempting to stop listening');
          await SpeechRecognition.stopListening();
          setIsStopped(true);
          // console.log('Listening stopped');
        } catch (error) {
          // console.error('Error stopping speech recognition:', error);
        }
      } else if (!isVoicePlaying && isStopped) {
        try {
          // console.log('Attempting to start listening');
          await SpeechRecognition.startListening(voiceParams);
          setIsStopped(false);
          // console.log('Listening started');
        } catch (error) {
          // console.error('Error starting speech recognition:', error);
        }
      }
    };

    handleListeningState();
  }, [isVoicePlaying, listening, isStopped, voiceParams]);

  if (!browserSupportsSpeechRecognition) {
    return <p>Browser does not support speech recognition.</p>;
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        right: '15px',
      }}
    >
      {/* <div
        style={{
          padding: '10px 15px',
          position: 'absolute',
          bottom: '205px',
          right: '20px',
          width: 'auto',
          zIndex: '99',
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 15px',
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          backdropFilter: 'blur(10px)',
          borderRadius: ' 10px ',
          transition: '500ms',
          // display: tempStr ? 'block' : 'none',
        }}
      >
        {tempStr}
      </div> */}
      <button
        className={style.microphoneContainer}
        onClick={async () => {
          if (!isVoicePlaying) {
            if (listening) {
              setIsStopped(true);
              await SpeechRecognition.stopListening();
              // console.log(
              //   'მიკროფონის იკონს დაიკლიკა ( უნდა გამოირთოს ამ კლიკზე )  '
              // );
            } else {
              await SpeechRecognition.startListening(voiceParams);
              setIsStopped(false);
              // console.log(
              //   'მიკროფონის იკონს დაიკლიკა ( უნდა ჩაირთოს ამ კლიკზე )  '
              // );
            }
          }
        }}
      >
        {listening ? (
          <>
            <div className={style.pulsingCircleAction}></div>
            <div className={style.pulsatingCircle}>
              {/* <MicWave /> */}
              {/* <AudioVisualizer isListening={true} /> */}
            </div>
          </>
        ) : (
          <span className={style.micIcon} key="mic" />
        )}
      </button>
    </div>
  );
};

export default VoiceHandler;
