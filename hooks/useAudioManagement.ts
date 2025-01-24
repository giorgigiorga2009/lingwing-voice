import { useState, useEffect, useCallback } from 'react';
import { useAudio } from '@utils/lessons/audioUtils';
import { useVoiceActive } from '@utils/store';

export const useAudioManagement = () => {
  const { Play, isAudioPlaying, PlaySuccess, PlayFail } = useAudio();
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const delayedFunction = useCallback(
    (timer: number, setIsReadyForNext: any) => {
      if (timeoutId) clearTimeout(timeoutId);

      const id = setTimeout(() => {
        PlaySuccess();
        setIsReadyForNext(true);
      }, timer);

      setTimeoutId(id as NodeJS.Timeout);
    },
    [timeoutId, PlaySuccess]
  );

  return {
    Play,
    isAudioPlaying,
    PlaySuccess,
    PlayFail,
    delayedFunction,
    timeoutId,
  };
};
