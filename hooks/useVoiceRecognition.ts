import { useEffect, useState } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

export const useVoiceRecognition = (
  isAudioPlaying: boolean,
  locale: string
) => {
  const { listening } = useSpeechRecognition();
  const [isStopped, setIsStopped] = useState(false);
  useEffect(() => {
    const voiceParams = { continuous: true, language: locale };

    if (listening || isStopped) {
      if (isAudioPlaying) {
        // SpeechRecognition.stopListening();
        setIsStopped(true);
      } else {
        // SpeechRecognition.startListening(voiceParams);
        setIsStopped(false);
      }
    }
  }, [isAudioPlaying, listening, locale]);

  return { isStopped, setIsStopped };
};
