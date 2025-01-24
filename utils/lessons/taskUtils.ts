import { timeStamp } from "console";

/**
 * Wraps all characters in the input string, except for the first character, with a <span> tag.
 *
 * @param {string} input - The input string to process.
 * @returns {string} - The updated string with all characters except the first one wrapped in <span> tags.
 */
export const replayHintHandler = (input: string): string => {
  // Check if the input string is null, undefined, or empty
  if (!input || input.length === 0) {
    return input; // Return the original string if it's empty or null
  }

  // Extract the first character from the input string
  const firstChar = input.charAt(0);

  // Get the rest of the string excluding the first character
  const restOfString = input.slice(1);

  // Concatenate the first character with the rest of the string wrapped in a <span> tag
  return `${firstChar}<span>${restOfString}</span>`;
};

interface WordObject {
  done: boolean;
  _word: string;
  [key: string]: any;
}

/**
 * Constructs a sentence from an array of word objects.
 * Wraps the first word with `done: false` in a <strong></strong> tag.
 *
 * @param {WordObject[]} wordsArray - The array of word objects.
 * @returns {string} - The constructed sentence.
 */
export const mistakeCorrectionHintHandler = (
  wordsArray: WordObject[]
): string => {


  logHandler('mistakeCorrectionHintHandler')
  console.log(wordsArray)



  let sentence = ''; // Initialize an empty string to build the sentence
  let firstMistakeWrapped = false; // Flag to track if the first mistake has been wrapped

  // Iterate over each word object in the array
  wordsArray.forEach((wordObj) => {

    console.log(`${wordObj.word }    ==== >>>     done : ${!wordObj.done} ;  firstMistakeWrapped : ${!firstMistakeWrapped} ,   error :  ${wordObj.error}`)
    // Check if the current word is marked as not done and if no mistake has been wrapped yet
    if (!wordObj.done && !firstMistakeWrapped ) {

      // Wrap the first word with a mistake in a <span> tag
      sentence += `<strong >${wordObj.word}</strong> `;
      firstMistakeWrapped = true; // Set the flag to true to indicate a mistake has been wrapped
    } else {
      // Append the word to the sentence normally
      sentence += `${wordObj.word} `;
    }
  });

  logHandler(sentence)

  // Return the constructed sentence, trimmed to remove any trailing spaces
  return sentence.trim();
};

/**
 * Define a minimal interface for the Task object with only the required properties
 */
interface Task {
  iLearnFrom: { text: string }[];
  taskType: { nameCode: string };
  wordsAudio: {
    words?: any;
    dialog?: { translation: any[] };
    sentence?: any;
    progress?: any;
  };
  iLearn: { text: string };
  [key: string]: any; // Allow additional properties
}

/**
 * Define an interface for the return values of the initialValues function
 */
interface InitialValues {
  wordsObject: any;
  sentenceObject: any;
  taskType: string;
  wordIndex: number;
  wordObj: any;
  word: string;
  lettersObj: any;
  letters: any[];
  currentLetterObj: any;
  charIndex: number;
  char: string;
  charObj: any;
  lastChar: string;
  lastCharObj: any;
  progress: any;
  fromText: string;
  lettersHandlerHint: string;
  wordsHandlerHint: string;
  wordAudioURL: string | null;
  sentenceAudioURL: string | null;
}

/**
 * Extracts and returns initial values from the given task object
 * @param task - The task object containing task details
 * @param currentMessageIndex - The index of the current message for dialog tasks
 * @returns An object containing extracted initial values or null if the task is invalid
 */
export const initialValues = (
  task: Task,
  currentMessageIndex: number
): InitialValues | null => {
  // Check if task and task.wordsAudio are defined
  if (!task || !task.wordsAudio) {
    return null;
  }

  // Destructure the necessary properties from the task object
  const { wordsAudio, iLearnFrom, taskType, iLearn } = task;
  const { words, dialog, sentence, progress } = wordsAudio;

  // Extract the necessary values based on the taskType
  const fromText = iLearnFrom[0]?.text;
  const type = taskType.nameCode;

  const isDialog = type === 'dialog';
  const translation = dialog?.translation[currentMessageIndex] || {};

  // Determine the wordsObject and sentenceObject based on the task type
  const wordsObject = isDialog ? translation.words : words;
  const sentenceObject = isDialog ? translation.sentence : sentence;
  const progressValue = isDialog ? translation.progress : progress;

  // Return null if wordsObject is not defined
  if (!wordsObject) {
    return null;
  }

  // Extract current word index and word object
  const wordIndex = wordsObject.current || 0;
  const wordObj = wordsObject.data?.[wordIndex] || {};
  const word = wordObj.word || '';

  // Extract letters object and related properties
  const lettersObj = wordObj.letters || {};
  const letters = lettersObj.all || [];
  const currentLetterObj = lettersObj.current || {};
  const charIndex = currentLetterObj.index || 0;
  const char = currentLetterObj.char || '';
  const charObj = letters[charIndex] || {};

  // Extract last character object and its properties
  const lastCharObj = letters.length > 0 ? letters[letters.length - 1] : {};
  const lastChar = lastCharObj.char || '';

  // Define lettersHandlerHint based on the current character
  const lettersHandlerHint = char === ' ' ? '␣' : word;
  const wordAudioURL =
    wordObj && wordObj.filePath && wordObj.audioFileName
      ? wordObj.filePath + '/' + wordObj.audioFileName
      : null;
  const sentenceAudioURL =
    sentenceObject && sentenceObject.filePath && sentenceObject.audioFileName
      ? sentenceObject.filePath + '/' + sentenceObject.audioFileName
      : null;

  // Define wordsHandlerHint based on the task type
  const wordsHandlerHint = type === 'mistakecorrection' ? iLearn.text : word;

  // Return all the extracted values in an object
  return {
    wordsObject,
    sentenceObject,
    taskType: type,
    wordIndex,
    wordObj,
    word,
    lettersObj,
    letters,
    currentLetterObj,
    charIndex,
    char,
    charObj,
    lastChar,
    lastCharObj,
    progress: progressValue,
    fromText,
    lettersHandlerHint,
    wordsHandlerHint,
    wordAudioURL,
    sentenceAudioURL,
  };
};

/** Logs the provided data with a clear and distinguishable format. **/
export const logHandler = (data: any) => {
  console.log('');
  console.log('===========>  Log Message  <=========');
  console.log(data);
  console.log('=====================================');
  console.log('');
};


/** Logs the provided data with a clear and distinguishable format. **/
export const persistenLog = (data: any) => {
  const logs = JSON.parse(localStorage.getItem('persistenLogs') || '[]');
  logs.push({ timeStamp: new Date().toLocaleTimeString() , data });
  localStorage.setItem('persistenLogs', JSON.stringify(logs))
  console.log(data);
  console.log('  p  e r s i s  t e n  ')
};


export const getPersistenLog = () => {

  const logs = localStorage.getItem('persistenLogs');
  const persistenLogs = JSON.parse(logs || '[]') ;

  
  console.log(persistenLogs);
}


/** Map of language codes to locale strings for speech recognition. */
export const locales: Record<string, string> = {
  deu: 'de-DE',
  eng: 'en-US',
  esp: 'es-ES',
  geo: 'ka-GE',
  fre: 'fr-FR',
  ita: 'it-IT',
  rus: 'ru-RU',
};








/**
 * Normalizes a string by removing diacritical marks.
 *
 * @param {string} str - The string to normalize.
 * @returns {string} - The normalized string.
 */
export const normalizeStr = (str: string): string =>
  str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

/**
 * Optimizes a word by trimming, converting to lowercase, and normalizing it.
 *
 * @param {string} str - The word to optimize.
 * @returns {string} - The optimized word.
 */
export const wordOptimizer = (str: string): string =>
  normalizeStr(str.trim().toLowerCase());

/**
 * Deeply clones an object or array.
 *
 * @template T
 * @param {T} obj - The object or array to clone.
 * @returns {T} - The deep cloned object or array.
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T;
  }

  const clone = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone((obj as any)[key]);
    }
  }

  return clone;
};

/**
 * Calculates the points earned based on error count and error limit.
 *
 * @param {number} errorCount - The number of errors made.
 * @param {number} errorLimit - The maximum number of allowable errors.
 * @param {number} taskPoint - The points assigned to the task.
 * @returns {number} - The points earned.
 */
export const getPoint = (
  errorCount: number,
  errorLimit: number,
  taskPoint: number
): number => (errorCount <= errorLimit ? taskPoint : 0);
