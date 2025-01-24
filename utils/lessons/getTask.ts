import axios, { AxiosRequestHeaders } from 'axios';

export type InitialTasksData = {
  tasks: InitialTask[];
  replay: boolean;
};

interface InitialTask {
  _id: string;
  course: string;
  ordinalNumber: number;
  point: 1;
  smallDescription: string;
  fullDescription: string;
  segment: '';
  showGenderHint: false;
  errorLimit: number;
  answers: number[];
  currentLevel: number;
  taskType: {
    name: string;
    nameCode: string;
    nameMobile: any;
  };
  wordsAudio: {
    dialog: {
      translation: [
        {
          words: {
            data: [
              {
                synonyms: string[];
                _word: string;
              }
            ];
          };
          sentence: {
            filePath: string;
            audioFileName: string;
          };
        }
      ];
    };
    synonyms: string[];
    words: {
      current: number;
      data: {
        filePath: string;
        audioFileName: string;
        duration: number;
        existAudio: boolean;
        synonyms: string[];
        _word: string;
        letters: {
          all: {
            number: number;
            auto: boolean;
            error: number;
            char: string;
            done: false;
          }[];
          current: {
            index: number;
            char: string;
          };
        };
        recognized: boolean;
        error: boolean;
        done: boolean;
        dubberId: number;
        word: string;
        length: number;
        index: number;
      }[];
    };
    sentence: {
      filePath: string;
      duration: number;
      existAudio: boolean;
      audioFileStatus: {
        fileName: string;
        extension: string;
        exist: boolean;
      }[];
      audioFileName: string;
      text: string;
    };
  };
  iLearn: {
    text: string | string[];
    errorText: string;
  };
  iLearnFrom: {
    hint?: string;
    text?: string;
    language: {
      name: {
        nameCode: string;
      };
    };
  }[];
}

export interface TaskData {
  obj: any;
  id: string;
  _id?: string;
  ordinalNumber: number;
  taskDescription: string;
  mobileTaskDescription: string;
  taskType:
    | 'dictation'
    | 'translate'
    | 'dialog'
    | 'omittedwords'
    | 'replay'
    | 'mistakecorrection'
    | 'grammar'
    | 'welcome';
  taskNumber: number;
  errorLimit: number;
  correctText: string | string[];
  errorText: string;
  taskText: string;
  mistakeTaskText: string;
  dialogLinesArray: [
    {
      words: string[];
      sentenceAudioPath: string;
    }
  ];
  answers: number[];
  currentLevel: number;
  wordsArray: {
    wordAudioPath: string;
    wordLoweredText: string;
    wordText: string;
  }[];
  iLearnFromNameCode: string;
  wordsSynonyms: [string[]];
  sentenceAudioPath: string;
  timeSpent: number;
}

export type CourseObject = {
  _id: string;
  isOriginal: number;

  course: {
    _id: string;
    title: {
      ben: string;
      tur: string;
      rus: string;
      esp: string;
      geo: string;
      eng: string;
    };
    languageSubStandard: {
      name: string;
    };
    iLearnFrom: {
      _id: string;
      code: number;
      nameCode: string;
      name: {
        geo?: string;
        eng?: string;
        esp?: string;
        tur?: string;
        rus?: string;
      };
    }[];
    iLearn: {
      _id: string;
      nameCode: string;
    };
    subTotalActiveTask: number;
    configuration: {
      authUserDailyLimit: number;
      enabled: boolean;
      unAuthUserDailyLimit: number;
    };
  };
  iLearnFromNameCode: string;
  info: {
    attachCreditCardAgain: boolean;
    bonus: number;
    dailyTaskLeft: number;
    daysLeft: number;
    freeTrialDaysLeft: number;
    freeTrialIsUsed: boolean;
    premium: boolean;
    userCreatedAt: string;
  };
  learnMode: 1 | 2 | 3;
  dailyReachedLimitDate: string;
  sentDailyTaskCounter: number;
  percent: string;
  uniquePassedTasks: number;
  score: number;
  totalTimeSpent: number;
};

export const getUserCourse = async ({
  languageTo,
  languageFrom,
  courseName,
  Token,
  userId,
}: {
  languageTo: string | string[];
  languageFrom: string | string[];
  courseName: string | string[];
  Token: string | null;
  userId: string | null;
}): Promise<CourseObject | undefined> => {
  try {
    if (Token) {
      const response = await axios({
        url: `${
          process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
        }/public/getUserCourse/${courseName}?lang=${languageTo}&iLearnFrom=${languageFrom}`,
        headers: {
          Authorization: Token,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        // params: {
        //   _: new Date().getTime() // Adds timestamp as query parameter
        // }
      });
      return response.data.data;
    } else {
      // if (userId) {
      const response = await axios({
        url: `${
          process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
        }/public/getUserCourse/${courseName}?lang=${languageTo}&iLearnFrom=${languageFrom}&userKey=${userId}`,
      });
    

      return response.data.data;
      // }
    }
  } catch (error) {
    console.log(error);
  }
};

export const getTasks = async ({
  languageTo,
  languageFrom,
  Token,
  courseId,
  userCourseId,
  userId,
  task,
  taskType,
  ordinalNumber,
}: {
  languageTo: string | string[];
  languageFrom: string | string[];
  Token: string | null;
  userId: string | null;
  courseId: string;
  userCourseId: any;
  task?: string | string[];
  taskType?: string | null;
  ordinalNumber?: any;
}): Promise<TaskData[]> => {
  try {
    let url = `${
      process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
    }/public/`;
    // }/public/temp/getTaskById?taskId=57b98b3bb5d1d5f225bdeb3f`
    // }/public/getTasks/${courseId}/${languageFrom}?lang=${languageTo}&task=${task}`;
    // }/public/special/getTasks?taskType=${taskType}&iLearnFromNameCode=${languageFrom}&courseId=${courseId}&limit=500`;
    // }/public/getTasks/${userCourseId}/${languageFrom}?task=${ordinalNumber}`;

    if (ordinalNumber) {
      url += `getTasks/${userCourseId}/${languageFrom}?task=${ordinalNumber}`;
      // logHandler(`
      //         Ordinal Number : ${url}

      //     `)
    } else if (taskType) {
      url += `special/getTasks?taskType=${taskType}&iLearnFromNameCode=${languageFrom}&courseId=${courseId}&limit=500`;
      // logHandler(`
      //     Task Types : ${url}
      // `)
    } else {
      url += `getTasks/${userCourseId}/${languageFrom}?lang=${languageTo}&task=${task}`;
      // logHandler(`
      //     Default
      // `)
    }

    // logHandler( 'Fetch Type : '  +   url )

    // }/public/temp/getTaskByIdOrType?taskType=dialog&limit=2&page=1`

    // temp/getTaskById?taskId=57b98b3bb5d1d5f225bdeb3f
    // temp/getTaskByIdOrType?taskType=dialog&limit=2&page=1

    let headers: {
      Authorization: string | null;
    } = {
      Authorization: Token,
    };

    if (userId && !Token) {
      // logHandler(`
      //   ordinalNumber  : ${ordinalNumber}
      //   taskType : ${taskType}
      //   courseId: ${courseId}
      //   userCourseId : ${userCourseId}
      //   userId : ${userId}
      //   Token : ${Token}
      // `)
      // console.log('NEW ENV:', { FACEBOOK_ID: process.env.FACEBOOK_ID, NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET })
      url += `&userKey=${userId}`;
      headers = { Authorization: '' };
    }

    const response = await axios({
      url,
      headers: (headers as AxiosRequestHeaders) || '',
      params: {
        _: new Date().getTime() // Adds timestamp as query parameter
      }
    });

    let data = null;

    if (taskType) {
      data = response.data.data;
    } else {
      data = response.data.data.tasks;
    }

    const tasks = data.map((task: InitialTask) => {
      const dialogLinesArray =
        task?.wordsAudio?.dialog &&
        task.wordsAudio.dialog.translation.map((dialogLine) => {
          return {
            words: dialogLine.words.data.map((word) => {
              return {
                wordLoweredText: word._word,
                wordSynonyms: word.synonyms,
              };
            }),
            sentenceAudioPath: `${dialogLine.sentence.filePath}/${dialogLine.sentence.audioFileName}`,
          };
        });
      return {
        obj: task,
        id: task._id,
        ordinalNumber: task.ordinalNumber,
        taskDescription: task.taskType.name,
        mobileTaskDescription: task.taskType.nameMobile,
        taskType: task.taskType.nameCode,
        taskNumber: task.ordinalNumber,
        errorLimit: task.errorLimit,
        correctText: task.iLearn.text,
        errorText: task.iLearn.errorText,
        taskText: task.iLearnFrom[0]?.text,
        mistakeTaskText: task.iLearnFrom[0]?.hint,
        dialogLinesArray: dialogLinesArray,
        answers: task.answers,
        currentLevel: task.currentLevel,
        wordsArray:
          task?.wordsAudio?.words &&
          task.wordsAudio.words.data.map((word) => {
            return {
              wordAudioPath: `${word.filePath}/${word.audioFileName}`,
              wordLoweredText: word._word,
              wordText: word.word,
            };
          }),
        wordsSynonyms: task?.wordsAudio?.words
          ? task.wordsAudio.words.data.map((word) => word.synonyms)
          : [],
        iLearnFromNameCode: task.iLearnFrom[0]?.language.name.nameCode,
        sentenceAudioPath:
          task?.wordsAudio?.sentence &&
          `${task.wordsAudio.sentence.filePath}/${task.wordsAudio.sentence.audioFileName}`,
      };
    });
    return tasks;
  } catch (error) {
    console.log(error);
    return [];
  }
};
