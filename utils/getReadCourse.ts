import axios from 'axios'
import getConfig from 'next/config'
//const { process.env } = getConfig()

export interface CourseData {
  info: {
    tasksQuantity: number
    uniqueWordsQuantity: number
    courseFinishTime: number
  }
  studyingTheCourse: number
  top: {
    firstName: string
    lastName: string
    email?: null | string
    rating: number
    countryCode: string
    avatar?: string
    position?: number
  }[]
  title: string
  smallDescription: string
  fullDescription: string
  promo: string[]
}

export interface CourseInfoProps {
  info: {
    tasksQuantity: number
    uniqueWordsQuantity: number
    courseFinishTime: number
  }
  title: string
  smallDescription: string
  languageTo?: string | string[]
  languageFrom?: string | string[]
  courseName?: string | string[]
}

export interface AboutQuotesProps {
  promo: string[]
}

export interface LeaderBoardProps {
  data: {
    firstName: string
    lastName: string
    email?: null | string
    rating: number
    countryCode: string
    avatar?: string
    position?: number
  }
  length: number
}

export interface ScoresProps {
  studyingTheCourse: number
  top: {
    firstName: string
    lastName: string
    email?: null | string
    rating: number
    countryCode: string
    avatar?: string
    position?: number
  }[]
  fullDescription: string
  languageTo?: string | string[]
  languageFrom?: string | string[]
  courseName?: string | string[]
}

export const getReadCourse = async (
  currentLanguage: string | any,
  courseName: string | string[] | undefined | any,
) => {
  try {
    const response = await axios.get(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/public/readCourse/${courseName}?lang=${currentLanguage}`,
    )
    return response.data.data
  } catch (error) {
    console.log(error)
  }
}
