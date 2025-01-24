import { useEffect, useState } from 'react';

const useKeyboardLanguage = () => {
  const [keyboardLanguage, setKeyboardLanguage] = useState('');

  useEffect(() => {
    const detectLanguage = () => {
      const language = navigator.language;

      setKeyboardLanguage(language);
    };

    detectLanguage();

    window.addEventListener('languagechange', detectLanguage);

    return () => {
      window.removeEventListener('languagechange', detectLanguage);
    };
  }, []);

  return keyboardLanguage;
};

export default useKeyboardLanguage;
