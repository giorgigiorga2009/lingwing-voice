import { useState, useRef } from 'react';
import { logHandler } from './taskUtils';

// Create audio instances only in browser environment
const audioSuccessInstance =
  typeof window !== 'undefined' ? new Audio('/assets/sounds/true.mp3') : null;
const audioFailInstance =
  typeof window !== 'undefined' ? new Audio('/assets/sounds/error.mp3') : null;


console.log('successInstance ', audioSuccessInstance);
console.log('failInstance ', audioFailInstance);

export const useAudio = () => {
  // const [audios, setAudios] = useState<HTMLAudioElement[]>([]);
  // const [audioIndex, setAudioIndex] = useState<number>(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);

  // Use useRef for storing audio instances that need to be created dynamically
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);

  const updateAudioPlayingState = (playing: boolean) => {
    setIsAudioPlaying(playing);
    console.log(playing, ' Update Audio Playing State   ');
  };

  // const wordAudioPlay = (wordIndex: number) => {
  //   if (audios.length > 0) {
  //     const currentAudio = audios[wordIndex - 1];
  //     if (currentAudio) {
  //       currentAudio.play();
  //     }
  //   }
  // };

  const Play = (audioUrl: string) => {
    if (!audioUrl) {
      console.error('No audio URL provided');
      return;
    }

    // Create or reuse audio instance
    if (!audioInstanceRef.current) {
      audioInstanceRef.current = new Audio();
      console.log('dynamic audio instance created');
    }

    // Construct the full URL
    const baseUrl = process.env.NEXT_PUBLIC_AUDIO_URL || process.env.AUDIO_URL;
    const fullUrl = audioUrl.endsWith('.mp3')
      ? `${baseUrl}${audioUrl}`
      : `${baseUrl}${audioUrl}.mp3`;

    audioInstanceRef.current.src = fullUrl;
    console.log(audioInstanceRef.current);
    audioInstanceRef.current
      .play()
      .then(() => updateAudioPlayingState(true))
      .catch((error) => {
        console.error('Error playing audio:', error);
        updateAudioPlayingState(false);
      });

    audioInstanceRef.current.onplay = () => {
      // logHandler(`
      //     Audio Played
      // `);
    };

    audioInstanceRef.current.onerror = (e) => {
      // logHandler(`
      //     Audio Error
      // `);
      console.log(e);
    };

 
   

   

    audioInstanceRef.current.onended = () => {
      // logHandler(`
      //     Audio Ended
      //   `);
      updateAudioPlayingState(false);
    };
  };

  const PlaySuccess = () => {
    if (audioSuccessInstance) {
      audioSuccessInstance.play();

      audioSuccessInstance.onplay = () => {
        // logHandler(`
        //     Audio Success Played
        // `);
      };


      audioSuccessInstance.onerror = (e) => {
        // logHandler(`
        //     Audio Success Error
        // `);
        console.log(e);
      };

      audioSuccessInstance.onemptied = (e) => {
        // logHandler(`
        //     Audio Success Emptied
        // `);
      };

      audioSuccessInstance.onabort = (e) => {
        // logHandler(`
        //     Audio Success Aborted
        // `);
      };


      audioSuccessInstance.onended = () => {
        // logHandler(`
        //     Audio Success Ended
        // `);
      };
    }
  }; 

  const PlayFail = () => {
    if (audioFailInstance) {
      audioFailInstance.play();

      audioFailInstance.onplay = () => {
        // logHandler(`
        //     Audio Fail Played
        // `);
      };

      audioFailInstance.onerror = (e) => {
        // logHandler(`
        //     Audio Fail Error
        // `);
        console.log(e);
      };

      audioFailInstance.onemptied = (e) => {
        // logHandler(`
        //     Audio Fail Emptied
        // `);
      };
      audioFailInstance.onabort = (e) => {
        // logHandler(`
        //     Audio Fail Aborted
        // `);
      };
      audioFailInstance.onended = () => {
        // logHandler(`
        //     Audio Fail Ended
        // `);
      };
    }
  };

  // const addAudio = (audioUrl: string) => {
  //   if (audioUrl === 'undefined/undefined') return;
  //   const newAudio = new Audio(
  //     `${
  //       process.env.NEXT_PUBLIC_AUDIO_URL || process.env.AUDIO_URL
  //     }${audioUrl}.mp3`
  //   );
  //   newAudio.onended = () => {
  //     setAudioIndex((prevIndex) => prevIndex + 1);
  //   };
  //   setAudios((prevAudios) => [...prevAudios, newAudio]);
  // };

  return {
    // audios,
    // audioIndex,
    // setAudios,
    // wordAudioPlay,
    Play,
    // addAudio,
    isAudioPlaying,
    PlaySuccess,
    PlayFail,
  };
};
