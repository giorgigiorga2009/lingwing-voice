import React, { FC, useEffect, useRef, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';


import style from '../VoiceRecognition.module.scss';
import { getVoiceRecognitionActive, useRecognitionActive, useVoiceActive } from '@utils/store';
import { logHandler } from '@utils/lessons/taskUtils';


interface IVoiceHandlerProps {
  voiceHandler: (arg: string) => void;
  lang: string;
  isAudioPlaying: boolean;  
  setIsListening: (arg: boolean) => void;
}

const VoiceHandler: FC<IVoiceHandlerProps> = ({
  voiceHandler,
  lang,
  isAudioPlaying,
  setIsListening,
}) => {
  const [isStopped, setIsStopped] = useState<boolean>(false);
  const tempRef = useRef<string>('');
  const isAndroid = /android/i.test(navigator.userAgent.toLowerCase());
const isSafari = /^((?!chrome|android).)*safari/i.test(
  navigator.userAgent.toLowerCase()
);
 

const { setListening, setKeyboardVisible } = useRecognitionActive(getVoiceRecognitionActive);


// Add this effect to handle keyboard visibility




  const {
    listening,  
    interimTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
    transcript,
    resetTranscript,
  } = useSpeechRecognition();
  
  const polyfillApplied = useRef<boolean>(false);
  const { isVoicePlaying } = useVoiceActive();
  const continuous = !isSafari && !isAndroid;
  const voiceParams = { continuous, language: lang };
  
  
  // logHandler(`
  //   isAndroid: ${isAndroid}
  //   isSafari: ${isSafari} 
  //   lang: ${lang} 
  //   polyfillApplied: ${polyfillApplied.current}
  //   interimTranscript: ${interimTranscript}
  //   finalTranscript: ${finalTranscript}
  //   transcript: ${transcript}
  //   continuous: ${continuous}
  //   listening: ${listening}
  //   isStopped: ${isStopped}
  //   isAudioPlaying: ${isAudioPlaying}
  // `)
  // useEffect(() => {
  //   if (listening) {
  //     setKeyboardVisible(false);
  //   } else {
  //     setKeyboardVisible(true);
  //     }
  //   }, [listening, setKeyboardVisible]);
  
  // useEffect(() => {
  //   setListening(listening);
  // }, [listening, setListening]);
  

  useEffect(() => {
    const applyPolyfill = async () => {
      if (typeof window !== 'undefined') {  // Check if we're on the client side
        const isGeorgianSafari = async () => {
          try {
            const token = process.env.NEXT_PUBLIC_AZURE_SPEECH_TOKEN as string;
            const region = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION as string;

            // Dynamically import the package
            const { default: createSpeechServicesPolyfill } = await import('web-speech-cognitive-services');

            if (createSpeechServicesPolyfill) {
              const { SpeechRecognition: AzureSpeechRecognition } =
                createSpeechServicesPolyfill({
                  credentials: {
                    region: region,
                    subscriptionKey: token,
                  },
                });

              SpeechRecognition.applyPolyfill(AzureSpeechRecognition);
              polyfillApplied.current = true;
            }
          } catch (error) {
            console.error('Error applying speech services polyfill:', error);
          }
        };

        if (isSafari && lang === 'ka-GE' && !polyfillApplied.current) {
          isGeorgianSafari();
        }
      }
    };

    applyPolyfill();
  }, [lang, isSafari]);

  // console.log('continius', continuous)
  // console.log('polifil', polyfillApplied.current)

  useEffect(() => {
    return () => {
      // console.log('daaejecte ------ ');
      if (polyfillApplied.current) {
        // Check if removePolyfill exists before calling it
        if ('removePolyfill' in SpeechRecognition) {
          (SpeechRecognition as any).removePolyfill();
        }
        polyfillApplied.current = false;
      }
      SpeechRecognition.stopListening();
    };
  }, []);

  useEffect(() => {
    if (
      !continuous &&
      !polyfillApplied.current &&
      interimTranscript.length > 0 &&
      !listening
    ) {
      /**
       * თუ არც ანდროიდია   , არც საფარი
       * თუ ქართულს არ ვსწავლობთ საფარიზე
       */
      voiceHandler(transcript);
      resetTranscript();
    } else if (finalTranscript.length > 0) {
      if (polyfillApplied.current && finalTranscript[finalTranscript.length - 1] === '.') {
        /**
         * თუ ქართულს  ვსწავლობთ საფარიზე
         */
        voiceHandler(finalTranscript.slice(0, -1));
      } else {
        voiceHandler(finalTranscript);
      }


      resetTranscript();
    }
  }, [finalTranscript, listening]);

  useEffect( () => {
    // console.log('listening', listening);
    const handleListeningState = async () => {
      if (isVoicePlaying && listening) {
        try {
          console.log('Attempting to stop listening');
          if (polyfillApplied.current) {
            await SpeechRecognition.abortListening();
          } else {
            await SpeechRecognition.stopListening();
          }
          setIsStopped(true);
          console.log('Listening stopped');
        } catch (error) {
          console.error('Error stopping speech recognition:', error);
        }
      } else if (!isVoicePlaying && isStopped) {
        try {
          console.log('Attempting to start listening');
          await SpeechRecognition.startListening(voiceParams);
          setIsStopped(false);
          console.log('Listening started');
        } catch (error) {
          console.error('Error starting speech recognition:', error);
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
      <button
        className={style.microphoneContainer}
        onClick={async () => {
          if (!isVoicePlaying) {
            if (listening) {
              if (polyfillApplied.current) {
                await SpeechRecognition.abortListening();
              } else {
                await SpeechRecognition.stopListening();
              }
              setIsStopped(false);
              // setIsListening(false)
              // console.log('Microphone icon clicked (should stop listening)');
            } else {
              await SpeechRecognition.startListening(voiceParams);
              setIsStopped(false);
              // setIsListening(true)
              // console.log('Microphone icon clicked (should start listening)');
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