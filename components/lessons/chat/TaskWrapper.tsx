import React, { useEffect, useRef, useState } from 'react';
import {
  locales,
  normalizeStr,
  deepClone,
  wordOptimizer,
  getPoint,
  logHandler,
  initialValues,
  replayHintHandler,
  mistakeCorrectionHintHandler,
} from '@utils/lessons/taskUtils';
import { useFocusStore, useTaskStore, useVoiceActive } from '@utils/store';
import { saveTask } from '@utils/lessons/saveTask';
import { setLevelColors } from '@utils/lessons/taskInputUtils';
import InputWrapper from './InputWrapper';
// import { useAudioManagement } from '@/hooks/useAudioManagement';
import KeyMessage from './messages/KeyMessage';
import useKeyboardLanguage from '@/hooks/useKeyboardLanguage';
import next from 'next';

type TaskFieldsUpdateKeys =
  | 'progress'
  | 'currentWordIndex'
  | 'currentWordIsDone'
  | 'currentWordHasError'
  | 'currentWordVoiceRecognized'
  | 'currentCharIsDone'
  | 'currentCharAddError'
  | 'currentWordIsRecognized'
  | 'updateNewCurrentCharIndex'
  | 'updateNewCurrentCharSymbol';

const languageMaps = {
  en: /[A-Za-z]/,
  ru: /[А-Яа-яЁё]/,
  es: /[A-Za-zñáéíóúü]/,
  ka: /[ა-ჰ]/,
  fr: /[A-Za-zàâçéèêëîïôûùüÿæœ]/,
  de: /[A-Za-zäöüß]/,
  it: /[A-Za-zàèéìíîòóùú]/,
  zh: /[\u4e00-\u9fa5]/, // Simplified Chinese
  jp: /[\u4e00-\u9faf\u3400-\u4dbf\u3040-\u309f\u30a0-\u30ff]/, // Japanese
  ko: /[\uac00-\ud7af]/, // Korean
  ar: /[\u0600-\u06ff\u0750-\u077f]/, // Arabic
  hi: /[\u0900-\u097f]/, // Hindi
  pt: /[A-Za-zàâãçéêíóôõúü]/, // Portuguese
  tr: /[A-Za-zçÇğĞıİöÖşŞüÜ]/, // Turkish
  // Add more languages and their character sets as needed
};

const detectInputLanguage = (input: string): string => {
  const charLangCounts: Record<string, number> = {
    en: 0,
    ru: 0,
    es: 0,
    ka: 0,
    fr: 0,
    de: 0,
    it: 0,
    zh: 0,
    jp: 0,
    ko: 0,
    ar: 0,
    hi: 0,
    pt: 0,
    tr: 0,
    // Initialize counts for additional languages
  };

  for (const char of input) {
    for (const [lang, regex] of Object.entries(languageMaps)) {
      if (regex.test(char)) {
        charLangCounts[lang]++;
      }
    }
  }

  const detectedLanguage = Object.entries(charLangCounts).reduce(
    (maxLang, [lang, count]) => (count > maxLang[1] ? [lang, count] : maxLang),
    ['unknown', 0]
  )[0];

  return detectedLanguage === 'unknown' && input.length > 0
    ? 'mixed'
    : detectedLanguage;
};

const transliterationMapToEn: { [key: string]: string } = {
  // ქართულ���
  ა: 'a',
  ბ: 'b',
  ც: 'c',
  დ: 'd',
  ე: 'e',
  ფ: 'f',
  გ: 'g',
  ჰ: 'h',
  ი: 'i',
  ჯ: 'j',
  კ: 'k',
  ლ: 'l',
  მ: 'm',
  ნ: 'n',
  ო: 'o',
  პ: 'p',
  ქ: 'q',
  რ: 'r',
  ს: 's',
  ტ: 't',
  თ: 't',
  უ: 'u',
  ვ: 'v',
  წ: 'w',
  ხ: 'x',
  ყ: 'y',
  ზ: 'z',
  ჩ: 'C',
  შ: 'S',
  ძ: 'Z',
  ჟ: 'J',
  ჭ: 'W',

  // რუსული
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'i',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'I',
  щ: 'I',
  ы: 'y',
  э: 'e',
  ю: 'yu',
  я: 'ya',

  // ესპანური
  á: 'a',
  // é: 'e',
  í: 'i',
  ó: 'o',
  ú: 'u',
  ñ: 'n',

  // ფრანგულიs
  à: 'a',
  â: 'a',
  // ç: 'c',
  // é: 'e',
  è: 'e',
  ê: 'e',
  î: 'i',
  ô: 'o',
  û: 'u',

  // გერმანული
  ä: 'ae',
  ö: 'oe',
  ü: 'ue',
  ß: 'ss',

  // პორტუგალიური
  ã: 'a',
  õ: 'o',
  // ç: 'c',

  // არაბული
  ا: 'a',
  ب: 'b',
  ت: 't',
  ث: 'th',
  ج: 'j',
  ح: 'h',
  خ: 'kh',
  د: 'd',
  ذ: 'dh',
  ر: 'r',
  ز: 'z',
  س: 's',
  ش: 'sh',
  ص: 's',
  ض: 'd',
  ط: 't',
  ظ: 'dh',
  ع: 'a',
  غ: 'gh',
  ف: 'f',
  ق: 'q',
  ك: 'k',
  ل: 'l',
  م: 'm',
  ن: 'n',
  ه: 'h',
  و: 'w',
  ي: 'y',

  // ჩინური (ფონეტიკური პინინი)
  你: 'ni',
  好: 'hao',
  是: 'shi',
  的: 'de',
  不: 'bu',

  // იაპონური (რომაჯი)
  あ: 'a',
  い: 'i',
  う: 'u',
  え: 'e',
  お: 'o',
  か: 'ka',
  き: 'ki',
  く: 'ku',
  け: 'ke',
  こ: 'ko',
  さ: 'sa',
  し: 'shi',
  す: 'su',
  せ: 'se',
  そ: 'so',

  // ჰინდი
  अ: 'a',
  आ: 'aa',
  इ: 'i',
  ई: 'ii',
  उ: 'u',
  ऊ: 'uu',
  ऋ: 'ri',
  ए: 'e',
  ऐ: 'ai',
  ओ: 'o',
  औ: 'au',
  क: 'ka',
  ख: 'kha',
  ग: 'ga',
  घ: 'gha',
  च: 'cha',
  छ: 'chha',
  ज: 'ja',
  झ: 'jha',
  ट: 'ta',
  ठ: 'tha',
  ड: 'da',
  ढ: 'dha',
  ण: 'na',
  त: 'ta',
  थ: 'tha',
  द: 'da',
  ध: 'dha',
  न: 'na',
  प: 'pa',
  फ: 'pha',
  ब: 'ba',
  भ: 'bha',
  म: 'ma',
  य: 'ya',
  र: 'ra',
  ल: 'la',
  व: 'va',
  श: 'sha',
  ष: 'sha',
  स: 'sa',
  ह: 'ha',

  // საერთო სიმბოლოები რამდენიმ��� ენის
  ç: 'с',
  é: 'e',
  // დაამატეთ სხვა საჭირო სიმბოლოები
};

const symbolSideCases: any = {
  deu: {
    a: 'ä',
    o: 'ö',
    u: 'ü',
    b: 'ß',
    s: 'ß',
  },
};

const transliterationMapToRu: { [key: string]: string } = {
  // ქართული
  ა: 'а',
  ბ: 'б',
  ც: 'ц',
  დ: 'д',
  ე: 'е',
  ფ: 'ф',
  გ: 'г',
  ჰ: 'х',
  ი: 'и',
  ჯ: 'ж',
  კ: 'к',
  ლ: 'л',
  მ: 'м',
  ნ: 'н',
  ო: 'о',
  პ: 'п',
  ქ: 'к',
  რ: 'р',
  ს: 'с',
  ტ: 'т',
  უ: 'у',
  ვ: 'в',
  წ: 'ц',
  ხ: 'х',
  ყ: 'й',
  ზ: 'з',
  ჩ: 'ч',
  შ: 'ш',
  ძ: 'дз',
  ჟ: 'ж',
  ჭ: 'ч',

  // ესპანური
  á: 'а',
  é: 'е',
  í: 'и',
  ó: 'о',
  ú: 'у',
  ñ: 'н',

  // გერმანული
  ä: 'а',
  ö: 'о',
  ü: 'у',
  ß: 'сс',

  // ფრანგული
  à: 'а',
  â: 'а',
  ç: 'ц',
  ê: 'е',
  î: 'и',
  ô: 'о',
  û: 'у',

  // რუსული ლათინური ტრანსლიტერაცია
  y: 'ы',

  // საერთო სიმბოლოები
  a: 'а',
  b: 'б',
  c: 'ц',
  d: 'д',
  e: 'е',
  f: 'ф',
  g: 'г',
  h: 'х',
  i: 'и',
  j: 'й',
  k: 'к',
  l: 'л',
  m: 'м',
  n: 'н',
  o: 'о',
  p: 'п',
  q: 'к',
  r: 'р',
  s: 'с',
  t: 'т',
  u: 'у',
  v: 'в',
  w: 'в',
  x: 'кс',
  z: 'з',
};

let isDesktopSize = false;

if (typeof window !== 'undefined') {
  isDesktopSize = window.innerWidth >= 1023;
}

const TaskWrapper: React.FC<any> = ({
  data,
  setCurrentTaskNumber,
  setCompletedTasks,
  completedTasks,
  getTasksHandler,
  commonProps,
  onDivHeight,
  taskCount,
  currentTaskNumber,
  locale,
  handleScroll,
  point,
  setPoint,
  currentMessageIndex,
  setCurrentMessageIndex,
  isDone,
  setIsDone,
  isReadyForNext,
  setIsReadyForNext,
  currentTaskState,
  setCurrentTaskState,
  showModal,
  setShowModal, 
  learnMode,
  chatRef,
  isPaused,
  isDisabled,
  t,
  Play,
  isAudioPlaying,
  PlayFail,
  delayedFunction,
}) => {
  const [key, setKey] = useState<string>('');
  const [totalMistakeCount, setTotalMistakeCount] = useState<number>(0);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<string>('');

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const ordinalRef = useRef<number>(0);
  const timerRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const nextHandlerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lettersHandlerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { shouldRefocus, isMobile, setShouldRefocus } = useFocusStore();

  const {
    SetHintShow,
    SetHintText,
    HintText,
    HintShown,
    SetHintAudioURL,
    SetAudioPlayCases,
    SetMistakeCount,
    MistakeCount,
  } = useTaskStore((state) => state);

  const keyboardLanguage = useKeyboardLanguage();


  /** Clean Up  */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (nextHandlerTimeoutRef.current) {
        clearTimeout(nextHandlerTimeoutRef.current);
      }
      if (lettersHandlerTimeoutRef.current) {
        clearTimeout(lettersHandlerTimeoutRef.current);
      }

      // 1. Clear any audio playing
      if (typeof window !== 'undefined') {
        const audio = document.getElementsByTagName('audio');
        Array.from(audio).forEach((a) => {
          a.pause();
          a.currentTime = 0;
        });
      }

      // 2. Reset timer if exists
      if (timerRef.current) {
        resetTimer();
      }

      // 4. Reset any voice recognition if implemented
      if (window.speechRecognition) {
        window.speechRecognition.stop();
      }
    };
  }, []);

  useEffect(() => {
    hideHintHandler();

    return () => {
      SetMistakeCount(0);
    };
  }, [currentTaskNumber]);

  /** ტასკის პროგრესის ყველა აფდეითზე ,  ჰინტის სახელის და აუდიოს წყაროს განახლება */
  useEffect(() => {
    // if (isDesktopSize) return;

    const initialVars = initialValues(task, currentMessageIndex);
    if (!initialVars) return;

    const { lettersHandlerHint, wordsObject,  wordsHandlerHint , wordAudioURL, sentenceAudioURL, taskType } =
      initialVars;

    // if (taskType === 'grammar') setShouldRefocus(false);
    if (taskType && ['replay', 'translate', 'mistakecorrection'].includes(taskType)) {

      let hintText = '';
      
      if(['mistakecorrection'].includes(taskType)){ 

        if (wordsObject && wordsObject.data) {
          const mistakeHintText = mistakeCorrectionHintHandler(
            wordsObject.data
          );

          hintText = mistakeHintText;
        } 

      } else {
        hintText = lettersHandlerHint;
      }
      
      SetHintText(hintText);
      SetAudioPlayCases(['playButton']);

      const audioUrl = ['replay', 'mistakecorrection'].includes(taskType)
        ? sentenceAudioURL
        : wordAudioURL;

      if (audioUrl) {
        SetHintAudioURL(audioUrl);
      }

      return () => {
        hideHintHandler();
      };
    }
  }, [data?.obj?.wordsAudio?.progress, isDesktopSize]);


  useEffect(() => {
    if (isMobile && shouldRefocus && inputRef.current && !showModal) {
      inputRef.current.focus();
      setShouldRefocus(false);
    }
  }, [shouldRefocus, isMobile, showModal]);

  useEffect(() => {
    if (!data || ['grammar', 'dialog'].includes(data.taskType)) return;

    const scrollTimeout = setTimeout(handleScroll, 10);
    return () => clearTimeout(scrollTimeout);
  }, [HintShown]);

 

  useEffect(() => {
    // Start the timer when the component mounts
    startTimer();

    // Clean up the interval when the component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    timerRef.current = 0;
    intervalRef.current = setInterval(() => {
      timerRef.current += 1;
    }, 1000);
  };

  const resetTimer = () => {
    timerRef.current = 0;
  };

  if (!data || !data.obj) return null;

  let task = { ...data.obj };

  const errorLimit = task.errorLimit;

  /**
   * Updates specific fields of the task object based on the provided key and value.
   *
   * @param key - The key indicating which field to update.
   * @param value - The value to set for the specified key.
   */
  const updateTaskFields = (key: TaskFieldsUpdateKeys, value: any) => {
    // Determine the correct words object based on the task type.
    const wordsObj =
      task.taskType.nameCode === 'dialog'
        ? task.wordsAudio.dialog.translation[currentMessageIndex]
        : task.wordsAudio;

    // Retrieve the current word, letter object, and character within the word.
    const currentWord = wordsObj?.words.data[wordsObj.words.current];
    const currentLetterObj = currentWord?.letters.current;
    const currentChar = currentWord?.letters.all[currentLetterObj?.index];

    // Update the appropriate field based on the key.

    switch (key) {
      case 'progress':
        wordsObj.progress = value;
        break;
      case 'currentWordIndex':
        wordsObj.words.current = value;
        break;
      case 'currentWordIsDone':
        currentWord.done = value;
        break;
      case 'currentWordHasError':
        currentWord.error = value;
        break;
      case 'currentWordVoiceRecognized':
        currentWord.recognized = value;
        break;
      case 'currentCharIsDone':
        currentChar.done = value;
        break;
      case 'currentCharAddError':
        currentChar.error = currentChar.error + value;
        break;
      case 'updateNewCurrentCharIndex':
        currentLetterObj.index = value;
        break;
      case 'updateNewCurrentCharSymbol':
        currentLetterObj.char = value;
        break;
      case 'currentWordIsRecognized':
        currentWord.recognized = value;
        break;
      default:
        // console.log('----------- nothing to update.');
        break;
    }
  };

  /**
   * Handles the logic for showing a hint to the user.
   *
   * @param message - The hint message to be displayed.
   */
  const showHintHandler = (
    message: string,
    type: string,
    audioUrl?: string | null,
    currentCharObj?: any,
    show?: boolean | null
  ) => {
    if (!HintShown) {
      // Increase the mistake count if the hint is not already shown
      SetMistakeCount(MistakeCount + 1);
    } else {
      // Log that the mistake will not be counted
      // logHandler('შეცდომაში არ ჩაეთვლება');
    }

    /** თუ მიმდინარე სიმბოლო სიტყვის პირველი ინდექსით არის ვსეტავთ ჰინტის აუდიოს წყაროს*/
    switch (type) {
      case 'dictation':
        SetHintAudioURL(audioUrl || '');
        if (currentCharObj && currentCharObj.index === 0) {
          SetAudioPlayCases(['playButton', 'autoStart']);
        } else {
          SetAudioPlayCases(['playButton']);
        }
        break;
      default:
        if (audioUrl) {
          SetHintAudioURL(audioUrl || '');
          SetAudioPlayCases(['playButton']);
        }
        break;
    }

    // Set the current word's error state to true
    updateTaskFields('currentWordHasError', true);

    // Increment the current character's error count by 1
    updateTaskFields('currentCharAddError', 1);

    // Increase the total mistake count by 1
    setTotalMistakeCount((prev) => prev + 1);

    // Set the hint message in the global state

    let text = '';

    switch (type) {
      case 'replay':
      case 'dialog':
        text = replayHintHandler(message);
        break;
      default:
        text = message;
        break;
    }

    SetHintText(text);

    // Show the hint by updating the global state
    SetHintShow(true);

    // Play the failure audio sound
    PlayFail();
  };

  /**
   * Handles the logic for hidding a hint to the user.
   */
  const hideHintHandler = () => {
    // alert(HintText)

    // alert('deleted ')
    SetHintShow(false);
    SetHintText('');
    SetHintAudioURL('');
    // SetMistakeCount(0);
  };

  const showMessageHandler = (message: string, messageType: string) => {
    setMessage(message || ' ');
    setShowMessage(true);
    setMessageType(messageType);
  };

  const hideMessageHandler = () => {
    setMessage('');
    setShowMessage(false);
    setMessageType('');
  };

  /**
   * Handles the last key event based on the provided string input.
   *
   * @param str - The key string from the key event.
   * @returns - Null if the task is done or initial variables are not available; otherwise, proceeds with handling the key.
   */
  const lastKeyHandler = (str: string) => {
    console.log('str in lastkey handler .......................', str);

    // If the task is finished, ignore further key inputs until the next task
    if (isDone) return null;

    const localeCodes: {
      [key: string]: string;
    } = {
      en: 'eng', // English
      ru: 'rus', // Russian
      es: 'esp', // Spanish
      ka: 'geo', // Georgian
      fr: 'fre', // French
      de: 'deu', // German
      it: 'ita', // Italian
      zh: 'chi', // Chinese
      jp: 'jpn', // Japanese
      ko: 'kor', // Korean
      ar: 'ara', // Arabic
      hi: 'hin', // Hindi
      pt: 'por', // Portuguese
      tr: 'tur', // Turkish
    };

    const detectedLang = detectInputLanguage(normalizeStr(str));
    const requiredLang = commonProps.languageTo;

    if (
      detectedLang !== 'mixed' &&
      localeCodes[detectedLang] !== requiredLang &&
      !(commonProps.languageTo === 'eng' && detectedLang === 'ka') &&
      !(
        ['eng', 'deu', 'ita', 'esp', 'fre'].includes(requiredLang) &&
        detectedLang === 'en'
      ) &&
      str !== 'Backspace' &&
      str !== 'Shift'
    ) {
      const enterMessage = commonProps?.languageFrom
        ? 'CHAT_MESSAGE_ENTER_FROM_' + commonProps?.languageFrom.toUpperCase()
        : 'გთხოვთ შეცვალოთ კლავიატურა ';

      showMessageHandler(`${enterMessage}`, 'keyboard');
      return;
    }

    hideMessageHandler();

    const initialVars = initialValues(task, currentMessageIndex);
    // Proceed only if initialVars is available
    if (!initialVars) return null;

    const { lettersHandlerHint, wordAudioURL, currentLetterObj, taskType } =
      initialVars;

    // Handle different keys from the keydown event
    if (str.length > 1) {
      switch (str) {
        case 'Enter':
          // Show hint when Enter key is pressed
          showHintHandler(
            lettersHandlerHint,
            taskType,
            wordAudioURL,
            currentLetterObj
          );
          break;
        case 'Backspace':
          // Alert user about current progress when Backspace key is pressed
          const backspaceMessage = commonProps?.languageFrom
            ? 'CHAT_MESSAGE_BACKSPACE_FROM_' +
              commonProps?.languageFrom.toUpperCase()
            : 'ტექსტი სწორია , განაგრძეთ წერა';
          showMessageHandler(backspaceMessage, 'backspace');
          // alert(
          //   'არსებული პროგრესი სწორად არის შევსებული  , გააგრძელეთ ტასკის შევსება'
          // );
          break;
        default:
          // Log unsupported keys
          // logHandler(`Key: '${str}' doesn't do anything`);
          hideMessageHandler();

          break;
      }
      return;
    }

    const map = transliterationMapToEn;

    // logHandler(`

    // STR : ${str}
    // detectedLang : ${detectedLang}
    // localeCodes : ${localeCodes[detectedLang]}
    // requiredLang : ${requiredLang}
    // `);

    // გარდა იმ შემთხვევისა როცა ვსწავლობთ ინგლისურს და ამავდროულად კლავიატურა არის ქართული
    // ყოველთვის უბრალოდ გამოიძახება სიმბოლოების ალგორითმი ყოველგვარი კლავიატურის ალგორითმის გარეშე
    if (!(requiredLang === 'eng' && detectedLang === 'ka')) {
      return letterHandler(str, data);
    }

    // ამ ხაზზე რადგან მოვიდა ხდება კლავიატურის ალგორითის გამოყენება
    // არასწორი კლავიატურის დაჰენდლვა , შესაბამის სიმბოლოდ გადათარგმნა

    const transliteratedChar = Object.keys(map).includes(str) ? map[str] : str;

    // logHandler(`
    //   Entered ${str};
    //   Translated ${transliteratedChar}
    // `);

    // const transliteratedChar = transliterate(str);

    if (transliteratedChar.length > 1) {
      for (let i = 0; i < transliteratedChar.length; i++) {
        letterHandler(transliteratedChar, data);
      }
    } else {
      // Handle valid single character input for letterHandler
      return letterHandler(transliteratedChar, data);
    }
  };

  /**
   * Updates the progress and sets the current character as done.
   *
   * @param progress - The new progress value.
   * @param isDone - Boolean indicating if the current character is done.
   */
  const updateProgressAndCharDone = (progress: string, isDone: boolean) => {
    // Update the progress of the task
    updateTaskFields('progress', progress);
    // Set the current character as done
    updateTaskFields('currentCharIsDone', isDone);
  };

  /**
   * Handles the logic for moving to the next character in the task.
   *
   * @param nextChar - The next character object.
   * @param lastCharObj - The last character object.
   * @param taskType - The type of the task.
   * @param charIndex - The index of the current character.
   */
  const handleNextChar = (
    nextChar: any,
    lastCharObj: any,
    taskType: string,
    charIndex: number
  ) => {
    // Update the index and symbol of the next character
    updateTaskFields('updateNewCurrentCharIndex', charIndex + 1);
    updateTaskFields('updateNewCurrentCharSymbol', nextChar.char);

    switch (taskType) {
      case 'replay':
      case 'dialog':
        // Handle the next key for replay and dialog task types
        lastKeyHandler(nextChar.char);
        break;
      default:
        if (nextChar.auto && lastCharObj.char !== ' ') {
          // Automatically handle the next key if the next character is set to auto and the last character is not a space
          lastKeyHandler(nextChar.char);
        } else {
          // Update the progress for the current task or reset for the next task
          setKey(task.wordsAudio.progress);
        }
        break;
    }
  };

  // Handle moving to the next word
  const handleNextWord = (
    wordsObject: any,
    wordIndex: number,
    taskType: string,
    task: any
  ) => {
    updateTaskFields('currentWordIsDone', true); // მიმდინარე სიტყვა წარმატებით შესრულდა
    updateTaskFields('currentWordHasError', false); // მიმდინარე სიტყვას აღარ აქვს ერორები
    updateTaskFields('currentWordIndex', wordIndex + 1); // მიმდინარე სიტყვის ინდექსი გაიზრდება ერთით (გადავა შემდეგ სიტყვაზე)

    const nextWordObj = wordsObject.data[wordsObject.current]; // შემდეგი სიტყვის ობიექტი

    if (nextWordObj.letters.all[0].auto) {
      lastKeyHandler(nextWordObj.letters.all[0].char); // პარამეტრად გადაცემულია შემდეგი სიტყვის პირველი სიმბოლო (0 ინდექსზე მყოფი)

      if (
        nextWordObj.letters.all.length === 2 &&
        nextWordObj.letters.all[1].char === ' '
      ) {
        lastKeyHandler(' ');
      }
    }
  };

  const repeatWordSentenceHandler = (
    taskType: string,
    filePath: string,
    audioFileName: string,
    audioDuration: number,
    text: string
  ): { audioDelay: number; nextTaskDuration: number; audioUrl: string } => {
    let nextTaskDuration = 0; // Time Task Needs To Save Data and continue with next task
    let audioDelay = 0; // Time Task Needs To Finish Audio listening
    const audioUrl = `${filePath}/${audioFileName}`; // mp3 Url To Repeat (finished word or sentence)

    switch (taskType) {
      case 'dialog':
        // Dialog task type specific duration
        audioDelay = 1;
        nextTaskDuration = 1;
        break;

      case 'grammar':
        // Grammar task type does not affect the delay
        break;

      case 'dictation':
        // Dictation specific calculation
        audioDelay = audioDuration + 0.09 * text.length;
        nextTaskDuration = audioDelay + 1;
        break;

      case 'translate':
      case 'replay':
      case 'omittedwords':
      case 'mistakecorrection':
        // Translate specific calculation
        audioDelay = audioDuration + 0.5;
        nextTaskDuration = audioDelay + 1;
        break;

      // Handling other cases like replay, mistakecorrection, etc.
      default:
        // Default case for other task types
        audioDelay = audioDuration + 0.5 * text.length;
        nextTaskDuration = audioDelay + 1;
        break;
    }

    return {
      audioDelay: audioDelay * 1000,
      nextTaskDuration: nextTaskDuration * 1000,
      audioUrl,
    };
  };

  const letterHandler = (str: string, data: any) => {
    const vars = initialValues(task, currentMessageIndex);

    // Early return if initial values are not available
    if (!vars) return null;

    const sideOption =
      symbolSideCases[commonProps.languageTo] &&
      symbolSideCases[commonProps.languageTo][str]
        ? symbolSideCases[commonProps.languageTo][str]
        : null;
    const {
      wordsObject,
      taskType,
      wordIndex,
      wordObj,
      sentenceObject,
      word,
      letters,
      charObj,
      charIndex,
      char,
      lastCharObj,
      progress,
      fromText,
      lettersHandlerHint: hintWord,
      wordAudioURL,
      currentLetterObj,
    } = vars;

    /** If Entered Key is equal to current Char ( Char we need to success step ) */
    if (
      str.toLocaleLowerCase() === char.toLocaleLowerCase() ||
      str.toLocaleLowerCase() === normalizeStr(char).toLocaleLowerCase() ||
      (sideOption && sideOption === char.toLocaleLowerCase())
    ) {
      const strTemp =
        wordIndex === 0 && charIndex === 0 ? char : progress + char;
      updateProgressAndCharDone(strTemp, true);

      const progressKey =
        taskType === 'dialog'
          ? task.wordsAudio.dialog.translation[currentMessageIndex].progress
          : task.wordsAudio.progress;

      setKey(progressKey);

      switch (taskType) {
        case 'mistakecorrection':
        case 'omittedwords':
          break; // შეცდომების შესწორების დროს მხოლოდ 'Check ' ღილაკზე დაკლიკვის მერე უნდა მოხდეს ჰინტზე მოქმედება

        default:
          hideHintHandler();
          break;
      }

      /** შემდეგი გამოსაცნობი სიმბოლო სიტყვაში */
      const nextChar =
        letters.length - 1 > charIndex ? letters[charIndex + 1] : null;

      /** თუ მიმდინარე სიტყვაში მოიძებნა შემდეგი სიმბოლო */
      if (nextChar) {
        handleNextChar(nextChar, lastCharObj, taskType, charIndex); // Handle the next character logic
      } else if (wordsObject.data.length - 1 > wordIndex) {
        /** თუ შეყვანილი სიმბოლოთი დასრულდა მიმდინარე სიტყვა და გვაქს შემდეგი სიტყვაც */
        /**
         *  აუდიო დაიწყება მხოლოდ იმ შემთხვევაში თუ :
         *
         *      - ტასკის ტიპი არ არის კარნახი და
         *      - filePath , audioFileName  ველები არ იყო ცარიელი ობიექტში  ( რომლის კომბინაციაც აუდიოს ლინკს იძ₾ევა )
         */

        // todo: optimize this ... ( სწორად შესრულებული დავალებისას , როდის და როგორ უნდა გაიმეოროს ხმით აუდიომ )
        if (
          taskType !== 'dictation' &&
          taskType !== 'dialog' &&
          taskType !== 'replay' &&
          taskType !== 'mistakecorrection' &&
          wordObj.filePath &&
          wordObj.audioFileName
        ) {
          // logHandler(`
          //   Letters Handler

          //   Audio: start
          // `);
          Play(wordObj.filePath + '/' + wordObj.audioFileName);
        }

        /** რადგან სიმბოლოების ალგორითმმა დაასრულა მიმდინარე სიტყვა   ( საჭირო ველების დააფდეითება  ) */
        updateTaskFields('currentWordIsDone', true); // მიმდინარე სიტყვა წარმატებით შესრულდა
        updateTaskFields('currentWordHasError', false); // მიმდინარე სიტყვას აღარ აქვს ერორები

        if (taskType === 'omittedwords') return str; // სიტყვების ჩასმისას

        /** შემდეგი სიტყვისთვის ობიექტის მომზადება ( საჭირო ველების დააფდეითება  ) */
        updateTaskFields('currentWordIndex', wordIndex + 1); // მიმდინარე სიტყვის ინდექსი გაიზრდება ერთით (გადავა შემდეგ სიტყვაზე)

        const nextWordObj = wordsObject.data[wordsObject.current]; // შემდეგი სიტყვის ობიექტი

        /**
         * თუ შემდეგი სიტყვის პირველი სიმბოლო (auto) ავტომატური დასაწერია
         * გამოიძახება lastKeyHandler პარამეტრად გადაეცემა ეს სიმბოლო.
         *
         * omittedWords - სიტყვების ჩასმის ტიპი  გამოტოვებულია შემდეგი ხაზისთვის რადგან
         * სხვადასხვა ადგილზე შეიძლება იყოს ჩასასმელი სიტყვა , ხოლო ეს ალგორითმი მხოლოდ
         * შემდეგ მეზობელ სიტყვაზეა გათვლილი.  ასევე სიტყვების ჩასმის ტიპი თვითნ გადმოცემს მიმდინარე სიტყვის ინდექსს
         */
        if (taskType !== 'omittedWords' && nextWordObj.letters.all[0].auto) {
          if (
            !(
              (taskType === 'replay' || taskType === 'dialog') &&
              nextWordObj.letters.all.find(
                (item: any) => item.char !== ' ' && !item.auto
              )
            )
          ) {
            lastKeyHandler(nextWordObj.letters.all[0].char); // პარამეტრად გადაცემულია შემდეგი სიტყვის პირველი სიმბოლო (0 ინდექსზე მყოფი)
          }

          if (
            nextWordObj.letters.all.length === 2 &&
            nextWordObj.letters.all[1].char === ' ' &&
            taskType !== 'dialog'
          ) {
            /**
             *  თუ მითითებულ სიტყვას ორ სიმბოლოიანია  ,
             *  რომელშიც მეორე სიმბოლო სფეისია (' ')
             *  lastKeyHandler - ს  ვიძახებთ მეორე სიმბოლოსთვის (სფეისისთვის) ,
             *  პირველი სიმბოლო უკვე დაჰენდლილია .
             *
             * */

            lastKeyHandler(' ');
          }
        }
      } else {
        /** თუ მიმდინარე სიტყვა დასრულდა და ეს იყო ბოლო სიტყვა მიმდინარე დავალებაში ( წინადადების დასასრული ) */

        let filePath = '';
        let audioFileName = '';
        let audioDuration = 0; // example duration in seconds
        const text = fromText || '';

        if (['dictation', 'mistakecorrection', 'replay'].includes(taskType)) {
          if (
            sentenceObject &&
            sentenceObject.filePath &&
            sentenceObject.audioFileName &&
            sentenceObject.duration
          ) {
            filePath = sentenceObject.filePath;
            audioFileName = sentenceObject.audioFileName;
            audioDuration = sentenceObject.duration;
          }
        } else if (['translate'].includes(taskType)) {
          if (
            wordObj &&
            wordObj.filePath &&
            wordObj.audioFileName &&
            wordObj.duration
          ) {
            filePath = wordObj.filePath;
            audioFileName = wordObj.audioFileName;
            audioDuration = wordObj.duration;
          }
        }

        // ითვლის დაყოვნების დროს (როგორც აუდიო ფაილის ასავე რა დროში უნდა მოხდეს ტასკის დასრულების მთხოვნის გაგზავნა)
        const { nextTaskDuration, audioDelay, audioUrl } =
          repeatWordSentenceHandler(
            taskType,
            filePath,
            audioFileName,
            audioDuration,
            text
          );

        /** ამ შემთხვევაშიც მიმდინარე სიტყვა დასრულდა , შესაბამისად ამ სიტყვის ობიექტის საჭირო ველები დააფდეითდება */
        updateTaskFields('currentWordIsDone', true); // მიმდინარე სიტყვა წარმატებით შესრულდა
        updateTaskFields('currentWordHasError', false); // მიმდინარე სიტყვას აღარ აქვს ერორები

        if (taskType !== 'dialog') {
          setIsDone(true);
          setCurrentTaskState(MistakeCount <= errorLimit);

          Play(audioUrl);
          delayedFunction(audioDelay, setIsReadyForNext);
        } else if (
          currentMessageIndex ===
          task.wordsAudio.dialog.translation.length - 1
        ) {
          setIsDone(true);
          setCurrentTaskState(MistakeCount <= errorLimit);
          delayedFunction(audioDelay, setIsReadyForNext);
        }

     
        lettersHandlerTimeoutRef.current = setTimeout(() => {
          if (
            taskType === 'dialog' &&
            currentMessageIndex < task.wordsAudio.dialog.translation.length - 1
          ) {
            // მხოლოდ დიალოგის ერთი ნაწილი დასრულდა
            setCurrentMessageIndex((prev: number) => prev + 1);
            setIsDone(false);
            setTotalMistakeCount(0);
            setKey('');
            // SetHintText('');
            // SetHintShow(false);
            hideHintHandler();
            setIsReadyForNext(false);
          } else {
            if (ordinalRef.current !== task.ordinalNumber) {
              ordinalRef.current = task.ordinalNumber;
            } else {
              return null;
            }

            saveTask({
              ...commonProps,
              currentTask: {
                ...task,
                taskType: task.taskType.nameCode,
                timeSpent: timerRef.current | 0,
              },
              totalMistakes: MistakeCount,
              forgivenErrorQuantity:
                MistakeCount > task.errorLimit ? task.errorLimit : MistakeCount,
              error: MistakeCount > task.errorLimit ? 1 : 0,
            })
              .then((res) => {
                if (inputRef.current) {
                  inputRef.current.focus();
                }

                if (!res) return null;

                // ნებისმიერი მიმდინარე ტასკი დასრულებულია
                setPoint(
                  (prev: number) =>
                    prev + getPoint(MistakeCount, task.errorLimit, task.point)
                );

                setIsReadyForNext(false);
                setCurrentTaskState(null);

                // console.log('----- M i s t a k e s : ' + mistakeCount + ' / ' + task.errorLimit)
                setIsDone(false);

                SetMistakeCount(0); // დაშვებული შეცდომის განულება შემდეგი ტასკისთვის
                setTotalMistakeCount(0);
                setCurrentMessageIndex(0); // დიალოგის ტიპის შემთხვევაში , დიალოგის მიმდინარე წინადადების ინდექსის განულება
                resetTimer();
                // SetHintText(''); // ჰინტის სიტყვა უნდა გაცარიელდეს  , დასრულებულ ტასკს აღარ ჭირდება
                // SetHintShow(false); // ჰინტის სექციაც უნდა დაიმალოს
                hideHintHandler(); // ჰინტის სექციაც უნდა დაიმალოს

                /** დასრულებული ტასკების სიაში დამატება */
                const answ = setLevelColors({
                  answers: task.answers || [],
                  currentLevel: task.currentLevel || 1,
                  learnMode: commonProps.learnMode,
                  isMistake: MistakeCount > errorLimit ? 1 : 0,
                });

                setCompletedTasks(
                  completedTasks.length > 0
                    ? [
                        ...completedTasks,
                        {
                          ...data,
                          answers: answ,
                          isFailed: MistakeCount > errorLimit ? 1 : 0,
                        },
                      ]
                    : [
                        {
                          ...data,
                          answers: answ,
                          isFailed: MistakeCount > errorLimit ? 1 : 0,
                        },
                      ]
                );

                if (currentTaskNumber < taskCount - 1) {
                  /**
                   *  თუ შემდეგი ტასკი გვაქ უკვე არსებული ტასკების სიაში ,
                   *  შემდეგ ტასკს მივანიჭებთ მიმდინარე ტასკის სტატუსს
                   */

                  setCurrentTaskNumber((prev: number) => {
                    return prev + 1;
                  });
                } else {
                  /**
                   * თუ არსებული ტასკების სიაში აღარ არის მეტი ტასკი ,
                   * ვაგზავნით მოთხოვნას ახალი ტასკების წამოსაღებად.
                   */
                  // setCurrentTaskNumber(0);

                  // getTasksHandler();

                  setCurrentTaskNumber(null);

                  getTasksHandler()
                    .then((res: any) => {
                      setCurrentTaskNumber(0);
                      return;
                    })
                    .catch((err: any) => {
                      console.log(err);
                    });
                }

                setKey(''); // შესაყვანი ველის სთეითი გასუფთავდება ( state = '' )

                /** მიმდინარე ტასკზე სქროლი ... */
                // setTimeout(() => {
                //     handleScroll()
                // }, 200)

                return str;
              })
              .catch((err) => {
                setIsReadyForNext(false);
                /**
                 * თუ saveTask მოთხოვნას აქვს რაიმე შეცდომა (error) ,
                 * ამ შემთხვევაშიც ვანულებთ საწყის მონაცემებს
                 * */

                setKey('');
                // SetHintText('');
                // SetHintShow(false);
                hideHintHandler();

                // console.log('######### S a v e T a s k   F a i l ##########');
                // console.log(err);
                // console.log('###################');
              });
          }
        }, nextTaskDuration);
      }

      return str;
    } else if (
      charObj.auto &&
      str === ' ' &&
      lastCharObj.char === ' ' &&
      letters[charIndex + 1].char === ' '
    ) {
      logHandler(`

            STAGE 1

            current input : '${str}'

      `);

      /**
       * შეყვანილი სიმბოლო არ დაემთხვა შესაყვანს , თუმცა
       * შესაყვანი სიმბოლო არის ავტომატური ამიტომ ,
       * თუ შეყვანილი სიმბოლო ' ' (სფეისია) მაშინ ავტომატურად მიაბავს სხვა შემთხვევაში
       * ჩაითვლება უბრალო შეცდომად.
       */

      // console.log(str, char);
      // console.log('არ დაემთხვა მაგრამ არის სფეისი და აუტო წინა');
      // console.log('------------------')

      lastKeyHandler(charObj.char);
      lastKeyHandler(' ');

      return '480   space თუმცა მიმდინარე სიმბოლო იყო აუტო ';
    } else if (
      wordIndex === 0 &&
      charObj.auto &&
      charIndex === 0 &&
      letters[1] &&
      letters[1].char &&
      (str.toLocaleLowerCase() === letters[1].char.toLocaleLowerCase() ||
        str.toLocaleLowerCase() ===
          normalizeStr(letters[1].char).toLocaleLowerCase())
    ) {
      /**
       * შეყვანილი სიმბოლო არ დაემთხვა შესაყვანს , თუმცა
       * შესაყვანი სიმბოლო არის ავტომატური ამიტომ ,
       * თუ შეყვანილი სიმბოლო ' ' (სფეისია) მაშინ ავტომატურად მიაბავს სხვა შემთხვევაში
       * ჩაითვლება უბრალო შეცდომად.
       */

      // console.log(letters);
      // logHandler(`
      //       STAGE 2

      //       current input : '${str}'
      // `);

      // console.log(str, char);
      // console.log('არ დაემთხვა მაგრამ არის სფეისი და აუტო წინა');
      // console.log('------------------')

      lastKeyHandler(charObj.char);

      if (taskType !== 'replay' && taskType !== 'dialog') lastKeyHandler(str);

      return '480   space თუმცა მიმდინარე სიმბოლო იყო აუტო ';
    } else if (
      charIndex === 0 &&
      charObj.auto &&
      letters[1]?.char &&
      (str.toLocaleLowerCase() === letters[1].char.toLocaleLowerCase() ||
        str.toLocaleLowerCase() ===
          normalizeStr(letters[1].char).toLocaleLowerCase())
    ) {
      lastKeyHandler(charObj.char);

      if (taskType !== 'replay' && taskType !== 'dialog') lastKeyHandler(str);
    } else if (charObj.auto && lastCharObj.char === ' ') {
      lastKeyHandler(charObj.char);
      if (taskType !== 'replay' && taskType !== 'dialog') lastKeyHandler(str);
    } else {
      /** თუ მომხმარებელმა შეიყვანა არასწორი სიმბოლო  , რომელიც side case - ებისთვისაც არ არის ვალიდური */

      //       logHandler(`

      //       STAGE 3

      //       current input : '${str}'

      // `);

      /** მიმდინარე სიტყვის ობიექტის განახლება */
      updateTaskFields('currentWordHasError', true); // მიმდინარე სიტყვას აქვს ერორი
      updateTaskFields('currentCharAddError', 1); // მიმდინარე სიმბოლოზე შეცდომის მცდელობის რიცხვი გაიზარდა
      if (
        taskType !== 'mistakecorrection' &&
        !(taskType === 'replay' && str === ' ')
      ) {
        showHintHandler(hintWord, taskType, wordAudioURL, currentLetterObj);

        // SetHintAudioURL(wordAudioURL || '');
      }

      return '501';
    }
  };

  const wordsHandler = (str: string) => {
    hideMessageHandler();

    /** str  უნდა იყოს 1 სიმბოლო მაინც  */
    if (!str || str.length < 1) return;

    const vars = initialValues(task, currentMessageIndex); // საჭირო რეფერენსები task ობიექტის

    /** თუ ობიექტიდან არ არის საჭირო ინფო  */
    if (!vars) return;

    /** საჭირო ფროფერთიების რეფერენსები task ობიექტიდან */
    const { charObj } = vars;

    /** თუ თავიდან ხელით შევიყვანთ სიმბოლოებს და სიტყვის დასრულებას მხოლოდ სფეისი აკლია
     * ამ დროს თუ სფეისი არ დავწერეთ და ისე გავაგრძელეთ ვოისით დავალებები სფეისს ავტომატურად
     * დაჰენდლავს რომ მიმდინარე სიტყვა შემდეგი იყოს და არ დატოვოს სფეისის გამო
     */
    if (charObj && charObj.char === ' ') {
      lastKeyHandler(' ');
    }

    sentenceHandler(str);
  };

  const sentenceHandler = (str: string) => {
    /** str  უნდა იყოს 1 სიმბოლო მაინც  */
    if (str.length < 1) return;

    const vars = initialValues(task, currentMessageIndex); // საჭირო რეფერენსები task ობიექტის

    /** თუ ობიექტიდან არ არის საჭირო ინფო  */
    if (!vars) return;

    /** საჭირო ფროფერთიების რეფერენსები task ობიექტიდან */
    const {
      wordsObject,
      taskType,
      wordIndex,
      word,
      wordObj,
      letters,
      lettersObj,
      lastCharObj,
      wordsHandlerHint: hintWord,
      sentenceAudioURL,
    } = vars;

    const checkWord = wordOptimizer(wordObj._word); // მიმდინარე სიტყვა რაც უნდა  შეიყვანოს იუზერმა
    const checkWordOriginal = wordOptimizer(wordObj.word); // მიმდინარე სიტყვა რაც უნდა  შეიყვანოს იუზერმა
    let voiceInputArray = str
      .trim()
      .replace(/\s+/g, ' ') // Normalize all whitespace to a single space
      .split(' '); // სიტყვების მასივი რაც შეიყვანა იუზერმა
    console.log(voiceInputArray, 'voiceInputArray');

    voiceInputArray = voiceInputArray.filter((item) => item.trim() !== ''); // ორი ან სამი სფეისი ზედიზედ თუ იყო მასივის ელემენტი შეიძლება ცარიელი სტრინგიც მივიღოთ

    // console.log('############## T O    A R R A Y ################');
    // console.log(str);
    // console.log(voiceInputArray);
    // console.log(wordsObject.data.map((item: any) => item._word));
    // console.log('##############################');

    /** Log */
    // console.log(' ');
    // console.log('######## Initial Values ########');
    // console.log('Voice said : ' + `'${str}'`);
    // console.log('Word To Say : ' + checkWord);
    // console.log('Synonyms : ', wordObj.synonyms);
    // console.log('         ');

    /**
     * მომხარებლის მიერ შეყვანილ წინადადებაში ვეძებთ იმ სიტყვის ინდექს , რომელიც ემთხვევა შესაყვან სიტყვას
     * ან შესაყვანი სიტყვის სინონიმ სიტყვას.
     */

    let isCorrect = false; //  ამ ხაზამდე არ არის ნაპოვნი სწორი სიტყვა
    let correctWordIndex: null | number = null;

    voiceInputArray.forEach((item, i) => {
      // console.log(`------------- START LOOP ON : ${item}  ,  INDEX : ${i} ---------------`)
      const mustCheck =
        wordOptimizer(item) === wordOptimizer(checkWord) ||
        wordOptimizer(item) === wordOptimizer(checkWordOriginal) ||
        (!['mistakecorrection', 'omittedwords'].includes(taskType) &&
          wordObj.synonyms &&
          wordObj.synonyms.includes(wordOptimizer(item)));

      logHandler(`
            item : ${wordOptimizer(item)}
            checkWord : ${wordOptimizer(checkWord)}
            checkWordOriginal : ${wordOptimizer(checkWordOriginal)}
        `);
      if (correctWordIndex !== null) return;

      if (mustCheck) {
        let isValid = true; // საწყისად ვალიდურია ყველაფერი , ალგორითმის არ შესრულების ნებისმიერ ეტაპზე გახდება false და დაიგნორდება ნათქვამი სიტყვა
        let step = i; //  შესაყვანი სიტყვა , მოიძებნა ნათქვამ წინადადებაში და იმყოფება (i)  ინდექსზე ნათქვემი სიტყვების მასივში
        let currentWordIndex = wordIndex; // შესაყვანი სიტყვის ინდექსი
        const resArr: string[] = []; // დროებით მასივი სადაც ინახება შესაყვანის სიტყვის წინა სიტყვები ვალიდაციის შემდეგ , რომლებიც წესით done უნდა იყოს

        while (step >= 0 && isValid) {
          if (currentWordIndex < 0) {
            // console.log(`#Checking Input  :  ${wordOptimizer(voiceInputArray[step])}`)
            // console.log(`But We Don't have more word in task ... thats F A I L  !!!!`)

            isValid = false;
            break;
          }

          const cleanVoiceWord = wordOptimizer(voiceInputArray[step]); // მომხმარებლის შეყვანილი მიმდინარე სიტყვა
          const clearTaskWord = wordOptimizer(
            wordsObject.data[currentWordIndex]._word
          ); // ტასკში არსებული შესაბამისი სიტყვა
          const clearTaskWordOriginal = wordOptimizer(
            wordsObject.data[currentWordIndex].word
          ); // ტასკში არსებული შესაბამისი სიტყვა

          /**
           * აქაც მიდის შემოწმება თუ  შესაბამისი სიტყვები  შეყვანილიც და ტასკში არსებული
           * შესაბამის ინდექსზე დაემთხვა ერთმანეთს ან  მომხმარებლის მიერ შეყვანილი შესაბამისი სიტყვა
           * მოიძებნება საჭირო სიტყვის ობიექტში არსებული სინონიმების მასივშიც.
           *
           *
           * ასევე მოწმდება რომ თუ შესადარებელი მიმდინარე სიტყვა არის done და ამავდროულად ეს მიმდინარე სიტყვა
           * არ არის current (ტასკში მონიშნული მიმდინარე შესაყვანი სიტყვა იგივე რაც ჰინტად გვექნება ამ მომენტში)
           */

          if (
            (cleanVoiceWord === clearTaskWord ||
              cleanVoiceWord === clearTaskWordOriginal ||
              (!['mistakecorrection', 'omittedwords'].includes(taskType) &&
                wordsObject.data[currentWordIndex] &&
                wordsObject.data[currentWordIndex].synonyms &&
                wordsObject.data[currentWordIndex].synonyms.includes(
                  cleanVoiceWord
                ))) &&
            !(
              wordsObject.data[currentWordIndex].done &&
              wordIndex === currentWordIndex
            )
          ) {
            resArr.unshift(clearTaskWord);
          } else {
            /** აქ თუ მოვიდა უკვე ნიშნავს  , რომ კი დაემთხვა current Word მაგრამ მის წინ რა სიტყვებიც
             *  ახსენა მომხმარებელმა არ დაემთხვა შესაბამის სიტყვებს.  ამიტომ ეს current Word იც არ დაისეტება.
             */

            // console.log(cleanVoiceWord, ' !== ', clearTaskWord);

            isValid = false;
            break;
          }

          step--;
          currentWordIndex--;

          /**
           *  შეიძლება გვქონდეს სიტუაცია სადაც წინა სიტყვა რომელიც უნდა შევადაროთ , ვოისის ნათქვამი წინადადებაში მიმდინარე სიტყვის
           *  შემოწმების მერე მისი წინა სიტყვა აღმოჩნდეს რო ტასკის ეს სიტყვა არის '-' ან რაიმე ისეთი სიტყვა რომლის პირველი სიმბოლო არის
           *  auto = true  მნიშნველობის მქონე შესაბამისად ამ დროს   ტასკის შესადარებელი სიტყვა უნდა იყოს არა ეს არამედ  1 ით კიდე გადაწეული წინ
           */
          while (
            wordsObject.data[currentWordIndex] &&
            wordsObject.data[currentWordIndex].letters &&
            wordsObject.data[currentWordIndex].letters.all.findIndex(
              (item: any) => !item.auto
            ) < 0
          ) {
            currentWordIndex--;
          }
        }

        if (isValid) {
          isCorrect = true;
          correctWordIndex = i;
        }

        // console.log(`------------- END LOOP ON : ${item}  ,  INDEX : ${i} -------  IS VALID ? : ${isValid} --------`)
        // console.log('')
      }
    });

    // console.log('isCorrect : ', isCorrect);
    // console.log('correct Word Index : ', correctWordIndex)
    // console.log('correct Word : ', correctWordIndex ? voiceInputArray[correctWordIndex] : ' არ არსებობს ')
    /** თუ წარმატებით დაემატა სიტყვა ,  ვანახლებთ შესაბამისი  ველებს */

    if (correctWordIndex !== null) {
      updateTaskFields('currentWordIsRecognized', true);

      /** სიტყვის ყველა სიმბოლოს განახლება */
      if (['dialog', 'replay'].includes(taskType)) {
        /** ამ ტიპებს ჭირდებათ მხოლოდ ერთი სიმბოლოს თქმა რადგან დანარჩენი ავტომატურად იწერება */
        const firstChar = letters[0]?.char;
        lastKeyHandler(firstChar);
      } else {
        letters.forEach((item: any) => {
          /**
           *  იმ ქეისის გარდა როდესაც მიმდინარე სიმბოლო (char , letter) არის
           *  ტასკის ბოლო სიტყვის ,  ბოლო სიმბოლო  იძახებს მიმდინარე სიმბოლოზე
           *  lastKeyHandler(მიმდინარე სიმბოლო).
           *
           *  ეს ერთი ქეისი გამოტოვებულია იმიტო , რომ ამ ქეისს თვითონ lastKeyHandler ფუნქცია აგვარებს.
           */
          if (
            !(
              wordsObject.current === wordsObject.data.length - 1 &&
              letters.length - 1 === lettersObj.current.index &&
              lastCharObj.auto
            )
          ) {
            if (!item.done) {
              lastKeyHandler(item.char);
            }
          }
        });
      }

      // const timeOutDur =
      //   taskType === 'dictation' ? 100 : wordObj.duration * 1.2 * 1000;

      const timeOutDur = [
        'dictation',
        'replay',
        'dialog',
        'mistakecorrection',
        'omittedwords',
      ].includes(taskType)
        ? 100
        : wordObj.duration * 1.2 * 1000;

      // console.log(wordsObject);
      console.log(timeOutDur, 'sentencehandler') ;
      timeoutRef.current = setTimeout(() => {
        if (wordsObject.data[wordIndex + 1]) {
          /**
           *  რადგან ვიცით რომ მიმდინარე ტასკს კიდევ აქვს სიტყვები ,
           *  ვამოწმებთ მიმდინარე სიტყვის  შემდეგ კიდევ თუ თქვა რამე ვოისმა.
           */
          if (
            correctWordIndex !== null &&
            voiceInputArray[correctWordIndex + 1]
          ) {
            /**
             *  რადგან ტასკშიც არის დარჩენილი სიტყვები შესასრულებელი
             *  და  ვოისშიც მომხმარებელმა მიმდინარე სიტყვაზე მეტი თქვა,
             *  ვამუშავებთ მიმდინარე სიტყვის შემდეგ დარჩენილ სტრინგს
             */

            // console.log(
            //   '==> Left Words To Check  : " ' +
            //     voiceInputArray.slice(correctWordIndex + 1).join(' ') +
            //     ' "  <=='
            // );

            // logHandler(`
            //     Words Handler
            // `);

            wordsHandler(voiceInputArray.slice(correctWordIndex + 1).join(' '));
          }
        }
      }, timeOutDur);

      /** თუ შეყვანილი სიმბოლოთი დასრულდა მიმდინარე სიტყვა და გვაქს შემდეგი სიტყვაც */
    } else {
      if (taskType === 'mistakecorrection') {
        if (wordsObject && wordsObject.data) {
          const mistakeHintText = mistakeCorrectionHintHandler(
            wordsObject.data
          );

          SetHintText(mistakeHintText);
        } else {
          // console.log('asfasfsafasf asf asf safqw rwq rqwr ');
        }
      } else if (taskType !== 'omittedwords') {
        showHintHandler(hintWord, taskType);
        // SetHintAudioURL(sentenceAudioURL || '');
      }

      // showHintHandler(hintWord);
      // updateTaskFields('currentWordHasError', true);
      // SetHintText(hintWord);
      // if (taskType !== 'mistakecorrection') {
      //   setTotalMistakeCount((prev) => prev + 1);
      //   SetHintShow(true);
      //   // setTimeout(() => {
      //   //     alert('lets goo')
      //   // }, 500)
      //   setMistakeCount((prev) => prev + 1);
      // }
    }
  };

  logHandler(HintText)


  const taskProgress = () => {
    if (task.taskType?.nameCode === 'grammar') {
      return isDone ? '100%' : '0%';
    }

    if (task.taskType?.nameCode === 'mistakecorrection') {
      return HintShown || !isDone ? '0%' : '100%';
    }

    if (task.taskType?.nameCode === 'dialog') {
      const dialogElementsLength = task.wordsAudio?.dialog?.translation?.length;

      if (dialogElementsLength > 0) {
        if (isDone) {
          return '100%';
        } else {
          return (currentMessageIndex / dialogElementsLength) * 100 + '%';
        }
      } else {
        return '0%';
      }
    }

    if (task.taskType?.nameCode === 'omittedwords') {
      const totalNumber = task.wordsAudio.words.omitted.length;
      let doneNumber = 0;

      task.wordsAudio.words.data.forEach((item: any) => {
        if (item.omit && item.done) {
          doneNumber++;
        }
      });

      return Math.floor((doneNumber / totalNumber) * 100) + '%';
    }

    let sum = 0;

    if (task.wordsAudio && task.wordsAudio.words) {
      task.wordsAudio.words.data.forEach((item: any) => {
        if (item.done) {
          sum++;
        }
      });

      return Math.floor((sum / task.wordsAudio.words.data.length) * 100) + '%';
    } else if (task.taskType.nameCode === 'grammar') {
      return '100%';
    } else {
      return '0%';
    }
  };

  const mistakeCorrectionHandler = (str: string, action = '') => {
    task = deepClone(data.obj);
    str = str.replace(/ - /g, ' ');


    console.log(str)

    wordsHandler(str);

    if (HintText && action === 'check') {
      // SetHintShow(true);
      // handleScroll();
      // setMistakeCount((prev) => prev + 1);
      // setTotalMistakeCount((prev) => prev + 1);
      // PlayFail();

      showHintHandler(HintText, 'mistakecorrection');
    } else if (action === '') {
      SetHintShow(false);
      // hideHintHandler();
    }
  };

  const nextHandler = () => {
    const vars = initialValues(task, currentMessageIndex);
    let dur = 1.2 * 1000;

    if (
      task?.taskType?.nameCode &&
      ['omittedwords'].includes(task?.taskType?.nameCode)
    ) {
      if (!vars) return null;
      const { taskType, sentenceObject, fromText } = vars;

      if (
        sentenceObject &&
        sentenceObject.filePath &&
        sentenceObject.audioFileName &&
        sentenceObject.duration
      ) {
        const { nextTaskDuration, audioDelay, audioUrl } =
          repeatWordSentenceHandler(
            taskType,
            sentenceObject.filePath,
            sentenceObject.audioFileName,
            sentenceObject.duration,
            fromText
          );

        dur = nextTaskDuration;
        Play(audioUrl);
        delayedFunction(audioDelay, setIsReadyForNext);
      }
      setIsDone(true);
    } else {
      delayedFunction(1 * 1000, setIsReadyForNext);
      setIsDone(true);
    }

    setCurrentTaskState(MistakeCount <= errorLimit);

    nextHandlerTimeoutRef.current = setTimeout(() => {
      if (ordinalRef.current !== task.ordinalNumber) {
        ordinalRef.current = task.ordinalNumber;
      } else {
        return null;
      }

      saveTask({
        ...commonProps,
        currentTask: {
          ...task,
          taskType: task.taskType.nameCode,
          timeSpent: timerRef.current | 0,
        },
        totalMistakes: MistakeCount,
        forgivenErrorQuantity:
          MistakeCount > task.errorLimit ? task.errorLimit : MistakeCount,
        error: MistakeCount > task.errorLimit ? 1 : 0,
      })
        .then((res) => {
          if (inputRef.current) {
            inputRef.current.focus();
          }

          if (!res) return null;

          setCurrentTaskState(null);
          setIsDone(false);
          setIsReadyForNext(false);
          setPoint(
            (prev: number) =>
              prev + getPoint(MistakeCount, task.errorLimit, task.point)
          );
          SetMistakeCount(0); // დაშვებული შეცდომის განულება შემდეგი ტასკისთვის
          setTotalMistakeCount(0);
          const answ = setLevelColors({
            answers: task.answers || [],
            currentLevel: task.currentLevel || 1,
            learnMode: commonProps.learnMode,
            isMistake: MistakeCount > errorLimit ? 1 : 0,
          });
          resetTimer();

          setCompletedTasks(
            completedTasks.length > 0
              ? [
                  ...completedTasks,
                  {
                    ...data,
                    answers: answ,
                    isFailed: MistakeCount > errorLimit ? 1 : 0,
                  },
                ]
              : [
                  {
                    ...data,
                    answers: answ,
                    isFailed: MistakeCount > errorLimit ? 1 : 0,
                  },
                ]
          );

          if (currentTaskNumber < taskCount - 1) {
            setCurrentTaskNumber((prev: number) => prev + 1);
          } else {
            setCurrentTaskNumber(null);

            getTasksHandler()
              .then((res: any) => {
                setCurrentTaskNumber(0);
                return;
              })
              .catch((err: any) => {
                console.log(err);
              });

            // getTasksHandler();
            // setCurrentTaskNumber(0);
          }

          setCurrentMessageIndex(0);
          setKey('');
          // SetHintText('');
          // SetHintShow(false);
          hideHintHandler();

          return;
        })
        .catch((err) => {
          setIsReadyForNext(false);

          // console.log(err);
        });
    }, dur);
  };

  const omittedWordsHandler = (inputs: any, action: 'check' | null) => {
    if (isDone) return null;

    let checkDone = true;
    let hint = '';

    // Check if all omitted words are done
    for (const item of task.wordsAudio.words.omitted) {
      if (!task.wordsAudio.words.data[item['_index']].done) {
        checkDone = false;
        hint = task.wordsAudio.words.data[item['_index']]._word;
        break;
      }
    }

    if (checkDone) {
      // SetHintShow(false);
      hideHintHandler();
      nextHandler();
      return null;
    }

    // Reset task and handle words if not done
    task = deepClone(data.obj);

    for (const item of task.wordsAudio.words.omitted) {
      updateTaskFields('currentWordIndex', item['_index']);
      wordsHandler(inputs[`input-${item['_index']}`]);
    }

    // Re-check completion status
    checkDone = true;
    for (const item of task.wordsAudio.words.omitted) {
      if (!task.wordsAudio.words.data[item['_index']].done) {
        checkDone = false;
        hint = task.wordsAudio.words.data[item['_index']]._word;
        break;
      }
    }

    if (checkDone) {
      // SetHintShow(false);
      hideHintHandler();
      nextHandler();
      return 'isDone';
    } else if (action === 'check') {
      showHintHandler(hint, 'omittedwords');
    } else {
      // SetHintShow(false);
      hideHintHandler();
    }

    return null;
  };

  return (
    <>
      <KeyMessage
        text={message}
        showMessage={showMessage}
        from={commonProps?.languageFrom}
        to={commonProps?.languageTo}
        messageType={messageType}
      />

      <textarea
        ref={inputRef}
        style={{
          zIndex: -2,
          position: 'absolute',
          bottom: 0,
          opacity: 0,
          left: 0,
        }}
      />

      <InputWrapper
        inputRef={inputRef}
        voiceHandler={wordsHandler}
        lastKeyHandler={lastKeyHandler}
        wordsHandler={wordsHandler}
        nextHandler={nextHandler}
        mistakeCorrectionHandler={mistakeCorrectionHandler}
        omittedWordsHandler={omittedWordsHandler}
        taskType={task.taskType.nameCode}
        name="word"
        value={key}
        taskProgress={taskProgress()}
        percentage={(1 - MistakeCount / (errorLimit || 1)) * 100}
        errorLimit={Math.max(errorLimit - MistakeCount, 0)}
        lang={locales[locale]}
        mistakeCount={MistakeCount}
        currentTask={task}
        isDone={isDone}
        totalMistakeCount={totalMistakeCount}
        isReadyForNext={isReadyForNext}
        setIsReadyForNext={setIsReadyForNext}
        showModal={showModal}
        isAudioPlaying={isAudioPlaying}
        chatRef={chatRef}
        isPaused={isPaused || isDisabled}
      />
    </>
  );
};

export default TaskWrapper;
