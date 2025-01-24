import axios from 'axios'
import { LanguageFrom } from '@utils/languages'
import getConfig from 'next/config'
//const { process.env } = getConfig()

export type FaqData = {
  question: string
  answer: string
  position: number
}

type QuestionAndAnswer = {
  eng: string
  rus: string
  geo: string
  tur: string
  ben: string
  esp: string
}

type FAQObject = {
  _id: string
  code: number
  question: QuestionAndAnswer
  answer: QuestionAndAnswer
}

type FAQCategory = {
  _id: {
    id: string
    code: number
    slug: string
    name: string
  }
  objects: FAQObject[]
}

export type ApiResponse = {
  status: number
  data: FAQCategory[]
}

export const getFAQ = (locale: LanguageFrom): Promise<FaqData[]> => {
  return axios
    .get(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/public/faqPricing?lang=${locale}`,
    )
    .then(response => response.data.data)

    .catch(error => console.log(error))
}

export const getFAQs = (locale: LanguageFrom): Promise<ApiResponse> => {
  return axios
    .get(
      `${
        process.env.NEXT_PUBLIC_DEFAULT_URL || process.env.DEFAULT_URL
      }/public/faq?lang=${locale}`,
    )
    .then(response => response.data)

    .catch(error => console.log(error))
}

// export const putQuestion = async (object: any) => {
//   try {
//     const response = await axios.put(
//       `${process.env.NEXT_PUBLIC_DEFAULT_URL ||process.env.DEFAULT_URL}/public/faq/custom/add`,
//       object,
//     )
//     return response
//   } catch (error) {
//     throw error
//   }
// }
