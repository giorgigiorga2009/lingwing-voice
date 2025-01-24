declare module 'web-speech-cognitive-services' {
    function createSpeechServicesPonyfill(config: {
      credentials: {
        region: string;
        subscriptionKey: string;
      };
    }): {
      SpeechRecognition: any;
      // Add other exports if needed
    };
  
    export default createSpeechServicesPonyfill;
  }