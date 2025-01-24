import { useTaskStore } from '@utils/store';
import { TaskData, CourseObject } from '@utils/lessons/getTask';
import { KEYBOARD_OVERRIDE, LANGUAGES_MAP_OVERRIDE } from '@utils/const';

export type CommonProps = {
  courseId: string;
  Token: string | null;
  userId: string | null;
  currentTask: TaskData;
  currentTaskNumber: number;
  languageTo: string | string[];
  languageFrom: string | string[];
  completedTasks: TaskData[] | undefined;
  setCurrentTaskNumber: (number: number) => void;
  setCompletedTasks: (tasks: TaskData[]) => void;
  learnMode: number;
  omittedWordsHandler?: any;
};

interface TextProcessingProps {
  inputText: string;
  outputText: string;
  correctText: string;
  currentWord: string;
  setForgivenErrorQuantity: (callback: (prev: number) => number) => void;
  setMistakesCount: (callback: (prev: number) => number) => void;
  setIsMistake: (mistake: boolean) => void;
}

interface RecognitionProcessingProps {
  currWordIndex: number;
  correctText: string;
  transcript: string;
  textFromKeyboard: string;
  wordsSynonyms: string[][];
  setIsMistake: (mistake: boolean) => void;
  setMistakesCount: (callback: (prev: number) => number) => void;
  setForgivenErrorQuantity: (callback: (prev: number) => number) => void;
}

export const handleChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  languageTo: keyof typeof LANGUAGES_MAP_OVERRIDE
) => {
  const currentCharCode = event.target.value.slice(-1).charCodeAt(0);

  const overriddenKeyboard = KEYBOARD_OVERRIDE.find(
    (override) =>
      override.geo === currentCharCode ||
      override.rus === currentCharCode ||
      override.eng === currentCharCode
  );

  if (overriddenKeyboard) {
    const overriddenText =
      event.target.value.slice(0, -1) +
      String.fromCharCode(
        overriddenKeyboard[LANGUAGES_MAP_OVERRIDE[languageTo]]
      );
    return overriddenText;
  } else {
    return event.target.value;
  }
};

// export const handleChangeOmittedWords = (
//   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
//   languageTo: keyof typeof LANGUAGES_MAP_OVERRIDE,
// ) => {
//   const currentCharCode = event.target.value.slice(-1).charCodeAt(0)

//   const overriddenKeyboard = KEYBOARD_OVERRIDE.find(
//     override =>
//       override.geo === currentCharCode ||
//       override.rus === currentCharCode ||
//       override.eng === currentCharCode,
//   )

//   if (overriddenKeyboard) {
//     const overriddenText =
//       event.target.value.slice(0, -1) +
//       String.fromCharCode(
//         overriddenKeyboard[LANGUAGES_MAP_OVERRIDE[languageTo]],
//       )
//     return overriddenText
//   } else {
//     return event.target.value
//   }
// }

const findMatchedWordIndex = ({
  wordWithSynonyms,
  transcriptArray,
  lastAddedWordIndex,
}: {
  wordWithSynonyms: string[];
  transcriptArray: string[];
  lastAddedWordIndex: number;
}) => {
  for (let i = 0; i < wordWithSynonyms.length; i++) {
    const index = transcriptArray.indexOf(
      wordWithSynonyms[i],
      lastAddedWordIndex
    );
    if (index !== -1) {
      return index;
    }
  }
  return -1;
};

export const getRecognitionText = ({
  currWordIndex,
  correctText,
  wordsSynonyms,
  transcript = '',
  textFromKeyboard,
  setIsMistake,
  setMistakesCount,
  setForgivenErrorQuantity,
}: RecognitionProcessingProps): string => {
  const HintShown = useTaskStore.getState().HintShown;
  const setHintShow = (show: boolean) =>
    useTaskStore.setState({ HintShown: show });
  const setHintText = (hintText: string) =>
    useTaskStore.setState({ HintText: hintText });
  const correctWordsArray = correctText
    .split(' ')
    .filter((word) => word !== '-');
  const correctWordsArrayWithHypen = correctText.split(' ');
  const transcriptArray = transcript.toLowerCase().split(' ');
  const lastAddedWordIndex = transcriptArray.length - 1 ?? 0;

  const outputArray = textFromKeyboard.trim()
    ? textFromKeyboard
        .trim()
        .split(/\s+/)
        .slice(
          0,
          textFromKeyboard.includes('-') ? currWordIndex + 1 : currWordIndex
        )
    : [];

  let modifiedWord = '';
  if (currWordIndex < correctWordsArray.length) {
    modifiedWord = correctWordsArray[currWordIndex]
      .replace(/[.,\/#!$%\^&\*;:{}=\_`~()¡¿-]/g, '')
      .toLowerCase()
      .trim();
  }

  const wordWithSynonyms = [
    modifiedWord,
    ...(wordsSynonyms[currWordIndex] || []),
  ];

  const transcriptIndex = findMatchedWordIndex({
    wordWithSynonyms,
    transcriptArray,
    lastAddedWordIndex,
  });

  if (transcriptIndex !== -1) {
    outputArray.push(correctWordsArray[currWordIndex]);
    if (correctWordsArrayWithHypen[currWordIndex + 1] === '-') {
      outputArray.push(correctWordsArrayWithHypen[currWordIndex + 1]);
    }
    setHintShow(false);
  } else {
    if (!HintShown) {
      setMistakesCount((prev) => prev + 1);
      setHintShow(true);
      setHintText(correctWordsArray[currWordIndex]);
    }
    setForgivenErrorQuantity((prev) => prev + 1);
    setIsMistake(true);
  }
  return outputArray ? outputArray.join(' ') + ' ' : '';
};

const regexp = /^[.,\/#!$%\^&\*;:{}=\-_`~()¡¿]$/;

//Used only for dialog and repetition tasks
export const replayInputCheck = ({
  inputText,
  outputText,
  correctText,
  currentWord,
  setForgivenErrorQuantity,
  setMistakesCount,
  setIsMistake,
}: TextProcessingProps) => {
  const HintShown = useTaskStore.getState().HintShown;
  const setHintShow = (show: boolean) =>
    useTaskStore.setState({ HintShown: show });
  const setHintText = (hintText: string) =>
    useTaskStore.setState({ HintText: hintText });
  const correctWordsArray = correctText.split(' ');
  const outputTextArray = outputText ? outputText.trim().split(' ') : [];
  const inputTextArray = inputText
    ? inputText.replace(/ $/, '').split(' ')
    : [];

  const index = inputTextArray.length - 1;
  const punctuations = correctWordsArray[index + 1];

  if (!currentWord) return '';
  const correctFirsLetter = currentWord.charAt(0).toLowerCase();
  const writtenFirsLetter = inputText
    .charAt(inputText.length - 1)
    .toLowerCase();

  if (correctFirsLetter === writtenFirsLetter) {
    outputTextArray.push(currentWord);
    punctuations?.match(regexp) && outputTextArray.push(punctuations);
    setHintShow(false);
    return outputTextArray.map((word) => word.concat(' ')).join('');
  }

  if (!HintShown) {
    setMistakesCount((prev) => prev + 1);
    setHintText(currentWord);
    setHintShow(true);
  } else {
    setForgivenErrorQuantity((prev) => prev + 1);
  }

  setIsMistake(true);

  return outputText;
};

export const textCheck = ({
  inputText,
  outputText,
  currentWord,
  correctText,
  setMistakesCount,
  setForgivenErrorQuantity,
  setIsMistake,
}: TextProcessingProps) => {
  const HintShown = useTaskStore.getState().HintShown;
  const setHintShow = (show: boolean) =>
    useTaskStore.setState({ HintShown: show });
  const setHintText = (hintText: string) =>
    useTaskStore.setState({ HintText: hintText });
  const firstMarkCheck = /^[¡¿"-]/.test(
    correctText.charAt(inputText.length - 1)
  );
  const index = inputText.length + Number(firstMarkCheck);
  const isSpaceOrMark = /[.,!"-]|\s/;
  const isSpaceHit = /\s/.test(inputText.slice(-1));
  const textToCompare = correctText
    .replace(/[àáâäãåā]/gi, 'a')
    .replace(/[èéêëēėę]/gi, 'e')
    .replace(/[ìíîïī]/gi, 'i')
    .replace(/[òóôöõøō]/gi, 'o')
    .replace(/[ùúûüū]/gi, 'u')
    .replace(/[ç]/gi, 'c')
    .replace(/[ß]/gi, 's')
    .charAt(index - 1);

  if (isSpaceHit && isSpaceOrMark.test(textToCompare)) {
    for (let i = 0; i < 5; i++) {
      if (!isSpaceOrMark.test(correctText.charAt(index + i - 1))) {
        setHintShow(false);

        return correctText.slice(0, index + i - 1);
      }
    }
  }

  if (inputText.slice(-1).toLowerCase() === textToCompare.toLocaleLowerCase()) {
    setHintShow(false);

    return index === correctText.trim().length - 1 &&
      isSpaceOrMark.test(correctText.slice(-1))
      ? correctText.trim()
      : correctText.trim().slice(0, index);
  }

  if (!HintShown) {
    setMistakesCount((prev) => prev + 1);
    setHintText(isSpaceOrMark.test(textToCompare) ? '(Space)' : currentWord);
    setHintShow(true);
  } else {
    setForgivenErrorQuantity((prev) => prev + 1);
  }

  setIsMistake(true);

  return outputText;
};

export const handleOnKeyDown = (
  event: React.KeyboardEvent,
  inputRef:
    | React.RefObject<HTMLTextAreaElement>
    | React.RefObject<HTMLInputElement[]>
) => {
  if (
    event.key === 'Space' &&
    inputRef.current //&&
    //inputRef.current.value.endsWith(' ')
  ) {
    event.preventDefault();
    return;
  }

  if (event.key === 'Enter') {
    event.preventDefault();
  }

  if (event.key === 'Backspace' || event.key === 'Delete') {
    event.preventDefault();
    // setCorrect(true)
  } else {
    // setCorrect(false)
  }
};

export const updateCompletedTasks = (
  commonProps: CommonProps,
  isMistake: number
) => {
  const newCompletedTasks = commonProps.completedTasks
    ? [...commonProps.completedTasks, commonProps.currentTask]
    : [commonProps.currentTask];

  commonProps.setCompletedTasks(newCompletedTasks);
  commonProps.setCurrentTaskNumber(commonProps.currentTaskNumber + 1);

  commonProps.currentTask.answers = setLevelColors({
    answers: commonProps.currentTask.answers,
    currentLevel: commonProps.currentTask.currentLevel,
    learnMode: commonProps.learnMode,
    isMistake: isMistake,
  });
};

export const setLevelColors = ({
  answers,
  currentLevel,
  learnMode,
  isMistake,
}: {
  answers: number[];
  currentLevel: number;
  learnMode: number;
  isMistake: number;
}) => {
  const setAnswers = (values: number[]) => (answers = values);

  if (!answers) {
    const arr = new Array(learnMode - 1).fill(-1);
    arr.unshift(isMistake);
    answers = arr;
  } else {
    if (learnMode === 3) {
      currentLevel === 1 && setAnswers([isMistake, -1, -1]);
      currentLevel === 2 && setAnswers([0, isMistake, -1]);
      currentLevel === 3 && setAnswers([0, 0, isMistake]);
    }
    if (learnMode === 2) {
      currentLevel === 1 && setAnswers([isMistake, -1]);
      currentLevel === 2 && setAnswers([0, isMistake]);
    }
    if (learnMode === 1) {
      setAnswers([isMistake]);
    }
  }
  return answers;
};

export const getLevelColors = ({
  currentTask,
  currentCourseObject,
  currentTaskState = null,
}: {
  currentTask: TaskData;
  currentCourseObject: CourseObject;
  currentTaskState?: boolean | null;
}) => {
  let levelsArray: number[] = [];

  const answers = currentTask.answers;

  if (currentTask && currentCourseObject) {
    if (!answers) {
      levelsArray = new Array(currentCourseObject?.learnMode).fill(-1);
    } else {
      const setAnswers = (values: number[]) => (levelsArray = values);
      const level: number = currentTask.currentLevel;
      const learnMode: number = currentCourseObject.learnMode;
      const lastAnswer = answers[answers.length - 1] === 1 ? 1 : -1;

      if (learnMode === 3) {
        level === 1 && setAnswers([lastAnswer, -1, -1]);
        level === 2 && setAnswers([0, lastAnswer, -1]);
        level === 3 && setAnswers([0, 0, lastAnswer]);
      }
      if (learnMode === 2) {
        level === 1 && setAnswers([lastAnswer, -1]);
        level === 2 && setAnswers([0, lastAnswer]);
      }
      if (learnMode === 1) {
        setAnswers([lastAnswer]);
      }
    }
  }

  /** Update result to get circles for currentTask Section To */
  if (currentTaskState !== null) {
    const errorIndex = levelsArray.findIndex((item) => item === 1);

    if (errorIndex >= 0) {
      levelsArray[errorIndex] = currentTaskState ? 0 : 1;
    } else {
      const nextIndex = levelsArray.findIndex((item) => item === -1);

      if (nextIndex >= 0) {
        levelsArray[nextIndex] = currentTaskState ? 0 : 1;
      }
    }
  }
  return levelsArray;
};
