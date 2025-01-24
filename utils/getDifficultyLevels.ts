import axios from 'axios';
import { LanguageFrom, LanguageTo } from './languages';
import getConfig from 'next/config';
//const { process.env } = getConfig()

const URL_LEVELS = `${
  process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
}/public/getLanguageStandard`;
const URL_LEVEL_OPTIONS = `${
  process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
}/public/getCourses`;

type LanguageLevelData = {
  _id: {
    _id: string;
    name: string;
    smallDescription: {
      [x in LanguageFrom]: string;
    };
    fullDescription: {
      [x in LanguageFrom]: string;
    };
    uniqueStudentsCount: number;
  };
};

interface LevelOptionData {
  _id: string;
  slug: string;
  title: string;
  testAvailable: boolean;
  studyingTheCourse: number;
  languageSubStandard: string;
  iLearnFrom: string;
  iLearn: string;
  fullDescription: string;
  smallDescription: string;
  subTotalActiveTask: number;
  status: {
    start: boolean;
    continue: boolean;
    buy: boolean;
    retake: boolean;
    time: {
      start: null;
      end: null;
    };
  };
}

export interface Option {
  title: string;
  studyingTheCourse: number;
  fullDescription: string;
  smallDescription: string;
  status: Status;
}

type Status = {
  allPassedTasks?: number | ((allPassedTasks: any) => unknown);
  buy: boolean;
  continue: boolean;
  retake: boolean;
  start: boolean;
};

export type LanguageLevel = {
  name: string;
  smallDescription: {
    [x in LanguageFrom]: string;
  };
  fullDescription: {
    [x in LanguageFrom]: string;
  };
  uniqueStudentsCount: number;
  options: Option[];
};

const getLevelsData = (
  languageTo: LanguageTo,
  languageFrom: LanguageFrom,
  locale: LanguageFrom
): Promise<LanguageLevelData[]> => {
  return axios
    .get(`${URL_LEVELS}/${languageTo}/${languageFrom}?lang=${locale}`)
    .then((response) => response.data.data)
    .catch((error) => console.log(error));
};

const getLevelOptionsData = (
  token: string,
  id: string,
  languageTo: LanguageTo,
  languageFrom: LanguageFrom,
  locale: LanguageFrom
): Promise<LevelOptionData[]> => {
  return axios
    .get(
      `${URL_LEVEL_OPTIONS}/${languageTo}/${languageFrom}/${id}?lang=${locale}`,
      {
        headers: {
          Authorization: token || '',
        },
      }
    )
    .then((response) => response.data.data)
    .catch((error) => console.log(error));
};

const getFormattedLevels = (
  level: LanguageLevelData,
  options: LevelOptionData[]
): LanguageLevel => {
  return {
    name: level._id.name,
    smallDescription: level._id.smallDescription,
    fullDescription: level._id.fullDescription,
    uniqueStudentsCount: level._id.uniqueStudentsCount,
    options: options.map((option) => {
      return {
        title: option.slug,
        studyingTheCourse: option.studyingTheCourse,
        fullDescription: option.fullDescription,
        smallDescription: option.smallDescription,
        status: option.status,
      };
    }),
  };
};

export const getDifficultyLevels = (
  token: string,
  languageTo: LanguageTo,
  languageFrom: LanguageFrom,
  locale: LanguageFrom
): Promise<LanguageLevel[]> => {
  return getLevelsData(languageTo, languageFrom, locale).then((response) => {
    const data = response.map((level: LanguageLevelData) => {
      const result: Promise<LanguageLevel> = getLevelOptionsData(
        token,
        level._id._id,
        languageTo,
        languageFrom,
        locale
      ).then((response) => getFormattedLevels(level, response));

      return result;
    });
    return Promise.all(data);
  });
};
